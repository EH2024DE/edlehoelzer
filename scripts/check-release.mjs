import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {walk,attr} from '../tools/shop-server/site-preview.mjs';

export function checkRelease(directory){
  const root=path.resolve(directory),manifest=JSON.parse(fs.readFileSync(path.join(root,'release-manifest.json'),'utf8'));
  if(manifest.generator!=='edle-hoelzer-static-v1'||manifest.checkoutEnabled!==false)throw Error('Unexpected release manifest');
  const failures=[],documents=new Map();
  const listed=new Set([...manifest.files,'release-manifest.json']);
  function scan(relative=''){
    for(const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){
      const file=relative?relative+'/'+entry.name:entry.name;
      if(entry.isSymbolicLink())failures.push({type:'symlink-export',file});
      else if(entry.isDirectory())scan(file);
      else if(!listed.has(file))failures.push({type:'unlisted-export',file});
    }
  }
  scan();
  const route=file=>'/'+file.replace(/index\.html$/,'');
  for(const file of manifest.files){
    const resolved=path.resolve(root,file);
    if(!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved)||/^(?:tools|docs|logs|atelier-vorschau|shop-vorschau|en\/atelier-preview|en\/shop-preview)\//.test(file)||file.startsWith('.')||file.startsWith('data/')&&!['data/reviews.json','data/reviews-en.json','data/reviews-meta.json'].includes(file)){
      failures.push({type:'export-boundary',file});continue;
    }
    if(file.endsWith('.html'))documents.set(route(file),parse(fs.readFileSync(resolved,'utf8')));
  }
  function target(value,source,kind){
    let url;try{url=new URL(value,'https://edlehoelzer.de'+source);}catch{return;}
    if(url.origin!=='https://edlehoelzer.de')return;
    const relative=decodeURIComponent(url.pathname).replace(/^\//,'');
    const file=path.join(root,relative,url.pathname.endsWith('/')?'index.html':'');
    if(!fs.existsSync(file))failures.push({type:'missing-'+kind,source,target:url.pathname});
    if(kind==='link'&&url.hash&&documents.has(url.pathname)){
      const id=decodeURIComponent(url.hash.slice(1));
      if(!walk(documents.get(url.pathname)).some(node=>attr(node,'id')===id||attr(node,'name')===id))failures.push({type:'missing-fragment',source,target:url.pathname+url.hash});
    }
  }
  for(const [source,document]of documents)for(const node of walk(document)){
    if(node.tagName==='a'&&attr(node,'href'))target(attr(node,'href'),source,'link');
    for(const name of ['src','poster'])if(attr(node,name))target(attr(node,name),source,'asset');
    if(node.tagName==='link'&&['stylesheet','icon','apple-touch-icon'].includes(attr(node,'rel')))target(attr(node,'href'),source,'asset');
    if(attr(node,'srcset'))for(const item of attr(node,'srcset').split(','))target(item.trim().split(/\s+/)[0],source,'asset');
    if(node.tagName==='script'&&/site-preview-bootstrap|shop-pilot\.js/.test(attr(node,'src')||''))failures.push({type:'preview-script',source});
  }
  const report={pages:documents.size,files:manifest.files.length,failures};
  return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  if(!process.argv[2])throw Error('Pass the generated release directory');
  const report=checkRelease(process.argv[2]);console.log(JSON.stringify(report,null,2));if(report.failures.length)process.exitCode=1;
}
