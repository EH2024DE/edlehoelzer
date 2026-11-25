const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { applyStatus } = require('../scripts/apply-etsy-status-snapshot.cjs');
const root = path.resolve(__dirname, '..');
const products = require('../products.json').products;
const checkedAt = '2026-11-25T14:23:55.110Z';

test('only confirmed sold_out changes a board into visible sold inspiration', () => {
  const p = { category: 'board', active: true, priceOrder: 159.99, productPath: '/stable/' };
  applyStatus(p, { status: 200, state: 'sold_out', quantity: 0 }, checkedAt);
  assert.equal(p.availabilityStatus, 'sold');
  assert.equal(p.visibility, 'inspiration');
  assert.equal(p.inspirationOnly, true);
  assert.equal(p.active, false);
  assert.equal(p.directListingUrlVerified, false);
  assert.equal(p.priceOrder, 159.99);
  assert.equal(p.productPath, '/stable/');
});
test('missing, unauthorized and ambiguous listings are never assumed sold', () => {
  for (const result of [undefined, { status: 404 }, { status: 401 }, { status: 200, state: 'inactive', quantity: 0 }]) {
    const p = { active: true, availabilityStatus: 'available', stock: 1 };
    applyStatus(p, result, checkedAt);
    assert.deepEqual(p, { active: true, availabilityStatus: 'available', stock: 1 });
  }
});
test('active listing does not silently revive sold individual variants', () => {
  const p = { active: false, availabilityStatus: 'sold', variants: [{ availabilityStatus: 'sold' }] };
  const before = JSON.stringify(p);
  applyStatus(p, { status: 200, state: 'active', quantity: 2 }, checkedAt);
  assert.equal(JSON.stringify(p), before);
});
test('the sold walnut and oak boards remain selectable in the actual catalogue predicate', () => {
  const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  const start = source.indexOf('  function isGridProduct(product) {');
  const end = source.indexOf('  function isComparableProduct(product) {', start);
  const isGridProduct = vm.runInNewContext(source.slice(start, end) + '\nisGridProduct', {
    availabilityStatus: p => p.availabilityStatus, isAvailableProduct: () => false
  });
  for (const id of ['1850610674', '1774262638']) {
    const p = products.find(p => p.listingId === id);
    assert.equal(p.availabilityStatus, 'sold');
    assert.equal(p.stock, 0);
    assert.equal(isGridProduct(p), true, id);
    for (const prefix of ['', '/en']) {
      const html = fs.readFileSync(path.join(root, prefix + p.productPath, 'index.html'), 'utf8');
      assert.match(html, prefix ? /Sold · One-of-a-kind inspiration/ : /Verkauft · Ein Unikat als Inspiration/);
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
      assert.equal(schema.offers, undefined);
    }
  }
});

test('only the two owner-confirmed small-board variants are available at 59.99 EUR', () => {
  const p = products.find(p => p.listingId === '4599650982');
  assert.equal(p.active, true);
  assert.equal(p.stock, 2);
  assert.equal(p.inspirationOnly, false);
  assert.equal(p.priceOrder, 59.99);
  const available = p.variants.filter(v => v.availabilityStatus === 'available');
  assert.deepEqual(available.map(v => v.id), ['oak-plum', 'oak-walnut-beech-2']);
  available.forEach(v => { assert.equal(v.stock, 1); assert.equal(v.priceOrder, 59.99); });
  const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  const start = source.indexOf('  function purchaseVariant(product) {');
  const end = source.indexOf('  function purchaseVariantSummary(product) {', start);
  let chosen;
  const select = vm.runInNewContext(source.slice(start, end) + '\npurchaseVariant', {
    purchaseSelection: () => ({ woodVariant: chosen })
  });
  assert.equal(select(p).id, 'oak-plum');
  chosen = 'oak-walnut-beech';
  assert.equal(select(p).id, 'oak-plum', 'a sold historical selection must not become the purchase default');
  chosen = 'oak-walnut-beech-2';
  assert.equal(select(p).id, chosen);
  for (const prefix of ['', '/en']) {
    const html = fs.readFileSync(path.join(root, prefix + p.productPath, 'index.html'), 'utf8');
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    assert.deepEqual(schema.hasVariant.filter(v => v.offers).map(v => v.sku),
      available.map(v => p.id + '-' + v.id));
    schema.hasVariant.filter(v => v.offers).forEach(v => assert.equal(v.offers.price, 59.99));
  }
});
