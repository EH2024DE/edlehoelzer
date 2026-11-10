import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {renderReference} from '../scripts/build-design-reference.mjs';
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-editorial-pages.json'),'utf8'));
test('eight English editorial destinations have reciprocal language metadata and original workshop imagery',()=>{
  assert.equal(pages.length,8);
  for(const page of pages){
    const nodes=walk(parse(fs.readFileSync(path.join(root,page.route.slice(1),'index.html'),'utf8')));
    assert.equal(attr(nodes.find(n=>n.tagName==='html'),'lang'),'en');
    assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
    assert.equal(text(nodes.find(n=>n.tagName==='h1')),page.title);
    assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://edlehoelzer.de'+page.route);
    assert.ok(nodes.some(n=>n.tagName==='img'&&attr(n,'src')===page.image));
    for(const section of page.sections)assert.ok(text(nodes.find(n=>n.tagName==='main')).includes(section.text));
    const de=walk(parse(fs.readFileSync(path.join(root,page.source),'utf8')));
    assert.ok(de.some(n=>n.tagName==='link'&&attr(n,'hreflang')==='en'&&attr(n,'href')==='https://edlehoelzer.de'+page.route));
    assert.ok(!nodes.some(n=>n.tagName==='a'&&attr(n,'href')===page.route&&text(n).trim()==='DE'));
    const faq=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>JSON.parse(text(n))).find(n=>n['@type']==='FAQPage');
    assert.equal(faq?.mainEntity.length||0,page.faq.length);
  }
});
test('custom enquiry keeps the existing provider and required contact fields without placing an order',()=>{
  const nodes=walk(parse(fs.readFileSync(path.join(root,'en/custom-cutting-board/index.html'),'utf8')));
  const form=nodes.find(n=>n.tagName==='form');
  assert.equal(attr(form,'action'),'https://formspree.io/f/maqanpld');
  for(const name of ['email','message'])assert.equal(attr(nodes.find(n=>attr(n,'name')===name),'required'),'');
  assert.ok(nodes.some(n=>attr(n,'data-reference-note')!==undefined));
  assert.ok(nodes.some(n=>n.tagName==='script'&&attr(n,'src')==='/assets/js/board-inquiry.js'));
});
test('service density changes disclose secondary explanations but never budget fields or the price section',()=>{
  for(const [route,file] of [['/schneidebretter-aus-holz-gastronomie/','schneidebretter-aus-holz-gastronomie/index.html'],['/handgefertigte-holzprodukte-fuer-unternehmen/','handgefertigte-holzprodukte-fuer-unternehmen/index.html'],['/en/corporate-gifts/','en/corporate-gifts/index.html']]){
    const nodes=walk(parse(renderReference({route,file,template:'b2b'}).html));
    assert.ok(nodes.some(n=>n.tagName==='details'&&attr(n,'class')==='editorialDisclosure'));
    for(const field of nodes.filter(n=>['budget','budget_basis','quantity'].includes(attr(n,'name')))){
      assert.equal(attr(field,'required'),'');for(let p=field.parentNode;p;p=p.parentNode)assert.notEqual(p.tagName,'details');
    }
    const price=nodes.find(n=>['preise','projektpreis'].includes(attr(n,'id')));
    for(let p=price;p;p=p.parentNode)assert.notEqual(p.tagName,'details');
  }
});
