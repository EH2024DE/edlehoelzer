const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--enable-unsafe-swiftshader']});
 try{
  for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
   const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+(en?'/en/':'/'),{waitUntil:'domcontentloaded'});
   assert.deepEqual(await page.locator('[data-home-topic-link] h2').allTextContents(),en?['Collection','Made to measure','Erbstück','Corporate gifts']:['Kollektion','Nach Maß','Erbstück','Firmengeschenke']);
   assert.ok((await page.locator('.atelierHomeRoom a').getAttribute('href')).startsWith('/brettvorschau/'));
   await page.goto(base+(en?'/en/atelier-preview/':'/atelier-vorschau/'),{waitUntil:'domcontentloaded'});
   await page.locator('[data-atelier-group=serving]').click();
   let ids=await page.locator('[data-atelier-piece]:visible').evaluateAll(nodes=>nodes.map(n=>n.dataset.atelierPiece));
   for(const id of ['4370769708','1850610674','4417507555','1776273564'])assert.ok(!ids.includes('product-'+id));
   for(const id of ['1827805914','1848021568','4440690649','4389604739','4398179153'])assert.ok(ids.includes('product-'+id),id);
   await page.locator('[data-atelier-archive]').check();
   assert.ok(await page.locator('[data-atelier-piece="product-1818046728"]').isVisible());
   assert.equal(await page.locator('.atelierCollectionStory').count(),0);
   await page.goto(base+(en?'/en/atelier-preview/erbstueck/':'/atelier-vorschau/erbstueck/'),{waitUntil:'domcontentloaded'});
   const engraving=page.locator('[data-shop-products] [name=engraving]');await engraving.check();
   const form=engraving.locator('xpath=ancestor::form');await form.locator('[name=engravingText]').fill('Für Generationen');await form.locator('[name=engravingPosition]').selectOption('edge-front-left');
   assert.ok(await form.locator('[name=engravingFont]').isVisible());
   for(const image of await page.locator('.atelierStoryArchive img').all()){const box=await image.boundingBox();assert.ok(Math.abs(box.height-box.width)<1);assert.equal(await image.evaluate(el=>getComputedStyle(el).objectFit),'contain');}
   const notice=page.locator('.legalGuaranteePreview').first();await notice.waitFor();assert.ok(await notice.isVisible());await notice.click();assert.ok(await page.locator('.legalGuaranteeDialog').isVisible());await page.keyboard.press('Escape');await page.locator('.legalGuaranteeDialog').waitFor({state:'detached'});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
   if([375,1440].includes(width))await page.screenshot({path:`/tmp/edle-shop-preview/owner-erbstueck-${en?'en':'de'}-${width}.png`,fullPage:true});
   await page.close();console.log(`PASS owner refinements ${en?'EN':'DE'} ${width}`);
  }
  for(const width of [375,1440]){
   const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/handgefertigte-holzprodukte-fuer-unternehmen/',{waitUntil:'domcontentloaded'});
   for(const box of await page.locator('.b2b-product__thumb').all()){const r=await box.boundingBox();assert.ok(Math.abs(r.width/r.height-1.5)<.02);}
   for(const image of await page.locator('.b2b-products img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());}
   await page.locator('.b2b-products').screenshot({path:`/tmp/edle-shop-preview/owner-b2b-${width}.png`});
   await page.goto(base+'/brettvorschau/?listing=4370769708',{waitUntil:'domcontentloaded'});
   const tips=page.getByRole('button',{name:'Alles klar',exact:true});if(await tips.isVisible())await tips.click();
   await page.locator('#renderer canvas').waitFor();await page.waitForTimeout(1800);
   await page.locator('#renderer').scrollIntoViewIfNeeded();
   assert.equal(await page.locator('body.atelierWorktop').count(),1);assert.ok(await page.locator('[data-menu-open]').isVisible());
   const before=await page.locator('#renderer').screenshot();
   await page.locator('#angle').evaluate(el=>{el.value='40';el.dispatchEvent(new Event('input',{bubbles:true}));});await page.waitForTimeout(400);
   const after=await page.locator('#renderer').screenshot();assert.notDeepEqual(before,after,'3D scene responds to rotation');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
   await page.screenshot({path:`/tmp/edle-shop-preview/owner-worktop-${width}.png`,fullPage:true});await page.close();console.log('PASS B2B and live 3D preview '+width);
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
