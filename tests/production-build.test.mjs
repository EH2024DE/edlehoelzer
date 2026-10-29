import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {renderProductionPage,productionHref,buildSite,isReleaseHtml} from '../scripts/build-site.mjs';
import {sitePages,walk,attr} from '../tools/shop-server/site-preview.mjs';
import {ROOT} from '../tools/shop-server/catalog.mjs';
import {checkRelease} from '../scripts/check-release.mjs';

test('production candidate preserves canonical metadata, consent and real inquiry contracts without demo scripts',()=>{
  for(const [route,file]of sitePages){
    const original=parse(fs.readFileSync(path.join(ROOT,file),'utf8'));
    const document=parse(renderProductionPage(route)),nodes=walk(document);
    const canonical=doc=>attr(walk(doc).find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href');
    assert.equal(canonical(document),canonical(original),route);
    assert.ok(nodes.some(node=>node.tagName==='header'&&attr(node,'class')==='atelierHeader'),route);
    assert.ok(!nodes.some(node=>node.tagName==='meta'&&attr(node,'name')==='robots'&&/noindex/.test(attr(node,'content')||'')),route);
    assert.ok(!nodes.some(node=>node.tagName==='script'&&/site-preview-bootstrap|shop-pilot/.test(attr(node,'src')||'')),route);
    assert.ok(!nodes.some(node=>node.tagName==='a'&&/\/(?:atelier-vorschau|shop-vorschau|en\/atelier-preview|en\/shop-preview)\//.test(attr(node,'href')||'')),route);
    const text=node=>!node?'':node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
    const normalize=value=>value.replace(/\s+/g,' ').trim();
    const main=doc=>walk(doc).find(node=>node.tagName==='main');
    if(!['/','/en/','/en/erbstueck/','/schneidebrett-aufbereiten/','/en/refurbishment/'].includes(route)){
      assert.equal(normalize(text(main(document))),normalize(text(main(original))),route+' approved main text');
    }
    if(route==='/en/erbstueck/'){
      const rendered=normalize(text(main(document)));
      for(const node of walk(main(original)).filter(node=>['p','h1','h2','h3'].includes(node.tagName))){
        assert.ok(rendered.includes(normalize(text(node))),route+' retained passage: '+normalize(text(node)).slice(0,60));
      }
    }
    if(!['/','/en/'].includes(route)){
      const forms=doc=>walk(doc).filter(node=>['form','input','select','textarea'].includes(node.tagName)).map(node=>[node.tagName,attr(node,'name'),attr(node,'required'),attr(node,'action')]);
      assert.deepEqual(forms(document),forms(original),route+' forms');
    }
    const consent=walk(original).some(node=>node.tagName==='script'&&/consent-manager/.test(attr(node,'src')||''));
    if(consent)assert.ok(nodes.some(node=>node.tagName==='script'&&/consent-manager/.test(attr(node,'src')||'')),route+' consent preserved');
  }
});
test('shop prototype links resolve to canonical products and do not enable unapproved payments',()=>{
  assert.equal(productionHref('/shop-vorschau/?product=product-1850610674','/'),'/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/');
  assert.equal(productionHref('/shop-vorschau/#warenkorb','/'),'/produkte.html');
  assert.equal(productionHref('/en/atelier-preview/start/','/en/'),'/en/');
  assert.equal(productionHref('https://example.com/page','/'),'https://example.com/page');
});
test('search stays intentionally non-indexable and the production worktop receives the shared design',()=>{
  for(const [route,file]of [['/suche/','suche/index.html'],['/en/search/','en/search/index.html'],['/brettvorschau/','brettvorschau/index.html']]){
    sitePages.set(route,file);
    try{const html=renderProductionPage(route);assert.match(html,/atelierHeader/);assert.doesNotMatch(html,/site-preview-bootstrap\.js/);if(route!=='/brettvorschau/')assert.match(html,/noindex,follow/);if(route==='/en/search/')assert.match(html,/<html lang="en">/);}
    finally{sitePages.delete(route);}
  }
});
test('English heirloom release retains the complete approved craft sequence without clipping its overview',()=>{
  const html=renderProductionPage('/en/erbstueck/'),nodes=walk(parse(html));
  const hasClass=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
  const hero=nodes.find(node=>hasClass(node,'erbstueckHero'));
  const overview=nodes.find(node=>hasClass(node,'erbstueckSeriesOverview'));
  assert.ok(overview);
  assert.ok(!walk(hero).some(node=>hasClass(node,'pageSummary')));
  assert.ok(walk(overview).some(node=>hasClass(node,'pageSummary')));
  assert.equal(nodes.filter(node=>attr(node,'data-craft-step')!==undefined).length,19);
  assert.match(html,/beech/);
  assert.doesNotMatch(html,/maple|259\.99|259,99/i);
  for(const image of nodes.filter(node=>node.tagName==='img'&&(attr(node,'src')||'').includes('/erbstueck-entstehung/'))){
    assert.match(attr(image,'src'),/\/cropped\/[^/]+\.webp$/);
    assert.equal(attr(image,'width'),attr(image,'height'));
  }
});
test('No.004 product titles do not assert conflicting dimensions and retain a direct story link',()=>{
  for(const route of ['/produkte/erbstueck-no-004-eiche-buche-4370769708/','/en/produkte/erbstueck-no-004-eiche-buche-4370769708/']){
    const html=renderProductionPage(route),nodes=walk(parse(html));
    const title=nodes.find(node=>node.tagName==='h1');
    const content=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(content).join('');
    assert.ok(title);assert.doesNotMatch(content(title),/40\s*[x×]|42\s*[x×]/);
    assert.ok(nodes.some(node=>node.tagName==='a'&&attr(node,'href')===(route.startsWith('/en/')?'/en/erbstueck/':'/schneidebrett-fachwerk-eiche/')));
    assert.match(html,/5[,.]8\s*kg/);
  }
});
test('static export includes runtime public data, excludes private configuration and refuses foreign output directories',()=>{
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'edle-release-test-'));
  buildSite(output);
  for(const file of ['data/reviews.json','data/reviews-en.json','data/reviews-meta.json','brettvorschau/models.json'])assert.ok(fs.existsSync(path.join(output,file)),file);
  for(const file of ['data/shop-pilot.json','tools/shop-server/server.mjs','assets/js/site-preview-bootstrap.js','assets/js/shop-pilot.js'])assert.ok(!fs.existsSync(path.join(output,file)),file);
  const foreign=fs.mkdtempSync(path.join(os.tmpdir(),'edle-foreign-test-'));
  fs.writeFileSync(path.join(foreign,'keep.txt'),'keep');
  assert.throws(()=>buildSite(foreign),/empty output directory/);
  assert.equal(fs.readFileSync(path.join(foreign,'keep.txt'),'utf8'),'keep');
});
test('committing prototype HTML cannot accidentally publish it as a release utility page',()=>{
  for(const file of ['atelier-vorschau/start/index.html','shop-vorschau/index.html','en/atelier-preview/erbstueck/index.html','en/shop-preview/index.html','tools/kitchen-preview/index.html'])assert.equal(isReleaseHtml(file),false,file);
  for(const file of ['index.html','en/index.html','suche/index.html','en/search/index.html','brettvorschau/index.html','b2b.html'])assert.equal(isReleaseHtml(file),true,file);
});
test('a leftover private file or symlink blocks upload even when it is absent from the manifest',()=>{
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'edle-export-boundary-'));
  buildSite(output);
  fs.writeFileSync(path.join(output,'unexpected-private.json'),'test-only');
  fs.symlinkSync(path.join(output,'products.json'),path.join(output,'unexpected-link.json'));
  const report=checkRelease(output);
  assert.ok(report.failures.some(item=>item.type==='unlisted-export'&&item.file==='unexpected-private.json'));
  assert.ok(report.failures.some(item=>item.type==='symlink-export'&&item.file==='unexpected-link.json'));
});
