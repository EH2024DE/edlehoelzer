import fs from 'node:fs';
import path from 'node:path';
import {ROOT,publicCatalog} from '../tools/shop-server/catalog.mjs';
import {renderErbstueckStory} from './atelier-story.mjs';
import {renderAtelierHome} from './atelier-home.mjs';

const catalog=publicCatalog();
const featured='product-4370769708';
const esc=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const price=(offer,en)=>new Intl.NumberFormat(en?'en-IE':'de-DE',{style:'currency',currency:'EUR'}).format(offer.unitCents/100);
const image=src=>String(src).replace('/il_fullxfull.','/il_794xN.');
for(const en of [false,true]){
  const base=en?'/en/atelier-preview/':'/atelier-vorschau/';
  const shop=en?'/en/shop-preview/':'/shop-vorschau/';
  const detail=base+'erbstueck/';
  const t=en?{
    collection:'Collection',heirloom:'Erbstück',custom:'Made to measure',cart:'Cart',preview:'Design preview · no real payments',
    title:'Edle Hölzer',intro:'Cutting boards, kitchen tools and individual pieces. Handcrafted in Central Hesse.',
    all:'All pieces',board:'Cutting boards',serving:'Serving & breakfast',tools:'Kitchen tools',coasters:'Coasters',care:'Care & stands',
    archive:'Include sold pieces',search:'Search the collection',view:'View piece',sold:'Sold',from:'From ',
    storyTitle:'Old oak. A new chapter.',story:'First a tree, then a timber-frame beam. Today, a cutting board with its own grain and traces of the wood’s history.',
    proof:'The character is in the material.',proofText:'Historical oak and a quiet beech accent. Selected, joined and finished by hand in our workshop in Central Hesse.',
    contents:'More than a cutting board.',contentsText:'A matching stand, care balm and care instructions belong with your Erbstück. A personally addressed card completes the set.',
    origin:'A story worth keeping.',originText:'For beams recovered from buildings we helped dismantle, a wooden card records the former location by town or region. No private addresses or GPS coordinates.',
    detailIntro:'Historical oak, beech accents and a matching stand. An individual piece for your kitchen.',
    kitchen:'View on my worktop',back:'Back to collection',studio:'An individual piece, from every angle',next:'Explore other pieces',
    footer:'Handcrafted in Central Hesse',imprint:'Imprint',privacy:'Privacy'
  }:{
    collection:'Kollektion',heirloom:'Erbstück',custom:'Nach Maß',cart:'Warenkorb',preview:'Gestaltungsprobe · keine echten Zahlungen',
    title:'Edle Hölzer',intro:'Schneidebretter, Küchenhelfer und besondere Einzelstücke. Von Hand gefertigt in Mittelhessen.',
    all:'Alle Stücke',board:'Schneidebretter',serving:'Servieren & Frühstück',tools:'Küchenhelfer',coasters:'Untersetzer',care:'Pflege & Halter',
    archive:'Vergebene Stücke einbeziehen',search:'Kollektion durchsuchen',view:'Stück ansehen',sold:'Vergeben',from:'Ab ',
    storyTitle:'Alte Eiche. Ein neues Kapitel.',story:'Erst Baum, dann Fachwerksbalken. Heute ein Schneidebrett mit eigener Maserung und den Spuren seiner Holzgeschichte.',
    proof:'Der Charakter liegt im Material.',proofText:'Historische Eiche und ein ruhiger Akzent aus Buche. Ausgewählt, gefügt und von Hand vollendet in unserer Werkstatt in Mittelhessen.',
    contents:'Mehr als ein Schneidebrett.',contentsText:'Ein passender Halter, Pflegebalsam und eine Pflegeanleitung gehören zu deinem Erbstück. Eine persönlich adressierte Karte macht das Set vollständig.',
    origin:'Eine Geschichte zum Bewahren.',originText:'Bei Balken aus Gebäuden, an deren Rückbau wir beteiligt waren, hält eine Holzkarte den ehemaligen Standort als Ort oder Region fest. Ohne private Adressen oder GPS-Koordinaten.',
    detailIntro:'Historische Eiche, Akzente aus Buche und ein passender Halter. Ein Einzelstück für deine Küche.',
    kitchen:'Auf meinem Tresen ansehen',back:'Zurück zur Kollektion',studio:'Ein Einzelstück, aus jedem Blickwinkel',next:'Weitere Stücke entdecken',
    footer:'Handgefertigt in Mittelhessen',imprint:'Impressum',privacy:'Datenschutz'
  };
  const header=()=>`<header class="atelierHeader"><a class="atelierBrand" href="${base}start/"><img src="/assets/logo.png" width="32" height="32" alt="">Edle Hölzer</a><nav class="atelierDesktopNav" aria-label="${en?'Main navigation':'Hauptnavigation'}"><a href="${base}">${t.collection}</a><a class="atelierCustomLink" href="${shop}?product=xxl-custom-board">${t.custom}</a><a href="${detail}">${t.heirloom}</a></nav><div class="atelierHeaderActions"><a href="${en?'/atelier-vorschau/':'/en/atelier-preview/'}" lang="${en?'de':'en'}">${en?'DE':'EN'}</a><a class="atelierCartLink" href="${shop}#warenkorb" aria-label="${t.cart}"><img src="/assets/icons/lucide/shopping-bag.svg" width="20" height="20" alt=""><span data-atelier-count>0</span></a><button class="atelierMenuToggle" type="button" data-menu-open aria-controls="atelier-menu" aria-expanded="false" aria-label="${en?'Open menu':'Menü öffnen'}"><img src="/assets/icons/lucide/menu.svg" width="22" height="22" alt=""></button></div></header><dialog class="atelierMenu" id="atelier-menu" aria-label="${en?'Navigation':'Navigation'}"><div class="atelierMenuHeading"><span>Edle Hölzer</span><button type="button" data-menu-close aria-label="${en?'Close menu':'Menü schließen'}" autofocus><img src="/assets/icons/lucide/x.svg" width="22" height="22" alt=""></button></div><nav aria-label="${en?'All pages':'Alle Seiten'}"><a href="${base}start/">${en?'Home':'Startseite'}</a><a href="${base}">${t.collection}</a><a href="${shop}?product=xxl-custom-board">${t.custom}</a><a href="${detail}">${t.heirloom}</a><a href="https://edlehoelzer.de/${en?'en/#b2b':'handgefertigte-holzprodukte-fuer-unternehmen/'}">${en?'Corporate gifts':'Firmengeschenke'}</a><div class="atelierMenuSecondary"><a href="https://edlehoelzer.de/${en?'en/products.html#produktfinder':'produkte.html#produktfinder'}">${en?'Board finder':'Brettfinder'}</a><a href="https://edlehoelzer.de/${en?'en/care.html':'pflege.html'}">${en?'Care':'Pflege'}</a><a href="https://edlehoelzer.de/schneidebretter-aus-holz-gastronomie/">${en?'For hospitality':'Für die Gastronomie'}</a></div></nav></dialog>`;
  const footer=()=>`<footer class="atelierFooter"><span>Edle Hölzer · ${t.footer}</span><div><a href="https://edlehoelzer.de/impressum.html">${t.imprint}</a><a href="https://edlehoelzer.de/datenschutz.html">${t.privacy}</a></div><small>${t.preview}</small></footer>`;
  const head=`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://edlehoelzer.de${base}"><title>${t.collection} | Edle Hölzer · ${en?'Preview':'Vorschau'}</title><link rel="stylesheet" href="/assets/css/atelier-preview.css"><script src="/assets/js/atelier-preview.js" defer></script><script src="/assets/js/site-preview.js" defer></script>`;
  const curated=[featured,'product-1850610674','product-4417507555'];
  const order=offer=>curated.includes(offer.sku)?curated.indexOf(offer.sku):curated.length;
  const offers=[...catalog.offers].sort((a,b)=>order(a)-order(b));
  const renderCard=offer=>`<article class="atelierPiece" data-atelier-piece="${esc(offer.sku)}" data-groups="${esc(offer.catalogGroups.join(' '))}" data-sold="${offer.sold}"><a href="${offer.sku===featured?detail:shop+'?product='+encodeURIComponent(offer.sku)}" class="atelierPieceLink"><div class="atelierPieceImage"><img src="${esc(image(offer.image))}" alt="${esc(en?offer.nameEn:offer.name)}" width="760" height="760" loading="${offer.sku===featured?'eager':'lazy'}"></div><div class="atelierPieceMeta"><h2>${esc(en?offer.nameEn:offer.name)}</h2><span data-atelier-price>${offer.sold?t.sold:t.from+price(offer,en)}</span></div><p>${esc(en?offer.detailEn:offer.detail)}</p><span class="atelierPieceAction">${t.view} <span aria-hidden="true">↗</span></span></a></article>`;
  const cards=offers.map(renderCard).join('');
  const homeIds=['product-4522458953','product-1850610674','product-1776273564','xxl-custom-board'];
  const homeCards=homeIds.map(sku=>{
    const offer=catalog.offers.find(offer=>offer.sku===sku);
    if(!offer||offer.sold)throw new Error('Homepage selection unavailable: '+sku);
    if(sku==='product-4522458953')return renderCard({...offer,image:offer.gallery[4]});
    if(sku==='product-1850610674')return renderCard({...offer,detail:offer.detail+' · Halter & Pflegebalsam inklusive',detailEn:offer.detailEn+' · Stand & care balm included'});
    if(sku==='product-1776273564')return renderCard({...offer,image:offer.gallery[1]});
    if(sku!=='xxl-custom-board')return renderCard(offer);
    const oakPrice=price({unitCents:offer.woodPrices.Eiche},en);
    return renderCard({...offer,image:'/assets/custom-projects/eiche-xxl-dark.jpg',detail:offer.detail+' · Gezeigt: Eiche '+oakPrice,detailEn:offer.detailEn+' · Shown: oak '+oakPrice});
  }).join('');
  const groups=['all','board','serving','tools','coasters','care'].map(group=>`<button type="button" data-atelier-group="${group}" aria-pressed="${group==='all'}">${t[group]}</button>`).join('');
  const collection=`<!doctype html><html lang="${en?'en':'de'}"><head>${head}</head><body class="atelierCollection">${header()}<main class="atelierMain"><section class="atelierIntro"><p class="atelierEyebrow">${t.collection} / Mittelhessen</p><h1>${t.title}</h1><p>${t.intro}</p></section><section aria-label="${t.collection}"><div class="atelierFilters"><div class="atelierGroups" role="group" aria-label="${t.collection}">${groups}</div><div class="atelierFilterTools"><label class="atelierSearch"><span class="sr-only">${t.search}</span><input type="search" data-atelier-search placeholder="${t.search}"></label><label class="atelierArchive"><input type="checkbox" data-atelier-archive>${t.archive}</label></div></div><p class="atelierResults" data-atelier-results role="status"></p><div class="atelierGrid">${cards}</div><p data-atelier-empty hidden>${en?'No pieces match this selection.':'Für diese Auswahl gibt es gerade keine passenden Stücke.'}</p></section></main>${footer()}</body></html>`;
  let product=fs.readFileSync(path.join(ROOT,shop,'index.html'),'utf8');
  product=product.replace('<body>','<body class="atelierDetail">').replace('</head>','<link rel="stylesheet" href="/assets/css/atelier-preview.css"><script src="/assets/js/atelier-preview.js" defer></script><script src="/assets/js/site-preview.js" defer></script></head>');
  product=product.replace(/<header>[\s\S]*?<\/header>/,header());
  const otherLanguage=en?'/atelier-vorschau/':'/en/atelier-preview/';
  product=product.replace('href="'+otherLanguage+'" lang=','href="'+otherLanguage+'erbstueck/" lang=');
  const introStart=product.indexOf('<main><div class="pilotIntro">'),introEnd=product.indexOf('<div class="pilotLayout">');
  product=product.slice(0,introStart)+`<main><div class="atelierDetailIntro"><a href="${base}">${t.back}</a><p class="atelierEyebrow">Erbstück / No. 004</p><h1>Erbstück No. 004</h1><p>${t.detailIntro}</p></div>`+product.slice(introEnd);
  product=product.replace('data-shop-products aria-label','data-shop-products data-product-focus="'+featured+'" aria-label');
  const stories=renderErbstueckStory(en,base,esc);
  product=product.replace('<p class="pilotFootnote">',stories+'<p class="pilotFootnote">');
  product=product.replace(/<footer class="pilotFooter">[\s\S]*?<\/footer>/,footer());
  product=product.replace('<title>','<title>Erbstück No. 004 · ').replace('href="https://edlehoelzer.de'+shop+'"','href="https://edlehoelzer.de'+detail+'"');
  const home=renderAtelierHome({en,base,shop,detail,head,header:header(),footer:footer(),cards:homeCards});
  for(const [route,html]of [[base,collection],[detail,product],[base+'start/',home]]){
    const dir=path.join(ROOT,route);fs.mkdirSync(dir,{recursive:true});
    const localised=en?html.replaceAll('https://edlehoelzer.de/schneidebretter-aus-holz-gastronomie/','https://edlehoelzer.de/en/wooden-cutting-boards-for-restaurants/').replaceAll('/en/products.html#produktfinder','/en/products.html#product-finder'):html;
    fs.writeFileSync(path.join(dir,'index.html'),localised.replace(/<img (?![^>]*\bloading=)/g,'<img loading="eager" '));
  }
}
console.log('Built isolated DE/EN atelier collection and Erbstueck previews.');
