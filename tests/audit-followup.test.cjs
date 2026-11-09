const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),{inventoryText}=require('../assets/js/catalog-display.js');
const data=require('../products.json'),snapshot=require('../data/inventory-public-snapshot.json');
test('stock statements expire and never turn made-to-order or archived products into ready inventory',()=>{
  const now=Date.parse(snapshot.checkedAt),product={active:true,availabilityStatus:'available',stock:1,inventoryCheckedAt:snapshot.checkedAt};
  assert.equal(inventoryText(product,false,now),'Im Shop verfügbar');
  assert.equal(inventoryText(product,true,now),'Available in the shop');
  assert.match(inventoryText(product,false,now+8*86400000),/ansehen/);
  assert.equal(inventoryText({...product,availabilityStatus:'made_to_order'},false,now),'Für dich auf Bestellung gefertigt');
  assert.match(inventoryText({...product,stock:0},false,now),/nicht verfügbar/);
  assert.match(inventoryText({...product,active:false},false,now),/nicht verfügbar/);
});
test('public snapshot contains only listing-level public quantities, not customer data',()=>{
  assert.deepEqual(Object.keys(snapshot).sort(),['checkedAt','quantities','source']);
  for(const [id,quantity] of Object.entries(snapshot.quantities)){assert.match(id,/^\d+$/);assert.ok(Number.isInteger(quantity)&&quantity>=0);}
  for(const p of data.products.filter(p=>p.inventoryCheckedAt&&p.active))assert.equal(p.stock,snapshot.quantities[p.listingId]);
  assert.equal(data.products.find(p=>p.listingId==='4599650982').availabilityStatus,'sold');
});
test('availability stays on product pages with a clear made-to-order enquiry',async()=>{
  const {renderReference}=await import('../scripts/build-design-reference.mjs');
  const {parse}=await import('parse5');
  const {walk,attr,text}=await import('../scripts/audit-design-system.mjs');
  const custom=data.products.find(p=>p.listingId==='4484195050');
  for(const en of [false,true]){
    const route=(en?'/en':'')+custom.productPath;
    const nodes=walk(parse(renderReference({route,file:route.slice(1)+'index.html',template:'product'}).html));
    const availability=nodes.find(n=>(attr(n,'class')||'').split(' ').includes('productInventory'));
    assert.match(text(availability),en?/Made to order for you/:/Für dich auf Bestellung gefertigt/);
    assert.equal(attr(walk(availability).find(n=>n.tagName==='a'),'href'),'/schneidebrett-nach-mass/#anfrage');
    assert.doesNotMatch(text(availability),/Etsy-Gesamtbestand|Stand \d|kein Lagerbestand|not ready stock/);
  }
});
test('new purchase summary is a reflection of existing price and link, not a new checkout',()=>{
  const source=fs.readFileSync(path.join(root,'assets/js/design-system.js'),'utf8');
  assert.ok(source.includes('priceValue.textContent=value.textContent'));
  assert.ok(source.includes('buy.href=action.href'));
  assert.ok(!source.includes('api.stripe.com'));
  assert.ok(source.includes('getBoundingClientRect().bottom<0'));
});
test('optimised public photos remain small and do not carry unnecessary camera metadata',()=>{
  for(const file of ['assets/geschenkset-erster-entwurf-800.jpg','assets/geschenkset-erster-entwurf-1200.jpg','assets/kuechenutensilien-set-geschenkbox-800.jpg','assets/kuechenutensilien-set-geschenkbox-1200.jpg','assets/kitchen-preview-example.jpg','assets/reviews/etsy-review-202609-marlena-buche.jpg']){
    const image=fs.readFileSync(path.join(root,file));
    assert.equal(image.readUInt16BE(0),0xffd8,file);
    assert.ok(image.length<500*1024,file+' exceeds the image budget');
    for(const signature of ['Exif\0\0','http://ns.adobe.com/xap/1.0/','Photoshop 3.0'])assert.ok(!image.includes(Buffer.from(signature)),file+' metadata');
  }
});
