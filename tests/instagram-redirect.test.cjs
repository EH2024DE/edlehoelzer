const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'instagram/index.html'), 'utf8');
const target = '/?utm_source=instagram&utm_medium=social&utm_campaign=bio';

test('Instagram short link replaces history with the existing fixed bio UTM target', () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const calls = [];
  vm.runInNewContext(script, { window: { location: { replace: url => calls.push(url) } } });
  assert.deepEqual(calls, [target]);
  assert.doesNotMatch(script, /location\.(search|hash)|URLSearchParams/);
});

test('no-JavaScript refresh and manual fallback use the same destination', () => {
  const refresh = html.match(/http-equiv="refresh" content="0; url=([^"]+)"/)[1];
  const fallback = html.match(/<a href="([^"]+)"/)[1];
  assert.equal(refresh.replaceAll('&amp;', '&'), target);
  assert.equal(fallback.replaceAll('&amp;', '&'), target);
});

test('short link is not indexed and loads no extra analytics', () => {
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.match(html, /rel="canonical" href="https:\/\/edlehoelzer\.de\/"/);
  assert.doesNotMatch(html, /<script[^>]+src=|umami|goatcounter|consent-manager/i);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), /\/instagram\//);
});
