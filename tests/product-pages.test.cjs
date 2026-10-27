const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../products.json');
const root = path.resolve(__dirname, '..');
const products = data.products.filter(p => !p.canonicalProductId);
const read = url => fs.readFileSync(path.join(root, url, 'index.html'), 'utf8');
test('every independent product has two static indexable pages and reciprocal alternates', () => {
  assert.equal(new Set(products.map(p => p.productPath)).size, products.length);
  const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  for (const p of products) for (const en of [false,true]) {
    const url = (en ? '/en' : '') + p.productPath;
    const html = read(url);
    assert.equal((html.match(/<h1>/g)||[]).length, 1, url);
    assert.ok(html.includes('rel="canonical" href="https://edlehoelzer.de' + url + '"'), url);
    assert.ok(html.includes('hreflang="de" href="https://edlehoelzer.de' + p.productPath + '"'));
    assert.ok(html.includes('hreflang="en" href="https://edlehoelzer.de/en' + p.productPath + '"'));
    assert.ok(sitemap.includes('<loc>https://edlehoelzer.de' + url + '</loc>'));
    assert.ok(html.includes(p.image));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    if (p.availabilityStatus === 'sold') {
      assert.ok(html.includes(en ? 'Sold' : 'Verkauft'));
      assert.equal(schema.offers, undefined);
      assert.ok(!html.includes('https://schema.org/InStock'));
    }
    if (p.variants?.length) {
      assert.equal(schema['@type'],'ProductGroup');
      assert.equal(schema.hasVariant.length,p.variants.length);
      for (const [i,v] of p.variants.entries()) {
        assert.equal(schema.hasVariant[i].offers.price,v.priceOrder);
        assert.ok(schema.hasVariant[i].offers.url.endsWith('?variante='+v.id));
      }
    }
  }
});
test('Etsy tropical experiment routes to the combined product without a duplicate page', () => {
  const alias = data.products.find(p=>p.listingId==='4451487112');
  const combined = data.products.find(p=>p.listingId==='4417507555');
  assert.equal(alias.canonicalProductId, combined.id);
  assert.equal(alias.canonicalVariantId,'tropical');
  assert.equal(alias.productPath,combined.productPath);
  assert.equal(products.filter(p=>p.productPath===combined.productPath).length,1);
  assert.deepEqual(combined.variants.map(v=>v.id),['beech','tropical','oak']);
});
test('verified October 26 price corrections agree with active Etsy offers', () => {
  const combined = data.products.find(p=>p.listingId==='4417507555');
  const coasters = data.products.find(p=>p.listingId==='1838851839');
  assert.equal(combined.priceOrder,254.99);
  assert.equal(coasters.priceOrder,39.99);
  assert.equal(combined.priceVerifiedAt,'2026-10-26');
  assert.ok(!combined.shortDescription.includes('264,99'));
});
