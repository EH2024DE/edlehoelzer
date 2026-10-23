const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.CATALOG_URL || 'http://127.0.0.1:8165';
const output = process.env.CATALOG_SCREENSHOTS || '/tmp/edle-catalog-review';
fs.mkdirSync(output, {recursive: true});

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
  try {
    for (const lang of ['de', 'en']) {
      for (const width of [375, 430, 768, 1024, 1440]) {
        const page = await browser.newPage({viewport: {width, height: 1000}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + (lang === 'de' ? '/produkte.html' : '/en/products.html'), {waitUntil: 'domcontentloaded'});
        const grid = page.locator('[data-products-grid]');
        const cards = grid.locator('.productCard');
        const form = page.locator('[data-product-filters]');
        await cards.first().waitFor();
        const consent = page.locator('[data-consent-necessary]').first();
        if (await consent.isVisible()) await consent.click();
        const total = await cards.count();
        assert.ok(total > 30);
        const countMatches = async () => assert.equal(parseInt(await page.locator('[data-catalog-count]').textContent(), 10), await cards.count());
        const group = async value => {
          await page.locator(`[data-catalog-category="${value}"]`).click();
          assert.equal(await form.locator('[name="category"]').inputValue(), value);
          assert.equal(await page.locator('[data-catalog-category][aria-pressed="true"]').count(), 1);
          await countMatches();
        };
        await countMatches();
        const ids = await grid.locator('[data-product-preview]').evaluateAll(nodes => nodes.map(n => n.dataset.productPreview));
        const products = require('../products.json').products;
        const sorted = ids.filter((id, index) => ids.indexOf(id) === index).map(id => products.find(p => p.id === id));
        const firstAccessory = sorted.findIndex(p => p.category !== 'board');
        assert.ok(sorted.slice(firstAccessory).every(p => p.category !== 'board' || p.inspirationOnly), 'Available boards precede accessories');
        await group('board');
        await form.locator('[name="construction"]').selectOption('end');
        await form.locator('[name="groove"]').selectOption('available');
        await form.locator('[name="wood"]').selectOption('eiche');
        await group('tools');
        assert.equal(await cards.count(), 3);
        for (const name of ['construction', 'groove']) {
          assert.ok(await form.locator(`[name="${name}"]`).isHidden());
          assert.ok(await form.locator(`[name="${name}"]`).isDisabled());
        }
        await form.locator('[name="wood"]').selectOption('zwetschge');
        await form.locator('[name="category"]').selectOption('care');
        assert.equal(await cards.count(), 2);
        assert.ok(await form.locator('[name="wood"]').isHidden());
        assert.equal(await form.locator('[name="wood"]').inputValue(), 'all');
        assert.equal(await page.locator('[data-catalog-category="care"]').getAttribute('aria-pressed'), 'true');
        await group('coasters');
        assert.equal(await cards.count(), 1);
        await group('serving');
        assert.ok(await cards.count() > 5);
        await group('all');
        await form.locator('[name="wood"]').selectOption('ahorn');
        await form.locator('[name="construction"]').selectOption('end');
        assert.ok(await cards.count() >= 2);
        await group('tools');
        await form.locator('[name="price"]').selectOption('over250');
        assert.equal(await cards.count(), 0);
        await countMatches();
        assert.ok(await grid.locator('.productEmpty').isVisible());
        await form.locator('[type="reset"]').click();
        await page.waitForFunction(() => document.querySelectorAll('[data-products-grid] .productCard').length > 30);
        assert.equal(await cards.count(), total);
        assert.equal(await form.locator('[name="category"]').inputValue(), 'all');
        for (const name of ['construction', 'groove', 'wood']) {
          assert.equal(await form.locator(`[name="${name}"]`).inputValue(), 'all');
          assert.ok(await form.locator(`[name="${name}"]`).isEnabled());
        }
        await form.locator('[name="price"]').selectOption('under50');
        await form.locator('[name="sort"]').selectOption('priceAsc');
        await countMatches();
        await form.locator('[type="reset"]').click();
        await page.waitForFunction(() => document.querySelector('[name="price"]').value === 'all' && document.querySelectorAll('[data-products-grid] .productCard').length > 30);
        await page.keyboard.press('Tab');
        await page.locator('[data-catalog-category="board"]').focus();
        const outline = await page.locator('[data-catalog-category="board"]').evaluate(node => getComputedStyle(node).outlineStyle);
        assert.notEqual(outline, 'none');
        await page.keyboard.press('Enter');
        assert.equal(await form.locator('[name="category"]').inputValue(), 'board');
        await form.scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lang}/${width}: horizontal overflow`);
        assert.ok(await page.locator('.catalogCategory').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().height >= 44)));
        await page.screenshot({path: `${output}/${lang}-${width}.png`});
        await grid.locator('[data-product-preview]').first().click();
        const close = page.locator('[data-product-experience-close]').first();
        await close.waitFor({state: 'visible'});
        await close.click();
        assert.equal(await form.locator('[name="category"]').inputValue(), 'board');
        if (width === 1440) {
          const handled = products.find(p => p.listingId === '4417507555');
          await grid.locator(`[data-product-preview="${handled.id}"]`).first().click();
          const variant = page.locator('[data-purchase-variant]');
          const before = await page.locator('[data-purchase-price]').first().textContent();
          await variant.selectOption((await variant.inputValue()) === 'beech' ? 'oak' : 'beech');
          assert.notEqual(await page.locator('[data-purchase-price]').first().textContent(), before);
          const groove = page.locator('[data-purchase-option="juiceGroove"]');
          const basePrice = await page.locator('[data-purchase-price]').first().textContent();
          await groove.check();
          assert.notEqual(await page.locator('[data-purchase-price]').first().textContent(), basePrice);
          await groove.uncheck();
          assert.equal(await page.locator('[data-purchase-price]').first().textContent(), basePrice);
          assert.ok((await page.locator('[data-product-etsy]').first().getAttribute('href')).includes('etsy.com'));
          await page.locator('[data-preview-type="image"]').first().click();
          await page.locator('[data-photo-viewer]').first().click();
          const photo = page.locator('.productPhotoViewer__image');
          await photo.waitFor({state: 'visible'});
          await page.locator('.productPhotoViewer__toolbar button').nth(2).click();
          assert.equal(await page.locator('.productPhotoViewer__scale').textContent(), '150%');
          await page.keyboard.press('Escape');
          const video = page.locator('[data-preview-type="video"]').first();
          if (await video.count()) {
            await video.click();
            const play = page.locator('[data-preview-video-play]');
            if (await play.count()) await play.click();
            await page.locator('video[data-preview-main]').waitFor();
          }
          await close.click();
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${lang}/${width}: filters, reset, keyboard, modal, no overflow`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
