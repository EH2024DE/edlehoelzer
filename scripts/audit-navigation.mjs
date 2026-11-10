import {parseFragment} from 'parse5';
import {walk,attr,text} from './audit-design-system.mjs';

const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const append=(parent,node)=>{node.parentNode=parent;parent.childNodes.push(node);};
const fragment=html=>parseFragment(html).childNodes[0];

// Destinations are existing source routes, including the translated owner pages.
const desktopLinks={
  de:[['Produkte','/produkte.html#produkte-grid'],['Atelier','/atelier/'],['Erbstück','/schneidebrett-fachwerk-eiche/'],['Maß','/schneidebrett-nach-mass/'],['Pflege','/pflege.html']],
  en:[['Products','/en/products.html#products-grid'],['Atelier','/en/atelier/'],['Heirloom','/en/erbstueck/'],['Custom','/en/custom-cutting-board/'],['Care','/en/care.html']]
};
const discoverLinks={
  de:[['B2B / Firmengeschenke','/handgefertigte-holzprodukte-fuer-unternehmen/'],['Gastronomie','/schneidebretter-aus-holz-gastronomie/']],
  en:[['B2B / Corporate gifts','/en/corporate-gifts/'],['Restaurants &amp; hotels','/en/wooden-cutting-boards-for-restaurants/']]
};

export function refineAuditNavigation(document,reference){
  const language=reference.route.startsWith('/en/')?'en':'de';
  const nodes=walk(document);
  const header=nodes.find(node=>node.tagName==='header'&&has(node,'topbar'));
  if(!header)return;
  const languageTargets=['de','en'].map(code=>[code,attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='alternate'&&attr(n,'hreflang')===code),'href')]);
  if(languageTargets.every(([,href])=>href)){
    let right=walk(header).find(n=>has(n,'topbar__right'));
    const inner=walk(header).find(n=>has(n,'topbar__inner'));
    if(!right&&inner){right=fragment('<div class="topbar__right"></div>');append(inner,right);}
    if(right&&!walk(right).some(n=>has(n,'lang'))){
      const group=fragment('<div class="lang"></div>');
      for(const link of [...right.childNodes].filter(n=>n.tagName==='a'&&['DE','EN'].includes(text(n).trim()))){
        right.childNodes.splice(right.childNodes.indexOf(link),1);append(group,link);
      }
      append(right,group);
    }
    for(const group of walk(header).filter(n=>has(n,'lang')||has(n,'mobileMenu__lang'))){
      for(const [code,href] of languageTargets){
        const url=new URL(href);
        const existing=walk(group).find(n=>n.tagName==='a'&&text(n).trim()===code.toUpperCase());
        if(existing){
          const base=attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href')||'https://edlehoelzer.de'+reference.route;
          if(new URL(attr(existing,'href'),base).pathname!==url.pathname)existing.attrs.find(a=>a.name==='href').value=url.pathname;
        }else append(group,fragment(`<a href="${url.pathname}" lang="${code}" hreflang="${code}"${language===code?' class="is-active" aria-current="page"':''} aria-label="${code==='en'?'Switch to English':'Zur deutschen Version'}">${code.toUpperCase()}</a>`));
      }
    }
  }
  const headerNodes=walk(header);
  const inner=headerNodes.find(node=>has(node,'topbar__inner'));
  const right=inner?.childNodes.find(node=>has(node,'topbar__right'));
  if(inner&&right&&!walk(inner).some(node=>has(node,'desktopNav')||attr(node,'data-ds-added')==='desktop-navigation')){
    const nav=fragment(`<nav class="desktopNav" data-ds-added="desktop-navigation" aria-label="${language==='en'?'Main navigation':'Hauptnavigation'}"></nav>`);
    for(const [label,href,lang] of desktopLinks[language]){
      append(nav,fragment(`<a href="${href}"${lang?` lang="${lang}"`:''}>${label}</a>`));
    }
    nav.parentNode=inner;
    inner.childNodes.splice(inner.childNodes.indexOf(right),0,nav);
  }

  const mobile=headerNodes.find(node=>node.tagName==='nav'&&has(node,'mobileMenu'));
  if(!mobile)return;
  let discover=walk(mobile).find(node=>has(node,'mobileMenu__discover'));
  if(!discover){
    discover=fragment(`<details class="mobileMenu__discover"><summary>${language==='en'?'Explore':'Entdecken'}</summary><div></div></details>`);
    append(mobile,discover);
  }
  let list=discover.childNodes.find(node=>node.tagName==='div'||node.tagName==='ul');
  if(!list){list=fragment('<div></div>');append(discover,list);}
  for(const [label,href] of discoverLinks[language]){
    if(walk(discover).some(node=>node.tagName==='a'&&attr(node,'href')===href))continue;
    const link=fragment(`<a href="${href}">${label}</a>`);
    if(list.tagName==='ul'){
      const item=fragment('<li></li>');append(item,link);append(list,item);
    }else append(list,link);
  }
}
