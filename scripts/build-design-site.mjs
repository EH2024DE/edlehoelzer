import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import {root,walk,attr,text,template} from './audit-design-system.mjs';
import {buildReference} from './build-design-reference.mjs';

const templates={'Home':'home','Product Detail':'product','Product Listing':'listing','Editorial / Guide':'editorial','Service / Conversion':'service','B2B':'b2b','Legal':'legal'};
export function sitePages(){
  const sitemap=new Set(walk(parse(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'))).filter(n=>n.tagName==='loc').map(text).map(u=>new URL(u).pathname));
  const files=execFileSync('git',['ls-files','-z','*.html'],{cwd:root,encoding:'utf8'}).split('\0').filter(f=>f&&!/^(tools|docs|tests|node_modules)\//.test(f));
  return files.map(file=>{
    const route=file==='index.html'?'/':file.endsWith('/index.html')?'/'+file.slice(0,-10):'/'+file;
    const nodes=walk(parse(fs.readFileSync(path.join(root,file),'utf8')));
    const redirect=nodes.some(n=>n.tagName==='meta'&&(attr(n,'http-equiv')||'').toLowerCase()==='refresh');
    return {file,route,template:route==='/brettvorschau/'?'tool':templates[template('https://edlehoelzer.de'+route)],indexable:sitemap.has(route),redirect};
  }).filter(p=>!p.redirect);
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){
  const pages=sitePages();console.log(buildReference(process.argv[2],pages));
}
