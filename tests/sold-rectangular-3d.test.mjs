import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {publicCatalog,quote} from '../tools/shop-server/catalog.mjs';
const data=JSON.parse(fs.readFileSync('products.json','utf8'));
test('owner-sold rectangular 3D board is archived, while the square homepage board stays available',()=>{
 const sold=data.products.find(p=>p.listingId==='1803930088'),square=data.products.find(p=>p.listingId==='1776273564');
 assert.equal(sold.stock,0);assert.equal(sold.active,false);assert.equal(sold.availabilityStatus,'sold');assert.equal(sold.visibility,'archive');
 assert.equal(square.active,true);assert.equal(square.stock,1);assert.equal(square.availabilityStatus,'available');
 assert.equal(publicCatalog().offers.find(o=>o.listingId===sold.listingId).sold,true);
 assert.throws(()=>quote({country:'DE',items:[{sku:'product-1803930088',quantity:1}]}),/PRODUCT_UNAVAILABLE/);
});
test('both static product pages keep the archived piece, without an active offer or buy button',()=>{
 for(const prefix of ['','en/']){
  const html=fs.readFileSync(prefix+'produkte/3d-stirnholz-nussbaum-weitere-1803930088/index.html','utf8');
  assert.match(html,/Verkauft|Sold/);assert.match(html,/Ähnliches Stück anfragen|Request a similar piece/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema.offers,undefined);
 }
 const home=fs.readFileSync('atelier-vorschau/start/index.html','utf8');assert.match(home,/data-atelier-piece="product-1776273564"/);assert.doesNotMatch(home,/data-atelier-piece="product-1803930088"/);
});
