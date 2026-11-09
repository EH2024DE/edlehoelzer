import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {parseFragment} from 'parse5';
import {root,walk,attr,text} from './audit-design-system.mjs';
import {allReviews,featuredReviews,googleReviewMeta,originalText,reviewDateLabel} from './review-content.mjs';

const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const set=(node,name,value)=>{const existing=node.attrs.find(a=>a.name===name);if(existing)existing.value=value;else node.attrs.push({name,value});};
const append=(parent,node)=>{node.parentNode=parent;parent.childNodes.push(node);};
const remove=node=>{node.parentNode.childNodes=node.parentNode.childNodes.filter(n=>n!==node);};
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const mainSource=read('main.js');
const copySource=mainSource.slice(0,mainSource.indexOf('function renderLegalGuaranteeNotice('));
const cardSource=read('assets/js/product-grid.js');

function staticCards(products,english){
  const context=vm.createContext({window:{localStorage:{getItem:()=>null}},document:{documentElement:{lang:english?'en':'de'}},console});
  vm.runInContext(copySource+cardSource,context);
  return products.map(product=>{
    const card=parseFragment(context.window.EdleProductCards.render(product,true)).childNodes[0];
    set(card,'data-ds-added','static-product');
    for(const button of walk(card).filter(n=>n.tagName==='button')){
      if(attr(button,'data-product-preview')){
        button.tagName='a';button.nodeName='a';button.attrs=button.attrs.filter(a=>a.name!=='type');
        set(button,'href',(english?'/en':'')+product.productPath);
        button.attrs=button.attrs.filter(a=>a.name!=='data-product-preview');
      }else if(attr(button,'data-product-compare'))set(button,'hidden','');
    }
    return card;
  });
}

export function refineHomepage(document,reference){
  if(reference.template!=='home')return;
  const english=reference.route.startsWith('/en/'),nodes=walk(document);
  const grid=nodes.find(n=>attr(n,'id')==='homepage-products');
  if(grid){
    const source=read(reference.file),match=source.match(/var homepageProductIds = (\[[\s\S]*?\]);/);
    if(!match)throw new Error('Missing curated homepage product IDs');
    const ids=JSON.parse(match[1]),catalog=JSON.parse(read('products.json')).products;
    const products=ids.map(id=>catalog.find(p=>p.id===id));
    if(products.some(p=>!p||!p.active||!['available','made_to_order'].includes(p.availabilityStatus)))throw new Error('Homepage selection contains an unavailable product');
    set(grid,'data-static-products','');
    for(const card of staticCards(products,english))append(grid,card);
  }
  const meta=JSON.parse(read('data/reviews-meta.json'));
  const heroCopy=nodes.find(n=>has(n,'hero__copy'));
  if(heroCopy&&!meta.needsReview&&meta.ratingCount>0){
    const rating=Number(meta.ratingAverage).toLocaleString(english?'en-GB':'de-DE',{minimumFractionDigits:1});
    const line=parseFragment(`<a class="heroTrust" data-ds-added="hero-trust" href="#${english?'reviews':'bewertungen'}" title="${english?'Etsy data updated':'Etsy-Daten aktualisiert'}: ${escape(meta.lastUpdated)}"><span aria-hidden="true">★</span> ${rating} · ${meta.ratingCount} ${english?'Etsy reviews':'Etsy-Bewertungen'}<span class="heroTrust__origin">${english?'Handmade in Central Hesse':'Handgefertigt in Mittelhessen'}</span></a>`).childNodes[0];
    append(heroCopy,line);
  }
  const reviewRoot=nodes.find(n=>attr(n,'data-review-trust-strip')!==undefined);
  if(reviewRoot){
    const headline=walk(reviewRoot).find(n=>attr(n,'data-review-headline')!==undefined);
    const subline=walk(reviewRoot).find(n=>attr(n,'data-review-subline')!==undefined);
    const rating=Number(meta.ratingAverage).toLocaleString(english?'en-GB':'de-DE',{minimumFractionDigits:1});
    for(const [node,value] of [
      [headline,english?'Customer reviews':'Kundenstimmen'],
      [subline,`${meta.ratingCount} ${english?'Etsy reviews':'Etsy-Bewertungen'} · ${googleReviewMeta().ratingCount} ${english?'Google reviews':'Google-Bewertungen'} · ${meta.transactionSoldCount} ${english?'sales via Etsy':'Verkäufe über Etsy'}`]
    ]){node.childNodes=[];for(const child of parseFragment(escape(value)).childNodes)append(node,child);}
    const reviews=featuredReviews();
    const track=walk(reviewRoot).find(n=>attr(n,'data-review-track')!==undefined);
    const viewport=walk(reviewRoot).find(n=>attr(n,'data-review-viewport')!==undefined);
    set(viewport,'tabindex','0');set(viewport,'role','region');
    set(reviewRoot,'data-static-reviews','');
    track.childNodes=[];
    for(const review of reviews){
      const original=originalText(review);
      const long=original.length>220;
      const excerpt=long?original.slice(0,original.lastIndexOf(' ',180))+'…':original;
      const card=parseFragment(`<article class="reviewCard" data-review-id="${escape(review.id)}"><div class="reviewCard__stars" aria-label="${review.rating} ${english?'out of 5 stars':'von 5 Sternen'}">${'★'.repeat(review.rating)}</div><p class="reviewCard__text">„${escape(excerpt)}“</p>${long?`<details class="reviewCard__full"><summary>${english?'Read the full original review':'Originalbewertung vollständig lesen'}</summary><p>${escape(original)}</p></details>`:''}<p class="reviewCard__meta">${escape(review.reviewerName)} · ${escape(reviewDateLabel(review,english))} · ${escape(review.product)} · <a href="${escape(review.sourceUrl||meta.sourceUrl)}" target="_blank" rel="noopener">${escape(review.source)}</a></p></article>`).childNodes[0];
      append(track,card);
    }
    const date=parseFragment(`<p class="reviewTrust__date" data-ds-added="review-date">${english?'Etsy data updated':'Etsy-Datenstand'}: ${escape(meta.lastUpdated)}${english?' · Quotes in their original language.':''}</p>`).childNodes[0];
    append(walk(reviewRoot).find(n=>has(n,'reviewTrust__head')),date);
    const link=parseFragment(`<p data-ds-added="review-archive-link"><a class="textLink" href="${english?'/en/reviews/':'/bewertungen/'}">${english?'Read all':'Alle'} ${allReviews().length} ${english?'reviews':'Bewertungen lesen'} →</a></p>`).childNodes[0];
    const reviewContainer=reviewRoot.childNodes.find(n=>n.tagName==='div');
    const sourceLink=reviewContainer.childNodes.find(n=>attr(n,'data-review-source-link')!==undefined);
    link.parentNode=reviewContainer;reviewContainer.childNodes.splice(reviewContainer.childNodes.indexOf(sourceLink),0,link);
  }
  if(english){
    const main=nodes.find(n=>n.tagName==='main');
    const closing=nodes.find(n=>has(n,'closingHero'));
    const topics=parseFragment('<section class="section homeTopics"><div class="container"><h2 data-ds-added="topics-heading">More from our workshop</h2></div></section>').childNodes[0];
    const container=walk(topics).find(n=>has(n,'container'));
    const ids=new Set(['find-your-board','product-finder-start','lead-paths','etsy-trust','material-proof-en','customwork','restoration','b2b']);
    const candidates=nodes.filter(n=>n.tagName==='section'&&(ids.has(attr(n,'id'))||has(n,'deliveryMap')||has(n,'ownershipMoment')));
    for(const section of candidates){
      const heading=walk(section).find(n=>n.tagName==='h2');
      if(!heading)continue;
      const details=parseFragment('<details class="homeTopic"><summary></summary></details>').childNodes[0];
      const summary=details.childNodes[0];
      remove(heading);append(summary,heading);remove(section);
      set(section,'class','homeTopic__content');
      append(details,section);append(container,details);
    }
    if(candidates.length){topics.parentNode=main;main.childNodes.splice(main.childNodes.indexOf(closing),0,topics);}
    const room=parseFragment(`<section class="roomDiscovery" id="your-board-your-kitchen" aria-labelledby="room-discovery-title" data-ds-added="room-discovery"><div class="container roomDiscovery__layout"><div><p class="roomEyebrow">Your kitchen. Your scale.</p><h2 id="room-discovery-title">See your board<br>in your kitchen.</h2><p>Have a board in mind? See how its size and wood look in your kitchen. All you need is a worktop photo with an A4 sheet.</p><button type="button" class="btn roomDiscovery__cta" data-kitchen-preview>See a board in my kitchen</button><p class="roomDisclosure">Your photo stays on your device. A visual guide, not a precise measurement or colour reference.</p></div><figure><img src="/assets/kitchen-preview-example.jpg" alt="Kitchen worktop with an A4 sheet for scale" width="1300" height="1024" loading="lazy"><figcaption>An example of a suitable starting photo.</figcaption></figure></div></section>`).childNodes[0];
    const productSection=grid.parentNode.parentNode;
    room.parentNode=main;main.childNodes.splice(main.childNodes.indexOf(productSection)+1,0,room);
    const video=nodes.find(n=>attr(n,'data-hero-video')!==undefined);
    if(video){video.attrs=video.attrs.filter(a=>a.name!=='autoplay');set(video,'data-autoplay','manual');}
  }
}
