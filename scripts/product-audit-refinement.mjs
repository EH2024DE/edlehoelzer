import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {parseFragment} from 'parse5';
import {root,walk,attr} from './audit-design-system.mjs';
import {comparisonHtml} from './refurbishment-comparison.mjs';
const require=createRequire(import.meta.url),display=require('../assets/js/catalog-display.js');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;
const source=fs.readFileSync(path.join(root,'main.js'),'utf8');
const copy=vm.runInNewContext(source.slice(0,source.indexOf('document.documentElement.classList'))+'\nEdleProductCopy');
const has=(n,c)=>(attr(n,'class')||'').split(/\s+/).includes(c);
const set=(n,k,v)=>{const a=n.attrs.find(a=>a.name===k);if(a)a.value=v;else n.attrs.push({name:k,value:v});};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const append=(p,n)=>{n.parentNode=p;p.childNodes.push(n);};
const add=(p,html)=>append(p,parseFragment(html).childNodes[0]);
export function refineProductAudit(document,reference){
  const nodes=walk(document),en=reference.route.startsWith('/en/');
  for(const directory of nodes.filter(n=>has(n,'productDirectory')||has(n,'productDetail__browse'))){
    const list=walk(directory).find(n=>n.tagName==='ul');if(!list)continue;
    list.childNodes=[];
    for(const item of catalog.filter(p=>!p.canonicalProductId))add(list,`<li><a href="${en?'/en':''}${item.productPath}">${escape(copy.text(item.displayName||item.name,en))}</a></li>`);
  }
  const productRoot=nodes.find(n=>attr(n,'data-product-page'));
  const balm=catalog.find(p=>p.listingId==='1881802291');
  if(productRoot){
    const product=catalog.find(p=>p.id===attr(productRoot,'data-product-page'));if(!product)return;
    const title=copy.text(product.displayName||product.name,en),inventory=display.inventoryText(product,en);
    set(productRoot,'data-display-title',title);set(productRoot,'data-inventory-label',inventory);
    const heading=walk(productRoot).find(n=>n.tagName==='h1');
    if(heading){heading.childNodes=[];for(const n of parseFragment(escape(title)).childNodes)append(heading,n);}
    const content=walk(productRoot).find(n=>has(n,'productPreview__content'));
    if(content){
      const variantNote=product.active&&product.availabilityStatus==='available'&&(product.category==='accessory'||product.variants?.length)?(en?' Choose your available wood and version in the shop.':' Deine verfügbare Holzart und Ausführung wählst du im Shop.') : '';
      const custom=product.listingId==='4484195050';
      const inquiry=product.active&&product.availabilityStatus==='made_to_order'?` <a class="textLink" href="${custom?'/schneidebrett-nach-mass/#anfrage':'mailto:info@edlehoelzer.de?subject='+encodeURIComponent((en?'Enquiry: ':'Anfrage: ')+title)}">${custom?(en?'Enquire about your custom board':'Wunschbrett anfragen'):(en?'Enquire about this board':'Dieses Brett anfragen')} →</a>`:'';
      const stock=parseFragment(`<p class="productInventory" data-ds-added="inventory">${escape(inventory+variantNote)}${inquiry}</p>`).childNodes[0];
      stock.parentNode=content;content.childNodes.splice(heading?content.childNodes.indexOf(heading)+1:0,0,stock);
      if(product.category==='board'&&!(product.packageContents||[]).some(p=>/balsam/i.test(p.label||'')))
        add(content,`<p class="productCareBridge" data-ds-added="care-bridge"><a href="${en?'/en':''}${balm.productPath}">${en?'Care balm for your board':'Pflegebalsam für dein Brett'} →</a></p>`);
    }
  }
  if(['/pflege.html','/en/care.html'].includes(reference.route)){
    const card=nodes.find(n=>has(n,'pflege-produkt__copy'));
    if(card){
      const p=parseFragment(`<p class="careProductPrice" data-ds-added="care-price">${escape(copy.text(balm.priceLabel,en))}</p>`).childNodes[0];
      const actions=card.childNodes.find(n=>has(n,'pflege-cta'));p.parentNode=card;card.childNodes.splice(actions?card.childNodes.indexOf(actions):card.childNodes.length,0,p);
      const section=nodes.find(n=>has(n,'pflege-produkt'));
      const comparison=parseFragment(`<section data-ds-added="care-comparison" class="careComparison"><h2>${en?'Three ways to care for your board':'Drei Wege für dein Brett'}</h2>${comparisonHtml(en)}</section>`).childNodes[0];
      comparison.parentNode=section.parentNode;section.parentNode.childNodes.splice(section.parentNode.childNodes.indexOf(section)+1,0,comparison);
    }
  }
}
