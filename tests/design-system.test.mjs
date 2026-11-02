import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import postcss from 'postcss';
import {references,renderReference,guardLegacyStyleLoads} from '../scripts/build-design-reference.mjs';
import {root,walk,attr,text,baseline} from '../scripts/audit-design-system.mjs';
test('reference rendering preserves SEO, original main content, links and form contracts',()=>{
  for(const reference of references){
    const original=parse(fs.readFileSync(path.join(root,reference.file),'utf8'));
    const rendered=renderReference(reference),document=parse(rendered.html);
    const nodes=walk(document),oldNodes=walk(original);
    for(const tag of ['title','h1'])assert.deepEqual(nodes.filter(n=>n.tagName===tag).map(text),oldNodes.filter(n=>n.tagName===tag).map(text),reference.route+' '+tag);
    const metadata=doc=>walk(doc).filter(n=>n.tagName==='meta'||n.tagName==='link'&&['canonical','alternate'].includes(attr(n,'rel'))||n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>({tag:n.tagName,attrs:n.attrs,text:text(n)}));
    assert.deepEqual(metadata(document),metadata(original),reference.route+' SEO');
    const main=doc=>walk(doc).find(n=>n.tagName==='main');
    assert.equal(text(main(document)),text(main(original)),reference.route+' text');
    const anchors=doc=>walk(main(doc)).filter(n=>n.tagName==='a').map(n=>attr(n,'href'));
    assert.deepEqual(anchors(document),anchors(original),reference.route+' internal links');
    const forms=doc=>walk(doc).filter(n=>['form','input','select','textarea'].includes(n.tagName)).map(n=>[n.tagName,...['name','required','action','method'].map(k=>attr(n,k))]);
    assert.deepEqual(forms(document),forms(original));
    assert.ok(nodes.some(n=>attr(n,'data-ds-template')===reference.template));
    assert.ok(!nodes.some(n=>n.tagName==='style'||n.tagName==='link'&&/fonts\.google|fonts\.gstatic/.test(attr(n,'href')||'')));
    assert.ok(!rendered.legacy.includes('fonts.googleapis.com'));
    assert.equal(postcss.parse(rendered.legacy).first.name,'layer');
  }
});
test('tokens centralise typography and three containers without viewport type or arbitrary important overrides',()=>{
  const css=postcss.parse(fs.readFileSync(path.join(root,'assets/css/design-system.css'),'utf8'));
  for(const token of ['font-sans','font-display','font-mono','color-bg','color-text','color-accent','container-wide','container-content','container-reading','space-10','radius']){
    let found=false;css.walkDecls('--'+token,()=>{found=true;});assert.ok(found,token);
  }
  css.walkDecls(decl=>{
    if(/font-size/.test(decl.prop))assert.ok(!/vw|cqw/.test(decl.value));
    if(decl.prop==='letter-spacing')assert.equal(decl.value,'0');
    if(decl.important)assert.equal(decl.parent.selector,'.ds-site [hidden]');
    if(decl.prop==='font-family')assert.ok(decl.value.includes('var(--font-')||decl.parent.name==='font-face');
  });
});
test('financial source files and original pages are untouched on the main-based design branch',()=>{
  for(const file of ['products.json',...references.map(r=>r.file)]){
    const before=execFileSync('git',['show',`${baseline}:${file}`],{cwd:root});
    assert.ok(before.equals(fs.readFileSync(path.join(root,file))),file);
  }
});
test('product runtime changes only the engraving label and protects interactive finder controls',()=>{
  const before=execFileSync('git',['show',`${baseline}:main.js`],{cwd:root,encoding:'utf8'});
  const after=fs.readFileSync(path.join(root,'main.js'),'utf8');
  assert.equal(after,before.replace('return isEnglish ? "on request" : "auf Anfrage";','return "optional";').replace("root.querySelectorAll('[data-product-preview]').forEach(function (button) {","root.querySelectorAll('[data-product-preview]').forEach(function (button) {\n      if (button.classList.contains('finderPool__inspect')) return;"));
});
test('reference runtime changes only four CSS-loading guards, not financial or product logic',()=>{
  const source=fs.readFileSync(path.join(root,'main.js'),'utf8');
  const guarded=guardLegacyStyleLoads(source),prefix="if (!document.body.classList.contains('ds-site')) ";
  assert.equal(guarded.split(prefix).length-1,4);
  assert.equal(guarded.replaceAll(prefix,''),source);
  assert.throws(()=>guardLegacyStyleLoads('changed runtime'),/loader changed/);
});
