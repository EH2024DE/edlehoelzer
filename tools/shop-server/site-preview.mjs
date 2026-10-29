import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse,parseFragment,serialize} from 'parse5';
import {ROOT} from './catalog.mjs';
import {refineRefurbishment} from './refurbishment-preview.mjs';
import {renderErbstueckStory} from '../../scripts/atelier-story.mjs';

export const walk=node=>[node,...(node.childNodes||[]).flatMap(walk)];
export const attr=(node,name)=>node.attrs?.find(item=>item.name===name)?.value;
const set=(node,name,value)=>{node.attrs||=[];const item=node.attrs.find(item=>item.name===name);if(item)item.value=value;else node.attrs.push({name,value});};
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const remove=node=>{if(node.parentNode)node.parentNode.childNodes=node.parentNode.childNodes.filter(child=>child!==node);};
const insert=(parent,nodes)=>{for(const node of nodes){node.parentNode=parent;parent.childNodes.push(node);}};
const sitemap=parse(fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8'));
export const sitePages=new Map(walk(sitemap).filter(node=>node.tagName==='loc').map(node=>{
  const url=new URL(text(node).trim());
  return [url.pathname,url.pathname.endsWith('/')?url.pathname.slice(1)+'index.html':url.pathname.slice(1)];
}));
const staticNames=execFileSync('git',['ls-files','-z','assets','brettvorschau','product','teigschaber-sauerteig/img'],{cwd:ROOT,encoding:'utf8'}).split('\0').filter(Boolean);
const publicTypes=/\.(?:css|js|json|png|jpe?g|webp|avif|svg|mp4|woff2?|ttf)$/i;
export const siteAssets=new Map(staticNames.filter(file=>publicTypes.test(file)).map(file=>['/'+file,file]));
for(const file of ['styles.css','main.js','products.json','data/reviews.json','data/reviews-en.json','data/reviews-meta.json','assets/css/site-preview.css','assets/js/site-preview-bootstrap.js','assets/js/site-preview.js'])siteAssets.set('/'+file,file);

export function previewHref(value,sourcePath){
  try{const url=new URL(value,'https://edlehoelzer.de'+sourcePath);if(url.hostname!=='edlehoelzer.de')return value;
    if(url.pathname==='/en/custom-cutting-board/')return '/en/#customwork';
    if(url.pathname==='/en/products.html'&&url.hash==='#produktfinder')return '/en/products.html'+url.search+'#product-finder';
    if(sourcePath.startsWith('/en/')&&url.pathname==='/'&&url.hash==='#service')return '/en/refurbishment/';
  }catch{}
  return value;
}

function sharedNavigation(en,source){
  const home=path.join(ROOT,en?'en/atelier-preview/start/index.html':'atelier-vorschau/start/index.html');
  const document=parse(fs.readFileSync(home,'utf8')),nodes=walk(document);
  const header=nodes.find(node=>node.tagName==='header'&&attr(node,'class')==='atelierHeader');
  const menu=nodes.find(node=>node.tagName==='dialog'&&attr(node,'id')==='atelier-menu');
  const alternates=walk(source).filter(node=>node.tagName==='link'&&attr(node,'rel')==='alternate');
  const language=alternates.find(node=>attr(node,'hreflang')===(en?'de':'en'));
  const canonical=walk(source).find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical');
  const searchAlternate=!en&&attr(canonical,'href')==='https://edlehoelzer.de/suche/'?'/en/search/':null;
  for(const node of [...walk(header),...walk(menu)])if(node.tagName==='a'){
    const href=attr(node,'href')||'';
    if(!en&&(attr(node,'class')==='atelierCustomLink'||href.includes('?product=xxl-custom-board')))set(node,'href','/schneidebrett-nach-mass/');
    if(attr(node,'lang')&&language)set(node,'href',new URL(attr(language,'href')).pathname);
    else if(attr(node,'lang')&&searchAlternate)set(node,'href',searchAlternate);
  }
  return [header,menu];
}

export const isFeaturedProduct=pathname=>/^\/(?:en\/)?produkte\/erbstueck-no-004-eiche-buche-4370769708\/$/.test(pathname);

function featuredProductPreview(pathname,source){
  const en=pathname.startsWith('/en/');
  const document=parse(fs.readFileSync(path.join(ROOT,en?'en/atelier-preview/erbstueck/index.html':'atelier-vorschau/erbstueck/index.html'),'utf8'));
  const head=walk(document).find(node=>node.tagName==='head');
  for(const node of walk(document).filter(node=>node.tagName==='title'||node.tagName==='link'&&attr(node,'rel')==='canonical'))remove(node);
  for(const node of walk(source).filter(node=>node.tagName==='title'||node.tagName==='link'&&['canonical','alternate'].includes(attr(node,'rel'))))insert(head,[node]);
  return {html:serialize(document),csp:"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' https://i.etsystatic.com data: blob:; media-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"};
}

export function renderSitePreview(pathname,{production=false}={}){
  const pilot=pathname==='/shop-vorschau/'||pathname==='/en/shop-preview/';
  const worktop=pathname==='/brettvorschau/';
  const file=sitePages.get(pathname)||(pilot||worktop||['/suche/','/en/search/'].includes(pathname)?pathname.slice(1)+'index.html':null);if(!file)return null;
  if(!production&&['/','/en/','/schneidebrett-fachwerk-eiche/','/en/erbstueck/'].includes(pathname))return null;
  const source=fs.readFileSync(path.join(ROOT,file),'utf8'),document=parse(source),nodes=walk(document);
  if(!production&&isFeaturedProduct(pathname))return featuredProductPreview(pathname,document);
  const body=nodes.find(node=>node.tagName==='body'),head=nodes.find(node=>node.tagName==='head');
  const en=attr(nodes.find(node=>node.tagName==='html'),'lang')==='en';
  if(['/schneidebrett-aufbereiten/','/en/refurbishment/'].includes(pathname))refineRefurbishment(document,en);
  if(production&&pathname==='/en/erbstueck/'){
    const main=nodes.find(node=>node.tagName==='main');
    const hasClass=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
    const hero=nodes.find(node=>hasClass(node,'erbstueckHero'));
    const summary=nodes.find(node=>hasClass(node,'pageSummary'));
    const badges=nodes.find(node=>hasClass(node,'erbstueckBadges'));
    const overview=parseFragment('<div class="container erbstueckSeriesOverview"></div>').childNodes[0];
    for(const node of [summary,badges])if(node){remove(node);insert(overview,[node]);}
    overview.parentNode=main;main.childNodes.splice(main.childNodes.indexOf(hero)+1,0,overview);
    const process=nodes.find(node=>hasClass(node,'erbstueckProcessSection'));
    const container=process?.childNodes.find(node=>hasClass(node,'container'));
    if(container){
      const existing=[...container.childNodes],brief=parseFragment('<details class="erbstueckCraftBrief"><summary>Craft in brief</summary></details>').childNodes[0];
      insert(brief,existing);container.childNodes=[];
      const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
      const approved=parseFragment(renderErbstueckStory(true,'/en/atelier-preview/',escape));
      const craft=walk(approved).find(node=>hasClass(node,'atelierCraft'));
      insert(container,[craft,brief]);
    }
  }
  for(const image of nodes.filter(node=>node.tagName==='img'&&/^\/assets\/erbstueck-entstehung\/[^/]+\.jpg$/.test(attr(node,'src')||''))){
    const cropped=attr(image,'src').replace('/erbstueck-entstehung/','/erbstueck-entstehung/cropped/').replace(/\.jpg$/,'.webp');
    if(fs.existsSync(path.join(ROOT,cropped))){
      set(image,'src',cropped);set(image,'width','591');set(image,'height','591');
      if((attr(image.parentNode,'class')||'').includes('erbstueckProcessCrop')){set(image.parentNode,'class','erbstueckProcessPhoto');set(image.parentNode,'style','');}
    }
  }
  for(const item of walk(document).filter(node=>node.tagName==='article'&&(attr(node,'class')||'').split(/\s+/).includes('faqItem'))){
    const heading=item.childNodes.find(node=>/^h[2-4]$/.test(node.tagName||''));
    if(!heading)continue;
    item.nodeName=item.tagName='details';
    const summary=parseFragment('<summary></summary>').childNodes[0];
    remove(heading);insert(summary,[heading]);summary.parentNode=item;item.childNodes.unshift(summary);
  }
  set(body,'class',(attr(body,'class')||'')+' atelierSite'+(pilot?' atelierShop':'')+(worktop?' atelierWorktop':''));
  const oldHeader=nodes.find(node=>node.tagName==='header');
  const navigation=sharedNavigation(en,document);
  if(oldHeader){const parent=oldHeader.parentNode,index=parent.childNodes.indexOf(oldHeader);for(const node of navigation)node.parentNode=parent;parent.childNodes.splice(index,1,...navigation);}
  else{for(const node of navigation)node.parentNode=body;body.childNodes.unshift(...navigation);}
  if(!nodes.some(node=>node.tagName==='main')){
    const wrapper=parseFragment('<div class="siteLegal"></div>').childNodes[0];
    const content=body.childNodes.filter(node=>!navigation.includes(node)&&node.tagName!=='script');
    body.childNodes=body.childNodes.filter(node=>!content.includes(node));insert(wrapper,content);insert(body,[wrapper]);
    const home=parse(fs.readFileSync(path.join(ROOT,en?'en/atelier-preview/start/index.html':'atelier-vorschau/start/index.html'),'utf8'));
    const footer=walk(home).find(node=>node.tagName==='footer');if(footer)insert(body,[footer]);
  }
  for(const node of [...nodes,...navigation.flatMap(walk)]){
    if(node.tagName==='a'&&attr(node,'href'))set(node,'href',previewHref(attr(node,'href'),pathname));
    if(!production&&node.tagName==='meta'&&attr(node,'name')==='robots')remove(node);
    if(node.tagName==='link'&&/fonts\.google/.test(attr(node,'href')||''))remove(node);
    if(!production&&node.tagName==='script'&&(/consent-manager/.test(attr(node,'src')||'')||/^https?:/.test(attr(node,'src')||'')))remove(node);
  }
  const bootstrap=parseFragment(pilot||production?'':'<script src="/assets/js/site-preview-bootstrap.js"></script>').childNodes;
  for(const node of bootstrap)node.parentNode=head;head.childNodes.unshift(...bootstrap);
  insert(head,parseFragment((production?'':'<meta name="robots" content="noindex,nofollow">')+'<link rel="stylesheet" href="/assets/css/atelier-preview.css"><link rel="stylesheet" href="/assets/css/site-preview.css"><link rel="stylesheet" href="/assets/css/site-search.css">'+(pilot?'':'<script src="/assets/js/atelier-preview.js" defer></script>')+'<script src="/assets/js/site-preview.js" defer></script><script src="/assets/js/site-search.js" defer></script>').childNodes);
  if(nodes.some(node=>node.tagName==='form'&&(attr(node,'class')||'').split(/\s+/).includes('b2b-form'))&&!nodes.some(node=>node.tagName==='script'&&/board-inquiry\.js/.test(attr(node,'src')||'')))insert(head,parseFragment('<script src="/assets/js/board-inquiry.js" defer></script>').childNodes);
  const hashes=walk(document).filter(node=>node.tagName==='script'&&!attr(node,'src')&&attr(node,'type')!=='application/ld+json').map(node=>"'sha256-"+createHash('sha256').update(text(node)).digest('base64')+"'");
  // OpenCV's Emscripten bindings generate JS invokers as well as compiling WASM.
  // This exception is confined to the worktop tool, never shop or checkout pages.
  return {html:serialize(document),csp:`default-src 'none'; script-src 'self' ${worktop?"'unsafe-eval' ":''}${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' https://i.etsystatic.com data: blob:; media-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`};
}

export function approvedHome(en){
  const document=parse(fs.readFileSync(path.join(ROOT,en?'en/atelier-preview/start/index.html':'atelier-vorschau/start/index.html'),'utf8'));
  if(en){const original=parse(fs.readFileSync(path.join(ROOT,'en/index.html'),'utf8'));for(const id of ['customwork','b2b']){const section=walk(original).find(node=>attr(node,'id')===id);if(section){set(section,'class','atelierHomeCustom atelierMain');insert(walk(document).find(node=>node.tagName==='main'),[section]);}}}
  if(en){const workshop=walk(document).find(node=>attr(node,'id')==='ueberuns');if(workshop)set(workshop,'id','about');}
  for(const node of walk(document))if(node.tagName==='a'&&attr(node,'href'))set(node,'href',previewHref(attr(node,'href'),en?'/en/':'/'));
  if(!walk(document).some(node=>node.tagName==='script'&&attr(node,'src')==='/assets/js/site-preview.js'))insert(walk(document).find(node=>node.tagName==='head'),parseFragment('<script src="/assets/js/site-preview.js" defer></script>').childNodes);
  if(en)insert(walk(document).find(node=>node.tagName==='head'),parseFragment('<script src="/assets/js/site-preview-bootstrap.js"></script><link rel="stylesheet" href="/assets/css/board-inquiry.css"><script src="/assets/js/board-inquiry.js" defer></script>').childNodes);
  insert(walk(document).find(node=>node.tagName==='head'),parseFragment('<link rel="stylesheet" href="/assets/css/site-search.css"><script src="/assets/js/site-search.js" defer></script>').childNodes);
  return serialize(document);
}
