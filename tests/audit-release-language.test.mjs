import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {renderReference} from '../scripts/build-design-reference.mjs';
import {auditLanguageCoverage} from '../scripts/audit-language-coverage.mjs';
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-editorial-pages.json'),'utf8'));
test('the entire indexable German sitemap has English destinations except the two owner-approved exclusions',()=>{
  const report=auditLanguageCoverage();
  assert.deepEqual(report.issues,[]);
  assert.equal(report.pairs,report.germanPages-2);
  assert.deepEqual(report.exceptions.map(r=>r.de).sort(),['/baumspende.html','/schneidebretter-aus-holz-gastronomie/']);
});
test('all generated English destinations have reciprocal language metadata and appropriate workshop imagery',()=>{
  assert.equal(pages.length,18);
  for(const page of pages){
    const nodes=walk(parse(fs.readFileSync(path.join(root,page.route.slice(1),'index.html'),'utf8')));
    assert.equal(attr(nodes.find(n=>n.tagName==='html'),'lang'),'en');
    assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
    assert.equal(text(nodes.find(n=>n.tagName==='h1')),page.title);
    assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://edlehoelzer.de'+page.route);
    if(page.image)assert.ok(nodes.some(n=>n.tagName==='img'&&attr(n,'src')===page.image));
    if(page.legal)assert.equal(nodes.some(n=>n.tagName==='details'&&attr(n,'class')==='editorialDisclosure'),false,'legal information stays visible');
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
test('custom board projects share the German gallery assets and page sequence',()=>{
  const docs=['schneidebrett-nach-mass/index.html','en/custom-cutting-board/index.html'].map(file=>walk(parse(fs.readFileSync(path.join(root,file),'utf8'))));
  const galleryAssets=nodes=>nodes.filter(n=>(attr(n,'class')||'').split(' ').includes('customProjects__gallery')).map(n=>walk(n).filter(n=>n.tagName==='img').map(n=>attr(n,'src')));
  assert.deepEqual(galleryAssets(docs[1]),galleryAssets(docs[0]));
  assert.deepEqual(galleryAssets(docs[1]).map(a=>a.length),[3,3]);
  const en=docs[1];
  for(const cls of ['summaryHero','customProjects','customBudget'])assert.ok(en.some(n=>(attr(n,'class')||'').split(' ').includes(cls)));
  assert.ok(en.some(n=>n.tagName==='a'&&/etsy\.com.*4484195050/.test(attr(n,'href')||'')));
  assert.match(text(en.find(n=>n.tagName==='main')),/contact you personally/);
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
