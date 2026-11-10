import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import postcss from 'postcss';
import {references,renderReference,guardLegacyStyleLoads} from '../scripts/build-design-reference.mjs';
import {root,walk,attr,text,baseline} from '../scripts/audit-design-system.mjs';
import {repairEnglishNavigation} from '../scripts/repair-english-navigation.mjs';
import {refineB2bAudit} from '../scripts/b2b-audit-refinement.mjs';
import catalogApproval from './catalog-copy-approval.cjs';
test('reference rendering preserves SEO, original main content, links and form contracts',()=>{
  for(const reference of references){
    const original=parse(fs.readFileSync(path.join(root,reference.file),'utf8'));
    refineB2bAudit(original,reference);
    const rendered=renderReference(reference),document=parse(rendered.html);
    const nodes=walk(document),oldNodes=walk(original);
    catalogApproval.clearCatalogDirectories(nodes);catalogApproval.clearCatalogDirectories(oldNodes);
    const productRoot=nodes.find(n=>attr(n,'data-display-title'));
    if(productRoot){const heading=oldNodes.find(n=>n.tagName==='h1');heading.childNodes=[{nodeName:'#text',value:attr(productRoot,'data-display-title'),parentNode:heading}];}
    for(const node of nodes.filter(n=>attr(n,'data-ds-added')!==undefined))node.parentNode.childNodes=node.parentNode.childNodes.filter(n=>n!==node);
    if(reference.template==='home')for(const list of [nodes,oldNodes]){
      const track=list.find(n=>attr(n,'data-review-track')!==undefined);if(track)track.childNodes=[];
      for(const node of list.filter(n=>attr(n,'data-review-headline')!==undefined||attr(n,'data-review-subline')!==undefined))node.childNodes=[];
    }
    for(const tag of ['title','h1'])assert.deepEqual(nodes.filter(n=>n.tagName===tag).map(text),oldNodes.filter(n=>n.tagName===tag).map(text),reference.route+' '+tag);
    const metadata=doc=>walk(doc).filter(n=>n.tagName==='meta'||n.tagName==='link'&&['canonical','alternate'].includes(attr(n,'rel'))||n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>({tag:n.tagName,attrs:n.attrs,text:text(n)}));
    assert.deepEqual(metadata(document),metadata(original),reference.route+' SEO');
    const main=doc=>walk(doc).find(n=>n.tagName==='main');
    const content=node=>walk(node).filter(n=>n.nodeName==='#text'&&n.value.trim()).map(n=>n.value.replace(/\s+/g,' ').trim()).sort();
    if(reference.template==='home')assert.deepEqual(content(main(document)),content(main(original)),reference.route+' text (reordering allowed)');
    else assert.equal(text(main(document)),text(main(original)),reference.route+' text');
    const anchors=doc=>walk(main(doc)).filter(n=>n.tagName==='a').map(n=>attr(n,'href'));
    if(reference.template==='home')for(const href of anchors(original))assert.ok(anchors(document).includes(href),href);
    else assert.deepEqual(anchors(document),anchors(original),reference.route+' internal links');
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
test('reference source pages preserve baseline markup outside the bilingual homepage collection',()=>{
  for(const file of references.map(r=>r.file)){
    const before=execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,encoding:'utf8'});
    const normalize=html=>file==='en/index.html'?html.replace(/<header[\s\S]*?<\/header>/,'').replace(/<main[\s\S]*?<\/main>/,'')
      .replace(/<a href="(?:\/en\/#b2b|\/en\/corporate-gifts\/|\/handgefertigte-holzprodukte-fuer-unternehmen\/)"[^>]*>Corporate gifts(?: \(DE\))?<\/a>/,'')
      .replace(/^[ \t]*<link rel="stylesheet" href="\/assets\/css\/homepage-refinement\.css[^"]*">\n/gm,'')
      .replace(/(\/assets\/js\/product-grid\.js\?v=)[^"]+/g,'$1')
      .replace(/var homepageProductIds = \[[\s\S]*?\n  \}\);/,'')
      :file.includes('1850610674')?html
      .replace(/<script type="application\/ld\+json">(.*?)<\/script>/,(_,source)=>{const schema=JSON.parse(source);delete schema.offers;return JSON.stringify(schema);})
      .replace(/<\/h1><p>[^<]+<\/p>\n(?:<p>279,99 EUR<\/p>)?/,'</h1>\n')
      .replace(/<a class="btn btn--emphasis" href="[^"]+"[^>]*>[^<]+<\/a>\n/,'')
      :['index.html','en/index.html'].includes(file)?html
      .replace(/^[ \t]*<link rel="stylesheet" href="\/assets\/css\/homepage-refinement\.css[^"]*">\n/gm,'')
      .replace(/(\/assets\/js\/product-grid\.js\?v=)[^"]+/g,'$1')
      .replace(/<section[^>]*aria-labelledby="homepage-products-title">[\s\S]*?<\/section>/,'')
      .replace(/var homepageProductIds = \[[\s\S]*?\n  \}\);/,''):html;
    const approvedPortraitChanges=html=>['index.html','en/index.html'].includes(file)?html
      .replace(/<span class="hero__promise">([^<]+)<\/span>/g,'$1')
      .replace(/<p data-review-subline>[\s\S]*?<\/p>/,'')
      .replace(/<section id="(?:ueberuns|about)"[\s\S]*?<\/section>/,'')
      .replace(/<section class="(?:section homeDecision|closingHero)[^\"]*"[\s\S]*?<\/section>/,''):html;
    const whitespace=html=>JSON.parse(fs.readFileSync(path.join(root,'data/product-url-migration.json'),'utf8')).reduce((value,item)=>value.replaceAll(item.previousPath,item.productPath),html)
      .replaceAll('href="/" class="brand" aria-label="Edle Hölzer home"','href="/en/" class="brand" aria-label="Edle Hölzer home"')
      .replaceAll('href="/en/#customwork"','href="/en/custom-cutting-board/"')
      .replace(/(<div class="(?:lang|mobileMenu__lang)">)[\s\S]*?<\/div>/g,'$1</div>')
      .replace(/href="(?:\.\.\/|\/)(?:impressum\.html)"/g,'href="/en/legal-notice/"')
      .replace(/href="(?:\.\.\/|\/)(?:datenschutz\.html)"/g,'href="/en/privacy/"')
      .replace(/href="\/sitemap-uebersicht\.html(?:#english-topics)?"/g,'href="/en/topics/"').replace(/>\s+</g,'><');
    assert.equal(whitespace(approvedPortraitChanges(normalize(repairEnglishNavigation(before,file)))),whitespace(approvedPortraitChanges(normalize(fs.readFileSync(path.join(root,file),'utf8')))),file);
  }
});
test('financial calculations and delivery rules stay unchanged during option UI work',()=>{
  const before=execFileSync('git',['show',`${baseline}:main.js`],{cwd:root,encoding:'utf8'});
  const after=fs.readFileSync(path.join(root,'main.js'),'utf8');
  const extract=(source,name)=>{const start=source.indexOf('  function '+name+'(');assert.ok(start>=0);return source.slice(start,source.indexOf('\n  function ',start+1));};
  for(const name of ['purchaseTotal','purchaseSubtotalWithoutCareBalm','formatCurrency','hasFreeShippingGermany'])assert.equal(extract(after,name),extract(before,name),name);
  const approvedDeliveryGuard='    if (product.availabilityStatus === "made_to_order") return isEnglish ? (product.availabilityNoteEn || "Made to order; production and delivery time agreed individually") : (product.availabilityNote || "Auf Bestellung; Fertigungs- und Lieferzeit nach Abstimmung");\n';
  assert.ok(extract(after,'purchaseDeliveryText').includes(approvedDeliveryGuard));
  assert.equal(extract(after,'purchaseDeliveryText').replace(approvedDeliveryGuard,''),extract(before,'purchaseDeliveryText'));
  const catalogBefore=JSON.parse(execFileSync('git',['show',`${baseline}:products.json`],{cwd:root,encoding:'utf8'}));
  const catalogAfter=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8'));
  const old=catalogBefore.products.find(p=>p.listingId==='4599650982'),sold=catalogAfter.products.find(p=>p.listingId==='4599650982');
  assert.equal(sold.stock,0);assert.equal(sold.active,false);assert.equal(sold.inspirationOnly,true);assert.equal(sold.availabilityStatus,'sold');
  for(const key of ['stock','active','availabilityStatus'])sold[key]=old[key];delete sold.inspirationOnly;
  sold.variants.forEach((v,i)=>{assert.equal(v.availabilityStatus,'sold');v.availabilityStatus=old.variants[i].availabilityStatus;});
  const oldWalnut=catalogBefore.products.find(p=>p.listingId==='1850610674'),walnut=catalogAfter.products.find(p=>p.listingId==='1850610674');
  assert.equal(walnut.stock,0);assert.equal(walnut.active,false);assert.equal(walnut.featured,false);assert.equal(walnut.inspirationOnly,true);assert.equal(walnut.availabilityStatus,'sold');
  for(const key of ['stock','active','featured','availabilityStatus'])walnut[key]=oldWalnut[key];delete walnut.inspirationOnly;
  const larch=catalogAfter.products.find(p=>p.listingId==='1818046728');
  assert.equal(larch.stock,0);assert.equal(larch.availabilityStatus,'made_to_order');
  assert.match(larch.availabilityNote,/nicht auf Lager/);
  const oldLarch=catalogBefore.products.find(p=>p.listingId==='1818046728');
  for(const key of ['availabilityStatus','deliveryDays','availabilityNote','availabilityNoteEn']){
    if(key in oldLarch)larch[key]=oldLarch[key];else delete larch[key];
  }
  const snapshot=JSON.parse(fs.readFileSync(path.join(root,'data/inventory-public-snapshot.json'),'utf8'));
  for(const product of catalogAfter.products.filter(p=>p.inventoryCheckedAt)){
    const original=catalogBefore.products.find(p=>p.id===product.id);
    assert.equal(product.inventoryCheckedAt,snapshot.checkedAt);
    if(product.availabilityStatus==='unavailable'){
      assert.ok(!Object.hasOwn(snapshot.quantities,product.listingId));
      assert.ok(['1803930088','4370769708'].includes(product.listingId));
      for(const key of ['active','availabilityStatus','availabilityNote','availabilityNoteEn']){if(key in original)product[key]=original[key];else delete product[key];}
    }else assert.equal(product.stock,snapshot.quantities[product.listingId]);
    product.stock=original.stock;delete product.inventoryCheckedAt;
  }
  catalogApproval.restoreApprovedWoodCopy(catalogBefore,catalogAfter);
  assert.deepEqual(catalogAfter,catalogBefore,'only confirmed availability and documented wood copy may change; prices remain intact');
});
test('reference runtime changes only four CSS-loading guards, not financial or product logic',()=>{
  const source=fs.readFileSync(path.join(root,'main.js'),'utf8');
  const guarded=guardLegacyStyleLoads(source),prefix="if (!document.body.classList.contains('ds-site')) ";
  assert.equal(guarded.split(prefix).length-1,4);
  assert.equal(guarded.replaceAll(prefix,''),source);
  assert.throws(()=>guardLegacyStyleLoads('changed runtime'),/loader changed/);
});
