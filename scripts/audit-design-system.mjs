import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
import postcss from 'postcss';

export const root=path.resolve(import.meta.dirname,'..');
export const baseline='f772f7ac7e7bdca497b9c044d7d9fbee82179f36';
export const walk=node=>[node,...(node.childNodes||[]).flatMap(walk)];
export const attr=(node,name)=>node?.attrs?.find(a=>a.name===name)?.value;
export const text=node=>node?.nodeName==='#text'?node.value:(node?.childNodes||[]).map(text).join('');
const csv=rows=>rows.map(row=>row.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
const read=file=>execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:10e6});
export function pageFile(url){const p=new URL(url).pathname;return p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1);}
export function template(url){
  const p=new URL(url).pathname;
  if(['/','/en/'].includes(p))return 'Home';
  if(/\/(?:en\/)?produkte\//.test(p))return 'Product Detail';
  if(/\/(produkte|products)\.html$/.test(p))return 'Product Listing';
  if(/impressum|datenschutz|privacy|widerruf|agb/.test(p))return 'Legal';
  if(/unternehmen|gastronomie|restaurants|b2b|corporate-gifts/.test(p))return 'B2B';
  if(/nach-mass|aufbereiten|refurbishment|custom/.test(p))return 'Service / Conversion';
  return 'Editorial / Guide';
}
export function audit(){
  const files=execFileSync('git',['ls-tree','-r','--name-only',baseline],{cwd:root,encoding:'utf8'}).trim().split('\n');
  const findings=[],selectors=new Map(),colors=new Set(),containers=new Set(),media=new Set();
  const record=(file,line,pattern,value,action='ersetzen')=>findings.push([file,line,pattern,value,action]);
  for(const file of files.filter(f=>/\.css$/.test(f)&&!f.startsWith('brettvorschau/assets/'))){
    const css=postcss.parse(read(file),{from:file});
    css.walkAtRules('media',n=>{media.add(n.params);record(file,n.source.start.line,'Media Query',n.params,'prüfen');});
    css.walkRules(rule=>{
      const key=rule.selector.trim();selectors.set(key,[...(selectors.get(key)||[]),`${file}:${rule.source.start.line}`]);
      if(/hero/i.test(key))record(file,rule.source.start.line,'Hero',key);
      if(/card|__box|ProofGrid/i.test(key))record(file,rule.source.start.line,'Card / Box',key);
      if(/\.btn|Button|__cta/i.test(key))record(file,rule.source.start.line,'Button',key);
      if(/\.section(?:\W|$)|\.container(?:\W|$)/.test(key))record(file,rule.source.start.line,'Section / Container',key);
    });
    css.walkDecls(decl=>{
      const {prop,value}=decl,line=decl.source.start.line;
      if(/font/.test(prop)&&/Playfair|Georgia|serif/.test(value))record(file,line,'Font family',`${prop}: ${value}`);
      else if(prop==='font-family'||prop==='font')record(file,line,'Local font override',`${prop}: ${value}`);
      if(decl.important)record(file,line,'Important',`${prop}: ${value}`,'entfernen nach Migration');
      if(prop==='border-radius')record(file,line,'Radius',value);
      if(/shadow/.test(prop)&&value!=='none')record(file,line,'Shadow',value,'entfernen außer Overlay');
      if(prop==='max-width'){containers.add(value);record(file,line,'Width',value);}
      for(const color of value.match(/#[\da-f]{3,8}\b/gi)||[])colors.add(color.toLowerCase());
    });
  }
  for(const file of files.filter(f=>f.endsWith('.html')&&!f.startsWith('tools/'))){
    const doc=parse(read(file),{sourceCodeLocationInfo:true});
    for(const node of walk(doc)){
      const line=node.sourceCodeLocation?.startLine||1;
      if(attr(node,'style'))record(file,line,'Inline style',attr(node,'style'),'prüfen: Layout oder Laufzeitwert');
      if(node.tagName==='style')record(file,line,'Page-local CSS',text(node).slice(0,120));
      if(node.tagName==='link'&&/fonts\.google/.test(attr(node,'href')||''))record(file,line,'External font',attr(node,'href'));
      if(node.tagName==='link'&&attr(node,'rel')==='stylesheet'&&/assets\/css/.test(attr(node,'href')||''))record(file,line,'Supplemental CSS',attr(node,'href'),'in Komponenten übernehmen');
    }
  }
  for(const [selector,locations] of selectors)if(locations.length>1)record(locations[0].split(':')[0],locations[0].split(':')[1],'Repeated selector',`${selector} (${locations.length} definitions)`,'Kontext prüfen');
  const urls=walk(parse(read('sitemap.xml'))).filter(n=>n.tagName==='loc').map(text);
  const inventory=[];
  for(const url of urls){
    const file=pageFile(url),doc=parse(read(file)),nodes=walk(doc),main=nodes.find(n=>n.tagName==='main')||doc;
    const classes=nodes.flatMap(n=>(attr(n,'class')||'').split(/\s+/));
    const kind=template(url),words=text(main).trim().split(/\s+/).length;
    const images=nodes.filter(n=>n.tagName==='img');
    inventory.push([url,kind,'Montserrat + Playfair / inherited legacy','yes',kind==='Home'?'immersive':kind==='Product Detail'?'product':kind==='Service / Conversion'||kind==='B2B'?'service':'editorial',classes.filter(c=>/card|__box/i.test(c)).length,words>1200?'high':words>500?'medium':'low',words>500?'review':'no',kind==='Product Detail'?'review':'only if meaningful',images.length?images.every(n=>attr(n,'alt'))?'manual asset review pending':'missing alt detected':'no image',kind==='Home'||kind.startsWith('Product')?'P1':kind==='B2B'||kind.startsWith('Service')?'P2':'P3']);
  }
  const out=path.join(root,'docs');fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'design-legacy-findings.csv'),csv([['file','line','pattern','value','action'],...findings]));
  fs.writeFileSync(path.join(out,'design-page-inventory.csv'),csv([['URL','Template','current_font','old_design_detected','hero_type','card_density','text_density','accordion_needed','tabs_needed','image_quality','priority'],...inventory]));
  const groups=[...new Set(findings.map(r=>r[2]))].map(pattern=>{
    const rows=findings.filter(r=>r[2]===pattern),sample=rows.slice(0,3).map(r=>`${r[0]}:${r[1]}`).join(', ');
    return `| ${pattern} (${rows.length}) | ${sample} | Inhalt / Vertrag | zentrales Token oder Komponente | nur nach Regression |`;
  }).join('\n');
  fs.writeFileSync(path.join(out,'design-system-audit.md'),`# Designsystem-Audit\n\nBasis: \`${baseline}\` (aktueller main beim Start). Automatisch reproduzierbar: \`node scripts/audit-design-system.mjs\`.\n\n${urls.length} Sitemap-URLs, ${findings.length} Fundstellen, ${colors.size} verschiedene Hexfarbwerte, ${containers.size} max-width-Werte und ${media.size} Media-Query-Ausdrücke. CSS-Syntax wird mit PostCSS, HTML mit parse5 gelesen. Zähler sind Inventar, keine automatisch bewiesenen Fehler: Wiederholungen innerhalb verschiedener Media Queries können notwendig sein. Kompiliertes Brettvorschau-Bundle separat, nicht mechanisch umschreiben.\n\n| Pattern | Fundstellen | behalten | ersetzen | entfernen |\n|---|---|---|---|---|\n${groups}\n\n## Scope und Schutz\n\n- Phase A/B: System und drei Referenztypen jeweils DE/EN. Kein siteweiter Rollout vor Review.\n- Neuer Worktree nötig, weil der Shopcheckout ungespeicherte Arbeiten enthält. Dieser bleibt unverändert.\n- Shopbranch \`codex/cloudflare-stripe-shop\`, Merge Base \`45111ea1419f6bf07db0c79b140d7af525e16184\`. Main enthält zusätzlich PR200. Konfliktrisiko besonders bei styles.css, main.js, Produktgenerator und Paketdaten.\n- Keine Shopbackend-Dateien übernehmen. Kein Stripe-, Preis-, Versand-, DNS- oder Checkout-Change.\n- Bestehende Designvorschau ist NICHT main. Frühere lokale Inhaltskorrekturen nicht still überschreiben oder als bereits gemergt ausgeben. Vor späterer Veröffentlichung separat abgleichen.\n- Alte Styles werden zunächst in einer Legacy-Cascade-Layer isoliert, nicht gelöscht. Nicht migrierte URLs bleiben unverändert.\n- Vollständige maschinenlesbare Fundstellen und Seitenzuordnung siehe die beiden CSV-Dateien. Bildqualität ist bewusst manuell offen; vorhandenes alt ist kein Qualitätsnachweis.\n`);
  return {pages:urls.length,findings:findings.length,colors:colors.size,widths:containers.size,media:media.size};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)console.log(audit());
