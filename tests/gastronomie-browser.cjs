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
    for (const isEnglish of [false, true]) {
    const route = isEnglish ? '/en/wooden-cutting-boards-for-restaurants/' : '/schneidebretter-aus-holz-gastronomie/';
    const shots = isEnglish ? output + '/en' : output;
    fs.mkdirSync(shots, {recursive: true});
    for (const width of [375, 430, 768, 1024, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 1000}, hasTouch: width <= 700});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(base + route, {waitUntil: 'domcontentloaded'});
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
        const destination = new URL(href, 'https://edlehoelzer.de/schneidebretter-aus-holz-gastronomie/');
        const local = path.join(__dirname, '..', destination.pathname, destination.pathname.endsWith('/') ? 'index.html' : '');
        assert.ok(fs.existsSync(local), href);
        if (href.startsWith('#')) assert.equal(await page.locator(href).count(), 1, href);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`);
      const heroBottom = await page.locator('.gastroHero').evaluate(node => node.getBoundingClientRect().bottom);
      assert.ok(heroBottom < 1000 - 40, 'Next section remains visible');
      const initialWords = (await page.locator('main').innerText()).trim().split(/\s+/).length;
      assert.ok(await page.locator('#anfrage').evaluate(node => node.offsetTop < document.querySelector('#sortiment').offsetTop));
      assert.equal(await page.locator('[data-carousel-controls], [data-carousel-position]').count(), 0);
      for (const image of await page.locator('.gastroSolutions img').all()) {
        const box = await image.boundingBox();
        assert.ok(Math.abs(box.width - box.height) < 1, 'Square use-case images');
        assert.equal(await image.evaluate(node => getComputedStyle(node).objectFit), 'cover');
      }
      if (width <= 700) {
        for (const id of ['gastro-solutions', 'products-gastro']) {
          const track = page.locator('#' + id);
          await track.evaluate(node => node.scrollTo({left: 0, behavior: 'instant'}));
          await track.focus();
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(id => document.getElementById(id).scrollLeft > 100, id);

          await page.keyboard.press('End');
          await page.waitForFunction(id => {
            const node = document.getElementById(id);
            return node.scrollLeft >= node.scrollWidth - node.clientWidth - 1;
          }, id);
          await page.keyboard.press('Home');
          await page.waitForFunction(id => document.getElementById(id).scrollLeft < 1, id);
        }
        const track = page.locator('#gastro-solutions');
        await track.evaluate(node => node.scrollTo({left: 0, behavior: 'instant'}));
        await page.waitForFunction(() => document.querySelector('#gastro-solutions').scrollLeft < 1);
        await track.scrollIntoViewIfNeeded();
        const box = await track.boundingBox();
        const client = await page.context().newCDPSession(page);
        const start = {x: Math.min(width - 30, box.x + box.width - 20), y: box.y + 100};
        await client.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [start]});
        for (let step = 1; step <= 6; step++) {
          await client.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: start.x - step * 40, y: start.y}]});
          await page.waitForTimeout(25);
        }
        await client.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
        await page.waitForFunction(() => document.querySelector('#gastro-solutions').scrollLeft > 100);
        await client.detach();
        await track.evaluate(node => new Promise(resolve => {
          let last = node.scrollLeft, quiet = 0;
          function settled() {
            quiet = Math.abs(node.scrollLeft - last) < 0.1 ? quiet + 1 : 0;
            last = node.scrollLeft;
            if (quiet >= 8) resolve(); else requestAnimationFrame(settled);
          }
          settled();
        }));
        await track.evaluate(node => node.scrollTo({left: 0, behavior: 'instant'}));
        await page.waitForFunction(() => document.querySelector('#gastro-solutions').scrollLeft < 1);
        if (width === 375) await page.locator('#loesungen').screenshot({path: `${shots}/375-solutions.png`});
      }
      for (const img of await page.locator('main img').all()) {
        if (!(await img.isVisible())) continue;
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(node => node.decode());
        assert.ok(await img.evaluate(node => node.naturalWidth > 0));
      }
      await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
      await page.screenshot({path: `${shots}/${width}-hero.png`});
      await page.locator('#products-gastro [data-product-preview]').first().click();
      await page.locator('[data-product-page] h1').waitFor();
      await page.goBack();
      await page.locator('#products-gastro .productCard').first().waitFor();
      const costNote = page.locator('p[data-concept-cost]');
      await costNote.scrollIntoViewIfNeeded();
      assert.ok(await costNote.isVisible());
      assert.match(await costNote.innerText(), /150/);
      const costFaq = page.locator('details[data-concept-cost]');
      await costFaq.locator('summary').click();
      assert.ok(await costFaq.locator('p').isVisible());
      assert.match(await costFaq.locator('p').innerText(), /150/);
      await costFaq.locator('summary').click();
      const form = page.locator('[data-board-inquiry]');
      await form.scrollIntoViewIfNeeded();
      await form.locator('[type="submit"]').click();
      assert.equal(await form.evaluate(node => node.checkValidity()), false);
      await form.locator('[name="name"]').fill('Browsertest');
      await form.locator('[name="email"]').fill('ungueltig');
      assert.equal(await form.evaluate(node => node.checkValidity()), false);
      await form.locator('[name="email"]').fill('browsertest@example.org');
      assert.equal(await form.evaluate(node => node.checkValidity()), false, 'Budget must not be omitted');
      assert.ok(await form.locator('[name="budget"]').isVisible());
      await form.locator('[name="budget"]').fill('40–60 €');
      assert.equal(await form.evaluate(node => node.checkValidity()), false, 'Budget basis must be explicit');
      await form.locator('[name="budget_basis"]').selectOption(isEnglish ? 'per piece' : 'pro Stück');
      assert.equal(await form.evaluate(node => node.checkValidity()), false, 'Open idea needs a description');
      const message = form.locator('[name="message"]');
      assert.ok(await message.isVisible());
      await form.locator('[name="product_idea"]').selectOption(isEnglish ? 'Serving board' : 'Servierbrett');
      assert.equal(await message.evaluate(node => node.required), false);
      assert.equal(await form.evaluate(node => node.checkValidity()), true);
      await form.locator('[name="product_idea"]').selectOption(isEnglish ? 'Bespoke solution' : 'Individuelle Sonderlösung');
      assert.ok(await message.isVisible());
      assert.equal(await form.evaluate(node => node.checkValidity()), false);
      await message.fill('Zwischengespeicherte Idee');
      await form.locator('[name="product_idea"]').selectOption(isEnglish ? 'Serving board' : 'Servierbrett');
      await form.locator('[name="product_idea"]').selectOption(isEnglish ? 'undecided' : 'noch offen');
      assert.equal(await message.inputValue(), 'Zwischengespeicherte Idee');
      assert.equal(await message.evaluate(node => node.required), true);
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
      await page.waitForFunction(english => document.querySelector('[data-board-inquiry] [role="status"]').textContent.includes(english ? 'could not be confirmed' : 'nicht bestätigt'), isEnglish);
      assert.equal(await form.locator('[name="message"]').inputValue(), 'Bitte Machbarkeit eines Servierbretts prüfen.');
      await form.locator('[type="submit"]').click();
      await page.waitForFunction(english => document.querySelector('[data-board-inquiry] [role="status"]').textContent.includes(english ? 'Thank you!' : 'Danke!'), isEnglish);
      await page.waitForFunction(() => document.querySelector('[name="message"]').required && !document.querySelector('[name="message"]').closest('details'));
      assert.ok(await message.isVisible());
      assert.equal(await message.inputValue(), '');
      assert.equal(attempts, 2);
      assert.ok(body.includes(isEnglish ? 'Hospitality project enquiry' : 'Gastronomie-Projektanfrage'));
      assert.ok(body.includes('40–60 €'));
      assert.ok(body.includes(isEnglish ? 'per piece' : 'pro Stück'));
      assert.equal(await form.locator('[name="email"]').inputValue(), '');
      assert.equal(await form.locator('[type="submit"]').isEnabled(), true);
      assert.deepEqual(await page.evaluate(() => window.gastroTestEvents.map(event => event.name)), ['inquiry_form_submit', 'inquiry_form_error', 'inquiry_form_submit', 'inquiry_form_success']);
      assert.ok(await page.evaluate(() => window.gastroTestEvents.every(event => !JSON.stringify(event.data).includes('example.org'))));
      assert.ok(await page.evaluate(() => window.gastroTestEvents.every(event => !JSON.stringify(event.data).includes('40–60'))));
      await form.locator('summary').click();
      const faq = page.locator('#faq summary').first();
      await faq.focus();
      await page.keyboard.press('Enter');
      assert.ok(await page.locator('#faq details').first().getAttribute('open') !== null);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow after interaction at ${width}`);
      console.log(`PASS ${isEnglish ? "EN" : "DE"} ${width}: ${initialWords} initial visible words; images, modal, validation/error/retry/success, FAQ keyboard`);
      if (width === 375 || width === 1440) {
        await form.locator('[role="status"]').evaluate(node => {node.textContent = ''; node.blur();});
        await page.addStyleTag({content: '.topbar,.backToTop,.gastroSkip{visibility:hidden!important}'});
        await page.locator('#anfrage').screenshot({path: `${shots}/${width}-form.png`});
      }
      if (width === 1440) {
        await page.locator('#loesungen').screenshot({path: `${shots}/1440-solutions.png`});
        await page.locator('#sonderloesungen').screenshot({path: `${shots}/1440-feasibility.png`});
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
    }
    for (const width of [375, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 1000}});
      await page.goto(base + '/handgefertigte-holzprodukte-fuer-unternehmen/', {waitUntil: 'domcontentloaded'});
      const consent = page.locator('[data-consent-necessary]').first();
      if (await consent.isVisible()) await consent.click();
      const note = page.locator('p[data-concept-cost]');
      await note.scrollIntoViewIfNeeded();
      assert.ok(await note.isVisible());
      assert.match(await note.innerText(), /kostenlos.*150.*vollständig angerechnet/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.locator('#anfrage').screenshot({path: output + '/b2b-' + width + '-costs.png'});
      console.log('PASS B2B ' + width + ': concept-cost visibility and layout');
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
