import fs from 'node:fs';
import {parse} from 'parse5';
import {walk,attr,text} from './audit-design-system.mjs';

const origin='https://edlehoelzer.de';
const migration=JSON.parse(fs.readFileSync('data/product-url-migration.json','utf8'));
const sitemap=await fetch(origin+'/sitemap.xml').then(r=>r.text());
const routes=walk(parse(sitemap)).filter(n=>n.tagName==='loc').map(text);
const aliases=migration.flatMap(p=>[p.previousPath,'/en'+p.previousPath]);
const aliasTargets=new Map(migration.flatMap(p=>[[origin+p.previousPath,origin+p.productPath],[origin+'/en'+p.previousPath,origin+'/en'+p.productPath]]));
const queue=[...new Set([...routes,...aliases.map(p=>origin+p)])];
const results=[];
async function worker(){
  while(queue.length){
    const url=queue.shift();
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
      const html=await response.text(),nodes=walk(parse(html));
      const canonical=attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href');
      const robots=nodes.filter(n=>n.tagName==='meta'&&attr(n,'name')==='robots').map(n=>attr(n,'content')).join(' ');
      const refresh=attr(nodes.find(n=>n.tagName==='meta'&&(attr(n,'http-equiv')||'').toLowerCase()==='refresh'),'content');
      const indexable=routes.includes(url);
      results.push({url,status:response.status,finalUrl:response.url,canonical,robots,refresh,indexable,design:html.includes('design-system.css'),issues:[...(response.status!==200?['HTTP '+response.status]:[]),...(indexable&&/noindex/i.test(robots)?['unexpected noindex']:[]),...(indexable&&canonical!==url?['canonical mismatch']:[]),...(!indexable&&canonical!==aliasTargets.get(url)?['redirect canonical mismatch']:[]),...(!indexable&&!refresh&&!response.redirected?['missing redirect']:[])]});
    }catch(error){results.push({url,issues:[error.message]});}
  }
}
await Promise.all(Array.from({length:4},worker));
results.sort((a,b)=>a.url.localeCompare(b.url));
const report={checkedAt:new Date().toISOString(),scope:'Public live site; no external state changed',pages:routes.length,aliases:aliases.length,issues:results.filter(r=>r.issues.length),htmlRedirects:results.filter(r=>!r.indexable&&r.refresh).length,results};
fs.writeFileSync('docs/live-release-audit-2026-11-10.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:report.pages,aliases:report.aliases,htmlRedirects:report.htmlRedirects,issues:report.issues},null,2));
if(report.issues.length)process.exitCode=1;
