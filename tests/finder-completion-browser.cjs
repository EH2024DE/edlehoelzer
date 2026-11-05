const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.FINDER_URL||'http://127.0.0.1:8817';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const width of [390,1440])for(const lang of ['de','en'])for(const budget of ['max100','max250','premium','open']){
      const page=await browser.newPage({viewport:{width,height:844}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+(lang==='de'?'/produkte.html':'/en/products.html'));
      await page.locator('[data-option="breakfast"]').waitFor();
      if(await page.locator('[data-consent-necessary]').isVisible())await page.locator('[data-consent-necessary]').click();
      if(budget==='open')await page.locator('[data-finder-tile]').evaluateAll(nodes=>nodes.forEach(node=>{node.animate=()=>{throw new Error('Simulated unsupported animation');};}));
      for(const [choice,next] of [['breakfast','compact'],['compact','portable'],['portable','light'],['open','max100']]){
        await page.locator(`[data-option="${choice}"]`).click();
        await page.locator(`[data-option="${next}"]`).waitFor();
      }
      const visibleImmediately=await page.locator(`[data-option="${budget}"]`).evaluate(button=>{
        button.click();return !document.querySelector('[data-finder-result]').hidden;
      });
      assert.equal(visibleImmediately,true,'last answer renders a result in the same interaction, not after a timer');
      try{await page.locator('[data-finder-result]:not([hidden])').waitFor({timeout:4000});}
      catch(error){console.log({width,lang,budget,errors});throw error;}
      assert.deepEqual(errors,[]);
      if(budget==='open'){
        await page.locator('[data-finder-edit="budget"]').click();
        await page.locator('[data-option="max250"]').waitFor();
        const typography=await page.locator('.finderOption.is-selected').evaluate(button=>({
          title:getComputedStyle(button.querySelector('.finderOption__title')).fontSize,
          description:getComputedStyle(button.querySelector('.finderOption__description')).fontSize,
          foreground:getComputedStyle(button).color,background:getComputedStyle(button).backgroundColor
        }));
        assert.equal(typography.title,'16px');assert.equal(typography.description,'14px');
        assert.equal(typography.foreground,'rgb(255, 255, 255)');assert.equal(typography.background,'rgb(68, 53, 45)');
        const next=page.locator('[data-finder-next]');await next.click();
        await page.locator('[data-finder-result]:not([hidden])').waitFor();
      }
      if(budget==='max250'){
        await page.locator('[data-finder-edit="budget"]').click();
        await page.locator('[data-option="max250"]').waitFor();
        fs.mkdirSync('/tmp/edle-finder-fix',{recursive:true});
        await page.screenshot({path:`/tmp/edle-finder-fix/${lang}-${width}.png`});
      }
      await page.close();
    }
    console.log('PASS: all budgets complete synchronously in DE/EN at 390/1440px; back/edit, explicit result action, animation failure fallback and compact high-contrast options work.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
