import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import {root,walk,attr} from './audit-design-system.mjs';

export function repairEnglishNavigation(source,file){
  if(!file.startsWith('en/produkte/')&&file!=='en/care.html')return source;
  const changes=[];
  for(const node of walk(parse(source,{sourceCodeLocationInfo:true}))){
    if(node.tagName!=='a')continue;
    const href=attr(node,'href');let replacement=href;
    if(file.startsWith('en/produkte/')){
      if(href==='#product-finder'||href==='/en/products.html#produktfinder')replacement='/en/products.html#product-finder';
      if(href==='/en/custom-cutting-board/')replacement='mailto:info@edlehoelzer.de?subject=Custom%20board%20inquiry';
    }
    if(file==='en/care.html'&&href==='/#service')replacement='/en/refurbishment/';
    if(replacement!==href){const location=node.sourceCodeLocation.attrs.href;changes.push({...location,text:'href="'+replacement+'"'});}
  }
  for(const change of changes.sort((a,b)=>b.startOffset-a.startOffset))source=source.slice(0,change.startOffset)+change.text+source.slice(change.endOffset);
  return source;
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){
  const files=execFileSync('git',['ls-files','-z','en/**/*.html','en/care.html'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  let changed=0;
  for(const file of files){const full=path.join(root,file),before=fs.readFileSync(full,'utf8'),after=repairEnglishNavigation(before,file);if(before!==after){fs.writeFileSync(full,after);changed++;}}
  const mainFile=path.join(root,'main.js'),main=fs.readFileSync(mainFile,'utf8'),fixed=main.replaceAll('/en/custom-cutting-board/','mailto:info@edlehoelzer.de?subject=Custom%20board%20inquiry');
  if(fixed!==main){fs.writeFileSync(mainFile,fixed);changed++;}
  console.log({repairedFiles:changed});
}
