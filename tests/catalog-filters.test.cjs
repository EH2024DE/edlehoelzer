const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('main.js','utf8');
const matcher = vm.runInNewContext(source.slice(source.indexOf('function createCatalogMatcher()'),source.indexOf('function initProductsPage()'))+'\ncreateCatalogMatcher()');
const data = require('../products.json');
const match = (id, filters) => matcher.matches(data.products.find(p=>p.listingId===id),filters,data.purchaseRules);
test('tools, coasters, stands and balm use distinct browsing groups',()=>{
  for(const [id,group] of [['4471048251','tools'],['1838851839','coasters'],['1874454440','care'],['1881802291','care']])assert.ok(match(id,{category:group}),id);
  assert.ok(!match('1838851839',{category:'tools'}));
  assert.ok(!match('1874454440',{category:'tools'}));
});
test('serving groups match the current owner-curated portfolio rather than generic serving suitability',async()=>{
  const {catalogGroups}=await import('../tools/shop-server/catalog-groups.mjs');
  for(const p of data.products)assert.deepEqual(Array.from(matcher.groups(p)),catalogGroups(p),p.id);
  assert.ok(match('1818046728',{category:'board'}));
  assert.ok(match('1818046728',{category:'serving'}));
  assert.ok(!match('1850610674',{category:'serving'}));
});
test('construction and all actual mixed wood species remain searchable',()=>{
  assert.ok(match('1774262638',{construction:'edge'}));
  assert.ok(!match('1774262638',{construction:'end'}));
  assert.ok(match('1850610674',{construction:'block'}));
  assert.ok(!match('1783351692',{construction:'block'}));
  for(const wood of ['ahorn','nussbaum'])assert.ok(match('4450988121',{wood}));
  const mm={category:'board',thicknessLabel:'35–45 mm'};
  assert.ok(!matcher.matches(mm,{construction:'block'},{}));
  assert.ok(matcher.matches({...mm,thicknessLabel:'40 mm'},{construction:'block'},{}));
});
test('grooves distinguish included from optional and ignore irrelevant filters in other groups',()=>{
  assert.ok(match('1783351692',{groove:'available'}));
  assert.ok(!match('1783351692',{groove:'included'}));
  assert.ok(match('1850610674',{groove:'included'}));
  assert.ok(!match('4471048251',{groove:'available'}));
  assert.ok(match('4471048251',{category:'tools',construction:'end',groove:'included'}));
  assert.ok(match('1881802291',{category:'care',wood:'eiche',groove:'included'}));
});
test('every active product belongs to at least one visible group',()=>{
  for(const p of data.products.filter(p=>p.active))assert.ok(matcher.groups(p).length,p.id);
});
