const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8171';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const width of [375,1440])for(const [route,en,selector]of [
      ['/handgefertigte-holzprodukte-fuer-unternehmen/',false,'.b2b-form'],
      ['/en/',true,'#b2b form'],
      ['/schneidebretter-aus-holz-gastronomie/',false,'[data-board-inquiry]'],
      ['/en/wooden-cutting-boards-for-restaurants/',true,'[data-board-inquiry]']
    ]){
      const page=await browser.newPage({viewport:{width,height:900}}),errors=[],submissions=[];
      let statusCode=500;
      page.on('pageerror',error=>errors.push(error.message));
      // Intercept every provider request: no test enquiry leaves this browser.
      await page.route('https://formspree.io/**',async route=>{
        if(route.request().method()==='POST')submissions.push(route.request().postData());
        await route.fulfill({status:route.request().method()==='OPTIONS'?204:statusCode,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Accept, Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS'},contentType:'application/json',body:route.request().method()==='OPTIONS'?'':JSON.stringify({ok:statusCode===200})});
      });
      await page.goto(base+route);
      const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
      const form=page.locator(selector),status=form.locator('[role=status]');
      await form.locator('[name=name]').fill('Local test');
      await form.locator('[name=email]').fill('test@example.invalid');
      const quantity=form.locator('[name=quantity]');
      if(await quantity.evaluate(node=>node.tagName==='SELECT'))await quantity.selectOption({index:1});else await quantity.fill('20');
      await form.locator('[name=budget]').fill('1500');
      await form.locator('[name=message]').fill('Local intercepted test, never sent.');
      assert.equal(await form.evaluate(node=>node.checkValidity()),false,'budget basis is mandatory');
      await form.locator('[name=budget_basis]').selectOption(en?'entire project':'Gesamtprojekt');
      assert.equal(await form.evaluate(node=>node.checkValidity()),true);
      await form.locator('[type=submit]').click();
      await status.filter({hasText:en?'could not be confirmed':'konnte nicht bestätigt'}).waitFor();
      assert.equal(await form.locator('[name=name]').inputValue(),'Local test','failed request keeps entries');
      statusCode=200;
      await form.locator('[type=submit]').click();
      await status.filter({hasText:en?'has been submitted':'wurde übermittelt'}).waitFor();
      assert.equal(await form.locator('[name=name]').inputValue(),'');
      assert.equal(submissions.length,2);
      assert.ok(submissions[1].includes('budget_basis'));assert.ok(submissions[1].includes('1500'));
      assert.deepEqual(errors,[]);assert.ok(page.url().startsWith(base+route));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.close();console.log(`PASS ${route} ${width}: required budget, failed retry, confirmed reset, no real submission`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
