import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildSite} from './build-site.mjs';
import {checkRelease} from './check-release.mjs';
import {ROOT} from '../tools/shop-server/catalog.mjs';

// Keep the deployed static-only handler while the separate shop backend is unfinished.
const handlerCommit='f6b4756d3a67dfdb8ae87f7fcae59d2525696f3b';
const directory=path.join(os.tmpdir(),'edle-design-staging'),assets=path.join(directory,'site');
buildSite(assets);
const report=checkRelease(assets);if(report.failures.length)throw Error('Design release validation failed');
const main=path.join(directory,'static-worker.mjs');
fs.writeFileSync(main,execFileSync('git',['show',handlerCommit+':tools/cloudflare-shop/worker.mjs'],{cwd:ROOT}));
const config={name:'edle-hoelzer-shop-staging',main,compatibility_date:'2026-10-29',workers_dev:true,preview_urls:true,vars:{SHOP_ENV:'staging'},observability:{enabled:false},assets:{directory:assets,binding:'ASSETS',run_worker_first:true}};
const configPath=path.join(directory,'wrangler.json');fs.writeFileSync(configPath,JSON.stringify(config,null,2));
console.log(JSON.stringify({configPath,pages:report.pages,files:report.files,checkoutEnabled:false,handlerCommit}));
