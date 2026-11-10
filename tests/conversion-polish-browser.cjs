const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright'),engine=process.env.BROWSER_ENGINE||'chromium';
const root='/tmp/edle-revision-a-build',out='/tmp/edle-conversion-polish-'+engine;fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:process.env.CHROMIUM_PATH}:{});
 const product=require('../products.json').products.find(p=>p.listingId==='1776273564');let renders=0;
 try{for(const width of [375,430,1440])for(const route of ['/','/en/',product.productPath,'/en'+product.productPath]){
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('[data-consent-necessary]').click();await page.evaluate(()=>document.fonts.ready);
  if(route==='/'||route==='/en/'){
   assert.equal(await page.locator('.hero [data-ds-added=hero-trust]').count(),0);
   const proof=page.locator('.hero__proof');assert.equal(await proof.count(),1);assert.ok(await proof.isVisible());
   const heroBox=await page.locator('.hero').boundingBox(),proofBox=await proof.boundingBox(),ctaBox=await page.locator('.hero__actions a').first().boundingBox();
   assert.ok(proofBox.y>=ctaBox.y+ctaBox.height+12);assert.ok(proofBox.y+proofBox.height<=heroBox.y+heroBox.height);
   await page.locator('.hero').screenshot({path:path.join(out,'hero-'+width+'-'+(route==='/en/'?'en':'de')+'.png')});
   const reviewTop=await page.locator('.reviewTrust').evaluate(n=>n.getBoundingClientRect().top);
   const headingTop=await page.locator('[data-review-headline]').evaluate(n=>n.getBoundingClientRect().top);
   assert.ok(headingTop-reviewTop>=40,'review heading has breathing room after the dark section');
   assert.equal(await page.locator('[data-review-trust-strip] .eyebrow').isVisible(),false);
   assert.ok((await page.locator('.reviewCard__meta').first().textContent()).match(/\d{2}[./]\d{2}[./]2026/));
   const action=page.locator('.closingHero .btn--emphasis');await action.scrollIntoViewIfNeeded();
   assert.equal(await action.evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(255, 255, 255)');
   for(const link of await page.locator('.homeEditorialLinks a,.hero__actions a').all())if(await link.isVisible())assert.ok((await link.boundingBox()).height>=44);
   await page.locator('.materialProofBlock').screenshot({path:path.join(out,'proof-'+width+'-'+(route==='/en/'?'en':'de')+'.png')});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const events=await page.evaluate(()=>{
    const calls=[];window.EdleAnalytics={track:(name,data)=>calls.push({name,data})};
    for(const s of ['.hero__actions a','.productCard__cta']){const a=document.querySelector(s);a.addEventListener('click',e=>e.preventDefault());a.click();}return calls;
   });
   assert.equal(events.filter(e=>e.name==='homepage_hero_click').length,1);assert.equal(events.filter(e=>e.name==='homepage_product_open').length,1);
  }else{
   const action=page.locator('.productPreview__earlyPurchase a[data-etsy-link]');await action.waitFor();await action.scrollIntoViewIfNeeded();
   const bar=page.locator('.productPurchaseBar');await page.waitForFunction(()=>document.querySelector('.productPurchaseBar').hidden);
   assert.equal(await page.locator('.productPurchaseTrust').count(),1);
   assert.ok(await page.locator('.productPurchaseTrust').evaluate(n=>n.previousElementSibling.classList.contains('productPreview__earlyPurchase')));
   const room=page.locator('.productPreview__roomPrompt .btn');assert.equal(await room.evaluate(n=>getComputedStyle(n).backgroundColor),'rgba(0, 0, 0, 0)');
   if(width<760){
    await action.evaluate(n=>window.scrollTo(0,n.getBoundingClientRect().bottom+scrollY+30));await bar.locator('a').waitFor({state:'visible'});
    const events=await page.evaluate(()=>{const calls=[];window.EdleAnalytics={track:(name,data)=>calls.push({name,data})};for(const s of ['.productPreview__earlyPurchase a','.productPurchaseBar a','[data-etsy-policy]']){const a=document.querySelector(s);a.addEventListener('click',e=>e.preventDefault());a.click();}return calls;});
    assert.equal(events.filter(e=>e.name==='etsy_checkout_click').length,2);assert.equal(events.filter(e=>e.name==='product_preview_etsy_click').length,0);
    assert.deepEqual(events.filter(e=>e.name==='etsy_checkout_click').map(e=>e.data.placement),['main','sticky']);
    await action.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.productPurchaseBar').hidden);
   }else assert.equal(await bar.isVisible(),false);
   await page.locator('.productPreview__earlyPurchase').screenshot({path:path.join(out,'purchase-'+width+'-'+(route.startsWith('/en/')?'en':'de')+'.png')});
  }
  if(route!=='/'&&route!=='/en/')assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);renders++;await page.close();
 }console.log({passed:true,renders,out});}finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
