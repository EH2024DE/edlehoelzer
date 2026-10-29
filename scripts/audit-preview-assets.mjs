import fs from 'node:fs';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {sitePages,renderSitePreview,approvedHome,walk,attr} from '../tools/shop-server/site-preview.mjs';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170',assets=new Set();
for(const route of [...sitePages.keys(),'/brettvorschau/','/atelier-vorschau/','/en/atelier-preview/']){
 let html=renderSitePreview(route)?.html;
 if(!html){if(route==='/'||route==='/en/')html=approvedHome(route==='/en/');else if(route.includes('atelier-')||route.includes('atelier/')){try{html=fs.readFileSync('.'+route+'index.html','utf8');}catch{}}}
 if(!html)continue;
 for(const node of walk(parse(html))){
  const values=[];
  if(['img','script','video','source'].includes(node.tagName))values.push(attr(node,'src'),attr(node,'poster'));
  if(node.tagName==='link'&&attr(node,'rel')==='stylesheet')values.push(attr(node,'href'));
  if(node.tagName==='img'&&attr(node,'srcset'))values.push(...attr(node,'srcset').split(',').map(part=>part.trim().split(/\s+/)[0]));
  for(const value of values.filter(Boolean)){try{const url=new URL(value,base+route);if(url.origin===base)assets.add(url.pathname+url.search);}catch{}}
 }
}
const failures=[];for(const asset of assets){const response=await fetch(base+asset,{method:'HEAD'});if(response.status!==200)failures.push({asset,status:response.status});}
console.log(JSON.stringify({assets:assets.size,failures},null,2));if(failures.length)process.exitCode=1;
