const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const main = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const context = {};
vm.runInNewContext(main.split('document.documentElement.classList.add("js");')[0], context);
const copy = context.EdleProductCopy.text;
const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8')).products;
const german = /Stirnholz|Langholz|Flankenholz|personalisierbar|Schneidebrett|Servierbrett|Teigschaber|Pfannenwender|Buttermesser|Bretthalter|Untersetzer|Nussbaum|Eiche|Buche|Esche|Laerche|Zwetschge|Saftrille|Astloch|Griffmulden|Schweizer|je nach|nicht angegeben|\boder\b|\bund\b|\bmit\b/;

test('all catalog names, badges, materials and short descriptions have English display copy', () => {
  for (const product of products) {
    for (const field of ['displayName', 'segment', 'material', 'shortDescription', 'sizeLabel', 'thicknessLabel', 'badges']) {
      for (const value of [].concat(product[field] || [])) {
        if (/Format laut Etsy|Set laut Etsy|nicht relevant/.test(value)) continue;
        assert.doesNotMatch(copy(value, true), german, `${product.id}: ${field}: ${value}`);
      }
    }
    assert.notEqual(copy(product.displayName, true), product.displayName);
  }
});

test('German catalog display and source data remain unchanged', () => {
  const before = JSON.stringify(products);
  for (const product of products) {
    for (const field of ['displayName', 'name', 'segment', 'material', 'shortDescription', 'priceLabel', 'badges']) {
      for (const value of [].concat(product[field] || [])) {
        assert.equal(copy(value, false), value);
        copy(value, true);
      }
    }
  }
  assert.equal(JSON.stringify(products), before);
});

test('construction, personalisation and Swiss bevel use consistent terminology', () => {
  assert.equal(copy('Stirnholz', true), 'End grain');
  assert.equal(copy('Langholz', true), 'Edge grain');
  assert.equal(copy('personalisierbar', true), 'Personalisable');
  assert.equal(copy('Schweizer Kante möglich', true), 'Swiss bevel available');
  assert.equal(copy('ca. 40 × 40 × 4,5 cm', true), 'approx. 40 × 40 × 4.5 cm');
});

test('display translation does not replace partial words or unknown product names', () => {
  assert.equal(copy('Beech & Kambala', true), 'Beech & Kambala');
  assert.equal(copy('Kitchen table', true), 'Kitchen table');
  assert.equal(copy('Erbstück', true), 'Erbstück');
});
