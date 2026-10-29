import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {buildSite} from '../../scripts/build-site.mjs';
import {checkRelease} from '../../scripts/check-release.mjs';

export const directory=path.join(os.tmpdir(),'edle-hoelzer-cloudflare-staging');
export const configPath=path.join(directory,'wrangler.json');

export function buildStaging(){
  const assets=path.join(directory,'site');
  const build=buildSite(assets),report=checkRelease(assets);
  if(report.failures.length)throw Error('Static release checks failed');
  if(report.files>20000)throw Error('Asset count requires a separate plan review');
  for(const file of JSON.parse(fs.readFileSync(path.join(assets,'release-manifest.json'))).files)if(fs.statSync(path.join(assets,file)).size>25*1024*1024)throw Error('Asset exceeds staging upload limit: '+file);
  const config={
    name:'edle-hoelzer-shop-disabled',
    main:fileURLToPath(new URL('./worker.mjs',import.meta.url)),
    compatibility_date:'2026-10-29',
    workers_dev:false,
    preview_urls:false,
    assets:{directory:assets,binding:'ASSETS',run_worker_first:true},
    vars:{SHOP_ENV:'disabled'},
    observability:{enabled:false},
    env:{staging:{name:'edle-hoelzer-shop-staging',workers_dev:true,preview_urls:true,vars:{SHOP_ENV:'staging'},assets:{directory:assets,binding:'ASSETS',run_worker_first:true}}}
  };
  fs.writeFileSync(configPath,JSON.stringify(config,null,2)+'\n');
  return {...build,configPath,checkoutEnabled:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(buildStaging(),null,2));
