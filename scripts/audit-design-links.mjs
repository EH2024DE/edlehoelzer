import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {parse} from 'parse5';
import {sitePages} from './build-design-site.mjs';
import {walk,attr,root} from './audit-design-system.mjs';
const output=process.argv[2]||path.join(os.tmpdir(),'edle-design-system-reference');
const documents=new Map();
const load=file=>{if(!documents.has(file))documents.set(file,walk(parse(fs.readFileSync(file,'utf8'))));return documents.get(file);};
const missing=new Map(),fragments=new Map();
for(const page of sitePages()){
 for(const node of load(path.join(output,page.file)).filter(n=>n.tagName==='a')){
  const href=attr(node,'href');if(!href||/^(mailto|tel|javascript|data):/.test(href))continue;
  let url;try{url=new URL(href,'https://edlehoelzer.de'+page.route);}catch{continue;}
  if(url.hostname!=='edlehoelzer.de')continue;
  const target=path.join(output,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){
   const key=url.pathname;if(!missing.has(key))missing.set(key,new Set());missing.get(key).add(page.route);continue;
  }
  if(url.hash&&/\.html$/.test(target)){
   const id=decodeURIComponent(url.hash.slice(1));
   if(!load(target).some(n=>attr(n,'id')===id||attr(n,'name')===id)){
    const key=url.pathname+url.hash;if(!fragments.has(key))fragments.set(key,new Set());fragments.get(key).add(page.route);
   }
  }
 }
}
const report={pages:sitePages().length,missingTargets:[...missing].map(([target,sources])=>({target,sources:[...sources]})),missingFragments:[...fragments].map(([target,sources])=>({target,sources:[...sources]}))};
fs.writeFileSync(path.join(root,'docs/design-link-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.missingTargets.length||report.missingFragments.length)process.exitCode=1;
