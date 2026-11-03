const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch();const report=[];fs.mkdirSync('docs/design-service-screenshots',{recursive:true});
  try{
    for(const width of [375,390,430,768,1440])for(const en of [false,true]){
      const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
      await page.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8184')+(en?'/en/refurbishment/':'/schneidebrett-aufbereiten/'),{waitUntil:'networkidle'});
      const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
      const comparison=page.locator('[data-service-comparison]'),cards=comparison.locator('.serviceOption');
      assert.equal(await cards.count(),3);assert.equal(await comparison.locator('table').count(),0);
      const metrics=await comparison.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,cardHeights:[...n.querySelectorAll('.serviceOption')].map(c=>c.getBoundingClientRect().height),clipped:[...n.querySelectorAll('h3,.serviceOption__price,.serviceOption__intro')].some(c=>c.scrollWidth>c.clientWidth+1)}));
      assert.equal(metrics.clipped,false);assert.ok(metrics.width<=width);
      if(width<=430)assert.ok(metrics.cardHeights.every(h=>h<240));
      const cardDetails=cards.first().locator('details');assert.equal(await cardDetails.getAttribute('open'),null);
      await cardDetails.locator('summary').press('Enter');assert.notEqual(await cardDetails.getAttribute('open'),null);await cardDetails.locator('summary').press('Enter');
      const detail=page.locator('.serviceCompareDetails').last();assert.equal(await detail.getAttribute('open'),null);
      await detail.locator('summary').press('Enter');assert.notEqual(await detail.getAttribute('open'),null);
      await detail.locator('summary').press('Enter');
      await comparison.scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.body.classList.contains('is-comparing-services'));
      assert.equal(await page.locator('.mobileStickyCta').isVisible(),false);
      if([390,1440].includes(width))await comparison.screenshot({path:`docs/design-service-screenshots/comparison-${en?'en':'de'}-${width}.png`});
      await page.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8184')+(en?'/en/refurbishment/#full-restoration':'/schneidebrett-aufbereiten/#generalueberholung'),{waitUntil:'networkidle'});
      assert.notEqual(await page.locator('.serviceCompareDetails').last().getAttribute('open'),null);
      const fallback=await browser.newPage({viewport:{width,height:844},javaScriptEnabled:false});
      await fallback.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8184')+(en?'/en/refurbishment/':'/schneidebrett-aufbereiten/'));
      assert.equal(await fallback.locator('[data-service-comparison] .serviceOption').count(),3);await fallback.locator('.serviceOption details summary').first().click();assert.notEqual(await fallback.locator('.serviceOption details').first().getAttribute('open'),null);await fallback.close();
      report.push({viewportWidth:width,language:en?'en':'de',...metrics,keyboard:true,noJavaScript:true,fragmentTarget:true,floatingCtaHidden:true});await page.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync('docs/design-service-comparison-qa.json',JSON.stringify(report,null,2));console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1;});
