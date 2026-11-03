import {parseFragment} from 'parse5';
import fs from 'node:fs';
import path from 'node:path';
import {root,walk,attr} from './audit-design-system.mjs';

const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const add=(node,name)=>{const value=node.attrs.find(a=>a.name==='class');if(value)value.value+=' '+name;else node.attrs.push({name:'class',value:name});};
function moveBefore(node,target){
  if(node===target)return;
  node.parentNode.childNodes.splice(node.parentNode.childNodes.indexOf(node),1);
  const parent=target.parentNode;parent.childNodes.splice(parent.childNodes.indexOf(target),0,node);node.parentNode=parent;
}
function disclose(node,label){
  const details=parseFragment('<details class="editorialDisclosure"><summary data-ds-added></summary></details>').childNodes[0];
  const summary=details.childNodes[0];summary.childNodes=[{nodeName:'#text',value:label,parentNode:summary}];
  const parent=node.parentNode;parent.childNodes.splice(parent.childNodes.indexOf(node),1,details);details.parentNode=parent;
  details.childNodes.push(node);node.parentNode=details;
}

export function refineContentLayout(document,reference){
  const nodes=walk(document),en=reference.route.startsWith('/en/');
  if(reference.route==='/en/erbstueck/'){
    const hero=nodes.find(n=>has(n,'erbstueckHero'));
    const summary=nodes.find(n=>has(n,'pageSummary'));
    const badges=nodes.find(n=>has(n,'erbstueckBadges'));
    const intro=parseFragment('<section class="erbstueckIntro"><div class="container"></div></section>').childNodes[0];
    const parent=hero.parentNode;parent.childNodes.splice(parent.childNodes.indexOf(hero)+1,0,intro);intro.parentNode=parent;
    for(const node of [summary,badges].filter(Boolean)){
      node.parentNode.childNodes.splice(node.parentNode.childNodes.indexOf(node),1);
      intro.childNodes[0].childNodes.push(node);node.parentNode=intro.childNodes[0];
    }
  }
  // Respect the source composition instead of forcing portrait photography into landscape crops.
  for(const image of nodes.filter(n=>n.tagName==='img'&&(has(n,'seoHero__image')||has(n.parentNode,'accessoryHero__grid')))){
    if(Number(attr(image,'height'))>Number(attr(image,'width')))add(image,'ds-image--portrait');
  }
  const finder=nodes.find(n=>attr(n,'data-product-finder')!==undefined);
  if(finder){
    const question=finder.childNodes.find(n=>has(n,'finderShell__top'));
    const options=finder.childNodes.find(n=>has(n,'finderOptions'));
    const navigation=finder.childNodes.find(n=>has(n,'finderNav'));
    const first=finder.childNodes.find(n=>n.tagName);
    if(question&&first!==question)moveBefore(question,first);
    if(options&&question)moveBefore(options,finder.childNodes[finder.childNodes.indexOf(question)+1]);
    if(navigation){const target=finder.childNodes.find(n=>has(n,'finderDecisions'));if(target)moveBefore(navigation,target);}
  }
  const custom=nodes.find(n=>has(n,'customProjects'));
  if(custom){
    const summary=nodes.find(n=>has(n,'pageSummary'));
    const actions=nodes.find(n=>has(n,'summaryActions'));
    if(summary&&actions)moveBefore(actions,summary);
    if(summary)disclose(summary,en?'Format, budget and possibilities':'Format, Budget und Möglichkeiten');
    const products=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;
    const referenceList=nodes.find(n=>n.tagName==='ul'&&walk(n).some(x=>x.value?.includes('29,5 × 20,1')||x.value?.includes('29.5 × 20.1')));
    if(referenceList){
      const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
      const gallery=parseFragment(`<div class="referenceProducts" data-ds-added>${['1827805914','1850610674','4484195050'].map(id=>products.find(p=>String(p.listingId)===id)).filter(Boolean).map(p=>`<a href="${en?'/en':''}${p.productPath}"><img src="${escape(p.image)}" alt="${escape(p.displayName)}" loading="lazy" width="600" height="600"><span>${escape(p.sizeLabel)}</span><span>${en?'View product':'Produkt ansehen'} →</span></a>`).join('')}</div>`).childNodes[0];
      const parent=referenceList.parentNode;parent.childNodes.splice(parent.childNodes.indexOf(referenceList)+1,0,gallery);gallery.parentNode=parent;
    }
    for(const article of nodes.filter(n=>has(n,'seoText'))){
      const children=[...article.childNodes];
      for(let i=0;i<children.length;i++){
        const heading=children[i];if(heading.tagName!=='h2'||/Fragen|questions/i.test(walk(heading).map(n=>n.value||'').join('')))continue;
        let end=i+1;while(end<children.length&&children[end].tagName!=='h2')end++;
        const group=children.slice(i,end);
        if(group.some(n=>walk(n).some(x=>has(x,'faqList'))))continue;
        const details=parseFragment('<details class="editorialTopic"><summary></summary></details>').childNodes[0];
        const summary=details.childNodes[0],position=article.childNodes.indexOf(heading);
        article.childNodes.splice(position,group.length,details);details.parentNode=article;
        summary.childNodes.push(heading);heading.parentNode=summary;
        for(const child of group.slice(1)){details.childNodes.push(child);child.parentNode=details;}
        i=end-1;
      }
    }
  }
  for(const item of nodes.filter(n=>has(n,'b2b-faq-item')))add(item,'faqItem');
}
