const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pages = [
  'schneidebrett-nach-mass/',
  'schneidebrett-oel-vergleich/',
  'messerschonendes-schneidebrett/',
  'en/cutting-board-oil-comparison/',
  'en/knife-friendly-cutting-board/'
];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  const output = process.env.AUDIT_SCREENSHOTS || '/tmp/eh-search-audit';
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const route of pages) {
      for (const width of [375, 430, 768, 1024, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${process.env.AUDIT_URL || 'http://127.0.0.1:8153'}/${route}`, { waitUntil: 'networkidle' });
        const consent = page.locator('[data-consent-necessary]').first();
        if (await consent.isVisible()) await consent.click();
        await page.locator('main h1').waitFor();
        if (route === 'schneidebrett-oel-vergleich/') {
          assert.equal(new URL(page.url()).pathname, '/welches-oel-schneidebrett/');
        }
        assert.equal(await page.locator('main h1').count(), 1);
        const overflowing = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflowing, false, `${route} at ${width}px overflows`);
        const hero = page.locator('main img').first();
        if (await hero.count()) {
          await hero.evaluate(img => img.decode());
          assert.ok(await hero.evaluate(img => img.naturalWidth > 0));
        }
        assert.deepEqual(errors, [], `${route}: ${errors.join(', ')}`);
        const name = `${route.replaceAll('/', '-')}${width}`;
        await page.screenshot({ path: path.join(output, `${name}-hero.png`) });
        const content = page.locator('.seoText').first();
        await (await content.count() ? content : page.locator('main section').nth(1)).scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `${name}-content.png`) });
        console.log(`PASS ${route} ${width}px: no overflow, hero image loaded, no JS error`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
