const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8173';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.goto(base+(en?'/en/':'/'));
    const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
    const footer=page.locator('.atelierFooterSiteNav');
    await footer.scrollIntoViewIfNeeded();
    assert.ok(await footer.isVisible());
    assert.equal(await footer.locator('h2').count(),3);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('footer').screenshot({path:`/tmp/edle-footer-${en?'en':'de'}-${width}.png`});
    await page.locator('[data-menu-open]').click();
    const menu=page.locator('#atelier-menu[open]');await menu.waitFor();
    const guide=menu.getByRole('link',{name:en?'Guides & materials':'Wissen & Ratgeber',exact:true});
    await guide.scrollIntoViewIfNeeded();assert.ok(await guide.isVisible());
    await page.screenshot({path:`/tmp/edle-menu-${en?'en':'de'}-${width}.png`});
    await guide.click();await page.waitForURL('**/sitemap-uebersicht.html**');
    if(en)assert.ok(await page.locator('#english-topics').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.close();console.log(`PASS navigation ${en?'EN':'DE'} ${width}`);
  }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
