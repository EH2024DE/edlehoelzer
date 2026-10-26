const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('schneidebretter-aus-holz-gastronomie/index.html');
const route = '/schneidebretter-aus-holz-gastronomie/';
const url = 'https://edlehoelzer.de' + route;
const englishRoute = '/en/wooden-cutting-boards-for-restaurants/';
const english = read(englishRoute + 'index.html');
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const decode = text => text.replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();

test('gastro page has one H1, indexable self canonical and focused metadata', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="${url}"`));
  assert.match(html, /name="robots" content="index,follow"/);
  const title = decode(html.match(/<title>(.*?)<\/title>/)[1]);
  assert.equal(title, 'Schneidebretter & Holzlösungen für Gastronomie | Edle Hölzer');
  assert.ok(title.length <= 65);
  const main = decode(html.split('<main id="gastro-inhalt">')[1]).split(/\s+/).slice(0, 120).join(' ');
  for (const phrase of ['Gastronomie', 'Restaurants', 'Hotels', 'Schneidebretter', 'Servierbretter', 'Massivholz', 'Maße', 'Machbarkeit', 'Mittelhessen']) assert.ok(main.includes(phrase), phrase);
});
test('WebPage, breadcrumb and six FAQ answers agree with visible content', () => {
  assert.deepEqual(graph.map(item => item['@type']), ['WebPage', 'BreadcrumbList', 'FAQPage']);
  const breadcrumb = graph[1].itemListElement;
  assert.equal(breadcrumb.at(-1).item, url);
  assert.equal(breadcrumb.at(-1).position, 2);
  const faq = graph[2].mainEntity;
  assert.equal(faq.length, 6);
  const visible = [...html.matchAll(/<details class="faqItem"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)];
  assert.equal(visible.length, 6);
  for (const [index, item] of faq.entries()) {
    assert.equal(decode(visible[index][1]), item.name);
    assert.equal(decode(visible[index][2]), item.acceptedAnswer.text);
  }
  assert.ok(!graph.some(item => ['Product', 'Offer', 'Review'].includes(item['@type'])));
});
test('sitemap, topic overview, site search and contextual incoming links include the route', () => {
  assert.equal(read('sitemap.xml').split(`<loc>${url}</loc>`).length - 1, 1);
  assert.ok(JSON.parse(read('assets/search-pages.json')).some(page => page.url === route));
  for (const file of ['sitemap-uebersicht.html', 'handgefertigte-holzprodukte-fuer-unternehmen/index.html', 'schneidebrett-nach-mass/index.html', 'atelier/index.html']) assert.ok(read(file).includes(`href="${route}"`), file);
  assert.ok(!read('b2b.html').includes('href="/schneidebretter-aus-holz-gastronomie/"'), 'Legacy B2B redirect stays a redirect');
});
test('portfolio selection comes from four active available catalog records', () => {
  const ids = JSON.parse(html.match(/var gastroProductIds = (\[[^;]+\]);/)[1]);
  assert.equal(ids.length, 4);
  const products = JSON.parse(read('products.json')).products;
  for (const id of ids) {
    const p = products.find(p => p.listingId === id);
    assert.ok(p && p.active && p.directListingUrlVerified, id);
    assert.equal(p.availabilityStatus, 'available');
    assert.equal(p.category, 'board');
  }
  assert.match(html, /product\.availabilityStatus === "available"/);
  assert.match(html, /renderProductGrid\("products-gastro"/);
});
test('concept labels prevent invented inventory and unnecessary production imagery', () => {
  assert.match(html, /Sonderanfertigung \/ Konzept/);
  assert.match(html, /kein Espresso-Serienprodukt/);
  assert.doesNotMatch(html, /holzbrett-kanten-fraesen|id="planung"/);
  assert.doesNotMatch(html, /Burg Hotel|Stauffenberg|Referenzkunde|HACCP-konform|kostenlose Vor-Ort|erfolgreich umgesetzt für|Wir bauen alles/i);
  assert.match(html, /bestimmte Umbaumaßnahmen im Innenausbau sind nach Abstimmung möglich/);
  assert.match(html, /Frühstücks-, Brunch- und Serviertabletts/);
  assert.doesNotMatch(html, /data-carousel-(controls|position)/);
});
test('inquiry reuses shared Formspree handler, accessible labels and optional details', () => {
  assert.match(html, /form data-board-inquiry action="https:\/\/formspree.io\/f\/maqanpld" method="POST"/);
  assert.ok(html.includes('/assets/js/board-inquiry.js'));
  assert.match(html, /name="email" required autocomplete="email"/);
  assert.match(html, /name="name" required autocomplete="name"/);
  assert.match(html, /name="budget" required maxlength="120"/);
  assert.match(html, /name="budget_basis" required/);
  assert.match(html, /name="_gotcha" tabindex="-1" autocomplete="off"/);
  assert.match(html, /<summary>Weitere Angaben hinzufügen \(optional\)<\/summary>/);
  assert.match(html, /<textarea name="message" maxlength="3000" required/);
  assert.equal((html.match(/name="message"/g) || []).length, 1);
  assert.match(html, /data-gastro-optional-message/);
  assert.doesNotMatch(html, /type="file"/);
  for (const field of ['company', 'product_idea', 'quantity', 'dimensions', 'wood', 'engraving', 'timing', 'budget', 'phone', 'message', 'reference']) assert.ok(html.includes(`name="${field}"`), field);
  assert.match(html, /role="status" aria-live="polite" tabindex="-1"/);
  assert.match(html, /href="\/datenschutz.html"/);
});
test('compact page puts mandatory budget inquiry before reference products and explains quantity pricing', () => {
  assert.ok(html.indexOf('id="loesungen"') < html.indexOf('id="projektpreis"'));
  assert.ok(html.indexOf('id="projektpreis"') < html.indexOf('id="anfrage"'));
  assert.ok(html.indexOf('id="anfrage"') < html.indexOf('id="sortiment"'));
  const form = html.split('<form data-board-inquiry')[1].split('</form>')[0];
  assert.ok(form.indexOf('name="budget"') < form.indexOf('<details>'));
  assert.equal((form.match(/name="budget"/g) || []).length, 1);
  assert.match(html, /Preise gelten für die jeweiligen Einzelangebote/);
  assert.match(html, /mengenabhängigen Stückpreis/);
  assert.match(html, /100 Exemplaren/);
  assert.match(form, /51–100/);
  assert.match(html, /data-gastro-carousel/);
  assert.ok(!read('assets/css/gastronomie.css').includes('#244c40'));
});
test('outgoing product, custom, groove, engraving and workshop paths are real', () => {
  for (const target of ['/produkte.html', '/schneidebrett-nach-mass/', '/schneidebrett-saftrille/', '/schneidebrett-mit-gravur/', '/atelier/']) {
    assert.ok(html.includes(`href="${target}"`));
    assert.ok(fs.existsSync(path.join(root, target, target.endsWith('/') ? 'index.html' : '')));
  }
});
test('image references use existing local files or exact catalog photos, not generated assets', () => {
  const products = JSON.parse(read('products.json')).products;
  const sources = new Set(products.flatMap(p => [p.image, ...(p.gallery || [])]));
  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
    if (match[1].startsWith('https:')) assert.ok(sources.has(match[1].replace('/il_794xN.', '/il_fullxfull.')), match[1]);
    else assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
    for (const attribute of ['alt=', 'width=', 'height=']) assert.ok(match[0].includes(attribute), attribute);
  }
});

test('both languages expose reciprocal alternates, PE request wording and matching FAQ schema', () => {
  for (const [source, pageRoute, language] of [[html, route, 'de'], [english, englishRoute, 'en']]) {
    assert.ok(source.includes('<html lang="' + language + '">'));
    assert.ok(source.includes('rel="canonical" href="https://edlehoelzer.de' + pageRoute + '"'));
    for (const [lang, target] of [['de', route], ['en', englishRoute], ['x-default', route]]) {
      assert.ok(source.includes('hreflang="' + lang + '" href="https://edlehoelzer.de' + target + '"'));
    }
    assert.equal(read('sitemap.xml').split('<loc>https://edlehoelzer.de' + pageRoute + '</loc>').length - 1, 1);
    const schema = JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.equal(schema[0].inLanguage, language);
    assert.equal(schema[0].url, 'https://edlehoelzer.de' + pageRoute);
    const visible = [...source.matchAll(/<details class="faqItem"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)];
    assert.equal(visible.length, 6);
    schema[2].mainEntity.forEach((item, i) => {
      assert.equal(decode(visible[i][1]), item.name);
      assert.equal(decode(visible[i][2]), item.acceptedAnswer.text);
    });
    assert.match(schema[2].mainEntity.at(-1).acceptedAnswer.text, /PE 500/);
    assert.doesNotMatch(schema[2].mainEntity.at(-1).acceptedAnswer.text, /HACCP|certified|zertifiziert|zugelassen/i);
    assert.ok(JSON.parse(read('assets/search-pages.json')).some(page => page.url === pageRoute));
  }
  assert.match(html, /<h1[^>]*>Individuelle Schneidebretter und Servierbretter aus Holz für die Gastronomie<\/h1>/);
  assert.match(english, /<h1[^>]*>Custom wooden cutting and serving boards for restaurants and hotels<\/h1>/);
  assert.match(english, /Suitable material documentation and technical feasibility are prerequisites/);
  assert.match(read('schneidebretter-gastronomie/index.html'), /http-equiv="refresh"/);
  assert.ok(!read('sitemap.xml').includes('<loc>https://edlehoelzer.de/schneidebretter-gastronomie/</loc>'));
});
