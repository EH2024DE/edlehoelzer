import fs from 'node:fs';
import path from 'node:path';
import {parse,parseFragment,serialize} from 'parse5';
import {root,walk,attr,text} from './audit-design-system.mjs';

export const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-editorial-pages.json'),'utf8'));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const catalog=JSON.parse(read('products.json')).products;
const names=JSON.parse(read('data/product-naming-2026-11-09.json')).products;
const home=walk(parse(read('en/index.html')));
const outer=node=>{const fragment=parseFragment('');fragment.childNodes=[structuredCloneNode(node)];return serialize(fragment);};
function structuredCloneNode(node,parentNode){
  const next={...node,parentNode,attrs:node.attrs?.map(a=>({...a})),childNodes:[]};
  next.childNodes=(node.childNodes||[]).map(child=>structuredCloneNode(child,next));return next;
}
const header=outer(home.find(n=>n.tagName==='header')),footer=outer(home.find(n=>n.tagName==='footer'));
const form=`<section class="section" id="enquiry"><div class="container ds-reading"><h2>Tell us about your idea</h2><p>Your first enquiry is free and does not place an order. We discuss feasibility, budget and timing with you.</p><form class="customInquiryForm" data-board-inquiry action="https://formspree.io/f/maqanpld" method="POST"><input type="hidden" name="_subject" value="Custom cutting board enquiry"><input type="hidden" name="reference" value=""><label class="formHoneypot" hidden>Leave blank<input name="_gotcha" tabindex="-1" autocomplete="off"></label><label>Your email address (required)<input type="email" name="email" autocomplete="email" required maxlength="254"></label><label>Your idea or intended use (required)<textarea name="message" required maxlength="3000" rows="4"></textarea></label><details><summary>Further preferences (optional)</summary><label>Dimensions or available space<input name="dimensions" maxlength="100"></label><label>Wood<select name="wood"><option value="Weiß ich noch nicht">Not sure yet</option value="Eiche">Oak</option><option value="Nussbaum">Walnut</option><option value="Anderes Holz / gemeinsam auswählen">Another wood / choose together</option></select></label><label>Construction<select name="construction"><option value="Weiß ich noch nicht">Not sure yet</option><option value="Langholz">Edge grain</option><option value="Stirnholz">End grain</option></select></label><label>Budget range<input name="budget" maxlength="100"></label><label>Preferred date<input name="timing" maxlength="100"></label></details><p>We use your details to respond to your enquiry. See our <a href="/datenschutz.html" lang="de">privacy policy (German)</a> for information about processing by Formspree.</p><button class="btn btn--emphasis" type="submit">Send a no-obligation enquiry</button><p data-board-inquiry-status role="status" aria-live="polite"></p></form></div></section>`;

for(const page of pages){
  if(page.overview)page.related=walk(parse(read('sitemap.xml'))).filter(n=>n.tagName==='loc').map(text).map(u=>new URL(u).pathname).filter(route=>route.startsWith('/en/')&&route!==page.route).map(route=>{
    const file=route.endsWith('/')?route.slice(1)+'index.html':route.slice(1),nodes=walk(parse(read(file)));
    return [text(nodes.find(n=>n.tagName==='h1')||nodes.find(n=>n.tagName==='title')),route];
  });
  const de='/'+page.source.replace(/index\.html$/,''),canonical='https://edlehoelzer.de'+page.route;
  const products=page.products.map(id=>catalog.find(p=>p.listingId===id)).filter(p=>p?.active&&['available','made_to_order'].includes(p.availabilityStatus));
  const productCards=products.map(p=>{
    const title=names.find(n=>n.listingId===p.listingId)?.en||p.displayName;
    const price=(/^ab /i.test(p.priceLabel)?'from ':'')+new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR'}).format(p.priceOrder);
    return `<article class="editorialProduct"><a href="/en${escape(p.productPath)}"><img src="${escape(p.image)}" alt="${escape(title)}" width="600" height="600" loading="lazy"><h3>${escape(title)}</h3></a><p>${escape(price)}</p><a class="textLink" href="/en${escape(p.productPath)}">View product →</a></article>`;
  }).join('');
  const sections=page.sections.map((s,i)=>`<section class="section"><div class="container ds-reading"><h2 id="topic-${i+1}">${escape(s.title)}</h2><p>${escape(s.text)}</p>${s.more?page.legal?`<p>${escape(s.more)}</p>`:`<details class="editorialDisclosure"><summary>Read more</summary><p>${escape(s.more)}</p></details>`:''}</div></section>`).join('');
  const people=page.people?`<section class="section"><div class="container"><div class="homePeople">${[['oezguer','Özgür'],['serkan','Serkan']].map(([file,name])=>`<article class="homePerson"><img src="/assets/team/${file}-800.webp" alt="${name} holding a cutting board in our workshop" width="800" height="1199" loading="lazy"><h2>${name} Koç</h2></article>`).join('')}</div></div></section>`:'';
  const faqs=page.faq.length?`<section class="section"><div class="container ds-reading"><h2>Questions before you choose</h2><div class="faqList">${page.faq.map(([q,a])=>`<article class="faqItem"><h3>${escape(q)}</h3><p>${escape(a)}</p></article>`).join('')}</div></div></section>`:'';
  const schema=[{'@context':'https://schema.org','@type':'WebPage',name:page.title,description:page.description,url:canonical,inLanguage:'en'},...(page.faq.length?[{'@context':'https://schema.org','@type':'FAQPage',mainEntity:page.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]:[])];
  let html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)} | Edle Hölzer</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="de" href="https://edlehoelzer.de${de}"><link rel="alternate" hreflang="en" href="${canonical}"><link rel="alternate" hreflang="x-default" href="https://edlehoelzer.de${de}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://edlehoelzer.de${page.image}"><link rel="stylesheet" href="/styles.css"><script src="/assets/js/consent-manager.js" defer></script>${schema.map(s=>`<script type="application/ld+json">${JSON.stringify(s).replaceAll('<','\\u003c')}</script>`).join('')}</head><body>${header}<main class="englishEditorial"><section class="section"><div class="container editorialHero"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/en/">Home</a> / ${escape(page.title)}</nav><p class="eyebrow">Edle Hölzer</p><h1>${escape(page.title)}</h1><p class="lead">${escape(page.intro)}</p><a class="btn btn--emphasis" href="${page.target}">${escape(page.cta)}</a></div><img class="editorialHero__image${page.ratio==='portrait'?' editorialHero__image--portrait':''}" src="${page.image}" alt="${escape(page.imageAlt)}" width="${page.ratio==='portrait'?800:1200}" height="${page.ratio==='portrait'?1200:800}" decoding="async"></div></section>${productCards?`<section class="section"><div class="container"><h2>Explore individual pieces</h2><div class="editorialProducts">${productCards}</div></div></section>`:''}${people}${sections}${faqs}${page.form?form:''}<section class="section"><div class="container ds-reading"><h2>Related topics</h2><ul class="seoLinkList">${page.related.map(([label,href])=>`<li><a href="${href}">${escape(label)}</a></li>`).join('')}</ul><p>Have a question about your own piece? <a href="mailto:info@edlehoelzer.de">Talk to us directly</a>.</p></div></section></main>${footer}<script src="/main.js"></script></body></html>`;
  const doc=parse(html);
  const heroImage=walk(doc).find(n=>n.tagName==='img'&&(attr(n,'class')||'').includes('editorialHero__image'));
  if(page.legal||page.overview){
    const hero=heroImage.parentNode;hero.childNodes=hero.childNodes.filter(n=>n!==heroImage);
    hero.attrs.find(a=>a.name==='class').value='container ds-reading';
    const head=walk(doc).find(n=>n.tagName==='head');head.childNodes=head.childNodes.filter(n=>!(n.tagName==='meta'&&attr(n,'property')==='og:image'));
  }else heroImage.attrs.push({name:'loading',value:'eager'});
  for(const node of walk(doc))for(const a of node.attrs||[])if(['href','src'].includes(a.name)&&a.value.startsWith('../')){
    const url=new URL(a.value,'https://edlehoelzer.de/en/');a.value=url.pathname+url.search+url.hash;
  }
  if(page.form){
    const nodes=walk(doc),head=nodes.find(n=>n.tagName==='head');
    const script=parseFragment('<script src="/assets/js/board-inquiry.js" defer></script>').childNodes[0];script.parentNode=head;head.childNodes.push(script);
    const enquiry=nodes.find(n=>n.tagName==='form');
    const note=parseFragment('<p data-reference-note></p>').childNodes[0];note.parentNode=enquiry;enquiry.childNodes.push(note);
    const status=nodes.find(n=>attr(n,'role')==='status');status.attrs.push({name:'tabindex',value:'-1'});
  }
  for(const div of walk(doc).filter(n=>(attr(n,'class')||'').split(' ').includes('lang'))){
    for(const a of walk(div).filter(n=>n.tagName==='a')){
      const en=(a.childNodes||[]).some(n=>n.value?.trim()==='EN');
      a.attrs=a.attrs.filter(x=>!['href','class'].includes(x.name));a.attrs.push({name:'href',value:en?page.route:de});if(en)a.attrs.push({name:'class',value:'is-active'});
    }
  }
  const output=path.join(root,page.route.slice(1),'index.html');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,serialize(doc));
  let source=read(page.source);
  if(!source.includes('hreflang="en"'))source=source.replace(/(<link\b[^>]*rel="canonical"[^>]*>)/,`$1\n<link rel="alternate" hreflang="de" href="https://edlehoelzer.de${de}"><link rel="alternate" hreflang="en" href="${canonical}">`);
  fs.writeFileSync(path.join(root,page.source),source);
  let sitemap=read('sitemap.xml');if(!sitemap.includes(canonical+'<'))sitemap=sitemap.replace('</urlset>',`  <url><loc>${canonical}</loc></url>\n</urlset>`);fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
  console.log(page.route);
}
