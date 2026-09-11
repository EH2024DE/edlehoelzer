import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>readFileSync(path.join(root,file),'utf8');
const rows=JSON.parse(read('docs/page-summaries.json'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
for(const {route,items} of rows){
 const html=read(route.slice(1)+(route.endsWith('/')?'index.html':''));
 assert.equal((html.match(/class="pageSummary"/g)||[]).length,1,route);
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,route);
 assert.equal((html.match(/id="summary-title"/g)||[]).length,1,route);
 for(const item of items){assert.ok(html.includes(`<dt>${escape(item.label)}</dt>`),route);assert.ok(html.includes(`<dd>${escape(item.text)}</dd>`),route);}
 assert.ok(html.includes('/assets/css/page-summary.css'),route);
 assert.ok(html.includes('/assets/js/page-summary.js'),route);
 assert.ok(html.includes('data-summary-cta')||html.includes('data-cta-location="summary"'),route);
 assert.ok(html.includes(`<link rel="canonical" href="https://edlehoelzer.de${route}"`),route);
}
for(const file of ['index.html','produkte.html','impressum.html','datenschutz.html','en/index.html','en/products.html'])assert.ok(!read(file).includes('class="pageSummary"'),file);
const custom=read('schneidebrett-nach-mass/index.html');
assert.ok(custom.indexOf('wenigen hundert Euro')<custom.indexOf('ab 1.199'));
assert.ok(custom.includes('75 × 60 cm'));
assert.ok(!custom.includes('75 × 65'));
const preview=read('tools/kitchen-preview/index.html');
assert.match(preview,/<input id="cameraFile"[^>]*accept="image\/\*"[^>]*capture="environment"/);
assert.match(preview,/id="takePhoto"[^>]*type="button"/);
console.log(`Summary regression checks passed: ${rows.length} pages; homepage exclusions, price framing and camera input intact.`);
