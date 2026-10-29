const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
 try{
  for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base+(en?'/en/':'/'));
   for(const image of await page.locator('.atelierHomeTopic>img').all()){
    const box=await image.boundingBox();assert.ok(Math.abs(box.width-box.height)<1,'square topic photo');
   }
   await page.locator('.atelierHomeTopics').scrollIntoViewIfNeeded();
   await page.screenshot({path:`/tmp/edle-shop-preview/home-topics-${en?'en':'de'}-${width}.png`});
   await page.goto(base+(en?'/en/products.html':'/produkte.html'));
   for(const [index,value]of ['bbq','large','stationary','light','premium'].entries()){
    await page.locator(`[data-option="${value}"]`).click();
    if(index<4)await page.waitForFunction(previous=>!document.querySelector(`[data-option="${previous}"]`),value);
   }
   await page.locator('[data-finder-result]:not([hidden])').waitFor();
   const near=page.locator('[data-finder-pool] .is-near-match .finderPool__inspect');
   if(await near.count()){
    await near.first().click();
    assert.ok(await page.locator('[data-finder-explanation]').isVisible());
   }
   await page.locator('[data-finder-edit="budget"]').click();
   await page.locator('[data-option="max100"]').click();
   await page.locator('[data-finder-result]:not([hidden])').waitFor();
   await page.goto(base+(en?'/en/refurbishment/':'/schneidebrett-aufbereiten/'));
   assert.equal(await page.locator('.refurbCompare').count(),1);
   assert.equal(await page.locator('.beforeAfterGallery').count(),0);
   const sources=await page.locator('main img').evaluateAll(images=>images.map(image=>image.getAttribute('src')));
   assert.equal(new Set(sources).size,sources.length);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no page overflow');
   if(!en){await page.locator('.refurbPackageDetails summary').first().click();assert.ok(await page.locator('.refurbPackageDetails .tier-includes').first().isVisible());}
   await page.screenshot({path:`/tmp/edle-shop-preview/refurb-compact-${en?'en':'de'}-${width}.png`,fullPage:true});
   assert.deepEqual(errors,[]);await page.close();console.log(`PASS ${en?'EN':'DE'} ${width}: auto finder, square topics, compact refurbishment`);
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
