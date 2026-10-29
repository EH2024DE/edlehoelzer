import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {sitePages,siteAssets,renderSitePreview,walk,attr,approvedHome,previewHref,isFeaturedProduct} from '../tools/shop-server/site-preview.mjs';
import {ROOT} from '../tools/shop-server/catalog.mjs';
const content=node=>!node?'':node.nodeName==='#text'?node.value:(node.childNodes||[]).map(content).join('');
const find=(doc,tag)=>walk(doc).find(node=>node.tagName===tag);
test('all preview interaction scripts parse before browser execution',()=>{
 for(const file of ['site-preview.js','site-preview-bootstrap.js','atelier-preview.js','shop-pilot.js'])assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(ROOT,'assets/js',file),'utf8')),file);
});
test('site-wide preview preserves content, canonical metadata and form contracts for every sitemap page',()=>{
 assert.equal(sitePages.size,145);let count=0;
 for(const [url,file]of sitePages){
  const result=renderSitePreview(url);if(!result)continue;count++;
  const original=parse(fs.readFileSync(path.join(ROOT,file),'utf8')),preview=parse(result.html);
  if(!isFeaturedProduct(url)&&!['/schneidebrett-aufbereiten/','/en/refurbishment/'].includes(url))assert.equal(content(find(preview,'main')).replace(/\s+/g,' ').trim(),content(find(original,'main')).replace(/\s+/g,' ').trim(),url+' main content');
  for(const tag of ['title'])assert.equal(content(find(preview,tag)),content(find(original,tag)),url+' '+tag);
  const canonical=doc=>attr(walk(doc).find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href');assert.equal(canonical(preview),canonical(original),url);
  const forms=doc=>walk(doc).filter(node=>['form','input','select','textarea','option'].includes(node.tagName)).map(node=>[node.tagName,attr(node,'name'),attr(node,'value'),attr(node,'action'),attr(node,'required')]);if(!isFeaturedProduct(url))assert.deepEqual(forms(preview),forms(original),url+' form contract');
  if(isFeaturedProduct(url))assert.match(result.html,/class="atelierDetail"/);else{assert.match(result.html,/class="[^"]*atelierSite/);assert.match(result.html,/site-preview.css/);}assert.match(result.html,/name="robots" content="noindex,nofollow"/);assert.doesNotMatch(result.html,/src="[^"]*consent-manager/);
  assert.ok(result.csp.includes("form-action 'none'"));assert.ok(!result.csp.includes("script-src 'self' 'unsafe-inline'"));
 }
 assert.ok(count>130);
});
test('refurbishment is compact, keeps confirmed prices and shows each process image once',()=>{
 for(const route of ['/schneidebrett-aufbereiten/','/en/refurbishment/']){
  const doc=parse(renderSitePreview(route).html),main=find(doc,'main'),nodes=walk(main);
  const images=nodes.filter(node=>node.tagName==='img').map(node=>attr(node,'src'));
  assert.equal(images.length,new Set(images).size,route+' no duplicate photos');
  assert.equal(nodes.filter(node=>attr(node,'class')==='refurbCompare').length,1);
  assert.ok(main.childNodes.filter(node=>node.tagName==='section').length<=8);
  for(const price of ['41','51','64','95','124','154'])assert.match(content(main),new RegExp(price+' ?€'));
  assert.match(content(main),route.startsWith('/en/')?/One care balm tin/:/Eine Dose Pflegebalsam/);
  assert.ok(!nodes.some(node=>(attr(node,'class')||'').includes('beforeAfterGallery')));
  const ids=new Set(nodes.map(node=>attr(node,'id')).filter(Boolean));
  for(const link of nodes.filter(node=>node.tagName==='a'&&(attr(node,'href')||'').startsWith('#')))assert.ok(ids.has(attr(link,'href').slice(1)),route+' '+attr(link,'href'));
 }
});
test('public asset allowlist never exposes private repository or order data',()=>{
 for(const url of ['/.env','/.git/config','/logs/etsy-active-listings.json','/tools/shop-server/server.mjs','/data/shop-pilot.json']){assert.ok(!siteAssets.has(url));assert.equal(renderSitePreview(url),null);}
 assert.ok(siteAssets.has('/main.js'));assert.ok(siteAssets.has('/products.json'));assert.ok(siteAssets.has('/assets/css/site-preview.css'));
});
test('OpenCV dynamic bindings are permitted only on the isolated worktop page, never checkout or catalogue pages',()=>{
 const worktop=renderSitePreview('/brettvorschau/');assert.ok(worktop.csp.includes("'unsafe-eval'"));assert.ok(worktop.csp.includes("connect-src 'self'"));assert.ok(!worktop.csp.includes("script-src 'self' 'unsafe-inline'"));
 for(const route of [...sitePages.keys(),'/shop-vorschau/','/en/shop-preview/']){const result=renderSitePreview(route);if(result)assert.ok(!result.csp.includes("'unsafe-eval'"),route);}
});
test('approved home remains the entry point and keeps the existing English business section',()=>{
 assert.match(approvedHome(false),/data-home-video/);assert.match(approvedHome(true),/id="b2b"/);assert.match(approvedHome(true),/id="customwork"/);
});
test('sold English archive links lead to the existing custom-work section',()=>{
 const html=renderSitePreview('/en/produkte/mahagoni-stirnholz-ruhiger-block-1886613306/').html;
 assert.match(html,/href="\/en\/#customwork"/);assert.doesNotMatch(html,/href="\/en\/custom-cutting-board\/"/);
});
test('English finder, about and restoration links keep working after the design migration',()=>{
 assert.equal(previewHref('/en/products.html#produktfinder','/en/care.html'),'/en/products.html#product-finder');
 assert.equal(previewHref('/#service','/en/care.html'),'/en/refurbishment/');
 assert.equal(previewHref('https://other.example/#service','/en/care.html'),'https://other.example/#service');
 assert.match(approvedHome(true),/id="about"/);
 assert.match(renderSitePreview('/en/care.html').html,/href="\/en\/refurbishment\/"/);
});
