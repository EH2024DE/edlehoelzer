const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const data=require('../products.json');
const source=fs.readFileSync('main.js','utf8');
const context={};vm.runInNewContext(source.slice(0,source.indexOf('document.documentElement.classList.add("js");')),context);
const supports=context.supportsJuiceGrooveOption;
test('grooves need an approved cutting board at least two centimetres thick',()=>{
 const rules={juiceGrooveOptionListingIds:['test']};
 const p={listingId:'test',category:'board',productType:'cuttingBoard',thicknessLabel:'2 cm'};
 assert.ok(supports(p,rules));
 for(const thicknessLabel of ['1,9 cm','ca. 1,5 cm','nicht angegeben'])assert.ok(!supports({...p,thicknessLabel},rules));
 assert.ok(!supports({...p,productType:'servingBoard'},rules));
 assert.ok(!supports({...p,category:'accessory'},rules));
 assert.ok(!supports({...p,finderProfile:{juiceGroove:true}},rules));
 assert.ok(!supports({...p,listingId:'unapproved'},rules));
});
test('real serving sets and thin boards never receive a groove option',()=>{
 for(const p of data.products.filter(p=>p.productType==='servingBoard'))assert.ok(!supports(p,data.purchaseRules),p.id);
 assert.ok(supports(data.products.find(p=>p.listingId==='1803930088'),data.purchaseRules));
 assert.equal(data.purchaseRules.optionPrices.juiceGroove,15);
});
test('schematics are original generic drawings without embedded Etsy arrows or photos',()=>{
 for(const name of ['guide','continuous','left','right']){
  const svg=fs.readFileSync('assets/juice-groove-'+name+'.svg','utf8');
  assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<image|etsy|base64|foreignObject/i);
 }
});
