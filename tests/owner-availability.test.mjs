import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {publicCatalog,quote,ROOT} from '../tools/shop-server/catalog.mjs';
test('larch is an active made-to-order product with no raw material or finished stock',()=>{
  const data=JSON.parse(fs.readFileSync(ROOT+'/products.json'));
  const product=data.products.find(p=>p.listingId==='1818046728');
  assert.equal(product.active,true);assert.equal(product.stock,0);
  assert.equal(product.availabilityStatus,'made_to_order');assert.equal(product.materialInStock,false);
  assert.doesNotMatch(product.availabilityNote,/Verkauftes Einzelstück/);
  const offer=publicCatalog().offers.find(p=>p.listingId===product.listingId);
  assert.equal(offer.sold,false);assert.equal(offer.singlePiece,false);
  assert.equal(offer.dispatch,'by-agreement');assert.equal(offer.requiresAgreement,true);
  assert.match(offer.availabilityNoteEn,/not in stock/);
  const q=quote({country:'DE',items:[{sku:offer.sku,quantity:1}]});
  assert.equal(q.items[0].requiresAgreement,true);
  for(const prefix of ['', '/en']){
    const html=fs.readFileSync(ROOT+prefix+product.productPath+'index.html','utf8');
    assert.match(html,/https:\/\/schema.org\/PreOrder/);
    assert.match(html,prefix?/not in stock/:/nicht auf Lager/);
  }
});
test('No.004 has verified product weight but not invented packed weight or dimensions',()=>{
  const offer=publicCatalog().offers.find(p=>p.listingId==='4370769708');
  assert.equal(offer.weightKg,5.8);assert.equal(offer.engravingCents,1000);
  assert.equal(offer.juiceGrooveCents,1500);assert.equal(offer.requiresAgreement,true);
  assert.equal(offer.packedWeightKg,undefined);
  for(const grooveType of ['perimeter','basin-left','basin-front-right']){
    const result=quote({country:'DE',items:[{sku:offer.sku,quantity:1,juiceGroove:true,grooveType}]});
    assert.equal(result.items[0].unitCents,29999);
  }
});
