const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const combined = data.products.find(p => p.listingId === '4417507555');
const single = data.products.find(p => p.listingId === '4451487112');
function engine() {
  const functions = ['purchaseSelection', 'purchaseVariant', 'purchaseSubtotalWithoutCareBalm'].map(name => {
    const start = source.indexOf('  function ' + name + '(');
    return source.slice(start, source.indexOf('\n  function ', start + 1));
  }).join('\n');
  const context = { purchaseSelections: {}, purchaseOptions: () => [{id:'juiceGroove',price:data.purchaseRules.optionPrices.juiceGroove}] };
  vm.runInNewContext(functions, context);
  return context;
}
test('combined starting price is the cheapest wood, not the oak reference price', () => {
  assert.equal(combined.priceOrder, 254.99);
  assert.equal(combined.priceOrder, Math.min(...combined.variants.map(v => v.priceOrder)));
  assert.equal(combined.availabilityStatus, 'available');
  assert.equal(combined.variants.find(v => v.id === 'oak').availabilityStatus, 'made_to_order');
});
test('tropical prices agree across both listings, including the optional groove', () => {
  const tropical = combined.variants.find(v => v.id === 'tropical');
  assert.equal(single.priceOrder, 274.99);
  assert.equal(tropical.priceOrder, single.priceOrder);
  assert.equal(Math.round((single.priceOrder + data.purchaseRules.optionPrices.juiceGroove) * 100) / 100, 289.99);
  assert.ok(data.purchaseRules.juiceGrooveOptionListingIds.includes(combined.listingId));
});
test('wood selection recalculates all three base and groove prices without mutating catalog data', () => {
  const e = engine();
  assert.equal(e.purchaseSubtotalWithoutCareBalm(combined), 254.99);
  for (const [id,base,groove] of [['beech',254.99,269.99],['tropical',274.99,289.99],['oak',284.99,299.99]]) {
    e.purchaseSelections[combined.id] = {woodVariant:id};
    assert.equal(e.purchaseSubtotalWithoutCareBalm(combined), base);
    e.purchaseSelections[combined.id].juiceGroove = true;
    assert.equal(e.purchaseSubtotalWithoutCareBalm(combined), groove);
  }
  assert.equal(combined.priceOrder, 254.99);
});
test('unknown variant safely falls back to the advertised starting variant', () => {
  const e = engine();
  e.purchaseSelections[combined.id] = {woodVariant:'invalid'};
  assert.equal(e.purchaseSubtotalWithoutCareBalm(combined), 254.99);
});
