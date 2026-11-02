import {parseFragment} from 'parse5';
import {walk,attr} from './audit-design-system.mjs';

const has=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const insertBefore=(parent,node,before)=>{node.parentNode=parent;parent.childNodes.splice(parent.childNodes.indexOf(before),0,node);};
function disclose(nodes,label){
  if(!nodes.length)return;
  const parent=nodes[0].parentNode;
  const contents=parent.childNodes.slice(parent.childNodes.indexOf(nodes[0]),parent.childNodes.indexOf(nodes.at(-1))+1);
  const details=parseFragment(`<details class="serviceCompareDetails"><summary data-ds-added>${label}</summary></details>`).childNodes[0];
  insertBefore(parent,details,nodes[0]);
  for(const node of contents){parent.childNodes.splice(parent.childNodes.indexOf(node),1);node.parentNode=details;details.childNodes.push(node);}
}
export function comparisonHtml(en){
  const options=en?[
    {id:'self',name:'Do it yourself',price:'Materials only',intro:'You clean, sand if needed and oil the board yourself.',items:['Sandpaper if needed','Linseed oil and a dry cotton cloth','Washing-up liquid for cleaning'],extra:'You provide the time and materials. Care balm is optional.'},
    {id:'refresh',name:'Refresh service',price:'€41–64',intro:'A renewed surface through sanding, oil and a protective finish. No repairs.',items:['Sand, raise the grain and fine-sand','Oil and finish with care balm','No repairs; no balm tin for home'],extra:'Up to 30 × 20 cm: €41 · up to 45 × 30 cm: €51 · longer than 45 cm: €64'},
    {id:'full',name:'Full restoration',price:'€95–154',intro:'All refresh work plus suitable repairs after assessment. One care balm tin included.',items:['All refresh-service work','Assess and treat suitable cracks, flatness and feet','One care balm tin for home included'],extra:'Up to 30 × 20 cm: €95 · up to 45 × 30 cm: €124 · longer than 45 cm: €154'}
  ]:[
    {id:'self',name:'Selbst machen',price:'Nur Materialkosten',intro:'Du reinigst, schleifst bei Bedarf und ölst dein Brett selbst.',items:['Schleifpapier nach Bedarf','Leinöl und ein trockenes Baumwolltuch','Spülmittel zum Reinigen'],extra:'Arbeitszeit und Material bringst du selbst ein. Pflegebalsam ist optional.'},
    {id:'refresh',name:'Auffrischung',price:'41–64 €',intro:'Eine neue Oberfläche durch Schliff, Öl und schützendes Finish. Ohne Reparaturen.',items:['Schleifen, wässern und fein nachschleifen','Ölen und mit Pflegebalsam abschließen','Ohne Reparaturen; keine Dose Balsam für zu Hause'],extra:'Bis 30 × 20 cm: 41 € · bis 45 × 30 cm: 51 € · über 45 cm Länge: 64 €'},
    {id:'full',name:'Generalüberholung',price:'95–154 €',intro:'Auffrischung plus Reparaturen nach Prüfung. Eine Dose Pflegebalsam inklusive.',items:['Alle Leistungen der Auffrischung','Geeignete Risse, Planheit und Füße prüfen und bearbeiten','Eine Dose Pflegebalsam für zu Hause inklusive'],extra:'Bis 30 × 20 cm: 95 € · bis 45 × 30 cm: 124 € · über 45 cm Länge: 154 €'}
  ];
  return `<div class="serviceOptions" id="${en?'compare-options':'paketvergleich'}" data-service-comparison data-ds-added>
    <div class="serviceOptions__grid">${options.map(option=>`<article class="serviceOption" data-service-option="${option.id}"><div class="serviceOption__head"><h3>${option.name}</h3><p class="serviceOption__price">${option.price}</p></div><p class="serviceOption__intro">${option.intro}</p><details><summary>${en?'View scope':'Leistungen ansehen'}</summary><ul>${option.items.map(item=>`<li>${item}</li>`).join('')}</ul><p>${option.extra}</p></details></article>`).join('')}</div>
    <p class="serviceOptions__note">${en?'Workshop prices include return shipping within Germany. You cover shipping to us.':'Werkstattpreise inklusive Rückversand (DE). Den Hinversand trägst du.'}</p>
    <p class="serviceOptions__note">${en?'Repairs only after photo assessment. Through-cracks, warping over 5 mm and hygienically irreparable damage are excluded.':'Reparaturen nur nach Fotoeinschätzung. Durchgehende Risse, Verzug über 5 mm und hygienisch irreparable Schäden sind ausgeschlossen.'}</p>
  </div>`;
}
export function refineRefurbishment(document,reference){
  if(!['/schneidebrett-aufbereiten/','/en/refurbishment/'].includes(reference.route))return;
  const nodes=walk(document),en=reference.route.startsWith('/en/');
  const quick=nodes.find(n=>has(n,'refurbQuickGuide__grid'));
  const tiers=nodes.filter(n=>has(n,'service-tier'));
  const first=quick||tiers[0];if(!first)return;
  const comparison=parseFragment(comparisonHtml(en)).childNodes[0];
  const triage=nodes.find(n=>has(n,'refurbVisualTriage'));
  insertBefore(first.parentNode,comparison,triage||first);
  if(quick)disclose([...(triage?[triage]:[]),quick],en?'Condition and price bands':'Zustand und Preisstaffeln im Detail');
  const steps=nodes.find(n=>has(n,'refurbEaseSteps'));
  if(steps)disclose([steps],en?'How the photo assessment works':'So funktioniert die Fotoeinschätzung');
  for(const tier of tiers){
    const label=has(tier,'service-tier--diy')?(en?'DIY care instructions':'Selbstpflege im Detail'):has(tier,'service-tier--refresh')?(en?'Refresh: full scope and prices':'Auffrischung: Leistungen und Preise'):(en?'Full restoration: scope and limits':'Generalüberholung: Leistungen und Grenzen');
    disclose([tier],label);
  }
}
