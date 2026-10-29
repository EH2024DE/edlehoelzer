const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8172';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{for(const width of [375,1440]){
    const page=await browser.newPage({viewport:{width,height:900}}),errors=[],posts=[],violations=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(request.method()==='POST')posts.push(request.url());});
    page.on('console',entry=>{if(entry.type()==='error'&&/Content Security Policy|violates.*directive/i.test(entry.text()))violations.push(entry.text());});
    await page.route('https://formspree.io/**',route=>route.abort());
    for(const route of ['/','/en/search/?q=walnut','/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/','/handgefertigte-holzprodukte-fuer-unternehmen/']){
      const response=await page.goto(base+route);
      assert.equal(response.status(),200,route);
      assert.match(response.headers()['x-robots-tag'],/noindex/);
      assert.ok(!response.headers().etag,'rewritten nonce HTML has no stale entity validator');
      await page.locator('[data-staging-notice]').waitFor();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route);
      assert.equal(await page.locator('script[src*="consent-manager"]').count(),0);
      if(route.includes('/produkte/')){
        await page.locator('.productPreview__thumb').first().waitFor();
        const buy=page.locator('.productPreview a[href*="etsy.com"]').first();
        await buy.click();assert.ok(page.url().startsWith(base));assert.equal((await page.context().pages()).length,1);
        await page.locator('.productPreview__thumb').nth(1).click();
        const play=page.locator('[data-preview-video-play]');if(await play.isVisible())await play.click();
        await page.locator('.productPreview__mainMedia video').waitFor();
      }
      if(route.includes('unternehmen')){
        const form=page.locator('.b2b-form');
        for(const [name,value]of [['name','Staging test'],['email','test@example.invalid'],['quantity','20'],['budget','1500'],['message','Synthetic test only']])await form.locator(`[name=${name}]`).fill(value);
        await form.locator('[name=budget_basis]').selectOption('Gesamtprojekt');
        await form.locator('[type=submit]').click();
        assert.equal(posts.length,0,'staging never submits a real enquiry');
      }
    }
    assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);assert.deepEqual(posts,[]);
    await page.close();console.log(`PASS ${width}: Workers runtime, CSP, noindex, gallery, payment/contact guards`);
  }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
