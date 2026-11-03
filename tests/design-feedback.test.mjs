import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {sitePages} from '../scripts/build-design-site.mjs';
import {renderReference} from '../scripts/build-design-reference.mjs';
import {walk,attr} from '../scripts/audit-design-system.mjs';
const pages=sitePages();
const nodes=route=>walk(parse(renderReference(pages.find(p=>p.route===route)).html));
const has=(n,c)=>(attr(n,'class')||'').split(' ').includes(c);
test('portrait editorial assets retain portrait frames in both language builds',()=>{
 for(const route of ['/pfannenwender-holz/','/hochwertige-kuechenaccessoires/','/brotzeitbrett/','/en/snack-board/','/holzarten-schneidebrett/','/en/wood-types-for-cutting-boards/','/stirnholz-vs-langholz/','/en/end-grain-vs-edge-grain/']){
  assert.ok(nodes(route).some(n=>has(n,'ds-image--portrait')),route);
 }
});
test('custom order topics retain content and add concrete linked reference photos',()=>{
 const result=nodes('/schneidebrett-nach-mass/');
 assert.ok(result.filter(n=>has(n,'editorialTopic')).length>=5);
 const gallery=result.find(n=>has(n,'referenceProducts'));
 assert.equal(walk(gallery).filter(n=>n.tagName==='img').length,3);
 assert.equal(walk(gallery).filter(n=>n.tagName==='a').length,3);
});
test('English Erbstueck has the same nineteen process photos in the same sequence',()=>{
 const gallery=nodes('/en/erbstueck/').find(n=>has(n,'erbstueckStoryGallery'));
 const actual=walk(gallery).filter(n=>n.tagName==='img').map(n=>attr(n,'src'));
 const expected=nodes('/schneidebrett-fachwerk-eiche/').filter(n=>has(n,'erbstueckProcessFrame')).map(n=>attr(walk(n).find(x=>x.tagName==='img'),'src'));
 assert.deepEqual(actual,expected);
 assert.equal(actual.length,19);
});
