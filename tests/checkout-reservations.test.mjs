import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {openStore} from '../tools/shop-server/store.mjs';
import {quote,checkoutParams,config,catalogVersion} from '../tools/shop-server/catalog.mjs';
import {createShopServer} from '../tools/shop-server/server.mjs';

const directory=()=>fs.mkdtempSync(path.join(os.tmpdir(),'edle-stock-hold-'));
const board=(options={})=>({country:'DE',items:[{sku:'product-1776273564',quantity:1,...options}]});
const fingerprint=input=>createHash('sha256').update(JSON.stringify(quote(input))).digest('hex');
const reserve=(store,input,requestId=randomUUID(),now)=>store.prepareCheckout(requestId,fingerprint(input),input,undefined,now);
const event=(order,type='checkout.session.completed',id=randomUUID())=>({id,livemode:false,type,data:{object:{id:order.session_id,client_reference_id:order.id,livemode:false,currency:'eur',amount_total:order.quote.totalCents,payment_status:type==='checkout.session.completed'?'paid':'unpaid'}}});

test('a one-off is atomically held across checkouts, persists on restart and cannot be held again using another option',()=>{
  const dir=directory();let store=openStore(dir);
  try{
    const input=board(),requestId=randomUUID(),order=reserve(store,input,requestId);
    assert.ok(checkoutParams(order,'https://shop.example.invalid').expires_at>=Math.floor(Date.now()/1000)+30*60);
    assert.equal(reserve(store,input,requestId).id,order.id);
    assert.throws(()=>reserve(store,input),/STOCK_RESERVED/);
    assert.equal(store.db.prepare('SELECT SUM(quantity) AS n FROM stock_holds').get().n,1);
    store.close();store=openStore(dir);
    assert.throws(()=>reserve(store,input),/STOCK_RESERVED/);
    assert.equal(store.soldUnits()['product-1776273564:'],undefined,'a reservation is not a sale');
    const engraving={kind:'text',text:'Familie',font:'allura',position:'face-bottom-left'};
    assert.throws(()=>reserve(store,board({engraving:true,personalisation:engraving})),/STOCK_RESERVED/);
  }finally{store.close();}
});
test('wood and edge capacities are shared across engravings, while separate edge stock stays independent',()=>{
  const store=openStore(directory());
  const input=(edge,quantity)=>({country:'DE',items:[{sku:'spatula',wood:'Eiche',edge,quantity}]});
  try{
    reserve(store,input('straight',2));
    reserve(store,input('straight',1));
    assert.throws(()=>reserve(store,input('straight',1)),/STOCK_RESERVED/);
    assert.doesNotThrow(()=>reserve(store,input('beveled',3)));
    assert.throws(()=>reserve(store,input('beveled',1)),/STOCK_RESERVED/);
  }finally{store.close();}
});
test('plain and groove versions of the same physical one-off use one shared hold',()=>{
  const store=openStore(directory());
  try{
    const input=variant=>({country:'DE',items:[{sku:'product-4598989614',variant,quantity:1}]});
    reserve(store,input('plain'));
    assert.throws(()=>reserve(store,input('groove')),/STOCK_RESERVED/);
  }finally{store.close();}
});
test('payment converts a hold to sold once; late expiry or failure cannot release paid stock',()=>{
  const store=openStore(directory());
  try{
    const input=board(),order=reserve(store,input);store.attach(order.id,'cs_test_reserved_board');order.session_id='cs_test_reserved_board';
    store.process(event(order));store.process(event(order));
    assert.equal(store.soldUnits()['product-1776273564:'],1);
    assert.equal(store.db.prepare('SELECT status FROM checkout_attempts WHERE order_id=?').get(order.id).status,'committed');
    store.process(event(order,'checkout.session.expired'));store.process(event(order,'checkout.session.async_payment_failed'));
    assert.equal(store.db.prepare('SELECT status FROM checkout_attempts WHERE order_id=?').get(order.id).status,'committed');
    assert.equal(store.soldUnits()['product-1776273564:'],1);
    assert.throws(()=>reserve(store,input),/PRODUCT_UNAVAILABLE/);
  }finally{store.close();}
});
test('only a verified matching terminal event releases a hold, never elapsed local time',()=>{
  const store=openStore(directory());
  try{
    const input=board(),requestId=randomUUID(),order=reserve(store,input,requestId,Date.now()-24*3600000);
    store.attach(order.id,'cs_test_expiring_board');order.session_id='cs_test_expiring_board';
    assert.throws(()=>reserve(store,input),/STOCK_RESERVED/,'unknown provider outcome must remain held');
    const expired=event(order,'checkout.session.expired');expired.data.object.amount_total=1;
    assert.throws(()=>store.process(expired),/AMOUNT_MISMATCH/);
    assert.throws(()=>reserve(store,input),/STOCK_RESERVED/);
    store.process(event(order,'checkout.session.expired'));
    assert.equal(store.db.prepare('SELECT status FROM checkout_attempts WHERE order_id=?').get(order.id).status,'released');
    assert.throws(()=>reserve(store,input,requestId),/ORDER_ALREADY_SUBMITTED/);
    assert.doesNotThrow(()=>reserve(store,input));
    assert.equal(store.tasks().length,0);assert.equal(store.notifications().length,0);
  }finally{store.close();}
});
test('simultaneous HTTP checkouts cannot both create a Stripe session for the last physical board',async()=>{
  const store=openStore(directory());
  const old={approved:config.approved,shipping:config.shippingConfirmed,env:process.env.SHOP_TEST_APPROVED,listingIds:config.checkoutListingIds};
  config.approved=true;config.shippingConfirmed=true;config.checkoutListingIds=['1776273564'];process.env.SHOP_TEST_APPROVED='yes';
  let finishCreate,created=0,started;
  const creating=new Promise(resolve=>started=resolve);
  const sdk={checkout:{sessions:{create:async(params)=>{
    created++;started();await new Promise(resolve=>finishCreate=resolve);
    return {id:'cs_test_race_'+params.client_reference_id.replace(/-/g,''),url:'https://checkout.stripe.com/c/pay/cs_test_fixture',livemode:false,client_reference_id:params.client_reference_id,currency:'eur',amount_total:params.line_items.reduce((sum,item)=>sum+item.quantity*item.price_data.unit_amount,0)+params.shipping_options[0].shipping_rate_data.fixed_amount.amount};
  }}}};
  const origin='https://shop.example.invalid';
  const server=createShopServer({mode:'test',publicOrigin:origin,stripe:sdk,store});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port;
  const post=()=>fetch(url+'/api/shop/checkout',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({...board(),requestId:randomUUID(),version:catalogVersion})});
  let first;
  try{
    config.checkoutListingIds=[];
    const denied=await post();assert.equal(denied.status,409);assert.equal((await denied.json()).error,'PRODUCT_NOT_APPROVED');
    assert.equal(created,0);assert.equal(store.db.prepare('SELECT COUNT(*) AS n FROM stock_holds').get().n,0);
    config.checkoutListingIds=['1776273564'];
    first=post();await creating;
    const second=await post();assert.equal(second.status,409);assert.equal((await second.json()).error,'STOCK_RESERVED');
    finishCreate();assert.equal((await first).status,200);assert.equal(created,1);
  }finally{
    finishCreate?.();if(first)await first;
    await new Promise(resolve=>server.close(resolve));store.close();
    config.approved=old.approved;config.shippingConfirmed=old.shipping;config.checkoutListingIds=old.listingIds;
    if(old.env===undefined)delete process.env.SHOP_TEST_APPROVED;else process.env.SHOP_TEST_APPROVED=old.env;
  }
});
test('an existing world-readable order directory is rejected instead of silently leaking private data',()=>{
  const dir=directory();fs.chmodSync(dir,0o755);
  try{assert.throws(()=>openStore(dir),/private directory/);}finally{fs.chmodSync(dir,0o700);}
});
test('invalid provider references and amounts cannot redirect a buyer or attach a session',async()=>{
  const old={approved:config.approved,shipping:config.shippingConfirmed,env:process.env.SHOP_TEST_APPROVED,listingIds:config.checkoutListingIds};
  config.approved=true;config.shippingConfirmed=true;config.checkoutListingIds=['1776273564'];process.env.SHOP_TEST_APPROVED='yes';
  try{for(const fault of ['amount','reference','currency','live','id','network']){
    const store=openStore(directory()),origin='https://shop.example.invalid';
    const sdk={checkout:{sessions:{create:async parameters=>{
      if(fault==='network')throw Error('PRIVATE_PROVIDER_PAYLOAD');
      const response={id:'cs_test_valid_fixture',client_reference_id:parameters.client_reference_id,currency:'eur',livemode:false,url:'https://checkout.stripe.com/c/pay/cs_test_fixture',amount_total:parameters.line_items.reduce((sum,item)=>sum+item.quantity*item.price_data.unit_amount,0)+parameters.shipping_options[0].shipping_rate_data.fixed_amount.amount};
      if(fault==='amount')response.amount_total=1;
      if(fault==='reference')response.client_reference_id=randomUUID();
      if(fault==='currency')response.currency='usd';
      if(fault==='live')response.livemode=true;
      if(fault==='id')response.id='cs_live_invalid';
      return response;
    }}}};
    const server=createShopServer({mode:'test',publicOrigin:origin,stripe:sdk,store});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    try{
      const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/shop/checkout',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({...board(),requestId:randomUUID(),version:catalogVersion})});
      assert.ok(response.status>=500);assert.ok(!(await response.text()).includes('PRIVATE_PROVIDER_PAYLOAD'));
      assert.equal(store.db.prepare('SELECT session_id FROM orders').get().session_id,null);
      assert.equal(store.checkoutAlerts()[0].reason,'provider_unresolved');
      assert.equal(store.db.prepare('SELECT status FROM checkout_attempts').get().status,'active');
      assert.deepEqual(store.soldUnits(),{});
    }finally{await new Promise(resolve=>server.close(resolve));store.close();}
  }}finally{
    config.approved=old.approved;config.shippingConfirmed=old.shipping;config.checkoutListingIds=old.listingIds;
    if(old.env===undefined)delete process.env.SHOP_TEST_APPROVED;else process.env.SHOP_TEST_APPROVED=old.env;
  }
});
