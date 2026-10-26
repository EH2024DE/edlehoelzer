const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const copy = vm.runInNewContext(source.slice(0, source.indexOf('document.documentElement.classList')) + '\nEdleProductCopy', { });
const esc = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const origin = 'https://edlehoelzer.de';
const catalog = data.products.filter(p => !p.canonicalProductId);
for (const en of [false, true]) {
  const template = fs.readFileSync(path.join(root, en ? 'en/products.html' : 'produkte.html'), 'utf8');
  const header = template.slice(template.indexOf('<header'), template.indexOf('</header>') + 9).replace(/href="#produktfinder"/g, 'href="' + (en ? '/en/products.html' : '/produkte.html') + '#produktfinder"');
  const footer = template.slice(template.indexOf('<footer'), template.indexOf('</footer>') + 9);
  const directory = '<!-- Generated product directory -->\n<details class="container productDirectory"><summary>' + (en ? 'All product pages' : 'Alle Produktseiten') + '</summary><ul>' + catalog.map(p => '<li><a href="' + (en ? '/en' : '') + p.productPath + '">' + esc(copy.text(p.displayName || p.name, en)) + '</a></li>').join('') + '</ul></details>\n<!-- End generated product directory -->';
  const index = template.replace(/\s*<!-- Generated product directory -->[\s\S]*?<!-- End generated product directory -->/g, '').replace('</main>', directory + '\n</main>');
  fs.writeFileSync(path.join(root, en ? 'en/products.html' : 'produkte.html'), index);
  for (const p of catalog) {
    if (!p.productPath) throw new Error('Missing stable productPath: ' + p.id);
    const url = (en ? '/en' : '') + p.productPath;
    const title = en ? copy.text(p.displayName || p.name, true) : p.name;
    const description = en ? copy.text(p.shortDescription || p.displayName, true) : (p.shortDescription || p.displayName || p.name);
    const sold = p.availabilityStatus === 'sold';
    const available = p.active === true && ['available', 'made_to_order'].includes(p.availabilityStatus);
    const status = sold ? (en ? 'Sold · One-of-a-kind inspiration' : 'Verkauft · Ein Unikat als Inspiration') : available ? (p.availabilityStatus === 'made_to_order' ? (en ? 'Made to order' : 'Auf Bestellung') : (en ? 'Available' : 'Verfügbar')) : (en ? 'Currently unavailable' : 'Aktuell nicht verfügbar');
    const facts = [[en ? 'Wood / material' : 'Holz / Material', p.material], [en ? 'Dimensions' : 'Maße', p.dimensionsReviewRequired ? (en ? 'See current offer' : 'Siehe aktuelles Angebot') : p.sizeLabel], [en ? 'Thickness' : 'Stärke', p.dimensionsReviewRequired ? '' : p.thicknessLabel]];
    const schema = {'@context':'https://schema.org', '@type':'Product', name:title, description, image:p.gallery?.length ? p.gallery : [p.image], sku:p.id, url:origin + url, brand:{'@type':'Brand',name:'Edle Hölzer'}};
    // No offer for archived/sold pieces, and no invented prices for variants.
    if (available && p.directListingUrlVerified && p.priceOrder > 0 && !p.variants?.length) schema.offers = {'@type':'Offer', url:origin + url, priceCurrency:'EUR', price:p.priceOrder, availability:'https://schema.org/' + (p.availabilityStatus === 'made_to_order' ? 'PreOrder' : 'InStock')};
    if (p.variants?.length) {
      schema['@type'] = 'ProductGroup';
      schema.productGroupID = p.id;
      schema.variesBy = [p.listingId === '4417507555' ? 'https://schema.org/material' : 'https://schema.org/pattern'];
      schema.hasVariant = p.variants.map(v => ({'@type':'Product', sku:p.id + '-' + v.id,
        name:title + ' · ' + (en ? v.nameEn : v.name), description,
        image:new URL(v.image || p.image, origin).href,
        ...(v.dimensions ? {size:v.dimensions} : {}),
        ...(p.listingId === '4417507555' ? {material:en ? v.nameEn : v.name} : {pattern:en ? v.nameEn : v.name}),
        ...(available && ['available','made_to_order'].includes(v.availabilityStatus) ? {offers:{'@type':'Offer', url:origin + url + '?variante=' + encodeURIComponent(v.id), price:v.priceOrder, priceCurrency:'EUR', availability:'https://schema.org/' + (v.availabilityStatus === 'made_to_order' ? 'PreOrder' : 'InStock')}} : {})
      }));
    }
    const variantText = p.variants?.length ? '<h2>' + (en ? 'Available versions' : 'Ausführungen') + '</h2><ul>' + p.variants.map(v => '<li>' + esc(en ? v.nameEn : v.name) + ' · ' + esc(v.dimensions) + ' · ' + Number(v.priceOrder).toLocaleString(en ? 'en-IE' : 'de-DE', {style:'currency',currency:'EUR'}) + (v.availabilityStatus === 'made_to_order' ? (en ? ' · Made to order' : ' · Auf Bestellung') : '') + '</li>').join('') + '</ul>' : '';
    const pageHeader = header.replace(/href="\/produkte.html"/g, 'href="' + p.productPath + '"').replace(/href="\/en\/products.html"/g, 'href="/en' + p.productPath + '"');
    const html = `<!doctype html>
<html lang="${en ? 'en' : 'de'}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Edle Hölzer</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${origin + url}">
<link rel="alternate" hreflang="de" href="${origin + p.productPath}">
<link rel="alternate" hreflang="en" href="${origin + '/en' + p.productPath}">
<link rel="alternate" hreflang="x-default" href="${origin + p.productPath}">
<meta property="og:type" content="product"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin + url}"><meta property="og:image" content="${esc(p.image)}">
<link rel="icon" href="/assets/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&amp;family=Playfair+Display:wght@500;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=20261026-product-pages">
<script type="application/ld+json">${json(schema)}</script>
<script src="/assets/js/consent-manager.js?v=20260823-intent" defer></script>
</head><body class="productDetailPage">
${pageHeader}
<main class="container productDetail" id="main-content">
<nav class="productDetail__breadcrumb" aria-label="${en ? 'Breadcrumb' : 'Brotkrümelnavigation'}"><a href="${en ? '/en/products.html' : '/produkte.html'}">${en ? 'All products' : 'Alle Produkte'}</a> / <span>${esc(en ? copy.text(p.displayName || p.name, true) : p.displayName || p.name)}</span></nav>
<div data-product-page="${esc(p.id)}" data-current-product-id="${esc(p.id)}" data-current-product-source="product-page">
<article class="productPreview"><div class="productPreview__media"><img src="${esc(p.image)}" alt="${esc(title)}" width="900" height="900" loading="eager" fetchpriority="high"></div><div class="productPreview__content">
<h1>${esc(title)}</h1><p>${esc(status)}</p><p>${esc(description)}</p>
${available && !p.variants?.length ? '<p>' + esc(p.priceLabel) + '</p>' : ''}
<dl class="productPreview__facts">${facts.filter(f => f[1]).map(f => '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(copy.text(f[1], en)) + '</dd></div>').join('')}</dl>
${variantText}
${available ? '<a class="btn btn--emphasis" href="' + esc(p.etsyListingUrl || p.etsyUrl) + '" target="_blank" rel="noopener">' + (en ? 'Configure and buy on Etsy' : 'Auf Etsy konfigurieren und kaufen') + '</a>' : '<a class="btn btn--emphasis" href="' + (en ? '/en/custom-cutting-board/' : '/schneidebrett-nach-mass/') + '">' + (en ? 'Request a similar piece' : 'Ähnliches Stück anfragen') + '</a>'}
</div></article></div>
<section class="productDetail__browse"><h2>${en ? 'Find your next favourite' : 'Dein nächstes Lieblingsstück'}</h2><a href="${en ? '/en/products.html#produktfinder' : '/produkte.html#produktfinder'}">${en ? 'Explore the product finder' : 'Zum Produktfinder'}</a><details><summary>${en ? 'Browse all products' : 'Alle Produkte entdecken'}</summary><ul>${catalog.map(other => '<li><a href="' + (en ? '/en' : '') + other.productPath + '">' + esc(copy.text(other.displayName || other.name, en)) + '</a></li>').join('')}</ul></details></section>
</main>${footer}
<script src="/main.js?v=20261026-product-pages"></script>
</body></html>\n`;
    const destination = path.join(root, url, 'index.html');
    fs.mkdirSync(path.dirname(destination), {recursive:true});
    fs.writeFileSync(destination, html);
  }
}
const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8').replace(/\s*<!-- Generated product pages -->[\s\S]*?<!-- End generated product pages -->/g, '');
sitemap = sitemap.replace('</urlset>', '  <!-- Generated product pages -->\n' + catalog.flatMap(p => [p.productPath, '/en' + p.productPath]).map(url => '  <url><loc>' + origin + url + '</loc></url>').join('\n') + '\n  <!-- End generated product pages -->\n</urlset>');
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Generated ${catalog.length} product pages in each language.`);
