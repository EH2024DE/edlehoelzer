import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text} from './audit-design-system.mjs';
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-editorial-pages.json'),'utf8'));
const mapping=new Map(pages.map(p=>['/'+p.source.replace(/index\.html$/,''),p.route]));
for(const url of walk(parse(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'))).filter(n=>n.tagName==='loc').map(text)){
  const route=new URL(url).pathname;if(route.startsWith('/en/')||['/baumspende.html','/schneidebretter-aus-holz-gastronomie/'].includes(route))continue;
  const file=route==='/'?'index.html':route.endsWith('/')?route.slice(1)+'index.html':route.slice(1);
  const alternate=walk(parse(fs.readFileSync(path.join(root,file),'utf8'))).find(n=>n.tagName==='link'&&attr(n,'hreflang')==='en');
  if(alternate)mapping.set(route,new URL(attr(alternate,'href')).pathname);
}
mapping.set('/en/#customwork','/en/custom-cutting-board/');
mapping.set('/index.html','/en/');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
for(const file of files(path.join(root,'en'))){
  let source=fs.readFileSync(file,'utf8');const changes=[];
  for(const n of walk(parse(source,{sourceCodeLocationInfo:true})).filter(n=>n.tagName==='a')){
    if((attr(n.parentNode,'class')||'').split(' ').some(c=>['lang','mobileMenu__lang'].includes(c)))continue;
    if(/^German (?:privacy|legal)/.test(text(n).trim()))continue;
    const href=attr(n,'href');if(!href)continue;
    const url=new URL(href,'https://edlehoelzer.de/'+path.relative(root,file));if(url.origin!=='https://edlehoelzer.de')continue;
    const route=url.pathname;
    const target=mapping.get(href)||mapping.get(route);
    if(!target)continue;
    const loc=n.sourceCodeLocation?.attrs?.href;if(!loc)continue;
    const hashMap={'#ueberuns':'#about','#produktfinder':'#product-finder','#produkte-grid':'#products-grid','#aufbereitungsservice':'#refurbishment-service'};
    const hash=target==='/en/custom-cutting-board/'&&url.hash==='#anfrage'?'#enquiry':hashMap[url.hash]||url.hash;
    const targetFile=target.endsWith('/')?target.slice(1)+'index.html':target.slice(1);
    const ids=walk(parse(fs.readFileSync(path.join(root,targetFile),'utf8'))).map(n=>attr(n,'id'));
    const destination=target+url.search+(hash&&ids.includes(hash.slice(1))?hash:'');
    changes.push({...loc,value:'href="'+destination.replaceAll('&','&amp;')+'"'});
    for(const child of n.childNodes||[])if(child.nodeName==='#text'&&/ \((?:DE|German)\)$/.test(child.value))changes.push({...child.sourceCodeLocation,value:child.value.replace(/ \((?:DE|German)\)$/,'')});
    const lang=n.sourceCodeLocation?.attrs?.lang;if(attr(n,'lang')==='de'&&lang)changes.push({...lang,value:'lang="en"'});
  }
  for(const c of changes.sort((a,b)=>b.startOffset-a.startOffset))source=source.slice(0,c.startOffset)+c.value+source.slice(c.endOffset);
  if(changes.length)fs.writeFileSync(file,source);
}
