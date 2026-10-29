import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../tools/cloudflare-shop/worker.mjs';
import fs from 'node:fs';
import {buildStaging,configPath} from '../tools/cloudflare-shop/build.mjs';

test('staging cannot serve the production domain, activate payments or accept writes',async()=>{
  for(const host of ['edlehoelzer.de','www.edlehoelzer.de'])assert.equal((await worker.fetch(new Request('https://'+host+'/'),{SHOP_ENV:'staging'})).status,503);
  assert.equal((await worker.fetch(new Request('https://staging.example/'),{})).status,503);
  for(const path of ['/api/shop/checkout','/api/shop/webhook','/api/shop/uploads']){
    const res=await worker.fetch(new Request('https://staging.example'+path,{method:'POST',body:'test'}),{SHOP_ENV:'staging'});assert.equal(res.status,503);
  }
  const health=await worker.fetch(new Request('https://staging.example/api/shop/health'),{SHOP_ENV:'staging'});
  assert.equal((await health.json()).checkoutEnabled,false);assert.match(health.headers.get('X-Robots-Tag'),/noindex/);
});
test('staging protects private paths and applies headers to static responses',async()=>{
  const env={SHOP_ENV:'staging',ASSETS:{fetch:async()=>new Response('body',{headers:{'Content-Type':'text/css'}})}};
  for(const path of ['/tools/shop-server/server.mjs','/docs/shop-go-live-approval.md','/.env','/data/shop-pilot.json','/shop-vorschau/','/en/shop-preview/','/release-manifest.json'])assert.equal((await worker.fetch(new Request('https://staging.example'+path),env)).status,404,path);
  const css=await worker.fetch(new Request('https://staging.example/styles.css'),env);
  assert.equal(await css.text(),'body');assert.equal(css.headers.get('X-Content-Type-Options'),'nosniff');assert.equal(css.headers.get('X-Frame-Options'),'DENY');
  const robots=await worker.fetch(new Request('https://staging.example/robots.txt'),env);assert.match(await robots.text(),/Disallow: \//);
});
test('Cloudflare build has no production route, secret or checkout permission',()=>{
  buildStaging();const config=JSON.parse(fs.readFileSync(configPath));
  assert.equal(config.workers_dev,false);assert.equal(config.vars.SHOP_ENV,'disabled');assert.equal(config.routes,undefined);
  assert.equal(config.env.staging.vars.SHOP_ENV,'staging');assert.equal(config.env.staging.assets.run_worker_first,true);
  assert.ok(!JSON.stringify(config).includes('STRIPE_SECRET_KEY'));
});
