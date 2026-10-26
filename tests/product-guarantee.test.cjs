const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const source = fs.readFileSync('main.js', 'utf8');
const context = {};
vm.runInNewContext(source.split('document.documentElement.classList.add("js");')[0], context);
const data = require('../products.json');

test('statutory notice uses the complete official language asset and clickable QR destination', () => {
  for (const en of [false, true]) {
    const html = context.renderLegalGuaranteeNotice(en);
    const lang = en ? 'en' : 'de';
    assert.match(html, /<details class="legalGuarantee"><summary>/);
    assert.ok(html.includes('/assets/legal/eu-legal-guarantee-' + lang + '.svg'));
    assert.ok(html.includes('https://europa.eu/youreurope/' + (en ? 'guarantees' : 'garantien')));
    assert.doesNotMatch(html, /GARAN|commercial guarantee|Herstellergarantie/);
    const asset = fs.readFileSync('assets/legal/eu-legal-guarantee-' + lang + '.svg');
    const expected = en ? 'd1b4293b75637022b582b3025f789d292e1c845660a0460d855bbe523b9763f7' : 'fd39364dbe42fa775ff55fb9b7aa80c377a5d04219929fef86a8522eed486b1a';
    assert.equal(crypto.createHash('sha256').update(asset).digest('hex'), expected);
  }
});

test('all static products and both catalogues expose the notice without JavaScript', () => {
  for (const en of [false, true]) {
    const catalog = fs.readFileSync(en ? 'en/products.html' : 'produkte.html', 'utf8');
    assert.ok(catalog.indexOf('class="legalGuarantee"') < catalog.indexOf('data-products-grid'));
    for (const product of data.products.filter(p => !p.canonicalProductId)) {
      const html = fs.readFileSync('.' + (en ? '/en' : '') + product.productPath + 'index.html', 'utf8');
      assert.equal((html.match(/class="legalGuarantee"/g) || []).length, 1, product.id);
      assert.ok(html.includes('eu-legal-guarantee-' + (en ? 'en' : 'de') + '.svg'));
    }
  }
});

test('interactive details retain the notice after hydration and balm copy leads with care, not discount', () => {
  const renderer = source.slice(source.indexOf('  function renderProductPreview('), source.indexOf('  function toggleCompare('));
  assert.ok(renderer.includes('renderLegalGuaranteeNotice(isEnglish)'));
  assert.ok(renderer.indexOf('renderEarlyPurchaseAction(product)') < renderer.indexOf('renderLegalGuaranteeNotice(isEnglish)'));
  assert.ok(!renderer.includes('renderPurchaseBenefit(product)'));
  assert.match(source, /careBalmOption: "Die passende Pflege gleich dazu"/);
  assert.match(source, /careBalmOption: "Add matching wood care"/);
  assert.doesNotMatch(source, /careBalmOption: "[^"\n]*(?:10 %|10%)/);
  assert.ok(source.includes('escapeHtml(labels.careBalmOptionNote)'));
});
