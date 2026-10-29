import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {openStore} from '../tools/shop-server/store.mjs';
import {quote} from '../tools/shop-server/catalog.mjs';
import {deliverNotifications} from '../tools/shop-server/delivery.mjs';

function fixture(){
  const store=openStore(fs.mkdtempSync(path.join(os.tmpdir(),'edle-delivery-')));
  const order=store.prepare(randomUUID(),'delivery',quote({country:'DE',items:[{sku:'care-balm',quantity:1}]}));
  store.attach(order.id,'cs_test_delivery');
  store.process({id:'evt_delivery',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_delivery',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:order.quote.totalCents,payment_status:'paid',customer_details:{email:'buyer@example.invalid'}}}});
  return {store,order};
}
test('delivery is disabled by default; receipt precedes explicit acceptance even with two workers',async()=>{
  const {store,order}=fixture(),sent=[];
  const transport={supportsIdempotency:true,idempotencyWindowMs:24*3600000,send:async message=>{sent.push(message);return {id:'provider_'+sent.length};}};
  try{
    assert.equal((await deliverNotifications(store,transport)).disabled,true);assert.equal(sent.length,0);
    store.review(order.id,'accepted');
    const first=store.claimNotification();assert.equal(first.kind,'receipt');
    const second=store.claimNotification();assert.equal(second.kind,'seller_review');
    assert.equal(store.claimNotification(),null,'acceptance waits for receipt delivery');
    store.finishNotification(first,'receipt_1');store.finishNotification(second,'seller_1');
    assert.equal((await deliverNotifications(store,transport,{approved:true,sellerEmail:'seller@example.invalid'})).sent,1);
    assert.match(sent[0].subject,/bestätigt/);assert.equal(sent[0].to,'buyer@example.invalid');
    assert.equal(store.notifications().length,0);
  }finally{store.close();}
});
test('transient failures retry with the same provider idempotency key without logging provider secrets',async()=>{
  const {store}=fixture();let clock=Date.now(),calls=[];
  const transport={supportsIdempotency:true,idempotencyWindowMs:24*3600000,send:async message=>{calls.push(message);if(calls.length===1)throw Error('SECRET_PROVIDER_PAYLOAD');return {id:'provider_ok'};}};
  try{
    const options={approved:true,sellerEmail:'seller@example.invalid',now:()=>clock,limit:1};
    assert.equal((await deliverNotifications(store,transport,options)).retry,1);
    clock+=60001;
    assert.equal((await deliverNotifications(store,transport,options)).sent,1);
    assert.equal(calls[0].idempotencyKey,calls[1].idempotencyKey);
    assert.ok(!JSON.stringify(store.db.prepare('SELECT * FROM notification_attempts').all()).includes('SECRET_PROVIDER_PAYLOAD'));
  }finally{store.close();}
});
test('missing recipient and non-idempotent transport fail safely without sending',async()=>{
  const {store}=fixture();let calls=0;
  const transport={supportsIdempotency:true,idempotencyWindowMs:24*3600000,send:async()=>{calls++;return {id:'ok'};}};
  try{
    await assert.rejects(()=>deliverNotifications(store,{send:async()=>{}},{approved:true}),/idempotent/);
    const result=await deliverNotifications(store,transport,{approved:true});
    assert.equal(result.sent,1);assert.equal(result.needsReview,1);assert.equal(calls,1);
    assert.equal(store.db.prepare("SELECT status FROM notification_jobs WHERE kind='seller_review'").get().status,'needs_review');
  }finally{store.close();}
});
