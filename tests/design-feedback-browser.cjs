const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const browser=await chromium.launch(),output='/tmp/edle-design-feedback';fs.mkdirSync(output,{recursive:true});
 try{
  for(const width of [375,430,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   for(const [route,selector] of [['/atelier/','.erbstueckFeature'],['/schneidebrett-nach-mass/','.editorialTopic'],['/en/erbstueck/','.erbstueckStoryGallery']]){
    await page.goto(base+route,{waitUntil:'networkidle'});
    const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
    assert.ok(await page.locator(selector).count(),route+' component missing');
    if(selector==='.editorialTopic'){
      const topic=page.locator(selector).filter({has:page.locator('.referenceProducts')}).first();
      if(await topic.count()){await topic.locator('summary').first().click();assert.equal(await topic.locator('.referenceProducts a').count(),3);}
      else{const first=page.locator(selector).first();await first.locator('summary').click();assert.ok(await first.evaluate(n=>n.open));}
    }
    if(selector==='.erbstueckFeature'){
      assert.equal(await page.locator('.erbstueckFeature h2').evaluate(n=>getComputedStyle(n).color),'rgb(255, 255, 255)');
      assert.equal(await page.locator('.erbstueckBadges li').first().evaluate(n=>getComputedStyle(n).borderRadius),'0px');
    }
    if(selector==='.erbstueckStoryGallery')assert.equal(await page.locator(selector+' figure').count(),19);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),route+' overflow');
    await page.locator(selector).first().scrollIntoViewIfNeeded();
    await page.locator(selector).first().evaluate(async n=>{await Promise.all([...n.querySelectorAll('img')].slice(0,3).map(img=>Promise.race([img.decode().catch(()=>{}),new Promise(r=>setTimeout(r,2000))])));});
    await page.screenshot({path:output+'/'+route.split('/').filter(Boolean).join('-')+'-'+width+'.png'});
   }
   for(const en of [false,true]){
    await page.goto(base+(en?'/en/products.html':'/produkte.html'),{waitUntil:'networkidle'});
    const heading=page.locator('[data-finder-question]');await page.locator('[data-option]').first().waitFor();
    const before=await heading.innerText();await page.locator('[data-option]').first().click();
    await page.waitForFunction(old=>document.querySelector('[data-finder-question]').textContent!==old,before);
    assert.ok(await page.locator('[data-finder-prev]').isEnabled());await page.locator('[data-finder-prev]').click();assert.equal(await heading.innerText(),before);
    const positions=await page.locator('[data-product-finder]').evaluate(n=>['.finderShell__top','.finderOptions','.finderNav','.finderPool'].map(s=>n.querySelector(s).getBoundingClientRect().top));
    assert.ok(positions[0]<positions[1]&&positions[1]<positions[2]&&positions[2]<positions[3],positions.join(','));
    const image=await page.locator('.productsHero__figure img').evaluate(n=>{const p=n.parentElement.getBoundingClientRect(),r=n.getBoundingClientRect();return {p:p.height,h:r.height};});assert.ok(Math.abs(image.p-image.h)<3);
   }
   await page.goto(base+'/produkte/3d-stirnholz-nussbaum-weitere-1803930088/',{waitUntil:'networkidle'});await page.locator('[data-ds-option-total]').waitFor();
   const option=page.locator('[data-purchase-option="engraving"]');if(await option.count()){
     const before=await page.locator('[data-ds-option-total] [data-purchase-price]').innerText();await option.check();
     assert.notEqual(await page.locator('[data-ds-option-total] [data-purchase-price]').innerText(),before);
     assert.equal(await page.locator('[data-ds-option-total] [data-purchase-price]').innerText(),await page.locator('[data-purchase-price]').first().innerText());
   }
   await page.close();console.log('PASS feedback components, automatic finder, back and live price',width);
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
