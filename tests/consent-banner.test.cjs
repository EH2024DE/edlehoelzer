const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/consent-manager.js', 'utf8');

test('compact consent copy names actual services in both languages', () => {
  assert.ok(source.includes('title: "Cookies und Datenschutz"'));
  assert.ok(source.includes('title: "Cookies and privacy"'));
  const introductions = [...source.matchAll(/intro: "([^"]+)"/g)].map(m => m[1]);
  assert.equal(introductions.length, 2);
  for (const text of introductions) {
    assert.ok(text.length < 180);
    for (const service of ['Umami', 'GoatCounter', 'YouTube']) assert.ok(text.includes(service));
  }
});

test('both decisions stay directly reachable and optional settings do not preselect consent', () => {
  const start = source.indexOf('  function bindBanner(');
  const end = source.indexOf('\n  function ', start + 1);
  let callback;
  const choices = [];
  let settings = 0;
  const context = {
    applyConsent: (choice, method) => choices.push({choice, method}),
    removeConsentUi: () => {},
    renderPreferenceCenter: () => { settings++; }
  };
  vm.runInNewContext(source.slice(start, end), context);
  context.bindBanner({addEventListener: (_, fn) => {callback = fn;}});
  const click = selector => callback({target:{closest: s => s === selector}});
  click('[data-consent-settings]');
  assert.equal(settings, 1);
  assert.equal(choices.length, 0);
  click('[data-consent-necessary]');
  assert.equal(choices[0].choice.analytics, false);
  assert.equal(choices[0].choice.marketing, false);
  assert.equal(choices[0].method, 'necessary_only');
  click('[data-consent-accept-all]');
  assert.equal(choices[1].choice.analytics, true);
  assert.equal(choices[1].choice.marketing, true);
  assert.equal(choices[1].method, 'accept_all');
});

test('primary colour has readable white text and choices use equal tracks', () => {
  const luminance = hex => {
    const channels = hex.match(/../g).map(c => parseInt(c, 16) / 255)
      .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  assert.ok(1.05 / (luminance('544237') + 0.05) >= 4.5);
  assert.ok((luminance('faf7f1') + 0.05) / (luminance('544237') + 0.05) >= 4.5);
  assert.ok(source.includes('grid-template-columns:repeat(2,minmax(0,1fr)) auto'));
  assert.ok(source.includes('min-height:44px'));
  assert.ok(source.includes('.consentButton:focus-visible'));
});
