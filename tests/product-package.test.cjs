const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const data = require('../products.json');
const source = fs.readFileSync('main.js','utf8');
const context = {};
vm.runInNewContext(source.split('document.documentElement.classList.add("js");')[0],context);
const byId = id=>data.products.find(p=>p.listingId===id);
const items = (id,selection)=>context.productPackageItems(byId(id),data.purchaseRules,selection);
const ids = (id,selection)=>Array.from(items(id,selection),i=>i.id);
test('every product has bilingual, non-duplicated package contents',()=>{
  for(const product of data.products){
    const before=JSON.stringify(product);
    const result=context.productPackageItems(product,data.purchaseRules);
    assert.equal(result[0].id,'product',product.id);
    assert.equal(new Set(result.map(i=>i.id)).size,result.length,product.id);
    assert.ok(result.every(i=>i.label && i.labelEn),product.id);
    assert.equal(JSON.stringify(product),before);
  }
});
test('actual sets distinguish six coasters, three serving boards and a single sword board',()=>{
  assert.match(items('1838851839')[0].label,/6 Holzuntersetzer/);
  assert.ok(ids('1838851839').includes('holder'));
  assert.match(items('4440690649')[0].label,/3 .*Servierbretter/);
  assert.ok(ids('4440690649').includes('holder'));
  assert.match(items('4389604739')[0].label,/1 Servierbrett/);
  assert.ok(!ids('4389604739').includes('holder'));
});
test('verified walnut and Erbstueck packages include stand, balm and instructions below generic stand threshold',()=>{
  for(const id of ['1850610674','4370769708','4598989614']){
    const result=ids(id);
    for(const item of ['holder','careBalm','careGuide']) assert.ok(result.includes(item),id+':'+item);
  }
  assert.ok(!ids('1850610674').includes('card'));
});
test('personally addressed cards belong exclusively to Erbstueck packages',()=>{
  const heirlooms=['4370769708','4598989614'];
  for(const product of data.products) assert.equal(ids(product.listingId).includes('card'),heirlooms.includes(product.listingId),product.id);
});
test('optional balm and order thresholds update contents without adding unselected accessories',()=>{
  assert.ok(!ids('4522458953').includes('careBalm'));
  assert.ok(ids('4522458953',{goodsValue:65.99,careBalm:true}).includes('careBalm'));
  assert.ok(ids('4522458953',{goodsValue:150}).includes('careBalm'));
  assert.ok(!ids('4522458953',{goodsValue:350}).includes('holder'),'thin boards do not gain stand entitlement');
  assert.ok(ids('4417507555',{goodsValue:350}).includes('holder'));
  assert.ok(!ids('4599650982').includes('careBalm'));
  assert.ok(!ids('4599650982').includes('holder'));
});
test('cloth is included only for listings with explicit evidence, not every eligible board',()=>{
  assert.ok(ids('1881802291').includes('careCloth'));
  assert.match(items('1881802291').find(i=>i.id==='careCloth').label,/Mikrofasertuch/);
  assert.ok(!ids('4522458953',{goodsValue:65.99,careBalm:true}).includes('careCloth'),'optional balm does not imply standalone care set contents');
  for(const id of ['1894223313','1776273564','4297451235','4297472161'])assert.ok(ids(id).includes('careCloth'));
  assert.ok(!ids('1824089235').includes('careCloth'));
});
test('current framed spalted-beech offer uses walnut, not the previous ash material assignment',()=>{
  const p=byId('4370784882');
  assert.equal(p.material,'Stockbuche, Nussbaum');
  assert.match(p.shortDescription,/Nussbaumrahmen/);
  assert.ok(!p.badges.includes('Buche, Esche'));
});
test('explicit included balm is not charged again below the general threshold',()=>{
  const e={purchaseRules:data.purchaseRules,purchaseSubtotalWithoutCareBalm:()=>100,purchaseSelection:()=>({careBalm:true}),purchaseOptions:()=>[{id:'careBalm',price:8.99}]};
  for(const name of ['careBalmIsIncluded','purchaseTotal']){
    const start=source.indexOf('  function '+name+'(');
    vm.runInNewContext(source.slice(start,source.indexOf('\n  function ',start+1)),e);
  }
  assert.equal(e.purchaseTotal({includesCareBalm:true}),100);
  assert.equal(e.purchaseTotal({}),108.99);
});
test('detail renderer removes generic slogans and puts package/configuration before checkout',()=>{
  const renderer=source.slice(source.indexOf('  function renderProductPreview('),source.indexOf('  function toggleCompare('));
  assert.doesNotMatch(renderer,/productMoment\(|renderExperiencePromise\(|productHighlights\(/);
  assert.ok(renderer.indexOf('renderPurchaseConfigurator(product)')<renderer.indexOf('data-product-package'));
  assert.ok(renderer.indexOf('data-product-package')<renderer.indexOf('renderEarlyPurchaseAction(product)'));
  assert.ok(renderer.includes('<details class="productPreview__detail"'));
});
