import fs from 'node:fs';
import path from 'node:path';
import {parse,parseFragment} from 'parse5';
import {ROOT} from './catalog.mjs';

const walk=node=>[node,...(node.childNodes||[]).flatMap(walk)];
const attr=(node,name)=>node.attrs?.find(item=>item.name===name)?.value;
const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const remove=node=>{if(node?.parentNode)node.parentNode.childNodes=node.parentNode.childNodes.filter(child=>child!==node);};
const append=(parent,node)=>{remove(node);node.parentNode=parent;parent.childNodes.push(node);};
const fragment=html=>parseFragment(html).childNodes[0];

// Keep the production source intact while the shorter page is being approved.
export function refineRefurbishment(document,en){
  const main=walk(document).find(node=>node.tagName==='main');
  const nodes=walk(main);
  if(en){
    for(const section of main.childNodes.filter(node=>node.tagName==='section')){
      if(!['service-hero','service-tiers','service-process','service-limits','faq','weiterlesen'].some(name=>has(section,name)))remove(section);
    }
    const hero=nodes.find(node=>has(node,'service-hero'));
    const container=hero.childNodes.find(node=>has(node,'container'));
    const grid=fragment('<div class="container refurbHero__grid"><div class="refurbHero__copy"></div></div>');
    const copy=grid.childNodes[0];
    for(const child of [...container.childNodes])append(copy,child);
    const de=parse(fs.readFileSync(path.join(ROOT,'schneidebrett-aufbereiten/index.html'),'utf8'));
    const comparison=walk(de).find(node=>has(node,'refurbCompare'));
    comparison.attrs.find(item=>item.name==='aria-label').value='Before and after refurbishment';
    for(const [index,image]of walk(comparison).filter(node=>node.tagName==='img').entries())image.attrs.find(item=>item.name==='alt').value=index?'The same wooden board after sanding and oiling':'Dry, scratched wooden board before refurbishment';
    for(const [index,label]of walk(comparison).filter(node=>node.tagName==='span').entries())label.childNodes=[{nodeName:'#text',value:index?'After':'Before',parentNode:label}];
    append(grid,comparison);remove(container);append(hero,grid);
    for(const node of nodes.filter(node=>has(node,'tier-media')||has(node,'trust-badge')))remove(node);
    // Same confirmed refresh package as the German page.
    const refresh=nodes.find(node=>attr(node,'id')==='refresh');
    const list=walk(refresh).find(node=>node.tagName==='ul');
    append(list,fragment('<li>One care balm tin for later care at home</li>'));
  }else{
    const keep=node=>has(node,'refurbHero')||has(node,'refurbQuickGuide')||attr(node,'id')==='schritt-fuer-schritt'||['faq','service-process','service-limits','weiterlesen'].some(name=>has(node,name));
    const quick=nodes.filter(node=>has(node,'refurbQuickCard'));
    for(const [index,id]of ['auffrischung','generalueberholung'].entries()){
      const tier=nodes.find(node=>attr(node,'id')===id);
      const details=fragment('<details class="refurbPackageDetails" id="'+id+'"><summary>Leistungsumfang &amp; Grenzen</summary></details>');
      for(const child of [...tier.childNodes])if(has(child,'tier-includes')||has(child,'tier-not-included'))append(details,child);
      remove(quick[index+1].childNodes.find(node=>node.tagName==='a'));
      append(quick[index+1],details);
    }
    for(const section of main.childNodes.filter(node=>node.tagName==='section'))if(!keep(section))remove(section);
    for(const node of nodes.filter(node=>has(node,'refurbVisualTriage')||has(node,'refurbEaseSteps')))remove(node);
    const steps=nodes.find(node=>attr(node,'id')==='schritt-fuer-schritt');
    const container=steps.childNodes.find(node=>has(node,'container'));
    const details=fragment('<details class="refurbMethod"><summary>So arbeiten wir dein Brett auf</summary></details>');
    for(const child of [...container.childNodes])append(details,child);
    append(container,details);
    // One before/after pair, not repeated in triage, results and a second gallery.
    const comparison=nodes.find(node=>has(node,'refurbCompare'));
    comparison.attrs.push({name:'id',value:'ergebnis'});
  }
  const overview=walk(main).find(node=>has(node,'pageSummary'));
  const heading=overview.childNodes.find(node=>node.tagName==='h2');
  overview.tagName=overview.nodeName='details';
  const summary=fragment('<summary></summary>');
  append(summary,heading);summary.parentNode=overview;overview.childNodes.unshift(summary);
}
