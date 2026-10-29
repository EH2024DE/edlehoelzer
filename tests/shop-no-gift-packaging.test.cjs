const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('shop and heirloom previews offer no additional gift-grouping controls in either language',()=>{
 for(const file of ['shop-vorschau/index.html','en/shop-preview/index.html','atelier-vorschau/erbstueck/index.html','en/atelier-preview/erbstueck/index.html']){
  assert.doesNotMatch(fs.readFileSync(file,'utf8'),/data-gift-options|data-create-bundle|data-shop-bundles|data-shop-set-ideas/);
 }
 assert.doesNotMatch(fs.readFileSync('assets/js/shop-pilot.js','utf8'),/data-bundle-select|bundleSelection|bundleId/);
});
test('existing serving-board sets and business gift ideas remain available',()=>{
 const products=require('../products.json').products;
 for(const id of ['4440690649','4389604739'])assert.ok(products.some(p=>p.listingId===id));
 assert.match(fs.readFileSync('handgefertigte-holzprodukte-fuer-unternehmen/index.html','utf8'),/<h3>Geschenksets<\/h3>/);
});
