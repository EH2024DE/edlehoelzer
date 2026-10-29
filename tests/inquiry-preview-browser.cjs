const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
 try{for(const width of [375,430,768,1440])for(const en of [false,true]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[],submissions=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/formspree.io/**',route=>{submissions.push(route.request().url());return route.abort();});
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:8170')+(en?'/en/#b2b':'/handgefertigte-holzprodukte-fuer-unternehmen/#anfrage'),{waitUntil:'domcontentloaded'});
  const form=en?page.locator('#b2b form'):page.locator('.b2b-form');
  await form.scrollIntoViewIfNeeded();
  for(const name of ['quantity','budget','budget_basis'])assert.ok(await form.locator(`[name=${name}]`).isVisible());
  assert.equal(await form.evaluate(el=>el.checkValidity()),false);
  await form.locator('[name=name]').fill('Preview Test');await form.locator('[name=email]').fill('preview@example.com');
  await form.locator('[name=quantity]').fill('20');await form.locator('[name=budget]').fill('1500');
  await form.locator('[name=message]').fill('20 gift sets for our team');
  assert.equal(await form.evaluate(el=>el.checkValidity()),false,'budget basis required');
  await form.locator('[name=budget_basis]').selectOption(en?'entire project':'Gesamtprojekt');
  assert.equal(await form.evaluate(el=>el.checkValidity()),true);
  const data=await form.evaluate(el=>Object.fromEntries(new FormData(el)));assert.equal(data.quantity,'20');assert.equal(data.budget,'1500');
  for(const element of await form.locator('label,input,select,textarea,summary,button').all()){
   const family=await element.evaluate(el=>getComputedStyle(el).fontFamily);assert.ok(family.includes('Atelier'),family);
  }
  await form.locator('button[type=submit]').click();await page.waitForTimeout(100);
  assert.match(await form.innerText(),/Vorschau|Preview/);assert.deepEqual(submissions,[]);assert.deepEqual(errors,[]);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await form.screenshot({path:`/tmp/edle-shop-preview/inquiry-${en?'en':'de'}-${width}.png`});
  console.log(`PASS ${en?'EN':'DE'} ${width}: fields, required validation, typography and safe preview submission`);await page.close();
 }
 for(const route of ['/atelier/','/schneidebrett-nach-mass/','/schneidebretter-aus-holz-gastronomie/','/en/wooden-cutting-boards-for-restaurants/','/baumspende.html']){
  const page=await browser.newPage({viewport:{width:375,height:900}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:8170')+route,{waitUntil:'domcontentloaded'});
  const form=page.locator('form[action*="formspree"]');assert.equal(await form.count(),1);
  for(const element of await form.locator('label,input,select,textarea,summary,button').all())assert.ok((await element.evaluate(el=>getComputedStyle(el).fontFamily)).includes('Atelier'),route);
  if(route.includes('gastronomie')||route.includes('restaurants')){
   await form.locator('[name=product_idea]').selectOption(route.startsWith('/en/')?'Bespoke solution':'Individuelle Sonderlösung');
   assert.ok(await form.locator('[name=message]').isVisible());assert.equal(await form.locator('[name=message]').getAttribute('required'),'');
   assert.equal(await form.locator('[name=budget_basis]').getAttribute('required'),'');
  }
  assert.deepEqual(errors,[]);await page.close();console.log('PASS secondary form '+route);
 }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
