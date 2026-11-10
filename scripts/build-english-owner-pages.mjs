import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {parse,parseFragment,serialize} from 'parse5';
import {root,walk,attr,text} from './audit-design-system.mjs';
const pages=JSON.parse(fs.readFileSync(path.join(root,'data/english-page-copy.json'),'utf8'));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const set=(n,k,v)=>{const a=n.attrs.find(a=>a.name===k);if(a)a.value=v;else n.attrs.push({name:k,value:v});};
const replaceText=(n,value)=>{n.childNodes=[{nodeName:'#text',value,parentNode:n}];};
const english=parse(read('en/index.html'));
const links=new Map([['/','/en/'],['/produkte.html','/en/products.html'],['/atelier/','/en/atelier/'],['/handgefertigte-holzprodukte-fuer-unternehmen/','/en/corporate-gifts/'],['/pflege.html','/en/care.html'],['/schneidebrett-fachwerk-eiche/','/en/erbstueck/'],['/schneidebrett-aufbereiten/','/en/refurbishment/']]);
for(const page of JSON.parse(read('data/english-editorial-pages.json')))links.set('/'+page.source.replace(/index\.html$/,''),page.route);
for(const page of Object.values(pages)){
  const doc=parse(read(page.source)),nodes=walk(doc),main=nodes.find(n=>n.tagName==='main');
  const sourceNodes=walk(main).filter(n=>n.nodeName==='#text'&&n.value.trim()&&!['script','style'].includes(n.parentNode?.tagName));
  const strings=[...new Set(sourceNodes.map(n=>n.value.trim()))];
  const hash=crypto.createHash('sha256').update(JSON.stringify(strings)).digest('hex');
  if(hash!==page.sourceHash||strings.length!==page.texts.length)throw Error(page.source+': translation source changed or count mismatch '+strings.length+'/'+page.texts.length);
  const translations=new Map(strings.map((s,i)=>[s,page.texts[i]]));
  for(const option of walk(main).filter(n=>n.tagName==='option'&&attr(n,'value')===undefined))set(option,'value',text(option));
  for(const n of sourceNodes)n.value=n.value.replace(n.value.trim(),translations.get(n.value.trim()));
  for(const n of walk(main))for(const a of n.attrs||[])if(['alt','title','placeholder','aria-label'].includes(a.name)&&page.attributes[a.value])a.value=page.attributes[a.value];
  for(const tag of ['header','footer']){
    const old=nodes.find(n=>n.tagName===tag),source=walk(english).find(n=>n.tagName===tag);
    const next=parseFragment(serialize(source.parentNode).match(new RegExp('<'+tag+'[\\s\\S]*?</'+tag+'>'))[0]).childNodes[0];
    next.parentNode=old.parentNode;old.parentNode.childNodes.splice(old.parentNode.childNodes.indexOf(old),1,next);
  }
  const all=walk(doc),de='/'+page.source.replace(/index\.html$/,'');
  for(const n of all)for(const a of n.attrs||[])if(['src','href'].includes(a.name)&&a.value.startsWith('../'))a.value=new URL(a.value,'https://edlehoelzer.de/en/').pathname;
  set(all.find(n=>n.tagName==='html'),'lang','en');
  replaceText(all.find(n=>n.tagName==='title'),page.title+' | Edle Hölzer');
  for(const n of all.filter(n=>n.tagName==='meta')){
    if(attr(n,'name')==='description'||['og:description','twitter:description'].includes(attr(n,'property')))set(n,'content',page.description);
    if(['og:title','twitter:title'].includes(attr(n,'property')))set(n,'content',page.title);
    if(attr(n,'property')==='og:url')set(n,'content','https://edlehoelzer.de'+page.route);
    if(attr(n,'property')==='og:locale')set(n,'content','en_GB');
  }
  const head=all.find(n=>n.tagName==='head');
  head.childNodes=head.childNodes.filter(n=>!(n.tagName==='link'&&['canonical','alternate'].includes(attr(n,'rel'))));
  for(const html of [`<link rel="canonical" href="https://edlehoelzer.de${page.route}">`,...[[de,'de'],[page.route,'en'],[de,'x-default']].map(([url,lang])=>`<link rel="alternate" hreflang="${lang}" href="https://edlehoelzer.de${url}">`)]){const n=parseFragment(html).childNodes[0];n.parentNode=head;head.childNodes.push(n);}
  for(const n of all.filter(n=>n.tagName==='a')){
    const href=attr(n,'href')||'',url=new URL(href,'https://edlehoelzer.de');
    if(!href.startsWith('/')||url.origin!=='https://edlehoelzer.de')continue;
    if(links.has(url.pathname)){url.pathname=links.get(url.pathname);if(url.hash==='#ueberuns')url.hash='#about';if(url.hash==='#produktfinder')url.hash='#product-finder';if(url.hash==='#produkte-grid')url.hash='#products-grid';set(n,'href',url.pathname+url.search+url.hash);if(text(n).trim()==='Corporate gifts (DE)')replaceText(n,'Corporate gifts');}
  }
  for(const n of all.filter(n=>n.tagName==='a'&&(attr(n.parentNode,'class')||'').split(' ').includes('lang'))){const isEn=text(n).trim()==='EN';set(n,'href',isEn?page.route:de);n.attrs=n.attrs.filter(a=>a.name!=='class');if(isEn)set(n,'class','is-active');}
  const faqs=walk(main).filter(n=>(attr(n,'class')||'').split(' ').some(c=>['faqItem','b2b-faq-item'].includes(c))).map(n=>({question:text(walk(n).find(x=>x.tagName==='h3'||x.tagName==='summary')),answer:walk(n).filter(x=>x.tagName==='p').map(text).join(' ')}));
  for(const n of all.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json')){
    const schema=JSON.parse(text(n));
    if(schema['@type']==='BreadcrumbList')schema.itemListElement=[{'@type':'ListItem',position:1,name:'Home',item:'https://edlehoelzer.de/en/'},{'@type':'ListItem',position:2,name:page.title,item:'https://edlehoelzer.de'+page.route}];
    else if(schema['@type']==='FAQPage')schema.mainEntity=faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}));
    else if(['WebPage','Service'].includes(schema['@type'])){schema.name=page.title;schema.description=page.description;schema.url='https://edlehoelzer.de'+page.route;schema.inLanguage='en';}
    replaceText(n,JSON.stringify(schema).replace(/</g,'\\u003c'));
  }
  const out=path.join(root,page.route.slice(1),'index.html');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,serialize(doc).replace(/[ \t]+$/gm,''));
  let source=read(page.source);
  if(!source.includes('hreflang="en"'))source=source.replace(/(<link rel="canonical"[^>]*>)/,`$1\n  <link rel="alternate" hreflang="de" href="https://edlehoelzer.de${de}">\n  <link rel="alternate" hreflang="en" href="https://edlehoelzer.de${page.route}">`);
  for(const cls of ['lang','mobileMenu__lang'])source=source.replace(new RegExp('<div class="'+cls+'">[\\s\\S]*?</div>'),`<div class="${cls}"><a href="${de}" class="is-active">DE</a><a href="${page.route}">EN</a></div>`);
  fs.writeFileSync(path.join(root,page.source),source);
  let sitemap=read('sitemap.xml');if(!sitemap.includes('https://edlehoelzer.de'+page.route+'<'))sitemap=sitemap.replace('</urlset>',`  <url><loc>https://edlehoelzer.de${page.route}</loc></url>\n</urlset>`);fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
  console.log(page.route,strings.length,'translated source strings');
}
