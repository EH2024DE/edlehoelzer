const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const browser=await chromium.launch();
 try{for(const width of [375,430,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
  for(const route of ['/','/en/']){
   await page.goto(base+route,{waitUntil:'networkidle'});
   const pending=page.locator('[data-ds-reveal=pending]').last();assert.ok(await pending.count(),route+' has pending sections');
   assert.equal(await pending.evaluate(n=>getComputedStyle(n).opacity),'0');
   const target=await pending.elementHandle();await target.evaluate(n=>n.scrollIntoView({block:'center'}));
   await page.waitForFunction(n=>n.dataset.dsReveal==='visible',target);
   await page.waitForTimeout(500);
   assert.equal(await target.evaluate(n=>getComputedStyle(n).opacity),'1');
   await page.goto(base+route,{waitUntil:'networkidle'});await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(()=>!document.querySelector('[data-ds-reveal=pending]'));
   assert.ok(await page.locator('main .reveal-on-scroll').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).opacity==='1')));
   await page.emulateMedia({reducedMotion:'no-preference'});
  }
  for(const route of ['/schneidebrett-fachwerk-eiche/','/en/erbstueck/']){
   await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>scrollTo(0,1500));
   assert.ok(await page.locator('.mobileStickyCta,.erbstueckStickyCta').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).display==='none')));
   const height=await page.locator('.erbstueckHero .btn').first().evaluate(n=>n.getBoundingClientRect().height);assert.ok(height>=44&&height<=70,height);
  }
  await page.goto(base+'/baumspende.html',{waitUntil:'networkidle'});
  assert.deepEqual(await page.locator('[data-free-plaetze]').allTextContents(),['2','2']);
  await page.locator('[data-free-plaetze]').first().scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.close();console.log('PASS homepage reveal, reduced motion, Erbstueck CTA, donation capacity',width);
 }
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base+'/');
 assert.ok(await nojs.locator('.reveal-on-scroll').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).opacity==='1')));await nojs.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
