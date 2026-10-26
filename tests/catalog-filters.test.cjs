const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('main.js', 'utf8');
const matcher = vm.runInNewContext(source.slice(source.indexOf('function createCatalogMatcher()'), source.indexOf('function initProductsPage()')) + '\ncreateCatalogMatcher()');
const data = require('../products.json');
const product = id => data.products.find(p => String(p.listingId) === id);
const match = (id, filters) => matcher.matches(product(id), filters, data.purchaseRules);

test('tools, coasters, holder and balm have distinct browsing groups', () => {
  for (const id of ['4471048251', '4470469056', '4549962555']) assert.ok(match(id, {category: 'tools'}));
  assert.ok(match('1838851839', {category: 'coasters'}));
  assert.ok(!match('1838851839', {category: 'tools'}));
  for (const id of ['1874454440', '1881802291']) {
    assert.ok(match(id, {category: 'care'}));
    assert.ok(!match(id, {category: 'tools'}));
  }
});
test('boards can belong to both groups without admitting accessories or serving-only swords', () => {
  assert.ok(match('1774262638', {category: 'board'}));
  assert.ok(match('1774262638', {category: 'serving'}));
  assert.ok(match('1827805914', {category: 'board'}));
  assert.ok(match('1827805914', {category: 'serving'}));
  assert.ok(!match('4549962555', {category: 'serving'}));
  assert.ok(!match('4389604739', {category: 'board'}));
  assert.ok(match('4389604739', {category: 'serving'}));
});
test('construction and mixed woods use existing product facts', () => {
  assert.ok(match('1774262638', {construction: 'edge'}));
  assert.ok(!match('1774262638', {construction: 'end'}));
  assert.ok(match('1850610674', {construction: 'block'}));
  assert.ok(match('4417507555', {construction: 'block'}));
  assert.ok(!match('1783351692', {construction: 'block'}));
  for (const wood of ['ahorn', 'nussbaum']) assert.ok(match('4450988121', {wood}));
  for (const wood of ['eiche', 'buche', 'nussbaum', 'ahorn', 'zwetschge']) assert.ok(match('4599650982', {wood}));
});
test('thickness handles approximate values, mm and ranges without guessing missing dimensions', () => {
  for (const [label, expected] of [['ca. 5 cm', 5], ['40 mm', 4], ['3,3–3,6 cm', 3.3], ['massiv', null]]) {
    assert.equal(matcher.thicknessCm({thicknessLabel: label}), expected);
  }
  assert.equal(matcher.thicknessCm({thicknessLabel: '5 cm', dimensionsReviewRequired: true}), null);
  assert.ok(!match('1874454440', {construction: 'block'}));
  assert.ok(!match('4370769708', {construction: 'block'}));
});
test('grooves distinguish included, optional rules and explicitly available Etsy variants', () => {
  assert.ok(match('1783351692', {groove: 'available'}));
  assert.ok(!match('1783351692', {groove: 'included'}));
  assert.ok(match('1850610674', {groove: 'included'}));
  assert.ok(match('4598989614', {groove: 'available'}));
  assert.ok(!match('4598989614', {groove: 'included'}));
  assert.ok(!match('4471048251', {groove: 'available'}));
});
test('irrelevant filters never exclude tools or care', () => {
  assert.ok(match('4471048251', {category: 'tools', construction: 'end', groove: 'included'}));
  assert.ok(match('1881802291', {category: 'care', wood: 'eiche', construction: 'block', groove: 'included'}));
});
test('use filter supports newer structured usage fields and cross-group gifts', () => {
  for (const id of ['4598989614', '4599650982']) {
    for (const useCase of ['daily', 'gift', 'serving']) assert.ok(match(id, {useCase}));
  }
  assert.ok(match('4471048251', {category: 'tools', useCase: 'gift'}));
  assert.ok(!match('4599650982', {useCase: 'bbq'}));
});
test('every active product has a browsing group and matching never mutates the catalog', () => {
  const before = JSON.stringify(data);
  for (const p of data.products.filter(p => p.active)) {
    assert.ok(matcher.groups(p).length, p.id);
    matcher.matches(p, {construction: 'block', groove: 'available', wood: 'other'}, data.purchaseRules);
  }
  assert.equal(JSON.stringify(data), before);
});
