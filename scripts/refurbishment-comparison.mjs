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
  const rows=en?[
    ['Your effort','Your own time','We do the work','We do the work'],
    ['Surface','Oil & wax yourself','Sand, oil & wax','All refresh work'],
    ['Repairs','—','—','Cracks, flatness & feet*'],
    ['Care balm for home','Buy separately','1 tin included','1 tin included']
  ]:[
    ['Dein Aufwand','Deine Arbeitszeit','Wir übernehmen','Wir übernehmen'],
    ['Oberfläche','Selbst ölen & wachsen','Schliff, Öl & Wachs','Alles aus Auffrischung'],
    ['Zusätzliche Arbeiten','—','—','Risse, Planheit & Füße*'],
    ['Pflegebalsam für zu Hause','Separat kaufen','1 Dose inklusive','1 Dose inklusive']
  ];
  return `<div class="serviceCompare" id="${en?'compare-options':'paketvergleich'}" data-service-comparison data-ds-added>
    <table aria-label="${en?'Compare care and refurbishment options':'Pflege und Aufbereitung vergleichen'}">
      <thead><tr><th scope="col" class="serviceCompare__self">${en?'Do it yourself':'Selbst pflegen'}<span>${en?'from €9.99':'ab 9,99 €'}</span></th><th scope="col" class="serviceCompare__refresh">${en?'Refresh':'Auffrischung'}<span>${en?'€41–64':'41–64 €'}</span></th><th scope="col" class="serviceCompare__full">${en?'Full restoration':'General<wbr>überholung'}<span>${en?'€95–154':'95–154 €'}</span></th></tr></thead>
      ${rows.map(row=>`<tbody><tr><th scope="rowgroup" colspan="3">${row[0]}</th></tr><tr>${row.slice(1).map((cell,i)=>`<td class="serviceCompare__${['self','refresh','full'][i]}">${cell}</td>`).join('')}</tr></tbody>`).join('')}
    </table>
    <p class="serviceCompare__care">${en?'DIY: <a href="/en/cutting-board-oil-comparison/">suitable boiled linseed oil</a> is often available online for up to €20. <a href="/en/produkte/pflegebalsam-leinoel-bienenwachs-1881802291/">Our balm</a>: boiled linseed oil and regional beeswax.':'Für zu Hause: <a href="/welches-oel-schneidebrett/">Geeigneter Leinölfirnis</a> häufig bis 20 € online. <a href="/produkte/pflegebalsam-leinoel-bienenwachs-1881802291/">Unser Balsam</a>: Leinölfirnis und regionales Bienenwachs.'}</p>
    <p class="serviceCompare__shipping">${en?'Workshop: return shipping within Germany included. Shipping to us is extra.':'Werkstatt: Rückversand (DE) inklusive. Hinversand separat.'}</p>
    <p class="serviceCompare__limits">${en?'*Repairs after photo assessment. Excluded: through-cracks, warping over 5 mm and hygienically irreparable damage.':'*Reparaturen nach Fotoeinschätzung. Ausgeschlossen: durchgehende Risse, Verzug über 5 mm, hygienisch irreparable Schäden.'}</p>
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
