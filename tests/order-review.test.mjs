import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomUUID,randomBytes} from 'node:crypto';
import {openStore} from '../tools/shop-server/store.mjs';
import {quote} from '../tools/shop-server/catalog.mjs';
import {notificationMessage} from '../tools/shop-server/notifications.mjs';
import {createShopServer} from '../tools/shop-server/server.mjs';

function fixture(){
  const store=openStore(fs.mkdtempSync(path.join(os.tmpdir(),'edle-review-')));
  const q=quote({country:'DE',items:[{sku:'care-balm',quantity:1}]});
  const order=store.prepare(randomUUID(),'receipt-test',q);
  store.attach(order.id,'cs_test_review_order');
  const event={id:'evt_review',type:'checkout.session.completed',livemode:false,data:{object:{id:'cs_test_review_order',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'paid',locale:'de',customer_details:{email:'test@example.invalid'}}}};
  return {store,order,event};
}
test('verified payment queues a receipt and seller review, never automatic acceptance',()=>{
  const {store,order,event}=fixture();
  try{
    store.process(event);store.process(event);
    store.process({...event,id:'evt_review_retry',type:'checkout.session.async_payment_succeeded'});
    assert.equal(store.db.prepare('SELECT status FROM orders WHERE id=?').get(order.id).status,'paid');
    assert.equal(store.db.prepare('SELECT status FROM order_reviews WHERE order_id=?').get(order.id).status,'pending');
    assert.deepEqual(store.notifications().map(job=>job.kind).sort(),['receipt','seller_review']);
    const receipt=store.notifications().find(job=>job.kind==='receipt');
    assert.match(notificationMessage('receipt',receipt.payload).text,/noch keine Annahme/);
    assert.throws(()=>notificationMessage('acceptance',receipt.payload),/INVALID_NOTIFICATION/);
    assert.equal(store.tasks().length,1);
    assert.equal(store.review(order.id,'accepted'),'accepted');
    assert.equal(store.review(order.id,'accepted'),'accepted');
    assert.equal(store.notifications().filter(job=>job.kind==='acceptance').length,1);
    assert.throws(()=>store.review(order.id,'rejected'),/REVIEW_CONFLICT/);
    const acceptance=store.notifications().find(job=>job.kind==='acceptance');
    assert.match(notificationMessage('acceptance',acceptance.payload).text,/nehmen sie an/);
  }finally{store.close();}
});
test('failed and amount-mismatched events cannot send receipts; unpaid completion acknowledges receipt without acceptance',()=>{
  for(const mode of ['unpaid','mismatch','failed']){
    const {store,order,event}=fixture();
    try{
      if(mode==='mismatch'){event.data.object.amount_total=1;assert.throws(()=>store.process(event),/AMOUNT_MISMATCH/);}
      else if(mode==='unpaid'){event.data.object.payment_status='unpaid';assert.equal(store.process(event),'awaiting_payment');}
      else{event.type='checkout.session.async_payment_failed';store.process(event);}
      if(mode==='unpaid'){
        assert.deepEqual(store.notifications().map(job=>job.kind).sort(),['receipt','seller_received']);
        const receipt=store.notifications().find(job=>job.kind==='receipt');
        assert.match(notificationMessage('receipt',receipt.payload).text,/Bestätigung steht noch aus/);
      }else assert.equal(store.notifications().length,0);
      assert.throws(()=>store.review(order.id,'accepted'),/ORDER_NOT_READY/);
    }finally{store.close();}
  }
});
test('asynchronous payment sends one receipt first and a separate payment update, never automatic acceptance',()=>{
  const {store,order,event}=fixture();
  try{
    event.data.object.payment_status='unpaid';
    store.process(event);
    assert.equal(store.db.prepare('SELECT status FROM orders WHERE id=?').get(order.id).status,'awaiting_payment');
    assert.throws(()=>store.review(order.id,'accepted'),/ORDER_NOT_READY/);
    event.data.object.payment_status='paid';
    store.process({...event,id:'evt_async_paid',type:'checkout.session.async_payment_succeeded'});
    store.process({...event,id:'evt_async_paid_duplicate',type:'checkout.session.async_payment_succeeded'});
    assert.equal(store.notifications().filter(job=>job.kind==='receipt').length,1);
    assert.equal(store.notifications().filter(job=>job.kind==='payment_received').length,1);
    assert.equal(store.notifications().filter(job=>job.kind==='acceptance').length,0);
    assert.equal(store.tasks().length,1);
  }finally{store.close();}
});
test('rejection cannot generate acceptance and does not silently refund a payment',()=>{
  const {store,order,event}=fixture();
  try{
    event.data.object.customer_details.email='bad\r\nBcc: other@example.invalid';
    store.process(event);
    assert.equal(store.notifications()[0].payload.recipient,null);
    store.review(order.id,'rejected');
    assert.ok(!store.notifications().some(job=>job.kind==='acceptance'));
    assert.equal(store.db.prepare('SELECT status FROM orders WHERE id=?').get(order.id).status,'paid');
    assert.throws(()=>store.review(order.id,'accepted'),/REVIEW_CONFLICT/);
  }finally{store.close();}
});
test('manual acceptance and notification status require the private admin token and expose no customer payload',async()=>{
  const {store,order,event}=fixture();store.process(event);
  const token=randomBytes(32).toString('hex'),previous=process.env.SHOP_ADMIN_TOKEN;
  process.env.SHOP_ADMIN_TOKEN=token;
  const server=createShopServer({store});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  try{
    const route='/api/shop/orders/'+order.id+'/review';
    const post=authorization=>fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json',...(authorization?{Authorization:authorization}:{})},body:JSON.stringify({decision:'accepted'})});
    assert.equal((await post()).status,401);
    assert.equal((await post('Bearer wrong')).status,401);
    assert.equal((await fetch(base+'/api/shop/notifications')).status,401);
    assert.equal((await fetch(base+'/api/shop/checkout-alerts')).status,401);
    store.flagCheckout(order.id,'provider_unresolved');
    const alerts=await(await fetch(base+'/api/shop/checkout-alerts',{headers:{Authorization:'Bearer '+token}})).json();
    assert.equal(alerts.alerts[0].orderId,order.id);
    assert.ok(!JSON.stringify(alerts).includes('test@example.invalid'));
    assert.equal((await post('Bearer '+token)).status,200);
    const status=await (await fetch(base+'/api/shop/notifications',{headers:{Authorization:'Bearer '+token}})).json();
    assert.equal(status.deliveryEnabled,false);
    assert.ok(!JSON.stringify(status).includes('test@example.invalid'));
    assert.equal(store.tasks()[0].taskType,'etsy_inventory_adjustment');
    assert.equal(store.tasks()[0].orderStatus,'accepted');
  }finally{
    await new Promise(resolve=>server.close(resolve));store.close();
    if(previous===undefined)delete process.env.SHOP_ADMIN_TOKEN;else process.env.SHOP_ADMIN_TOKEN=previous;
  }
});
