const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const start = main.indexOf('function buildCardGalleryItems(');
const end = main.indexOf('\nif (!document.querySelector', start);
const context = {};
vm.runInNewContext(main.slice(start, end), context);

test('mobile gallery starts with the product photo, then real videos, then other photos', () => {
  const p = { image: '/a.jpg', gallery: ['/a.jpg', '/b.jpg'], videos: [{ src: '/v.mp4', poster: '/v.jpg' }] };
  const original = JSON.stringify(p);
  const result = JSON.parse(JSON.stringify(context.buildCardGalleryItems(p)));
  assert.deepEqual(result.map(x => x.src), ['/a.jpg', '/v.mp4', '/b.jpg']);
  assert.equal(JSON.stringify(p), original);
});

test('gallery is bounded, deduplicated and ignores incomplete videos', () => {
  const result = context.buildCardGalleryItems({ image: '/a.jpg', gallery: Array.from({ length: 20 }, (_, i) => '/' + i + '.jpg'), videos: [{ src: '/bad.mp4' }] });
  assert.equal(result.length, 5);
  assert.ok(result.every(x => x.type === 'image'));
});

test('mobile gallery uses the existing Etsy card-image size, not full-size photos', () => {
  assert.equal(context.buildCardGalleryItems({ image: 'https://i.etsystatic.com/1/r/il/a/b/il_fullxfull.b.jpg' })[0].src, 'https://i.etsystatic.com/1/r/il/a/b/il_794xN.b.jpg');
});

test('existing catalog entries remain unchanged except verified walnut and No.004 corrections', () => {
  const before = JSON.parse(require('node:child_process').execFileSync('git', ['show', 'origin/main:products.json'], { cwd: root, encoding: 'utf8' }));
  const walnut = before.products.find(p => p.listingId === '1850610674');
  walnut.priceOrder = 279.99;
  walnut.priceLabel = '279,99 EUR';
  const heirloom = before.products.find(p => p.listingId === '4370769708');
  Object.assign(heirloom, {
    priceOrder: 284.99, priceLabel: 'ab 284,99 EUR', priceVerifiedAt: '2026-10-23',
    etsyOptionsOnly: true, dimensionsReviewRequired: true,
    includesEndGrainHolder: true, includesCareBalm: true,
    shortDescription: 'Historische Eiche in Stirnholz-Bauweise mit Buche-Inlay. Passender Stirnholzhalter und Pflegebalsam inklusive. Maße und Gewicht findest du im aktuellen Angebot.',
    badges: ['Eiche & Buche', 'Stirnholz', 'Erbstück']
  });
  const after = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
  const existingIds = new Set(before.products.map(p => p.id));
  after.products = after.products.filter(p => existingIds.has(p.id));
  const withoutVideos = data => { data.products.forEach(p => delete p.videos); return data; };
  assert.deepEqual(withoutVideos(after), withoutVideos(before));
});

test('all assigned videos and posters exist locally; owner-confirmed mappings stay explicit', () => {
  const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8')).products;
  const mappings = require('../scripts/import-card-videos.json');
  for (const p of products) for (const v of p.videos || []) {
    assert.ok(fs.existsSync(path.join(root, v.src)), v.src);
    assert.ok(fs.existsSync(path.join(root, v.poster)), v.poster);
  }
  for (const source of ['Eiche_Rechteck_klein_hamornisch.mp4', 'Eiche_Padouk_Schachbrett.mp4', 'Nussbaum_Wenge_Ahorn_Buche.mp4']) {
    assert.equal(mappings.find(x => x.source === source).ownerConfirmed, true);
  }
});

test('local turnaround originals take priority; previous application videos remain available', () => {
  const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8')).products;
  for (const [id, slug] of [['4549962555', 'buttermesser'], ['4471048251', 'teigschaber']]) {
    const p = products.find(p => p.listingId === id);
    assert.equal(p.videos[0].src, '/assets/product-videos/' + slug + '-turnaround.mp4');
    assert.equal(p.videos.length, 2);
    assert.ok(!p.videos.some(v => /holzarten-drehung-etsy/.test(v.src)));
  }
});

test('consent sanitizer preserves product attribution without allowing arbitrary parameters', () => {
  const code = fs.readFileSync(path.join(root, 'assets/js/consent-manager.js'), 'utf8');
  const first = code.indexOf('  function sanitizePayload(');
  const last = code.indexOf('\n  function ', first + 10);
  const c = { isEnglish: () => false, window: { location: { pathname: '/produkte.html' } } };
  vm.runInNewContext(code.slice(first, last), c);
  const result = c.sanitizePayload({ product_id: 'p', listing_id: '123', product_name: 'Erbstück', wood: 'Eiche, Buche', entry_point: 'card_cta', email: 'no@example.com' });
  assert.equal(result.product_name, 'Erbstück');
  assert.equal(result.entry_point, 'card_cta');
  assert.equal(result.listing_id, '123');
  assert.equal(result.email, undefined);
  assert.match(main, /track\("product_card_cta_click", product/);
});
