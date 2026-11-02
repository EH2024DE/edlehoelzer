import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {root} from './audit-design-system.mjs';
const directory=path.join(os.tmpdir(),'edle-design-system-reference');
const port=Number(process.env.PORT||8184);
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Read-only preview');}
  const url=new URL(req.url,'http://localhost');let pathname;
  try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);return res.end();}
  const before=pathname.startsWith('/before/');if(before)pathname=pathname.slice(7);
  const base=before?root:directory;
  const relative=pathname.replace(/^\//,'')+(pathname.endsWith('/')?'index.html':'');
  if(relative.split('/').some(p=>p.startsWith('.')||['node_modules','tools','docs','scripts','tests'].includes(p))){res.writeHead(404);return res.end();}
  const file=path.resolve(base,relative);
  if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  if(req.method==='HEAD')return res.end();
  if(file.endsWith('.html')){
    const guard='<script>document.addEventListener("submit",function(e){e.preventDefault();e.stopImmediatePropagation();},true);</script>';
    return res.end(fs.readFileSync(file,'utf8').replace('</head>',guard+'</head>'));
  }
  fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Reference preview: http://127.0.0.1:${port} (before: /before/)`));
