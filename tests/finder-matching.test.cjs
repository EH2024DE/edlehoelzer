const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const engine = source.slice(source.indexOf('function createFinderMatcher()'), source.indexOf('function initProductsPage()'));
const matcher = vm.runInNewContext(engine + '\ncreateFinderMatcher();');
const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8')).products;
const byListing = id => products.find(p => p.listingId === id);
const answers = (use, space, movement, style, budget, giftUse) => ({ use, space, movement, style, budget, giftUse });
const select = (...args) => matcher.select(products, answers(...args));

test('1: breakfast admits the real breakfast board, not a heavy hackblock', () => {
  const result = select('breakfast', 'compact', 'portable', 'open', 'max100');
  assert.equal(matcher.evaluate(byListing('1827805914'), answers('breakfast', 'compact', 'portable', 'open', 'max100')).hardConflicts.length, 0);
  assert.equal(result.main.product.listingId, '1827805914');
  assert.notEqual(result.main.product.weightClass, 'heavy');
});
test('2: daily prep recommends a cutting board below the price cap', () => {
  const r = select('dailyPrep', 'medium', 'balanced', 'open', 'max250');
  assert.equal(r.main.product.productType, 'cuttingBoard');
  assert.ok(r.main.product.priceOrder <= 250);
});
test('3: BBQ large stationary has a stable cutting board within budget', () => {
  const r = select('bbq', 'large', 'stationary', 'open', 'max250');
  assert.equal(r.main.product.productType, 'cuttingBoard');
  assert.equal(r.main.product.sizeProfile, 'large');
  assert.ok(r.main.product.priceOrder <= 250);
});
test('4: premium BBQ light selects a light large hackblock', () => {
  const r = select('bbq', 'large', 'stationary', 'light', 'premium');
  assert.ok(r.main.product.finderProfile.visual.includes('light'));
  assert.equal(r.main.product.sizeProfile, 'large');
});
test('5: serving uses serving suitability and honest visual compromises', () => {
  const r = select('serving', 'medium', 'balanced', 'dark', 'max250');
  assert.ok(r.main.product.servingSuitable);
  assert.ok(r.main.conflicts.length === 0 || r.main.conflicts[0].type === 'visual');
});
test('hosting gifts recommend dedicated serving boards, not individual breakfast boards', () => {
  const hostingIds = ['4389604739', '4440690649', '4398179153'];
  for (const budget of ['max100', 'max250', 'premium', 'open']) {
    const r = select('gift', 'open', 'portable', 'expressive', budget, 'serving');
    assert.ok(r.main);
    for (const entry of [r.main, r.alternative, r.near].filter(Boolean)) {
      assert.ok(hostingIds.includes(entry.product.listingId));
    }
  }
  const small = byListing('4381023266');
  assert.ok(matcher.supports(small, 'breakfast'));
  assert.equal(matcher.evaluate(small, answers('gift', 'compact', 'portable', 'expressive', 'open', 'serving')).status, 'excluded');
  const compact = select('gift', 'compact', 'portable', 'expressive', 'open', 'serving');
  assert.equal(compact.main, null);
  assert.ok(hostingIds.includes(compact.near.product.listingId));
  assert.equal(compact.near.conflicts[0].type, 'size');
});
test('6: BBQ gift never resolves to an accessory or breakfast board', () => {
  const r = select('gift', 'large', 'stationary', 'expressive', 'premium', 'bbq');
  assert.equal(r.main.product.productType, 'cuttingBoard');
  assert.ok(matcher.supports(r.main.product, 'bbq'));
});
test('7: compact portable rejects heavy/large/stationary main options', () => {
  const r = select('dailyPrep', 'compact', 'portable', 'open', 'open');
  assert.equal(r.main.product.sizeProfile, 'compact');
  assert.notEqual(r.main.product.weightClass, 'heavy');
  assert.notEqual(r.main.product.portability, 'stationary');
});
test('8: budget is hard, and a one-conflict over-budget near match is separate', () => {
  const r = select('bbq', 'large', 'stationary', 'open', 'max100');
  assert.equal(r.main, null);
  assert.ok(r.near);
  assert.equal(r.near.conflicts.length, 1);
  assert.equal(r.near.conflicts[0].type, 'budget');
  assert.ok(r.near.conflicts[0].delta > 0);
});
test('9: changing only budget brings candidates back without mutating answers', () => {
  const a = answers('bbq', 'large', 'stationary', 'light', 'max100');
  const before = JSON.stringify(a);
  const r = matcher.select(products, a);
  assert.equal(r.main, null);
  assert.equal(JSON.stringify(a), before);
  a.budget = 'premium';
  assert.ok(matcher.select(products, a).main);
  assert.equal(a.use, 'bbq');
  assert.equal(a.style, 'light');
});
test('open budget has no price ceiling or premium bias; premium explicitly prefers elaborate pieces', () => {
  const base = byListing('1818046728');
  const simple = { ...base, id: 'simple', priceOrder: 80, premiumLevel: 1 };
  const elaborate = { ...base, id: 'elaborate', priceOrder: 300, premiumLevel: 3 };
  const a = answers('dailyPrep', 'compact', 'portable', 'light', 'max100');
  assert.equal(matcher.select([simple, elaborate], a).main.product.id, 'simple');
  a.budget = 'premium';
  assert.equal(matcher.select([simple, elaborate], a).main.product.id, 'elaborate');
  a.budget = 'open';
  assert.equal(matcher.select([simple, elaborate], a).main.product.id, 'simple');
  assert.equal(matcher.evaluate(elaborate, a).hardConflicts.length, 0);
  assert.ok(!matcher.evaluate(elaborate, a).matches.some(m => m.type === 'premium'));
  a.budget = 'max100';
  assert.equal(matcher.select([simple, elaborate], a).main.product.id, 'simple');
});
test('XXL is inquiry-only and only eligible for explicit large/stationary use', () => {
  const p = byListing('4484195050');
  assert.equal(p.availabilityStatus, 'made_to_order');
  assert.ok(p.finderProfile.requestOnly);
  assert.ok(matcher.evaluate(p, answers('dailyPrep', 'medium', 'balanced', 'open', 'open')).hardConflicts.length);
  assert.equal(matcher.evaluate(p, answers('dailyPrep', 'large', 'stationary', 'open', 'open')).hardConflicts.length, 0);
});
test('invalid, sold, inspiration, inactive and unverified data cannot be recommended', () => {
  const base = byListing('1818046728');
  for (const change of [{ active: false }, { availabilityStatus: 'sold' }, { availabilityStatus: 'inspiration' }, { inspirationOnly: true }, { dataVerified: false }, { finderProfile: undefined }, { primaryUseCases: undefined }, { thicknessLabel: 'nicht angegeben' }]) {
    const p = { ...base, ...change };
    assert.equal(matcher.eligible(p), false);
    assert.equal(matcher.evaluate(p, {}).status, 'excluded');
  }
});
test('serving with stationary handling recommends working boards, not antipasti platters', () => {
  const r = select('serving', 'large', 'stationary', 'light', 'max250');
  assert.equal(r.main.product.productType, 'cuttingBoard');
  assert.equal(r.main.product.portability, 'stationary');
  if (r.alternative) assert.equal(r.alternative.product.productType, r.main.product.productType);
  assert.ok(matcher.evaluate(byListing('4398179153'), answers('serving', 'large', 'stationary', 'light', 'max250')).hardConflicts.some(c => c.type === 'handling'));
});
test('serving sets remain eligible without inventing an unknown thickness', () => {
  for (const id of ['4389604739', '4440690649']) {
    assert.ok(matcher.eligible(byListing(id)));
    assert.equal(matcher.supports(byListing(id), 'dailyPrep'), false);
    assert.equal(matcher.supports(byListing(id), 'bbq'), false);
  }
  assert.equal(products.filter(matcher.eligible).length, 34); // Tropical standalone listing aliases the combined board.
});
test('handled tropical block is large and stationary; walnut reissue is made to order', () => {
  const p = byListing('4451487112');
  assert.equal(p.sizeProfile, 'large');
  assert.equal(p.portability, 'stationary');
  assert.ok(p.primaryUseCases.includes('dailyPrep'));
  assert.equal(byListing('1886821275').availabilityStatus, 'made_to_order');
});
test('all combinations respect budgets, roles, one near match and real trade-offs', () => {
  for (const use of ['breakfast', 'dailyPrep', 'bbq', 'serving', 'gift'])
  for (const space of ['compact', 'medium', 'large', 'open'])
  for (const movement of ['portable', 'balanced', 'stationary', 'open'])
  for (const style of ['light', 'dark', 'expressive', 'open'])
  for (const budget of ['max100', 'max250', 'premium', 'open']) {
    const a = answers(use, space, movement, style, budget, use === 'gift' ? 'bbq' : undefined);
    const r = matcher.select(products, a);
    for (const entry of [r.main, r.alternative].filter(Boolean)) {
      assert.equal(entry.hardConflicts.length, 0);
      if (budget === 'max100') assert.ok(entry.product.priceOrder <= 100);
      if (budget === 'max250') assert.ok(entry.product.priceOrder <= 250);
      if (['dailyPrep', 'bbq'].includes(matcher.effectiveUse(a))) assert.equal(entry.product.productType, 'cuttingBoard');
    }
    if (r.alternative) assert.ok(r.alternative.tradeoff);
    if (r.near) assert.equal(r.near.conflicts.length, 1);
  }
});
