const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const target = '/firmengeschenke-holz/';

test('legacy B2B redirect preserves query attribution and legacy fragments', () => {
  const html = read('b2b.html');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const hash of ['', '#anfrage', '#produkte', '#preise', '#vorteile', '#ablauf']) {
    let destination;
    vm.runInNewContext(script, { window: { location: {
      search: '?utm_source=instagram&utm_campaign=company', hash,
      replace: value => { destination = value; }
    } } });
    assert.equal(destination, target + '?utm_source=instagram&utm_campaign=company' + hash);
    if (hash) assert.ok(read('firmengeschenke-holz/index.html').includes('id="' + hash.slice(1) + '"'));
  }
  assert.match(html, /http-equiv="refresh" content="0; url=https:\/\/edlehoelzer.de\/firmengeschenke-holz\/"/);
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.ok(html.includes('href="' + target + '"'));
});

test('moved B2B content differs only in canonical URL and root-relative paths', () => {
  const before = execFileSync('git', ['show', 'origin/main:b2b.html'], { cwd: root, encoding: 'utf8' });
  const expected = before.replaceAll('b2b.html', 'firmengeschenke-holz/')
    .replaceAll('./assets/', '/assets/').replaceAll('href="./', 'href="/');
  assert.equal(read('firmengeschenke-holz/index.html'), expected);
});

test('sitemap, search index and edge redirect configuration use the new owner URL', () => {
  const sitemap = read('sitemap.xml');
  assert.ok(sitemap.includes('https://edlehoelzer.de' + target));
  assert.ok(!sitemap.includes('/b2b.html'));
  const index = JSON.parse(read('assets/search-pages.json'));
  assert.equal(index.filter(p => p.url === target).length, 1);
  assert.ok(!index.some(p => p.url === '/b2b.html'));
  assert.ok(read('config/cloudflare-bulk-redirects.csv').includes(
    'https://edlehoelzer.de/b2b.html,https://edlehoelzer.de/firmengeschenke-holz/,301,false,false,true,false'));
});

test('other production pages change only their B2B destination, not content or metadata', () => {
  const files = execFileSync('git', ['diff', '--name-only', 'origin/main', '--', '*.html'], { cwd: root, encoding: 'utf8' })
    .trim().split('\n').filter(p => p && p !== 'b2b.html' && p !== 'firmengeschenke-holz/index.html');
  for (const file of files) {
    const before = execFileSync('git', ['show', 'origin/main:' + file], { cwd: root, encoding: 'utf8' });
    assert.equal(read(file).trimEnd(), before.replaceAll('/b2b.html', target).trimEnd(), file);
  }
});
