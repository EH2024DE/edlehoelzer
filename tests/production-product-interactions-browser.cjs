const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8171';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
      const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.goto(base+(en?'/en':'')+'/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/');
      const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
      await page.locator('.productPreview__thumb').first().waitFor();
      const thumbs=page.locator('.productPreview__thumb');
      assert.equal(await thumbs.nth(0).getAttribute('data-preview-type'),'image');
      assert.equal(await thumbs.nth(1).getAttribute('data-preview-type'),'video');
      const stage=page.locator('.productPreview__mainMedia');
      const box=await stage.boundingBox();assert.ok(Math.abs(box.width-box.height)<2,'product stage stays square');
      await thumbs.nth(1).click();
      const playVideo=stage.locator('[data-preview-video-play]');if(await playVideo.isVisible())await playVideo.click();
      await stage.locator('video').waitFor();
      assert.ok(await stage.locator('video source').getAttribute('src'));
      await thumbs.nth(0).click();await stage.locator('img').first().click();
      await page.locator('.productPhotoViewer[open]').waitFor();
      await page.keyboard.press('Escape');await page.locator('.productPhotoViewer[open]').waitFor({state:'hidden'});
      const notice=page.locator('.legalGuaranteePreview');await notice.waitFor();
      const image=notice.locator('img');await image.evaluate(node=>node.decode());
      const dimensions=await image.evaluate(node=>({width:node.width,height:node.height,naturalWidth:node.naturalWidth,naturalHeight:node.naturalHeight,fit:getComputedStyle(node).objectFit}));
      assert.ok(Math.abs(dimensions.width/dimensions.height-dimensions.naturalWidth/dimensions.naturalHeight)<.02,'official notice is not cropped');
      assert.equal(dimensions.fit,'contain');
      await notice.click();await page.locator('.legalGuaranteeDialog[open]').waitFor();
      await page.keyboard.press('Escape');await page.locator('.legalGuaranteeDialog').waitFor({state:'detached'});
      await page.goto(base+(en?'/en/erbstueck/':'/schneidebrett-fachwerk-eiche/'));
      const prefix=en?'craft':'process';
      const craft=page.locator(en?'[data-craft-stage]':'.erbstueckProcessTrack');await craft.waitFor();
      const count=page.locator(`[data-${prefix}-count]`);const initial=await count.innerText();
      await page.waitForTimeout(3200);assert.equal(await count.innerText(),initial,'craft does not autoplay');
      await page.locator(`[data-${prefix}-next]`).click();await page.waitForTimeout(400);assert.match(await count.innerText(),/02\s*\/\s*19/);
      await page.locator(`[data-${prefix}-play]`).click();await page.waitForTimeout(3500);assert.match(await count.innerText(),/03\s*\/\s*19/);
      await page.locator(`[data-${prefix}-play]`).click();
      assert.deepEqual(errors,[]);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:`/tmp/edle-production-heirloom-${en?'en':'de'}-${width}.png`,fullPage:true});
      await page.close();console.log(`PASS ${en?'EN':'DE'} ${width}: square gallery, video second, photo zoom, complete notice, manual craft`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
