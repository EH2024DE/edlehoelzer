import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const apiBase = process.env.SHOP_API_BASE || '';
if (apiBase) {
  const url = new URL(apiBase);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || /[\s"<>]/.test(apiBase)) throw new Error('SHOP_API_BASE must be a public HTTPS API URL without credentials, query or fragment');
}
for (const en of [false, true]) {
  const page = en ? '/en/shop-preview/' : '/shop-vorschau/';
  const t = en ? {
    title: 'The Edle Hölzer collection', subtitle: 'Cutting boards, kitchen tools and wood care. Direct checkout for Germany; EU orders by enquiry.',
    preview: 'Preview · no real payments', products: 'All products', cart: 'Your cart', items: 'items',
    empty: 'Your cart is empty.', checkout: 'Preview checkout', tax: 'No VAT charged (§19 UStG).',
    payment: 'Preview only · no payment',
    note: 'Preview prices from the current starting prices. Wood-specific prices, shipping and dispatch times still require approval. Example photos show individual wood grain.',
    warranty: 'Your statutory warranty rights', rights: 'EU information on your rights', close: 'Close',
    demo: 'Checkout preview', demoTotal: 'Preview total including the stated shipping assumption',
    help: 'A personal request?', contact: 'Contact us', imprint: 'Imprint', privacy: 'Privacy', retry: 'Try again',
    noscript: 'This cart requires JavaScript. You can also contact us directly.'
  } : {
    title: 'Das Sortiment von Edle Hölzer', subtitle: 'Schneidebretter, Küchenhelfer und Holzpflege. Direkter Checkout für Deutschland; EU auf Anfrage.',
    preview: 'Vorschau · keine echten Zahlungen', products: 'Alle Produkte', cart: 'Dein Warenkorb', items: 'Artikel',
    empty: 'Dein Warenkorb ist leer.', checkout: 'Bezahlablauf ansehen', tax: 'Kein Umsatzsteuerausweis (§19 UStG).',
    payment: 'Nur Vorschau · keine Zahlung',
    note: 'Vorschaupreise auf Basis der aktuellen Ab-Preise. Holzartspezifische Preise, Versand und Lieferzeiten sind noch freizugeben. Beispielfotos zeigen individuelle Holzmaserungen.',
    warranty: 'Deine gesetzlichen Gewährleistungsrechte', rights: 'EU-Informationen zu deinen Rechten', close: 'Schließen',
    demo: 'Vorschau des Bezahlablaufs', demoTotal: 'Vorschau-Gesamtbetrag einschließlich angezeigter Versandannahme',
    help: 'Lieber persönlich abstimmen?', contact: 'Kontakt aufnehmen', imprint: 'Impressum', privacy: 'Datenschutz', retry: 'Erneut versuchen',
    noscript: 'Dieser Warenkorb benötigt JavaScript. Du kannst uns auch direkt kontaktieren.'
  };
  const html = `<!doctype html>
<html lang="${en ? 'en' : 'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${t.title} | Edle Hölzer</title><meta name="description" content="${t.preview}"><link rel="canonical" href="https://edlehoelzer.de${page}"><link rel="stylesheet" href="/assets/css/shop-pilot.css?v=20261028-pilot"><script src="/assets/js/shop-pilot.js?v=20261028-pilot" defer></script></head>
<body><header><div class="pilotHeader"><a class="pilotBrand" href="https://edlehoelzer.de/"><img src="/assets/logo.png" width="36" height="36" alt="">Edle Hölzer</a><nav aria-label="${en ? 'Navigation' : 'Navigation'}"><a href="https://edlehoelzer.de/${en ? 'en/products.html' : 'produkte.html'}">${t.products}</a><div class="pilotLang"><a href="/shop-vorschau/"${en ? '' : ' aria-current="page"'}>DE</a><a href="/en/shop-preview/"${en ? ' aria-current="page"' : ''}>EN</a></div><a class="pilotCartLink" href="#warenkorb"><img src="/assets/icons/lucide/shopping-bag.svg" width="22" height="22" alt=""><span data-shop-count>0</span><span class="sr-only">${t.items}</span></a></nav></div></header>
<main><div class="pilotIntro"><div><h1>${t.title}</h1><p>${t.subtitle}</p></div><span class="pilotBadge">${t.preview}</span></div>
<div class="pilotLayout"><section class="pilotProducts" data-shop-products aria-label="${t.products}"><p>${en ? 'Loading products…' : 'Produkte werden geladen…'}</p></section>
<aside class="pilotCart" id="warenkorb" aria-label="${t.cart}"><h2>${t.cart}<span><span data-shop-count>0</span> ${t.items}</span></h2><div data-shop-cart><p class="pilotEmpty">${t.empty}</p></div><dl class="pilotSummary" data-shop-summary></dl><p class="pilotTax">${t.tax}</p><p class="pilotFine" data-shop-shipping-note></p><button type="button" class="pilotCheckout" data-shop-checkout disabled>${t.checkout}</button><p class="pilotPaymentNote"><img src="/assets/icons/lucide/lock.svg" alt="" width="15" height="15">${t.payment}</p><div class="pilotStatus" role="status" aria-live="polite" data-shop-status></div><button class="pilotRetry" data-shop-retry type="button">${t.retry}</button>
<details><summary>${t.warranty}</summary><div class="pilotGuarantee"><a href="/assets/legal/eu-legal-guarantee-${en ? 'en' : 'de'}.svg" target="_blank" rel="noopener"><img src="/assets/legal/eu-legal-guarantee-${en ? 'en' : 'de'}.svg" width="700" height="990" alt="${t.warranty}"></a></div><a href="https://europa.eu/youreurope/${en ? 'guarantees' : 'garantien'}">${t.rights}</a></details></aside></div>
<p class="pilotFootnote">${t.note}</p><noscript><p class="pilotFootnote">${t.noscript} <a href="mailto:info@edlehoelzer.de">${t.contact}</a></p></noscript></main>
<footer class="pilotFooter"><span>Edle Hölzer · ${en ? 'Handcrafted in Central Hesse' : 'Handgefertigt in Mittelhessen'}</span><div><a href="https://edlehoelzer.de/impressum.html">${t.imprint}</a><a href="https://edlehoelzer.de/datenschutz.html">${t.privacy}</a></div></footer>
<a class="pilotMobileCart" href="#warenkorb"><span><img src="/assets/icons/lucide/shopping-bag.svg" width="20" height="20" alt="">${t.cart} · <span data-shop-count>0</span></span><span class="pilotMobileCart__amount" aria-live="polite" aria-atomic="true"><strong data-shop-mobile-total>0,00 €</strong><small data-shop-mobile-label>${en?'Total':'Gesamtsumme'}</small></span></a>
<dialog class="pilotDialog" data-shop-dialog aria-labelledby="checkout-title"><header><h2 id="checkout-title">${t.demo}</h2><button class="pilotIcon" type="button" data-close aria-label="${t.close}" title="${t.close}"><img src="/assets/icons/lucide/x.svg" width="20" height="20" alt=""></button></header><strong data-demo-total></strong><small>${t.demoTotal}</small><p data-demo-status></p></dialog></body></html>\n`;
  const destination = path.join(root, page, 'index.html');
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  const filters = '<div class="pilotCatalogue"><form class="pilotFilters" data-shop-filters role="search"><label>'+(en?'Search':'Suchen')+'<input type="search" data-shop-search></label><label>'+(en?'Group':'Produktgruppe')+'<select data-shop-group><option value="all">'+(en?'All products':'Alle Produkte')+'</option><option value="board">'+(en?'Boards':'Bretter')+'</option><option value="accessory">'+(en?'Tools & accessories':'Küchenhelfer & Zubehör')+'</option><option value="care">'+(en?'Care':'Pflege')+'</option></select></label><label>'+(en?'Availability':'Verfügbarkeit')+'<select data-shop-availability><option value="all">'+(en?'All':'Alle')+'</option><option value="available">'+(en?'Available / made to order':'Verfügbar / auf Bestellung')+'</option><option value="sold">'+(en?'Sold pieces':'Vergriffene Stücke')+'</option></select></label><p data-shop-results role="status"></p></form>';
  const upgrade = '<label class="pilotShippingUpgrade" data-shop-insured-row hidden><input type="checkbox" data-shop-insured><span>'+(en?'Insured DHL shipping · +€3.49':'Versicherter DHL-Versand · +3,49 €')+'<small>'+(en?'€6.19 instead of €2.70 uninsured shipping':'6,19 € statt 2,70 € unversicherter Versand')+'</small></span></label>';
  fs.writeFileSync(destination, html.replace('</head>', '<meta name="shop-api" content="' + apiBase + '"></head>').replace('data-shop-retry type="button"', 'data-shop-retry type="button" hidden').replace('<section class="pilotProducts"', filters+'<section id="sortiment" class="pilotProducts"').replace('</section>\n<aside','</section></div>\n<aside').replace('<dl class="pilotSummary"',upgrade+'<dl class="pilotSummary"').replace('href="https://edlehoelzer.de/'+(en?'en/products.html':'produkte.html')+'"','href="#sortiment"').replaceAll('v=20261028-pilot','v=20261028-personalisation').replace(/<img /g, '<img loading="lazy" ').replace('loading="lazy" src="/assets/logo.png"', 'loading="eager" src="/assets/logo.png"'));
}
console.log('Built isolated DE/EN shop preview pages (noindex).');
