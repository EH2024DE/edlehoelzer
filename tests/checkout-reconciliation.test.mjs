import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {openStore} from '../tools/shop-server/store.mjs';
import {checkoutParams} from '../tools/shop-server/catalog.mjs';
import {reconcileCheckouts} from '../tools/shop-server/reconcile.mjs';

function fixture(){
  const store=openStore(fs.mkdtempSync(path.join(os.tmpdir(),'edle-reconcile-')));
  const input={country:'DE',items:[{sku:'product-1776273564',quantity:1}]};
  const order=store.prepareCheckout(randomUUID(),'known-fingerprint',input);
  const parameters=store.stageCheckout(order.id,checkoutParams(order,'https://shop.example.invalid',true));
  const session={id:'cs_test_reconcile_'+order.id,client_reference_id:order.id,livemode:false,currency:'eur',amount_total:order.quote.totalCents,status:'open',payment_status:'unpaid',locale:'en'};
  return {store,input,order,parameters,session};
}
test('a lost creation response is recovered with exactly the original server parameters and idempotency key',async()=>{
  const {store,order,parameters,session}=fixture();
  try{
    assert.deepEqual(store.stageCheckout(order.id,{...parameters,expires_at:1}),parameters,'staged request is immutable');
    const stripe={checkout:{sessions:{create:async(params,key)=>{assert.deepEqual(params,parameters);assert.equal(key.idempotencyKey,order.id);return {...session,status:'complete',payment_status:'paid'};}}}};
    assert.deepEqual(await reconcileCheckouts(store,stripe),{checked:1,paid:1,released:0,pending:0,needsReview:0});
    assert.equal(store.soldUnits()['product-1776273564:'],1);
    assert.equal(store.notifications().find(job=>job.kind==='receipt').payload.english,true);
    assert.equal((await reconcileCheckouts(store,stripe)).checked,0);
  }finally{store.close();}
});
test('provider-verified expiry releases inventory and an open or unpaid async session remains held',async()=>{
  for(const state of ['expired','open','complete']){
    const {store,order,session,input}=fixture();
    try{
      store.attach(order.id,session.id);
      const stripe={checkout:{sessions:{retrieve:async id=>{assert.equal(id,session.id);return {...session,status:state};}}}};
      const result=await reconcileCheckouts(store,stripe);
      assert.equal(result.released,state==='expired'?1:0);
      if(state==='expired')assert.doesNotThrow(()=>store.prepareCheckout(randomUUID(),'new',input));
      else assert.throws(()=>store.prepareCheckout(randomUUID(),'new',input),/STOCK_RESERVED/);
      assert.equal(store.notifications().length,state==='complete'?2:0);
    }finally{store.close();}
  }
});
test('network errors, wrong references, live objects or manipulated totals never release stock',async()=>{
  for(const fault of ['network','reference','live','amount']){
    const {store,order,session,input}=fixture();
    try{
      store.attach(order.id,session.id);
      const changed={...session,status:'expired'};
      if(fault==='reference')changed.client_reference_id=randomUUID();
      if(fault==='live')changed.livemode=true;
      if(fault==='amount')changed.amount_total=1;
      const stripe={checkout:{sessions:{retrieve:async()=>{if(fault==='network')throw Error('private provider error');return changed;}}}};
      assert.equal((await reconcileCheckouts(store,stripe)).needsReview,1);
      assert.equal(store.checkoutAlerts()[0].reason,'provider_unresolved');
      assert.equal(store.checkoutAlerts()[0].orderId,order.id);
      assert.ok(!JSON.stringify(store.checkoutAlerts()).includes('private provider error'));
      assert.throws(()=>store.prepareCheckout(randomUUID(),'new',input),/STOCK_RESERVED/);
      assert.equal(store.notifications().length,0);
    }finally{store.close();}
  }
});
test('uncertain old creates are not replayed beyond the safe idempotency recovery window',async()=>{
  const {store,order,parameters,input}=fixture();
  try{
    let calls=0;
    const stripe={checkout:{sessions:{create:async()=>{calls++;throw Error('must not call provider');}}}};
    const old=Date.now()+24*60*60*1000;
    assert.throws(()=>store.stageCheckout(order.id,parameters,old),/CHECKOUT_RECOVERY_REVIEW_REQUIRED/);
    assert.equal((await reconcileCheckouts(store,stripe,old)).needsReview,1);
    assert.equal(store.checkoutAlerts()[0].reason,'recovery_window_elapsed');
    assert.equal(calls,0);
    assert.throws(()=>store.prepareCheckout(randomUUID(),'new',input),/STOCK_RESERVED/,'unknown outcomes remain held for manual investigation');
  }finally{store.close();}
});
test('an unresolved recovery alert persists across restart and clears only after positive verification',async()=>{
  const {store,order,session}=fixture();const directory=store.directory;
  store.attach(order.id,session.id);
  await reconcileCheckouts(store,{checkout:{sessions:{retrieve:async()=>{throw Error('private detail');}}}});
  store.close();
  const reopened=openStore(directory);
  try{
    assert.equal(reopened.checkoutAlerts().length,1);
    await reconcileCheckouts(reopened,{checkout:{sessions:{retrieve:async()=>session}}});
    assert.equal(reopened.checkoutAlerts().length,0);
    assert.ok(reopened.db.prepare('SELECT resolved_at FROM checkout_alerts WHERE order_id=?').get(order.id).resolved_at);
    assert.equal(reopened.db.prepare('SELECT status FROM checkout_attempts WHERE order_id=?').get(order.id).status,'active');
  }finally{reopened.close();}
});
