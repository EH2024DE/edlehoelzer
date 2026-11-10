import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
const copy=JSON.parse(fs.readFileSync(path.join(root,'data/english-page-copy.json'),'utf8'));
const load=file=>walk(parse(fs.readFileSync(path.join(root,file),'utf8')));
test('new English pages mirror German main sections, images and form contracts',()=>{
  for(const page of Object.values(copy)){
    const de=load(page.source),en=load(page.route.slice(1)+'index.html');
    const main=nodes=>walk(nodes.find(n=>n.tagName==='main'));
    const shape=nodes=>main(nodes).filter(n=>n.tagName==='section').map(n=>attr(n,'class'));
    assert.deepEqual(shape(en),shape(de));
    const images=nodes=>main(nodes).filter(n=>n.tagName==='img').map(n=>attr(n,'src'));
    assert.deepEqual(images(en),images(de));
    const fields=nodes=>main(nodes).filter(n=>['input','textarea','select'].includes(n.tagName)).map(n=>[n.tagName,attr(n,'name'),attr(n,'required')]);
    assert.deepEqual(fields(en),fields(de));
    assert.equal(attr(en.find(n=>n.tagName==='html'),'lang'),'en');
    const visible=main(en).filter(n=>n.nodeName==='#text'&&n.value.trim()).map(n=>n.value.trim());
    for(const value of page.texts)assert.ok(visible.includes(value)||value.endsWith(' (DE)')&&visible.includes(value.replace(/ \(DE\)$/,'')),value);
    const faq=JSON.parse(text(en.find(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json'&&text(n).includes('FAQPage'))));
    assert.ok(faq.mainEntity.length>=4);
  }
});
test('Germany-only services and 2026 donation closure are explicit without inflated counts',()=>{
  const tree=load('baumspende.html');
  assert.ok(text(tree.find(n=>n.tagName==='main')).includes('Die Annahme für 2026 ist geschlossen.'));
  const form=tree.find(n=>attr(n,'id')==='baumspende-flow');
  assert.equal(attr(form,'hidden'),'');assert.equal(attr(form,'inert'),'');assert.equal(attr(form,'data-season-closed'),'2026');
  assert.equal(tree.some(n=>attr(n,'data-free-plaetze')!==undefined),false);
  const html=fs.readFileSync(path.join(root,'en/refurbishment/index.html'),'utf8');
  assert.ok(html.includes('only available within Germany'));
  assert.ok(html.includes('do not apply to international refurbishment orders'));
});
test('budget and quantity remain mandatory and visible on German business pages',()=>{
  for(const file of ['handgefertigte-holzprodukte-fuer-unternehmen/index.html','schneidebretter-aus-holz-gastronomie/index.html']){
    const nodes=load(file);
    for(const name of ['budget','budget_basis','quantity','email','message']){
      const field=nodes.find(n=>attr(n,'name')===name);assert.notEqual(attr(field,'required'),undefined,name);
      for(let p=field.parentNode;p;p=p.parentNode)assert.notEqual(p.tagName,'details',name);
    }
  }
});
