const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8170';
require('node:fs').mkdirSync('/tmp/edle-shop-preview',{recursive:true});
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
      const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(base+(en?'/en/products.html':'/produkte.html'));
      const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
      await page.locator('.productCard').first().waitFor();
      const form=page.locator('[data-product-filters]');
      const select=name=>form.locator('[name="'+name+'"]');
      const original=await page.locator('.productCard').count();
      assert.ok(original>25);
      await select('construction').selectOption('end');
      await select('groove').selectOption('included');
      await select('wood').selectOption('nussbaum');
      await page.locator('[data-catalog-category="tools"]').click();
      assert.equal(await select('category').inputValue(),'tools');
      assert.equal(await select('construction').inputValue(),'all');
      assert.equal(await select('groove').inputValue(),'all');
      assert.equal(await select('wood').inputValue(),'all');
      assert.ok(!await select('construction').isVisible());
      assert.equal(await page.locator('.productCard').count(),3);
      await select('wood').selectOption('eiche');
      await select('category').selectOption('care');
      assert.ok(!await select('wood').isVisible());
      assert.equal(await page.locator('.productCard').count(),2);
      await select('category').selectOption('board');
      assert.equal(await select('wood').inputValue(),'all');
      await select('price').selectOption('under50');
      await select('construction').selectOption('block');
      await select('wood').selectOption('zwetschge');
      assert.equal(await page.locator('.productCard').count(),0);
      assert.ok(await page.locator('.productEmpty').isVisible());
      await form.locator('[type="reset"]').click();
      await page.waitForFunction(count=>document.querySelectorAll('.productCard').length===count,original);
      assert.equal(await select('category').inputValue(),'all');
      assert.equal(await page.locator('[data-catalog-category="all"]').getAttribute('aria-pressed'),'true');
      const count=await page.locator('[data-catalog-count]').innerText();
      assert.ok(count.startsWith(String(original)));
      await page.keyboard.press('Tab');
      await page.locator('[data-catalog-category="board"]').focus();
      assert.equal(await page.locator('[data-catalog-category="board"]').evaluate(node=>getComputedStyle(node).outlineStyle),'solid');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow');
      assert.deepEqual(errors,[]);
      if([375,1440].includes(width))await page.screenshot({path:`/tmp/edle-shop-preview/catalog-${en?'en':'de'}-${width}.png`});
      await page.close();console.log(`PASS ${en?'EN':'DE'} ${width}: groups, hidden filters, empty, reset, count, focus`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
