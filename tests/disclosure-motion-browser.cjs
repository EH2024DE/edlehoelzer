const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const browser=await chromium.launch();fs.mkdirSync('/tmp/edle-disclosure-motion',{recursive:true});
 try{for(const width of [375,1440])for(const en of [false,true])for(const reduced of [false,true]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:reduced?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(en?'/en':'')+'/produkte/3d-stirnholz-nussbaum-weitere-1803930088/',{waitUntil:'networkidle'});
  const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
  await page.locator('[data-preview-media]').nth(1).click();
  const play=page.getByRole('button',{name:en?'Play product video':'Produktvideo abspielen',exact:true});
  assert.ok(await play.isVisible());assert.equal((await play.innerText()).trim(),'');
  assert.equal(await play.locator('img[src="/assets/icons/lucide/play.svg"]').count(),1);
  if(!reduced){await page.locator('.productPreview__mainMedia').screenshot({path:`/tmp/edle-disclosure-motion/play-${en?'en':'de'}-${width}.png`});}
  await play.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.productPreview__mainMedia video').count(),1);
  const button=page.locator('.readMore__button').first(),details=page.locator('.productPreview__detail').first();
  await button.scrollIntoViewIfNeeded();await button.click();
  assert.equal(await button.getAttribute('aria-expanded'),'true');
  if(!reduced)assert.ok(await details.evaluate(n=>n.getAnimations().some(a=>a.playState==='running')));
  await page.waitForTimeout(reduced?0:280);assert.ok(await details.evaluate(n=>n.open));
  await button.evaluate(n=>n.click());assert.equal(await button.getAttribute('aria-expanded'),'false');
  if(!reduced)assert.ok(await details.evaluate(n=>n.open&&n.getAnimations().length>0));
  await page.waitForTimeout(reduced?0:280);assert.ok(await details.evaluate(n=>!n.open));
  // Rapid reversal must end in the requested state without leaving a fixed height or clipping.
  await button.evaluate(n=>{n.click();n.click();n.click();});await page.waitForTimeout(reduced?0:280);
  assert.ok(await details.evaluate(n=>n.open&&n.style.overflow===''));
  await page.goto(base+'/schneidebrett-nach-mass/',{waitUntil:'networkidle'});
  const native=page.locator('.editorialTopic').first();await native.locator('summary').focus();await page.keyboard.press('Enter');
  await page.waitForTimeout(reduced?0:280);assert.ok(await native.evaluate(n=>n.open));
  await native.locator('summary').focus();await page.keyboard.press('Enter');await page.waitForTimeout(reduced?0:280);assert.ok(await native.evaluate(n=>!n.open));
  const faq=page.locator('.faqQuestion').first();await faq.click();await page.waitForTimeout(reduced?0:280);
  assert.equal(await faq.getAttribute('aria-expanded'),'true');assert.ok(await page.locator('#'+await faq.getAttribute('aria-controls')).isVisible());
  await faq.click();await page.waitForTimeout(reduced?0:280);assert.ok(await page.locator('#'+await faq.getAttribute('aria-controls')).isHidden());
  assert.deepEqual(errors,[]);await page.close();console.log('PASS icon video, keyboard disclosures, reversal, FAQ',width,en?'EN':'DE',reduced?'reduced':'animated');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
