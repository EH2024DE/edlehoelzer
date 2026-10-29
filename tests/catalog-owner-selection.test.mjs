import test from 'node:test';
import assert from 'node:assert/strict';
import {publicCatalog,quote} from '../tools/shop-server/catalog.mjs';
import {servingListingIds} from '../tools/shop-server/catalog-groups.mjs';
import {renderSitePreview} from '../tools/shop-server/site-preview.mjs';
test('serving navigation uses the owner-curated compact and serving products only',()=>{
 const offers=publicCatalog().offers;
 assert.deepEqual(new Set(offers.filter(o=>o.catalogGroups.includes('serving')).map(o=>o.listingId)),servingListingIds);
 for(const id of ['4370769708','1850610674','4417507555','1776273564'])assert.ok(!offers.find(o=>o.listingId===id).catalogGroups.includes('serving'));
 assert.ok(offers.find(o=>o.listingId==='1818046728').sourceReviewRequired,'existing inventory still needs source verification');
});
test('No.004 supports the existing engraving price, fonts and narrow-edge position',()=>{
 const result=quote({country:'DE',items:[{sku:'product-4370769708',quantity:1,engraving:true,personalisation:{kind:'text',text:'Unsere Erinnerungen',font:'allura',position:'edge-front-left'}}]});
 assert.equal(result.items[0].unitCents,29499);
 assert.equal(result.items[0].personalisation.position,'edge-front-left');
 assert.equal(result.items[0].mockupApprovalRequired,true);
});
test('both canonical No.004 pages use the configurable heirloom presentation',()=>{
 for(const prefix of ['','/en']){
  const route=prefix+'/produkte/erbstueck-no-004-eiche-buche-4370769708/';
  const {html}=renderSitePreview(route);assert.match(html,/data-product-focus="product-4370769708"/);assert.match(html,/atelierStoryArchive/);assert.match(html,new RegExp('https://edlehoelzer.de'+route));
 }
});
