const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('schneidebretter-gastronomie/index.html');
const route = '/schneidebretter-gastronomie/';
const url = 'https://edlehoelzer.de' + route;
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
test('WebPage, breadcrumb and five FAQ answers agree with visible content', () => {
  assert.deepEqual(graph.map(item => item['@type']), ['WebPage', 'BreadcrumbList', 'FAQPage']);
  const breadcrumb = graph[1].itemListElement;
  assert.equal(breadcrumb.at(-1).item, url);
  assert.equal(breadcrumb.at(-1).position, 2);
  const faq = graph[2].mainEntity;
  assert.equal(faq.length, 5);
  const visible = [...html.matchAll(/<details class="faqItem"><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/g)];
  assert.equal(visible.length, 5);
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
  assert.ok(!read('b2b.html').includes('href="/schneidebretter-gastronomie/"'), 'Legacy B2B redirect stays a redirect');
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
test('concept and planning labels prevent invented inventory and customer references', () => {
  assert.match(html, /Sonderanfertigung \/ Konzept/);
  assert.match(html, /kein Espresso-Serienprodukt/);
  assert.match(html, /Planungsbeispiel · Steakbrett/);
  assert.match(html, /kein Gastro-Kundenprojekt/);
  assert.doesNotMatch(html, /Burg Hotel|Stauffenberg|Referenzkunde|HACCP-konform|kostenlose Vor-Ort|erfolgreich umgesetzt für|Wir bauen alles/i);
  assert.match(html, /Möbelbau, Innenausbau und komplette Gastronomieausstattung sind nicht Teil dieses Angebots/);
});
test('inquiry reuses shared Formspree handler, accessible labels and optional details', () => {
  assert.match(html, /form data-board-inquiry action="https:\/\/formspree.io\/f\/maqanpld" method="POST"/);
  assert.ok(html.includes('/assets/js/board-inquiry.js'));
  assert.match(html, /name="email" required autocomplete="email"/);
  assert.match(html, /name="name" required autocomplete="name"/);
  assert.match(html, /name="_gotcha" tabindex="-1" autocomplete="off"/);
  assert.match(html, /<summary>Weitere Angaben hinzufügen \(optional\)<\/summary>/);
  assert.match(html, /<textarea name="message" maxlength="3000"/);
  assert.doesNotMatch(html, /type="file"/);
  for (const field of ['company', 'product_idea', 'quantity', 'dimensions', 'wood', 'engraving', 'timing', 'budget', 'phone', 'message', 'reference']) assert.ok(html.includes(`name="${field}"`), field);
  assert.match(html, /role="status" aria-live="polite" tabindex="-1"/);
  assert.match(html, /href="\/datenschutz.html"/);
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
