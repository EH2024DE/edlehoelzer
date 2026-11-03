const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const{references}=await import('../scripts/build-design-reference.mjs');const browser=await chromium.launch();
 try{
  for(const width of [375,1440])for(const en of [false,true]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const fonts=[];page.on('request',r=>{if(/fonts\.googleapis|fonts\.gstatic/.test(r.url()))fonts.push(r.url());});
   const ref=references.find(r=>r.template==='product'&&r.route.startsWith('/en/')===en);
   await page.goto(base+ref.route,{waitUntil:'networkidle'});await page.locator('[data-product-package]').waitFor();
   const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
   await page.locator('#menuButton').click();assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'true');
   await page.locator('#menuCloseButton').click();assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'false');
   const thumbs=page.locator('[data-preview-media]');assert.ok(await thumbs.count()>2);
   const before=await page.locator('[data-preview-main]').getAttribute('src');await thumbs.nth(2).click();
   assert.notEqual(await page.locator('[data-preview-main]').getAttribute('src'),before);
   const more=page.locator('.readMore__button').first();await more.click();assert.equal(await more.getAttribute('aria-expanded'),'true');await more.click();assert.equal(await more.getAttribute('aria-expanded'),'false');
   const price=page.locator('[data-purchase-price]').first();assert.ok(await price.isVisible());
   assert.ok(await page.locator('.productPreview__facts').isVisible());assert.equal(await page.locator('[data-product-etsy]').count(),1);
   assert.deepEqual(fonts,[]);await page.close();console.log(`PASS product/menu/gallery/read-more ${en?'EN':'DE'} ${width}`);
  }
  for(const ref of references){
   const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:375,height:900}});await page.goto(base+ref.route);
   assert.equal(await page.locator('main h1').count(),1);assert.ok(await page.locator('main h1').isVisible());
   if(ref.template==='product'){assert.ok(await page.locator('.productPreview__facts').isVisible());await page.locator('.productPreview__detail > summary').click();assert.ok(await page.locator('.productPreview__detail').evaluate(n=>n.open));}
   await page.close();
  }
  console.log('PASS six no-JavaScript reference fallbacks');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
