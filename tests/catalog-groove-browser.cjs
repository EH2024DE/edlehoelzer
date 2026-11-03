const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const browser=await chromium.launch(),output='/tmp/edle-catalog-groove';fs.mkdirSync(output,{recursive:true});
 try{for(const width of (process.env.DESIGN_WIDTHS||'1440,375,430,768,1024').split(',').map(Number))for(const en of [false,true]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(en?'/en/products.html':'/produkte.html'),{waitUntil:'networkidle'});
  const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
  await page.locator('[data-products-grid] .productCard').first().waitFor();
  const rows=await page.locator('[data-products-grid]').evaluate(root=>{
   const rows={};for(const card of root.querySelectorAll('.productCard')){
    const key=Math.round(card.getBoundingClientRect().top),price=card.querySelector('.productCard__price'),cta=card.querySelector('.ctaRow>.btn'),compare=card.querySelector('.productCard__compareUtility');
    (rows[key]||=[]).push({price:price.getBoundingClientRect().top,cta:cta.getBoundingClientRect().top,compare:compare?.getBoundingClientRect().top});
   }return Object.values(rows);
  });
  for(const row of rows.filter(row=>row.length>1))for(const key of ['price','cta','compare']){
   const values=row.map(r=>r[key]).filter(Number.isFinite);assert.ok(Math.max(...values)-Math.min(...values)<2,`${en?'EN':'DE'} ${width} ${key}: ${values}`);
  }
  await page.goto(base+(en?'/en':'')+'/produkte/3d-stirnholz-nussbaum-weitere-1803930088/',{waitUntil:'networkidle'});
  const option=page.locator('[data-purchase-option="juiceGroove"]');await option.waitFor();
  assert.ok(await page.locator('[data-groove-choices]').isHidden());
  const price=await page.locator('[data-purchase-price]').first().innerText();await option.check();
  assert.ok(await page.locator('[data-groove-choices]').isVisible());
  assert.notEqual(await page.locator('[data-purchase-price]').first().innerText(),price);
  const selectedPrice=await page.locator('[data-purchase-price]').first().innerText();
  for(const value of ['continuous','left','right']){
   await page.locator(`[data-purchase-groove-style][value=${value}]`).check();
   assert.equal(await page.locator('[data-purchase-price]').first().innerText(),selectedPrice);
  }
  await page.locator('[data-groove-choices]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${output}/choices-${en?'en':'de'}-${width}.png`});
  assert.ok(await page.locator('[data-preview-src="/assets/juice-groove-guide.svg"]').count());
  await page.locator('[data-preview-src="/assets/juice-groove-guide.svg"]').click();
  const image=page.locator('.productPreview__mainMedia img[data-preview-main]');await image.evaluate(n=>n.decode());
  assert.equal(await image.evaluate(n=>getComputedStyle(n).objectFit),'contain');
  await option.uncheck();assert.ok(await page.locator('[data-groove-choices]').isHidden());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
  await page.goto(base+(en?'/en':'')+'/produkte/servierbrett-set-dreiteilig-4440690649/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-purchase-option="juiceGroove"]').count(),0);
  await page.goto(base+(en?'/en':'')+'/produkte/kleines-stirnholzbrett-verschiedene-holzdesigns-4599650982/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-product-etsy]').count(),0);
  assert.match(await page.locator('main').innerText(),en?/Sold/:/Verkauft/);
  await page.goto(base+(en?'/en/care.html':'/pflege.html'),{waitUntil:'networkidle'});
  assert.equal(await page.locator('.pflege-produkt__img').first().evaluate(n=>getComputedStyle(n).padding),'0px');
  assert.deepEqual(errors,[]);await page.close();console.log('PASS aligned catalogue, groove choices, sold state, care image',en?'EN':'DE',width);
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
