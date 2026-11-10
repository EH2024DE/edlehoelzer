import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {parse} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {renderReference} from '../scripts/build-design-reference.mjs';
const catalog=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;
const review=JSON.parse(fs.readFileSync(path.join(root,'data/wood-range-review-2026-11-09.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'main.js'),'utf8');
const copy=vm.runInNewContext(source.slice(0,source.indexOf('document.documentElement.classList'))+'\nEdleProductCopy');
test('documented wood ranges agree with the catalogue and preserve prices through the approved URL migration',()=>{
  for(const update of review.updates){
    const product=catalog.find(p=>p.listingId===update.listingId);assert.ok(product);
    for(const [key,value] of Object.entries(update.fields)){
      assert.ok(['displayName','material','shortDescription','longDescription','badges'].includes(key));
      assert.deepEqual(product[key],key==='displayName'?JSON.parse(fs.readFileSync(path.join(root,'data/product-url-migration.json'),'utf8')).find(p=>p.listingId===product.listingId).de:value);
    }
  }
  const knife=catalog.find(p=>p.listingId==='4549962555');
  for(const wood of ['Nussbaum','Zwetschge','Esche','Eiche'])assert.ok(knife.displayName.includes(wood));
  assert.equal(knife.priceOrder,21.7);
  assert.equal(knife.productPath,'/produkte/buttermesser-holz/');
  assert.match(copy.text(knife.displayName,true),/Oak, walnut, plum & ash/);
});
test('shared product directories render current names instead of stale generated labels',()=>{
  const product=catalog.find(p=>p.listingId==='4549962555');
  for(const en of [false,true]){
    const file=(en?'en':'')+product.productPath+'index.html';
    const nodes=walk(parse(renderReference({route:(en?'/en':'')+product.productPath,file:file.replace(/^\//,''),template:'product'}).html));
    const directory=nodes.find(n=>(attr(n,'class')||'').includes('productDetail__browse'));
    const links=walk(directory).filter(n=>n.tagName==='a'&&(attr(n,'href')||'').includes('/produkte/'));
    assert.equal(links.length,catalog.filter(p=>!p.canonicalProductId).length);
    assert.equal(text(links.find(n=>attr(n,'href')===(en?'/en':'')+product.productPath)),copy.text(product.displayName,en));
    assert.ok(text(nodes.find(n=>n.tagName==='h1')).includes(en?'ash':'Esche'));
  }
});
