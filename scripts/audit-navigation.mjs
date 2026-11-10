import {parseFragment} from 'parse5';
import {walk,attr} from './audit-design-system.mjs';

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
