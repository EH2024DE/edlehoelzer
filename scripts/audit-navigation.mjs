import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {sitePages,walk,attr} from '../tools/shop-server/site-preview.mjs';
import {renderProductionPage} from './build-site.mjs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

export function auditNavigation(){
  const graph=new Map();
  for(const route of sitePages.keys()){
    const links=new Set();
    for(const node of walk(parse(renderProductionPage(route))))if(node.tagName==='a'&&attr(node,'href')){
      try{const url=new URL(attr(node,'href'),'https://edlehoelzer.de'+route);if(url.hostname==='edlehoelzer.de'&&sitePages.has(url.pathname))links.add(url.pathname);}catch{}
    }
    graph.set(route,links);
  }
  const distance=new Map([['/',0],['/en/',0]]),queue=['/','/en/'];
  for(let i=0;i<queue.length;i++)for(const next of graph.get(queue[i])||[])if(!distance.has(next)){distance.set(next,distance.get(queue[i])+1);queue.push(next);}
  return {pages:sitePages.size,unreachable:[...sitePages.keys()].filter(route=>!distance.has(route)),depths:Object.fromEntries(distance),deep:[...distance].filter(([,depth])=>depth>3)};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(auditNavigation(),null,2));
