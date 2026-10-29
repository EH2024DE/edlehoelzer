import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {parse,parseFragment,serialize} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {ROOT,publicCatalog} from '../tools/shop-server/catalog.mjs';
import {sitePages,renderSitePreview,approvedHome,walk,attr} from '../tools/shop-server/site-preview.mjs';

const remove=node=>{if(node.parentNode)node.parentNode.childNodes=node.parentNode.childNodes.filter(child=>child!==node);};
const set=(node,name,value)=>{const item=node.attrs?.find(item=>item.name===name);if(item)item.value=value;else(node.attrs||=[]).push({name,value});};
const add=(parent,nodes)=>{for(const node of nodes){node.parentNode=parent;parent.childNodes.push(node);}};
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const offerPaths=new Map(publicCatalog().offers.map(offer=>[offer.sku,offer.productPath]));
export const isReleaseHtml=file=>file.endsWith('.html')&&!/^(?:tools|docs|logs|atelier-vorschau|shop-vorschau|en\/atelier-preview|en\/shop-preview)\//.test(file);

export function productionHref(value,route){
  let url;try{url=new URL(value,'https://edlehoelzer.de'+route);}catch{return value;}
  if(url.hostname!=='edlehoelzer.de')return value;
  const en=url.pathname.startsWith('/en/');
  const base=en?'/en/atelier-preview/':'/atelier-vorschau/';
  if(url.pathname===base+'start/')return en?'/en/':'/';
  if(url.pathname===base)return en?'/en/products.html':'/produkte.html';
  if(url.pathname===base+'erbstueck/')return en?'/en/erbstueck/':'/schneidebrett-fachwerk-eiche/';
  if(['/shop-vorschau/','/en/shop-preview/'].includes(url.pathname)){
    const product=offerPaths.get(url.searchParams.get('product'));
    return product?(en?'/en':'')+product:en?'/en/products.html':'/produkte.html';
  }
  return url.pathname+url.search+url.hash;
}

export function renderProductionPage(route){
  const file=sitePages.get(route)||route.slice(1)+(route.endsWith('/')?'index.html':'');
  const original=parse(fs.readFileSync(path.join(ROOT,file),'utf8'));
  const home=['/','/en/'].includes(route);
  const document=parse(home?approvedHome(route.startsWith('/en/')):renderSitePreview(route,{production:true})?.html||serialize(original));
  const head=walk(document).find(node=>node.tagName==='head');
  if(home){
    const metadata=node=>node.tagName==='title'||node.tagName==='meta'&&!['charset','viewport'].includes(attr(node,'name'))||node.tagName==='link'&&['canonical','alternate'].includes(attr(node,'rel'))||node.tagName==='script'&&attr(node,'type')==='application/ld+json';
    for(const node of walk(head).filter(metadata))remove(node);
    add(head,walk(original).find(node=>node.tagName==='head').childNodes.filter(metadata));
    const consent=walk(original).find(node=>node.tagName==='script'&&/consent-manager/.test(attr(node,'src')||''));
    if(consent)add(head,[consent]);
  }
  for(const node of walk(document)){
    if(node.tagName==='script'&&/site-preview-bootstrap|shop-pilot/.test(attr(node,'src')||''))remove(node);
    if((attr(node,'class')||'').split(/\s+/).includes('atelierCartLink'))remove(node);
    if(node.tagName==='small'&&/Gestaltungsprobe|Design preview/.test(text(node)))remove(node);
    if(node.tagName==='a'&&attr(node,'href'))set(node,'href',productionHref(attr(node,'href'),route));
  }
  if(!walk(document).some(node=>node.tagName==='script'&&/site-search\.js/.test(attr(node,'src')||'')))add(head,parseFragment('<script src="/assets/js/site-search.js" defer></script>').childNodes);
  return serialize(document);
}

export function buildSite(output=path.join(os.tmpdir(),'edle-hoelzer-release')){
  const destination=path.resolve(output);
  if(destination===ROOT||destination.startsWith(ROOT+path.sep))throw Error('Build output must be outside the working checkout');
  fs.mkdirSync(destination,{recursive:true});
  const manifestFile=path.join(destination,'release-manifest.json');
  const previous=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):null;
  if(fs.readdirSync(destination).length && previous?.generator!=='edle-hoelzer-static-v1')throw Error('Choose an empty output directory or a recognised previous build');
  const written=[];
  const write=(relative,contents)=>{const target=path.join(destination,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,contents);written.push(relative);};
  for(const [route,file]of sitePages)write(file,renderProductionPage(route));
  // Preserve redirect and intentionally non-indexable utility pages, including search.
  const htmlFiles=[...new Set([...execFileSync('git',['ls-files','-z','*.html'],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean),'en/search/index.html'])];
  const canonicalFiles=new Set(sitePages.values());
  for(const file of htmlFiles)if(!canonicalFiles.has(file)&&isReleaseHtml(file)){
    const route='/'+file.replace(/index\.html$/,'');
    let document=parse(fs.readFileSync(path.join(ROOT,file),'utf8'));
    if(['suche/index.html','en/search/index.html','brettvorschau/index.html'].includes(file)){
      sitePages.set(route,file);document=parse(renderProductionPage(route));sitePages.delete(route);
    }
    write(file,serialize(document));
  }
  const copyDirectory=directory=>{
    const source=path.join(ROOT,directory);if(!fs.existsSync(source))return;
    for(const entry of fs.readdirSync(source,{withFileTypes:true})){
      if(entry.isSymbolicLink()||entry.name==='node_modules'||entry.name.startsWith('.'))continue;
      const relative=directory+'/'+entry.name;
      if(['assets/js/site-preview-bootstrap.js','assets/js/shop-pilot.js','assets/css/shop-pilot.css'].includes(relative))continue;
      if(entry.isDirectory())copyDirectory(relative);
      else if(/\.(?:css|js|json|jpe?g|png|webp|avif|svg|ico|mp4|wasm|woff2?|ttf|txt|map)$/i.test(entry.name))write(relative,fs.readFileSync(path.join(ROOT,relative)));
    }
  };
  for(const directory of ['assets','brettvorschau','product','teigschaber-sauerteig/img'])copyDirectory(directory);
  for(const file of ['styles.css','main.js','products.json','sitemap.xml','robots.txt','CNAME','data/reviews.json','data/reviews-en.json','data/reviews-meta.json'])if(fs.existsSync(path.join(ROOT,file))){
    const source=fs.readFileSync(path.join(ROOT,file));
    write(file,file==='styles.css'?source.toString('utf8').replace(/^@import url\("https:\/\/fonts\.googleapis\.com\/[^\"]+"\);\s*/,''):source);
  }
  for(const relative of previous?.files || []){
    const target=path.resolve(destination,relative);
    if(!written.includes(relative)&&target.startsWith(destination+path.sep)&&fs.existsSync(target)&&fs.lstatSync(target).isFile())fs.unlinkSync(target);
  }
  write('release-manifest.json',JSON.stringify({generator:'edle-hoelzer-static-v1',generatedAt:new Date().toISOString(),pages:sitePages.size,checkoutEnabled:false,files:written.sort()},null,2)+'\n');
  return {output:destination,pages:sitePages.size,files:written.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(buildSite(process.argv[2]),null,2));
