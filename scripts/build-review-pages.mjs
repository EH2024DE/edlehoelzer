import fs from 'node:fs';
import path from 'node:path';
import {parse,parseFragment,serializeOuter as serialize,serialize as serializeDocument} from 'parse5';
import {root,walk,attr,text} from './audit-design-system.mjs';
import {allReviews,googleReviewMeta,originalText,reviewDateLabel} from './review-content.mjs';

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const reviews=allReviews(),meta=JSON.parse(fs.readFileSync(path.join(root,'data/reviews-meta.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;
if(new Set(reviews.map(r=>r.id)).size!==reviews.length)throw new Error('Duplicate review IDs');
for(const english of [false,true]){
  const home=parse(fs.readFileSync(path.join(root,english?'en/index.html':'index.html'),'utf8'));
  const nodes=walk(home),header=nodes.find(n=>n.tagName==='header'),footer=nodes.find(n=>n.tagName==='footer');
  for(const node of [...walk(header),...walk(footer)])for(const attribute of (node.attrs||[]).filter(a=>['href','src'].includes(a.name))){
    if(!/^(?:\/|#|[a-z]+:)/i.test(attribute.value)){
      const url=new URL(attribute.value,'https://edlehoelzer.de/'+(english?'en/':''));attribute.value=url.pathname+url.search+url.hash;
    }
  }
  for(const group of walk(header).filter(n=>(attr(n,'class')||'').split(/\s+/).some(c=>['lang','mobileMenu__lang'].includes(c)))){
    for(const link of walk(group).filter(n=>n.tagName==='a')){
      const language=text(link).trim();if(!['DE','EN'].includes(language))continue;
      const href=link.attrs.find(a=>a.name==='href');href.value=language==='DE'?'/bewertungen/':'/en/reviews/';
    }
  }
  const route=english?'/en/reviews/':'/bewertungen/';
  const title=english?'Customer reviews | Edle Hölzer':'Bewertungen & Erfahrungen | Edle Hölzer';
  const description=english?'Original Etsy and Google Maps reviews of Edle Hölzer: cutting boards, kitchen tools, wood care and personal service from our workshop in Central Hesse.':'Originale Etsy- und Google-Maps-Bewertungen zu Edle Hölzer: Erfahrungen mit Schneidebrettern, Küchenhelfern, Holzpflege und persönlichem Service.';
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'CollectionPage',name:title,url:'https://edlehoelzer.de'+route,inLanguage:english?'en':'de',description,isPartOf:{'@type':'WebSite',name:'Edle Hölzer',url:'https://edlehoelzer.de/'},dateModified:meta.lastUpdated},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:english?'Home':'Startseite',item:'https://edlehoelzer.de/'+(english?'en/':'')},{'@type':'ListItem',position:2,name:english?'Reviews':'Bewertungen',item:'https://edlehoelzer.de'+route}]}
  ]};
  const cards=reviews.map(review=>{
    const product=catalog.find(p=>String(p.listingId)===review.listingId);
    const name=english&&review.reviewerName==='Etsy-Kundin oder -Kunde'?'Etsy customer':review.reviewerName;
    const date=review.date?`<time datetime="${escape(review.date)}">${escape(review.date)}</time>`:escape(reviewDateLabel(review,english));
    return `<article class="reviewArchive__item" id="${escape(review.id)}" data-review-id="${escape(review.id)}"><header><h2>${escape(name)}</h2><p class="reviewArchive__meta">${date} · <a href="${escape(review.sourceUrl||meta.sourceUrl)}" target="_blank" rel="noopener">${escape(review.source)}</a> · <span aria-label="${review.rating} ${english?'out of 5 stars':'von 5 Sternen'}">${'★'.repeat(review.rating)}</span></p></header><blockquote>${escape(originalText(review))}</blockquote><p class="reviewArchive__product">${product?`<a href="${english?'/en':''}${escape(product.productPath)}">${escape(review.product)}</a>`:escape(review.product)}</p></article>`;
  }).join('\n');
  const html=`<!doctype html><html lang="${english?'en':'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://edlehoelzer.de${route}"><link rel="alternate" hreflang="de" href="https://edlehoelzer.de/bewertungen/"><link rel="alternate" hreflang="en" href="https://edlehoelzer.de/en/reviews/"><link rel="alternate" hreflang="x-default" href="https://edlehoelzer.de/bewertungen/"><link rel="icon" href="/assets/favicon-32x32.png"><link rel="stylesheet" href="/styles.css"><script src="/assets/js/consent-manager.js" defer></script><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body>${serialize(header)}<main class="reviewArchive"><section class="section"><div class="container"><nav class="breadcrumb" aria-label="${english?'Breadcrumb':'Brotkrumennavigation'}"><a href="/${english?'en/':''}">${english?'Home':'Startseite'}</a> / ${english?'Reviews':'Bewertungen'}</nav><div class="reviewArchive__intro"><div><p class="eyebrow">${english?'Customer feedback from Etsy':'Kundenstimmen von Etsy'}</p><h1>${english?'Reviews of Edle Hölzer':'Bewertungen von Edle Hölzer'}</h1><p>${english?`All ${reviews.length} original reviews imported from our Etsy shop. Feedback on cutting boards, kitchen tools, wood care and our personal service.`:`Alle ${reviews.length} Originalbewertungen aus unserem Etsy-Shop. Erfahrungen mit Schneidebrettern, Küchenhelfern, Holzpflege und unserem persönlichen Service.`}</p><p class="reviewArchive__meta">${Number(meta.ratingAverage).toLocaleString(english?'en-GB':'de-DE',{minimumFractionDigits:1})} / 5 · ${meta.ratingCount} ${english?'Etsy reviews':'Etsy-Bewertungen'} · ${english?'Data updated':'Datenstand'}: ${meta.lastUpdated}</p><a class="textLink" href="${escape(meta.sourceUrl)}" target="_blank" rel="noopener" data-etsy-link>${english?'Read reviews on Etsy':'Bewertungen auf Etsy ansehen'} →</a></div><img src="/assets/team/oezguer-workshop-800.webp" alt="${english?'Özgür at work in the Edle Hölzer workshop':'Özgür bei der Arbeit in der Werkstatt von Edle Hölzer'}" width="800" height="534" loading="eager" decoding="async"></div><p class="reviewArchive__notice">${english?'The reviews appear in their original language and wording. Where no public name could be matched reliably, the attribution reads “Etsy customer”.':'Die Bewertungen stehen in ihrer Originalsprache und im Originalwortlaut. Wo kein öffentlicher Name sicher zugeordnet werden konnte, steht „Etsy-Kundin oder -Kunde“.'}</p><div class="reviewArchive__list">${cards}</div><p><a class="textLink" href="/${english?'en/products.html':'produkte.html'}">${english?'View our products':'Unsere Produkte ansehen'} →</a></p></div></section></main>${serialize(footer)}<script src="/main.js"></script></body></html>`;
  const output=parse(html),outputNodes=walk(output),intro=outputNodes.find(n=>(attr(n,'class')||'').includes('reviewArchive__intro'));
  const replaceText=(node,value)=>{node.childNodes=parseFragment(escape(value)).childNodes;node.childNodes.forEach(child=>child.parentNode=node);};
  replaceText(walk(intro).find(n=>n.tagName==='p'&&!attr(n,'class')),english?`All ${reviews.length} original reviews from Etsy and Google Maps. Feedback on cutting boards, kitchen tools, wood care and our personal service.`:`Alle ${reviews.length} Originalbewertungen von Etsy und Google Maps. Erfahrungen mit Schneidebrettern, Küchenhelfern, Holzpflege und unserem persönlichen Service.`);
  const google=googleReviewMeta();
  replaceText(walk(intro).find(n=>attr(n,'class')==='reviewArchive__meta'),`Etsy: ${Number(meta.ratingAverage).toLocaleString(english?'en-GB':'de-DE',{minimumFractionDigits:1})} / 5 · ${meta.ratingCount} ${english?'reviews':'Bewertungen'} | Google Maps: ${Number(google.ratingAverage).toLocaleString(english?'en-GB':'de-DE',{minimumFractionDigits:1})} / 5 · ${google.ratingCount} ${english?'reviews':'Bewertungen'} · ${english?'Data updated':'Datenstand'}: ${meta.lastUpdated}`);
  replaceText(outputNodes.find(n=>attr(n,'class')==='reviewArchive__notice'),english?'The reviews appear in their original language and wording, with the public first name or profile name. Relative Google dates are shown as observed on the stated date.':'Die Bewertungen stehen in ihrer Originalsprache und im Originalwortlaut mit dem öffentlichen Vornamen oder Profilnamen. Relative Google-Datumsangaben entsprechen der Anzeige zum genannten Datenstand.');
  const file=path.join(root,route.slice(1),'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,serializeDocument(output)+'\n');
}
console.log(`Generated two review pages containing ${reviews.length} original reviews each.`);
