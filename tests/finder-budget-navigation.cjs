const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../main.js'), 'utf8');
const engine = source.slice(source.indexOf('function createFinderMatcher()'), source.indexOf('function initProductsPage()'));
const matcher = vm.runInNewContext(engine + '\ncreateFinderMatcher();');
const products = require('../products.json').products;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  try {
    for (const lang of ['de', 'en']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:8140/' + (lang === 'de' ? 'produkte.html' : 'en/products.html'), { waitUntil: 'domcontentloaded' });
      await page.locator('[data-option="bbq"]').waitFor();
      const consent = page.locator('[data-consent-necessary]').first();
      if (await consent.isVisible()) await consent.click();
      const answers = { use: 'bbq', space: 'large', movement: 'stationary', style: 'light', budget: 'premium' };
      async function pick(value) {
        await page.locator(`[data-option="${value}"]`).click();
        await page.waitForTimeout(700);
      }
      async function checkResult() {
        await page.locator('[data-finder-result]:not([hidden])').waitFor();
        const expected = matcher.select(products, answers);
        for (const [kind, entry] of [['recommendation', expected.main], ['alternative', expected.alternative], ['near_match', expected.near]]) {
          const action = page.locator(`[data-finder-result] [data-finder-open="${kind}"]`);
          assert.equal(await action.count(), entry ? 1 : 0);
          if (entry) {
            const id = await action.getAttribute('data-product-preview');
            if (id) assert.equal(id, entry.product.id);
          }
        }
        assert.equal(await page.locator('[data-finder-edit]').count(), 5, 'Changing one answer retains the other four');
      }
      for (const value of Object.values(answers)) await pick(value);
      await checkResult();
      for (const budget of ['max100', 'open', 'max250', 'premium', 'max100', 'open']) {
        await page.locator('[data-finder-edit="budget"]').click();
        assert.equal(await page.locator(`[data-option="${answers.budget}"]`).getAttribute('aria-pressed'), 'true');
        answers.budget = budget;
        await pick(budget);
        await checkResult();
      }
      await page.locator('[data-finder-edit="budget"]').click();
      await page.locator('[data-finder-prev]').click();
      assert.equal(await page.locator('[data-option="light"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-finder-prev]').click();
      assert.equal(await page.locator('[data-option="stationary"]').getAttribute('aria-pressed'), 'true');
      answers.movement = 'portable';
      await pick('portable');
      await checkResult();
      await page.locator('[data-finder-edit="movement"]').click();
      answers.movement = 'stationary';
      await pick('stationary');
      await checkResult();
      await page.locator('[data-finder-edit="budget"]').click();
      await page.screenshot({ path: `/tmp/edle-finder-v2/${lang}-budget-clarity.png` });
      assert.deepEqual(errors, []);
      console.log(`PASS ${lang}: repeated budget changes and two-step back navigation agree with fresh matching`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
