const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const en of [false,true]){
      const page=await browser.newPage({viewport:{width:375,height:900}}),errors=[];
      await page.addInitScript(()=>{
        Storage.prototype.getItem=function(){throw new DOMException('Disabled by browser settings','SecurityError');};
        Storage.prototype.setItem=function(){throw new DOMException('Disabled by browser settings','SecurityError');};
        Storage.prototype.removeItem=function(){throw new DOMException('Disabled by browser settings','SecurityError');};
      });
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(base+(en?'/en/shop-preview/':'/shop-vorschau/'));
      const balm=page.locator('form[data-add="care-balm"]');await balm.waitFor();
      await balm.locator('[type=submit]').click();
      await page.waitForFunction(()=>document.querySelector('[data-shop-mobile-total]').textContent.includes('12,69')||document.querySelector('[data-shop-mobile-total]').textContent.includes('12.69'));
      assert.ok((await page.locator('[data-atelier-count]').first().innerText()).includes('1'));
      const scraper=page.locator('form[data-add="dough-scraper"]');await scraper.locator('[type=submit]').click();
      await page.waitForFunction(()=>document.querySelector('[data-shop-mobile-total]').textContent.includes('42,17')||document.querySelector('[data-shop-mobile-total]').textContent.includes('42.17'));
      assert.equal(await page.locator('[data-atelier-count]').first().innerText(),'2');
      assert.deepEqual(errors,[]);await page.close();
      console.log(`PASS ${en?'EN':'DE'}: cart, fixed total and header count work with browser storage disabled`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
