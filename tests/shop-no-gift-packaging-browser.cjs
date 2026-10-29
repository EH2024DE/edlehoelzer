const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
 try{for(const en of [false,true])for(const width of [375,1440]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('edle-shop-pilot-cart-v1',JSON.stringify([
   {sku:'dough-scraper',wood:'Eiche',quantity:2,bundleId:'12345678-1234-1234-1234-123456789abc'},
   {sku:'butter-knife',wood:'Nussbaum',quantity:1,bundleId:'12345678-1234-1234-1234-123456789abc'}
  ])));
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:8170')+(en?'/en/shop-preview/':'/shop-vorschau/'),{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('.pilotCartItem').length===2&&!document.querySelector('[data-shop-checkout]').disabled);
  assert.equal(await page.locator('[data-gift-options],[data-bundle-select],[data-create-bundle],.pilotSetTag').count(),0);
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('edle-shop-pilot-cart-v1')));
  assert.equal(stored.reduce((n,item)=>n+item.quantity,0),3);assert.ok(stored.every(item=>!('bundleId'in item)));
  assert.match(await page.locator('[data-shop-summary]').innerText(),en?/81\.16/:/81,16/);
  await page.locator('[data-step="-1"]').first().click();
  await page.waitForFunction(()=>document.querySelectorAll('[data-shop-count]')[0].textContent==='2');
  assert.deepEqual(errors,[]);console.log(`PASS no gift packaging ${en?'EN':'DE'} ${width}, legacy cart preserved`);await page.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
