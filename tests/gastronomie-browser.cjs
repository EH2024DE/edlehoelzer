const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.GASTRO_URL || 'http://127.0.0.1:8165';
const output = process.env.GASTRO_SCREENSHOTS || '/tmp/edle-gastro-review';
fs.mkdirSync(output, {recursive: true});

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
  try {
    for (const width of [375, 430, 768, 1024, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 1000}});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(base + '/schneidebretter-gastronomie/', {waitUntil: 'domcontentloaded'});
      await page.addStyleTag({content: 'html{scroll-behavior:auto!important}'});
      assert.equal(response.status(), 200);
      await page.locator('#products-gastro .productCard').first().waitFor();
      const consent = page.locator('[data-consent-necessary]').first();
      if (await consent.isVisible()) await consent.click();
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('#products-gastro .productCard').count(), 4);
      const links = await page.locator('main a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
      for (const href of links) {
        if (!href.startsWith('/') && !href.startsWith('#')) continue;
        const destination = new URL(href, 'https://edlehoelzer.de/schneidebretter-gastronomie/');
        const local = path.join(__dirname, '..', destination.pathname, destination.pathname.endsWith('/') ? 'index.html' : '');
        assert.ok(fs.existsSync(local), href);
        if (href.startsWith('#')) assert.equal(await page.locator(href).count(), 1, href);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`);
      const heroBottom = await page.locator('.gastroHero').evaluate(node => node.getBoundingClientRect().bottom);
      assert.ok(heroBottom < 1000 - 40, 'Next section remains visible');
      const initialWords = (await page.locator('main').innerText()).trim().split(/\s+/).length;
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        assert.ok(await img.evaluate(node => node.naturalWidth > 0));
      }
      await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
      await page.screenshot({path: `${output}/${width}-hero.png`});
      await page.locator('#products-gastro [data-product-preview]').first().click();
      const close = page.locator('[data-product-experience-close]').first();
      await close.waitFor({state: 'visible'});
      await close.click();
      const form = page.locator('[data-board-inquiry]');
      await form.scrollIntoViewIfNeeded();
      await form.locator('[type="submit"]').click();
      assert.equal(await form.evaluate(node => node.checkValidity()), false);
      await form.locator('[name="name"]').fill('Browsertest');
      await form.locator('[name="email"]').fill('ungueltig');
      assert.equal(await form.evaluate(node => node.checkValidity()), false);
      await form.locator('[name="email"]').fill('browsertest@example.org');
      assert.equal(await form.evaluate(node => node.checkValidity()), true, 'Only name and email are required');
      await page.keyboard.press('Tab');
      await form.locator('summary').focus();
      assert.notEqual(await form.locator('summary').evaluate(node => getComputedStyle(node).outlineStyle), 'none');
      await page.keyboard.press('Enter');
      assert.ok(await form.locator('[name="message"]').isVisible());
      await form.locator('[name="message"]').fill('Bitte Machbarkeit eines Servierbretts prüfen.');
      await form.locator('[name="quantity"]').selectOption('6–15');
      await page.evaluate(() => { window.gastroTestEvents = []; window.EdleAnalytics = {track: (name, data) => window.gastroTestEvents.push({name, data})}; });
      let attempts = 0;
      let body = '';
      await page.route('https://formspree.io/f/maqanpld', async route => {
        attempts++;
        body = route.request().postData() || '';
        await route.fulfill({status: attempts === 1 ? 503 : 200, contentType: 'application/json', body: attempts === 1 ? '{"error":"test"}' : '{"ok":true}'});
      });
      await form.locator('[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('[data-board-inquiry] [role="status"]').textContent.includes('nicht bestätigt'));
      assert.equal(await form.locator('[name="message"]').inputValue(), 'Bitte Machbarkeit eines Servierbretts prüfen.');
      await form.locator('[type="submit"]').click();
      await page.waitForFunction(() => document.querySelector('[data-board-inquiry] [role="status"]').textContent.includes('Danke!'));
      assert.equal(attempts, 2);
      assert.ok(body.includes('Gastronomie-Projektanfrage'));
      assert.equal(await form.locator('[name="email"]').inputValue(), '');
      assert.equal(await form.locator('[type="submit"]').isEnabled(), true);
      assert.deepEqual(await page.evaluate(() => window.gastroTestEvents.map(event => event.name)), ['inquiry_form_submit', 'inquiry_form_error', 'inquiry_form_submit', 'inquiry_form_success']);
      assert.ok(await page.evaluate(() => window.gastroTestEvents.every(event => !JSON.stringify(event.data).includes('example.org'))));
      await form.locator('summary').click();
      const faq = page.locator('#faq summary').first();
      await faq.focus();
      await page.keyboard.press('Enter');
      assert.ok(await page.locator('#faq details').first().getAttribute('open') !== null);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow after interaction at ${width}`);
      console.log(`PASS ${width}: ${initialWords} initial visible words; images, modal, validation/error/retry/success, FAQ keyboard`);
      if (width === 375 || width === 1440) {
        await form.locator('[role="status"]').evaluate(node => {node.textContent = ''; node.blur();});
        await page.addStyleTag({content: '.topbar,.backToTop,.gastroSkip{visibility:hidden!important}'});
        await page.locator('#anfrage').screenshot({path: `${output}/${width}-form.png`});
      }
      if (width === 1440) {
        await page.locator('#loesungen').screenshot({path: `${output}/1440-solutions.png`});
        await page.locator('#sonderloesungen').screenshot({path: `${output}/1440-feasibility.png`});
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
