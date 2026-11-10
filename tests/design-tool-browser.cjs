const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});const results=[];
  try{
    for(const width of [375,1440]){
      const page=await browser.newPage({viewport:{width,height:1000}});
      await page.addInitScript(()=>localStorage.setItem('edle-kitchen-photo-tips-seen','1'));
      await page.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8184')+'/brettvorschau/',{waitUntil:'networkidle'});
      const canvas=page.locator('#renderer canvas');await canvas.waitFor({state:'visible'});
      const first=await canvas.screenshot(),stats=await sharp(first).stats();
      assert.ok(stats.channels.slice(0,3).some(c=>c.stdev>8),'Canvas must contain a visibly rendered object');
      await page.locator('#angle').evaluate(n=>{n.value='45';n.dispatchEvent(new Event('input',{bubbles:true}));});
      await page.waitForFunction(()=>document.querySelector('#angleValue').textContent.includes('45'));
      const second=await canvas.screenshot();assert.ok(!first.equals(second),'Rotation must change the rendered pixels');
      fs.writeFileSync(`/tmp/edle-design-tool-${width}.png`,await page.screenshot());
      results.push({width,canvasNonblank:true,rotationChangesPixels:true});await page.close();
    }
  }finally{await browser.close();}
  console.log(results);
})().catch(e=>{console.error(e);process.exitCode=1;});
