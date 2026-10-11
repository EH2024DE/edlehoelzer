const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const products = require('../products.json').products;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  try {
    for (const lang of ['de', 'en']) {
      const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
      await page.goto((process.env.FINDER_URL || 'http://127.0.0.1:8140') + '/' + (lang === 'de' ? 'produkte.html' : 'en/products.html'), { waitUntil: 'domcontentloaded' });
      await page.locator('[data-option="serving"]').waitFor();
      const consent = page.locator('[data-consent-necessary]').first();
      if (await consent.isVisible()) await consent.click();
      for (const button of await page.locator('.finderPool__inspect').all()) {
        const box = await button.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
      }
      for (const value of ['serving', 'large', 'stationary', 'light', 'max250']) {
        await page.locator(`[data-option="${value}"]`).click();
        await page.waitForTimeout(500);
      }
      const main = page.locator('[data-finder-match="recommendation"]');
      await main.waitFor();
      const id = await main.locator('[data-finder-open]').getAttribute('data-product-preview');
      assert.equal(products.find(p => p.id === id).productType, 'cuttingBoard');
      const reason = await main.textContent();
      assert.ok(reason.includes(lang === 'de' ? 'Arbeitsbrett zum Schneiden' : 'working board for cutting'));
      await page.locator('[data-finder-edit="movement"]').click();
      await page.locator('[data-option="balanced"]').click();
      await page.waitForTimeout(500);
      const servingId = await main.locator('[data-finder-open]').getAttribute('data-product-preview');
      assert.equal(products.find(p => p.id === servingId).listingId, '4398179153');
      assert.ok((await main.textContent()).includes(lang === 'de' ? 'nicht für tägliche Schneid-' : 'not everyday cutting'));
      await page.setViewportSize({ width: 1440, height: 1000 });
      await main.scrollIntoViewIfNeeded();
      await main.locator('img').first().evaluate(img => img.decode());
      await page.screenshot({ path: `/tmp/edle-finder-v2/${lang}-serving-role.png` });
      await page.locator('[data-finder-reset]').click();
      for (const value of ['gift', 'serving', 'medium', 'portable', 'expressive', 'max250']) {
        await page.locator(`[data-option="${value}"]`).click();
        await page.waitForTimeout(600);
      }
      await main.waitFor();
      const hostingId = await main.locator('[data-finder-open]').getAttribute('data-product-preview');
      assert.ok(['4389604739', '4440690649', '4398179153'].includes(products.find(p => p.id === hostingId).listingId));
      assert.ok(!(await main.textContent()).includes('Mooreiche'));
      await page.screenshot({ path: `/tmp/edle-finder-v2/${lang}-hosting-gift.png` });
      await page.locator('[data-finder-edit="space"]').click();
      await page.locator('[data-option="compact"]').click();
      await page.waitForTimeout(600);
      assert.equal(await page.locator('[data-finder-match="recommendation"]').count(), 0);
      assert.equal(await page.locator('[data-finder-near]').count(), 1);
      assert.ok(!(await page.locator('[data-finder-near]').textContent()).includes('Mooreiche'));
      console.log(`PASS ${lang}: stationary work-and-serve, balanced antipasti, 44px pool targets`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
