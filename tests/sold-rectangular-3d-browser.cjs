const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
 try{for(const en of [false,true]){
  const page=await browser.newPage({viewport:{width:430,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170';
  await page.goto(base+(en?'/en/atelier-preview/':'/atelier-vorschau/'));
  const rectangular=page.locator('[data-atelier-piece="product-1803930088"]');assert.equal(await rectangular.isVisible(),false);
  assert.ok(await page.locator('[data-atelier-piece="product-1776273564"]').isVisible());
  await page.locator('[data-atelier-archive]').check();assert.ok(await rectangular.isVisible());assert.match(await rectangular.innerText(),/Vergeben|Sold/);
  await page.goto(base+(en?'/en/shop-preview/':'/shop-vorschau/')+'?product=product-1803930088');await page.locator('.pilotSold').waitFor();assert.equal(await page.locator('[data-add]').count(),0);
  await page.goto(base+'/brettvorschau/?listing=1803930088'+(en?'&lang=en':''));await page.waitForURL('**/produkte/3d-stirnholz-nussbaum-weitere-1803930088/');
  assert.match(await page.locator('main').innerText(),/Verkauft|Sold/);assert.deepEqual(errors,[]);await page.close();console.log('PASS rectangular 3D sold, square retained '+(en?'EN':'DE'));
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
