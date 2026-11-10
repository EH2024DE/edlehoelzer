import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parseFragment} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {comparisonHtml} from '../scripts/refurbishment-comparison.mjs';

test('three compact disclosure cards replace the table in both languages',()=>{
  for(const en of [false,true]){
    const nodes=walk(parseFragment(comparisonHtml(en)));
    assert.equal(nodes.filter(n=>n.tagName==='table').length,0);
    assert.equal(nodes.filter(n=>n.tagName==='article').length,3);
    assert.equal(nodes.filter(n=>n.tagName==='details').length,3);
    const copy=text(nodes[0]);
    for(const price of en?['€41–64','€95–154']:['41–64 €','95–154 €'])assert.ok(copy.includes(price));
    const option=id=>text(nodes.find(n=>attr(n,'data-service-option')===id));
    for(const item of en?['Sandpaper','linseed oil','cotton cloth','Washing-up liquid']:['Schleifpapier','Leinöl','Baumwolltuch','Spülmittel'])assert.ok(option('self').toLowerCase().includes(item.toLowerCase()));
    assert.ok(!/Dose|tin for home/i.test(option('refresh')));
    const self=nodes.find(n=>attr(n,'data-service-option')==='self');
    assert.ok(walk(self).some(n=>n.tagName==='a'&&(attr(n,'href')||'').includes('/produkte/pflegebalsam-schneidebrett/')));
    assert.ok(option('self').includes(en?'€9.99':'9,99'));
    assert.ok(option('full').includes(en?'One care balm tin for home included':'Eine Dose Pflegebalsam für zu Hause inklusive'));
    assert.ok(copy.includes(en?'All refresh work':'Alle Leistungen der Auffrischung'));
    assert.ok(copy.includes('5 mm'));
  }
});
test('legacy package descriptions also reserve a balm tin for full restoration only',()=>{
  for(const file of ['schneidebrett-aufbereiten/index.html','en/refurbishment/index.html']){
    const source=fs.readFileSync(path.join(root,file),'utf8'),nodes=walk(parseFragment(source));
    const tier=name=>nodes.find(n=>(attr(n,'class')||'').split(/\s+/).includes('service-tier--'+name));
    const refresh=text(tier('refresh')),full=text(tier('deluxe'));
    assert.ok(!/Eine Dose Pflegebalsam|One care balm tin/.test(refresh));
    assert.ok(/Eine Dose Pflegebalsam|One care balm tin/.test(full));
    assert.ok(!source.includes('refurbVisualTriage__surface'));
    assert.ok(!source.includes('Eine Dose Pflegebalsam gratis'));
  }
});
