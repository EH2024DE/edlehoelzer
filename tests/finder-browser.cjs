const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.FINDER_URL || 'http://127.0.0.1:8140';
const output = process.env.FINDER_SCREENSHOTS || '/tmp/edle-finder-v2';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  const context = await browser.newContext();
  try {
    for (const width of process.env.FINDER_WIDTHS ? process.env.FINDER_WIDTHS.split(',').map(Number) : [375, 430, 768, 1024, 1440]) {
      for (const lang of process.env.FINDER_LANGUAGES ? process.env.FINDER_LANGUAGES.split(',') : ['de', 'en']) {
        const page = await context.newPage();
        await page.setViewportSize({ width, height: Number(process.env.FINDER_HEIGHT || 1000) });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + (lang === 'de' ? '/produkte.html' : '/en/products.html'), { waitUntil: 'domcontentloaded' });
        await page.locator('[data-option="breakfast"]').waitFor();
        var consent = page.locator('[data-consent-necessary]').first();
        if (await consent.isVisible()) await consent.click();
        await page.evaluate(() => {
          window.finderTestEvents = [];
          window.EdleAnalytics = { track: (name, payload) => window.finderTestEvents.push({ name, payload }) };
        });
        const pool = page.locator('[data-finder-tile]');
        const initialCount = await pool.count();
        assert.equal(initialCount, 33);
        const early = page.locator('[data-finder-tile] [data-product-preview]').first();
        await early.click();
        await page.locator('[data-product-experience-close]').first().click();
        assert.equal(await page.locator('[data-finder-edit]').count(), 0, 'Early preview does not answer questions');
        await page.evaluate(() => document.querySelector('[data-product-finder]').scrollIntoView({ block: 'start' }));
        await page.waitForTimeout(600);
        assert.ok(await page.locator('[data-finder-pool] img').evaluateAll(nodes => nodes.every(node => !node.src.includes('il_fullxfull'))));
        if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-start.png` });
        async function pick(value, next) {
          await page.locator(`[data-option="${value}"]`).click();
          if (next) await page.locator(`[data-option="${next}"]`).waitFor();
          else await page.locator('[data-finder-result]:not([hidden])').waitFor();
          await page.waitForTimeout(450);
          if (next) {
            const question = await page.locator('.finderShell__top').boundingBox();
            assert.ok(question.y >= 70 && question.y < 150, `Question is visible below header at ${lang}/${width}: ${question.y}`);
            const firstOption = await page.locator('[data-finder-options] button').first().boundingBox();
            assert.ok(firstOption.y < 350, 'Answers are visible without scrolling past the product pool');
          }
          assert.equal(await pool.count(), initialCount, 'Excluded pictures stay in the pool');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${lang}/${width}`);
        }
        await pick('breakfast', 'compact');
        await page.locator('[data-finder-tile] [data-product-preview]').first().click();
        await page.locator('[data-product-experience-close]').first().click();
        assert.equal(await page.locator('[data-finder-edit]').count(), 1, 'Preview preserves existing answers');
        if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-after-1.png` });
        await pick('compact', 'portable');
        await pick('portable', 'light');
        if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-after-3.png` });
        await pick('open', 'max100');
        await pick('max100');
        assert.ok(await page.locator('[data-finder-match]').count() <= 2);
        assert.ok(await page.locator('[data-finder-near]').count() <= 1);
        assert.ok((await page.locator('[data-finder-match="recommendation"] h3').textContent()).includes('Bambus'));
        for (const kind of ['recommendation', 'alternative']) {
          const action = page.locator(`[data-finder-open="${kind}"]`);
          if (await action.count()) {
            await action.click();
            await page.locator('[data-product-experience-close]').first().click();
            assert.ok((await page.evaluate(() => window.finderTestEvents.map(e => e.name))).includes(`product_finder_${kind}_open`));
          }
        }
        if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-result.png` });
        await page.locator('[data-finder-edit="budget"]').click();
        assert.equal(await page.locator('[data-option="max100"]').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[data-finder-edit]').count(), 5);
        await pick('premium');
        assert.equal(await page.locator('[data-finder-edit]').count(), 5);
        await page.locator('[data-finder-edit="use"]').click();
        await pick('gift', 'unknown');
        await pick('bbq');
        assert.equal(await page.locator('[data-finder-edit="giftUse"]').count(), 1);
        await page.locator('[data-finder-edit="use"]').click();
        await pick('bbq');
        assert.equal(await page.locator('[data-finder-edit="giftUse"]').count(), 0, 'Gift use removed when leaving gift path');
        for (const [key, value] of [['space', 'large'], ['movement', 'stationary'], ['budget', 'max100']]) {
          await page.locator(`[data-finder-edit="${key}"]`).click();
          await pick(value);
        }
        assert.equal(await page.locator('[data-finder-match]').count(), 0);
        assert.equal(await page.locator('[data-finder-near]').count(), 1);
        for (const button of await page.locator('[data-finder-result] button').all()) {
          const box = await button.boundingBox();
          assert.ok(box && box.height >= 44, 'Result actions have a 44px touch target');
        }
        if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-near.png` });
        await page.locator('.is-near-match button:not([disabled])').focus();
        const nearTarget = await page.locator('.is-near-match button:not([disabled])').boundingBox();
        assert.ok(nearTarget.height >= 44 && nearTarget.width >= 44, 'Scaled near-match tile retains a 44px touch target');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Focused tooltip stays within the page');
        await page.keyboard.press('Enter');
        assert.ok(await page.locator('[data-finder-explanation]').isVisible());
        await page.keyboard.press('Escape');
        assert.ok(!(await page.locator('[data-finder-explanation]').isVisible()));
        await page.locator('[data-finder-result] [data-finder-reconsider]').click();
        assert.equal(await page.locator('[data-option="max100"]').getAttribute('aria-pressed'), 'true');
        await pick('premium');
        assert.ok(await page.locator('[data-finder-match="recommendation"]').count());
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        const events = await page.evaluate(() => window.finderTestEvents.map(e => e.name));
        for (const event of ['product_finder_answer', 'product_finder_answer_changed', 'product_finder_step_back', 'product_finder_complete', 'product_finder_no_match', 'product_finder_near_match_open', 'product_finder_near_match_reconsider']) assert.ok(events.includes(event), event);
        assert.deepEqual(errors, []);
        await page.locator('[data-finder-reset]').click();
        await page.waitForTimeout(700);
        assert.equal(await page.locator('[data-option="breakfast"]').getAttribute('aria-pressed'), 'false');
        const resetQuestion = await page.locator('.finderShell__top').boundingBox();
        assert.ok(resetQuestion.y >= 70 && resetQuestion.y < 150, `Reset lands on question, not pool: ${resetQuestion.y}`);
        if (width < 768) {
          const poolBox = await page.locator('[data-finder-pool]').boundingBox();
          const optionsBox = await page.locator('[data-finder-options]').boundingBox();
          assert.ok(poolBox.y > optionsBox.y + optionsBox.height);
          assert.ok(poolBox.height <= 191);
          const ratios = await page.locator('[data-finder-pool] img').evaluateAll(images => images.map(img => img.getBoundingClientRect()).map(box => box.width / box.height));
          assert.ok(ratios.every(ratio => Math.abs(ratio - 170 / 135) < .03), 'No strip-shaped mobile images');
        }
        if ([375, 390, 1440].includes(width)) await page.screenshot({ path: `${output}/${lang}-${width}-reset.png` });
        console.log(`PASS ${lang} ${width}px: navigation, budget, gift dependency, near match, overflow, events`);
        await page.close();
      }
    }
    const madePage = await context.newPage();
    const madeProducts = require('../products.json').products.filter(product => product.availabilityStatus === 'made_to_order');
    await madePage.route('**/products.json*', route => route.fulfill({ json: { products: madeProducts } }));
    await madePage.goto(base + '/produkte.html', { waitUntil: 'domcontentloaded' });
    await madePage.locator('[data-option="bbq"]').waitFor();
    for (const value of ['bbq', 'large', 'stationary', 'open', 'open']) {
      await madePage.locator(`[data-option="${value}"]`).click();
      await madePage.waitForTimeout(500);
    }
    await madePage.locator('[data-finder-result]:not([hidden])').waitFor();
    assert.ok(await madePage.locator('[data-finder-match="recommendation"] .finderMatchCard__availability').count());
    assert.equal(await madePage.locator('[data-finder-open="recommendation"]').getAttribute('href'), '/schneidebrett-nach-mass/');
    console.log('PASS made-to-order fixture: honest availability and inquiry action');
    await madePage.close();
    const page = await browser.newPage({ viewport: { width: 375, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(base + '/produkte.html', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-option="breakfast"]').waitFor();
    await page.locator('[data-option="breakfast"]').click();
    await page.locator('[data-option="compact"]').waitFor();
    assert.equal(await page.evaluate(() => document.querySelector('[data-finder-pool]').getAnimations({ subtree: true }).length), 0);
    console.log('PASS reduced motion');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
