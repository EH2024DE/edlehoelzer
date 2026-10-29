import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {buildSite} from './build-site.mjs';

const directory=path.join(os.tmpdir(),'edle-design-audit');
buildSite(directory);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.wasm':'application/wasm'};
const server=http.createServer((request,response)=>{
  if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);return response.end();}
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const file=path.resolve(directory,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(directory+path.sep)||!fs.statSync(file).isFile())throw Error('not found');
    response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'});
    if(request.method==='HEAD')return response.end();
    fs.createReadStream(file).pipe(response);
  }catch{response.writeHead(404);response.end('Not found');}
});
server.listen(8173,'127.0.0.1',()=>console.log('Read-only design audit: http://127.0.0.1:8173'));
