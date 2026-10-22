const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8')).products;
const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const byId = id => products.find(p => p.listingId === id);

test('new live Etsy listings retain all photos, verified starting prices and direct links', () => {
  for (const [id, price, photos] of [['4599650982', 39.99, 13], ['4598989614', 284.99, 16], ['4598938055', 279.99, 14]]) {
    const p = byId(id);
    assert.ok(p.active && p.dataVerified && p.directListingUrlVerified);
    assert.equal(p.priceOrder, price);
    assert.equal(p.gallery.length, photos);
    assert.equal(new Set(p.gallery).size, photos);
    assert.ok(p.etsyUrl.includes('/' + id + '/'));
    assert.equal(p.etsyOptionsOnly, true);
  }
});

test('five compact-board designs have the prices and photos shown on Etsy', () => {
  const p = byId('4599650982');
  assert.deepEqual(p.variants.map(v => v.priceOrder), [39.99, 49.99, 59.99, 59.99, 59.99]);
  assert.deepEqual(p.variants.map(v => p.gallery.indexOf(v.image)), [3, 12, 0, 6, 9]);
  assert.ok(p.variants.every(v => v.nameEn && v.availabilityStatus === 'available'));
  assert.equal(p.priceOrder, Math.min(...p.variants.map(v => v.priceOrder)));
});

test('Erbstueck groove option is not confused with wood-species pricing', () => {
  const p = byId('4598989614');
  assert.deepEqual(p.variants.map(v => v.priceOrder), [284.99, 299.99]);
  assert.equal(p.variantLabel, 'Ausführung');
  assert.equal(p.weight, 'ca. 5,8 kg');
  assert.equal(byId('4598938055').weight, 'ca. 3,7 kg');
});

test('product details no longer truncate listing galleries and cards omit service chips', () => {
  assert.doesNotMatch(main, /urls\.slice\(0, 9\)|videos\.concat\(images\)\.slice/);
  assert.doesNotMatch(main, /buildServiceSignals\(/);
  assert.match(main, /data-preview-src'\) === selectedVariant\.image/);
});
