import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr} from './audit-design-system.mjs';
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-editorial-pages.json'),'utf8'));
const mapping=new Map(pages.map(p=>['/'+p.source.replace(/index\.html$/,''),p.route]));
mapping.set('/en/#customwork','/en/custom-cutting-board/');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);}
for(const file of files(path.join(root,'en'))){
  let source=fs.readFileSync(file,'utf8');const changes=[];
  for(const n of walk(parse(source,{sourceCodeLocationInfo:true})).filter(n=>n.tagName==='a')){
    if((attr(n.parentNode,'class')||'').split(' ').some(c=>['lang','mobileMenu__lang'].includes(c)))continue;
    const href=attr(n,'href');const route=href?.split('#')[0];
    const target=mapping.get(href)||mapping.get(route);
    if(!target)continue;
    const loc=n.sourceCodeLocation?.attrs?.href;if(!loc)continue;
    changes.push({...loc,value:'href="'+target+'"'});
    for(const child of n.childNodes||[])if(child.nodeName==='#text'&&/ \(DE\)$/.test(child.value))changes.push({...child.sourceCodeLocation,value:child.value.replace(/ \(DE\)$/,'')});
    const lang=n.sourceCodeLocation?.attrs?.lang;if(attr(n,'lang')==='de'&&lang)changes.push({...lang,value:'lang="en"'});
  }
  for(const c of changes.sort((a,b)=>b.startOffset-a.startOffset))source=source.slice(0,c.startOffset)+c.value+source.slice(c.endOffset);
  if(changes.length)fs.writeFileSync(file,source);
}
