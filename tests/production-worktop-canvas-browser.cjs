const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const sharp=require('../tools/shop-server/node_modules/sharp');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8171';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--enable-unsafe-swiftshader']});
  try{
    for(const width of [375,1440]){
      const page=await browser.newPage({viewport:{width,height:950}}),errors=[],missing=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)missing.push(response.url());});
      await page.goto(base+'/brettvorschau/?listing=4370769708');
      const tips=page.getByRole('button',{name:'Alles klar',exact:true});if(await tips.isVisible())await tips.click();
      const canvas=page.locator('#renderer canvas');await canvas.waitFor();
      await page.waitForTimeout(1500);
      const before=await canvas.screenshot();
      const pixels=await sharp(before).removeAlpha().raw().toBuffer({resolveWithObject:true});
      let varied=0;
      for(let offset=3;offset<pixels.data.length;offset+=3){
        if(Math.abs(pixels.data[offset]-pixels.data[0])+Math.abs(pixels.data[offset+1]-pixels.data[1])+Math.abs(pixels.data[offset+2]-pixels.data[2])>30)varied++;
      }
      assert.ok(varied>pixels.info.width*pixels.info.height*.02,'canvas contains a visible nonblank model');
      await page.locator('#angle').evaluate(node=>{node.value='55';node.dispatchEvent(new Event('input',{bubbles:true}));});
      await page.waitForTimeout(300);
      assert.match(await page.locator('#angleValue').innerText(),/55/);
      const rotated=await canvas.screenshot();assert.notDeepEqual(rotated,before,'rotation changes rendered pixels');
      await page.locator('#holderView').click();await page.waitForTimeout(400);
      assert.equal(await page.locator('#holderView').getAttribute('aria-pressed'),'true');
      assert.notDeepEqual(await canvas.screenshot(),rotated,'holder mode changes rendered pixels');
      assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:`/tmp/edle-production-worktop-${width}.png`,fullPage:true});
      await page.close();console.log(`PASS ${width}: visible canvas, rotation, holder, assets, framing`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
