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
      const comparison=page.locator('[data-service-comparison]'),table=comparison.locator('table');
      assert.equal(await table.locator('thead th').count(),3);
      const metrics=await comparison.evaluate(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,tableHeight:n.querySelector('table').getBoundingClientRect().height,backgrounds:[...n.querySelectorAll('thead th')].map(h=>getComputedStyle(h).backgroundColor),clipped:[...n.querySelectorAll('th,td')].some(c=>c.scrollWidth>c.clientWidth+1)}));
      assert.equal(new Set(metrics.backgrounds).size,3);assert.equal(metrics.clipped,false);
      assert.ok(metrics.width<=width);if(width===390){assert.ok(metrics.tableHeight<520);assert.ok(metrics.height<720);}
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
      assert.ok(await fallback.locator('[data-service-comparison] table').isVisible());await fallback.close();
      report.push({viewportWidth:width,language:en?'en':'de',...metrics,keyboard:true,noJavaScript:true,fragmentTarget:true,floatingCtaHidden:true});await page.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync('docs/design-service-comparison-qa.json',JSON.stringify(report,null,2));console.log(report);
})().catch(e=>{console.error(e);process.exitCode=1;});
