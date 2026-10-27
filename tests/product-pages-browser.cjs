const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const data = require('../products.json');
const base = process.env.PRODUCT_URL || 'http://127.0.0.1:8165';
const canonical = data.products.filter(p => !p.canonicalProductId);
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH});
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    // Every static page must remain useful without JavaScript.
    for (const en of [false, true]) for (const product of canonical) {
      const response = await page.request.get(base + (en ? '/en' : '') + product.productPath);
      assert.equal(response.status(), 200, product.id);
      const html = await response.text();
      assert.equal((html.match(/<h1>/g) || []).length, 1);
      assert.ok(html.includes(product.image));
      if (product.availabilityStatus === 'sold') assert.ok(html.includes(en ? 'Sold' : 'Verkauft'));
      await page.goto(base + (en ? '/en' : '') + product.productPath, {waitUntil:'domcontentloaded'});
      await page.locator('[data-product-package]').waitFor();
      const media = page.locator('[data-preview-media]');
      const defaultImage = product.variants?.[0]?.image || product.image;
      if (await media.count()) {
        assert.equal(await media.first().getAttribute('data-preview-type'),'image',product.id);
        assert.equal(await media.first().getAttribute('data-preview-src'),defaultImage,product.id);
      }
      if (product.videos?.length) assert.equal(await media.nth(1).getAttribute('data-preview-type'),'video',product.id);
      assert.ok(await page.locator('.productPreview__mainMedia img[data-preview-main]').getAttribute('alt'),product.id);
      assert.equal(await page.locator('.productPreview__moment, .productPreview__experiencePromise, .productPreview__chips').count(),0);
      assert.equal(await page.locator('[data-preferred-source-cta]').count(),0,'No unrelated outbound promotion on product pages');
      const packageText = await page.locator('[data-product-package]').innerText();
      assert.ok(packageText.trim(),product.id);
      if (product.listingId === '1838851839') {
        assert.match(packageText,en ? /6 wooden coasters/ : /6 Holzuntersetzer/);
        assert.match(packageText,en ? /holder/ : /Untersetzerhalter/);
      }
      if (['1850610674','4370769708','4598989614'].includes(product.listingId)) {
        assert.equal(await page.locator('[data-package-item="holder"]').count(),1,product.id);
        assert.equal(await page.locator('[data-package-item="careBalm"]').count(),1,product.id);
      }
      if (product.active !== false && ['available','made_to_order'].includes(product.availabilityStatus)) assert.equal(await page.locator('[data-product-page] [data-product-etsy]').count(),1,product.id);
    }
    const handled = canonical.find(p => p.listingId === '4417507555');
    const other = canonical.find(p => p.listingId === '1850610674');
    fs.mkdirSync('/tmp/edle-product-pages', {recursive:true});
    for (const en of [false, true]) for (const width of [375,430,768,1024,1440]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(base + (en ? '/en' : '') + handled.productPath, {waitUntil:'domcontentloaded'});
      await page.locator('[data-purchase-variant]').waitFor();
      const consent = page.locator('[data-consent-necessary]').first();
      if (await consent.isVisible()) await consent.click();
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('[data-product-page] [role=dialog]').count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'overflow ' + width);
      for (const variant of handled.variants) {
        await page.locator('[data-purchase-variant]').selectOption(variant.id);
        assert.ok((await page.locator('[data-purchase-price]').first().innerText()).includes(String(variant.priceOrder).split('.')[0]));
        const facts = await page.locator('.productPreview__facts').innerText();
        assert.deepEqual(facts.match(/\d+(?:[.,]\d+)?/g)?.slice(0,3).map(v=>v.replace(',','.')), variant.dimensions.match(/\d+(?:[.,]\d+)?/g).map(v=>v.replace(',','.')), facts);
        assert.ok(page.url().includes('variante=' + variant.id));
        const room = page.locator('[data-kitchen-preview]');
        assert.equal(await room.getAttribute('data-kitchen-variant'), variant.id);
      }
      await page.locator('.productPreview__related img').evaluateAll(images=>images.forEach(image=>{image.loading='eager';}));
      await page.waitForFunction(()=>Array.from(document.querySelectorAll('.productPreview__related img')).every(image=>image.complete && image.naturalWidth>0));
      await page.screenshot({path:`/tmp/edle-product-pages/${en?'en':'de'}-${width}.png`,fullPage:true});
    }
    const compact = canonical.find(p=>p.listingId==='4522458953');
    await page.goto(base + compact.productPath);
    const balmOption = page.locator('[data-purchase-option="careBalm"]');
    await balmOption.waitFor();
    assert.equal(await page.locator('[data-package-item="careBalm"]').count(),0);
    await balmOption.check();
    assert.equal(await page.locator('[data-package-item="careBalm"]').count(),1);
    await balmOption.uncheck();
    assert.equal(await page.locator('[data-package-item="careBalm"]').count(),0);
    await page.goto(base + handled.productPath);
    await page.locator('[data-purchase-variant]').waitFor();
    await page.locator('.productPreview__compareControls [data-product-compare]').click();
    await page.goto(base + other.productPath);
    await page.locator('.productPreview__compareControls [data-product-compare]').waitFor();
    assert.ok((await page.evaluate(() => localStorage.getItem('edleHoelzerCompareProducts'))).includes(handled.id));
    await page.locator('.productPreview__compareControls [data-product-compare]').click();
    await page.locator('[data-compare-open]').first().click();
    await page.locator('.compareView').waitFor();
    assert.equal(await page.locator('.compareView .compareProduct').count(), 2);
    await page.locator('.compareView [data-product-experience-close]').click();
    assert.equal(await page.locator('[data-product-page] h1').count(), 1);
    await page.goto(base + '/produkte.html');
    await page.locator('.productCard a[data-product-preview]').first().waitFor();
    const alias = data.products.find(p => p.canonicalProductId);
    assert.equal(await page.locator('.productCard [data-product-preview="'+alias.id+'"]').count(), 0);
    const link = page.locator('.productCard a[data-product-preview]').first();
    const href = await link.getAttribute('href');
    await link.click();
    await page.waitForURL(base + href);
    await page.locator('[data-product-page] h1').waitFor();
    const mobile = await browser.newPage({viewport:{width:375,height:900},hasTouch:true});
    mobile.on('pageerror', error => errors.push(error.message));
    await mobile.goto(base + '/produkte.html');
    const mobileConsent = mobile.locator('[data-consent-necessary]').first();
    if (await mobileConsent.isVisible()) await mobileConsent.click();
    const track = mobile.locator('.productCard__swipeTrack').first();
    await track.waitFor();
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    const client = await mobile.context().newCDPSession(mobile);
    await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width-30,y:box.y+80}]});
    for (let i=1;i<=8;i++) await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width-30-i*(box.width-60)/8,y:box.y+80}]});
    await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await mobile.waitForFunction(()=>document.querySelector('.productCard__swipeTrack').scrollLeft>100);
    assert.ok(mobile.url().endsWith('/produkte.html'), 'Swiping does not navigate');
    await mobile.close();
    assert.deepEqual(errors, []);
    console.log('92 static pages; 10 responsive DE/EN views; variant pricing, facts, room-preview context, cross-page comparison and card navigation passed.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
