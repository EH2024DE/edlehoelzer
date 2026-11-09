import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse,serialize,serializeOuter} from 'parse5';
import {refineAuditNavigation} from '../scripts/audit-navigation.mjs';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';

const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const files=['index.html','en/index.html','pflege.html','en/care.html',
  'produkte/nussbaum-stirnholz-mit-saftrille-1850610674/index.html',
  'en/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/index.html'];

for(const file of files)test(`${file}: additive, verified and idempotent navigation`,()=>{
  const document=parse(fs.readFileSync(path.join(root,file),'utf8'));
  const english=file.startsWith('en/');
  const reference={route:english?'/en/':'/'};
  const original=walk(document);
  const preserved=original.filter(n=>['head','main'].includes(n.tagName)||has(n,'menuButton')||has(n,'mobileMenu'));
  const snapshots=new Map(preserved.map(n=>[n,serializeOuter(n)]));
  const mobile=original.find(n=>has(n,'mobileMenu'));
  const originalLinks=walk(mobile).filter(n=>n.tagName==='a');
  const linkSnapshots=originalLinks.map(n=>[n,serializeOuter(n)]);
  const ids=original.map(n=>attr(n,'id')).filter(Boolean);
  refineAuditNavigation(document,reference);
  const nodes=walk(document);
  const nav=nodes.find(n=>attr(n,'data-ds-added')==='desktop-navigation');
  assert.ok(nav);assert.equal(nav.tagName,'nav');assert.ok(has(nav,'desktopNav'));
  assert.equal(attr(nav,'aria-label'),english?'Main navigation':'Hauptnavigation');
  const siblings=nav.parentNode.childNodes;
  assert.ok(has(siblings[siblings.indexOf(nav)+1],'topbar__right'));
  const links=walk(nav).filter(n=>n.tagName==='a');
  assert.deepEqual(links.map(text),english?['Products','Atelier','Heirloom','Custom','Care']:['Produkte','Atelier','Erbstück','Maß','Pflege']);
  const discover=nodes.find(n=>has(n,'mobileMenu__discover'));
  const additions=walk(discover).filter(n=>n.tagName==='a');
  assert.ok(additions.some(n=>attr(n,'href')===(file.startsWith('en/')?'/en/corporate-gifts/':'/handgefertigte-holzprodukte-fuer-unternehmen/')));
  assert.ok(additions.some(n=>attr(n,'href')===(english?'/en/wooden-cutting-boards-for-restaurants/':'/schneidebretter-aus-holz-gastronomie/')));
  for(const link of [...links,...additions]){
    const href=attr(link,'href');assert.match(href,/^\/(?!\/)/);assert.ok(text(link).trim());
    const url=new URL(href,'https://edlehoelzer.de');
    const target=path.join(root,url.pathname,url.pathname.endsWith('/')?'index.html':'');
    assert.ok(fs.existsSync(target),href);
    if(url.hash){
      const targetNodes=walk(parse(fs.readFileSync(target,'utf8')));
      assert.ok(targetNodes.some(n=>attr(n,'id')===url.hash.slice(1)),href);
    }
  }
  for(const node of preserved.filter(n=>n!==mobile))assert.equal(serializeOuter(node),snapshots.get(node));
  for(const [node,snapshot] of linkSnapshots)assert.equal(serializeOuter(node),snapshot);
  assert.deepEqual(nodes.map(n=>attr(n,'id')).filter(Boolean),ids);
  assert.ok(original.every(n=>nodes.includes(n)),'all original nodes remain');
  const once=serialize(document);refineAuditNavigation(document,reference);assert.equal(serialize(document),once);
});

test('missing header or insertion target is safe and never inserts elsewhere',()=>{
  for(const html of ['<main>Original</main>','<header class="topbar"><div class="topbar__inner">Brand</div></header>']){
    const document=parse(html),before=serialize(document);
    refineAuditNavigation(document,{route:'/'});assert.equal(serialize(document),before);
  }
});

test('existing discover links are retained and list markup stays valid',()=>{
  const document=parse('<header class="topbar"><nav class="mobileMenu"><details class="mobileMenu__discover"><summary>Entdecken</summary><ul><li><a href="/handgefertigte-holzprodukte-fuer-unternehmen/">Firmengeschenke</a></li></ul></details></nav></header>');
  refineAuditNavigation(document,{route:'/'});
  const links=walk(document).filter(n=>n.tagName==='a');assert.equal(links.length,2);
  assert.equal(text(links[0]),'Firmengeschenke');
  assert.ok(links.every(n=>n.parentNode.tagName==='li'));
});
