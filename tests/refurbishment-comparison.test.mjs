import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFragment} from 'parse5';
import {walk,attr,text} from '../scripts/audit-design-system.mjs';
import {comparisonHtml} from '../scripts/refurbishment-comparison.mjs';

test('the same three packages use aligned comparison criteria in both languages',()=>{
  for(const en of [false,true]){
    const nodes=walk(parseFragment(comparisonHtml(en)));
    assert.equal(nodes.filter(n=>n.tagName==='th'&&attr(n,'scope')==='col').length,3);
    assert.equal(nodes.filter(n=>n.tagName==='tbody').length,4);
    for(const row of nodes.filter(n=>n.tagName==='tbody'))assert.equal(walk(row).filter(n=>n.tagName==='td').length,3);
    const copy=text(nodes[0]);
    for(const price of en?['€9.99','€41–64','€95–154']:['9,99 €','41–64 €','95–154 €'])assert.ok(copy.includes(price));
    assert.ok(copy.includes(en?'Your own time':'Deine Arbeitszeit'));
    assert.ok(copy.includes(en?'All refresh work':'Alles aus Auffrischung'));
    assert.ok(copy.includes('5 mm'));
  }
});
