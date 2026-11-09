import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse,parseFragment,serialize} from 'parse5';
import postcss from 'postcss';
import {root,walk,attr,text} from './audit-design-system.mjs';
import {refineRefurbishment} from './refurbishment-comparison.mjs';
import {refineContentLayout} from './design-content-layout.mjs';
import {addEnglishProcess} from './erbstueck-process-translation.mjs';
import {refineHomepage} from './homepage-presentation.mjs';

export const references=[
  {route:'/',file:'index.html',template:'home'},
  {route:'/en/',file:'en/index.html',template:'home'},
  {route:'/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/',file:'produkte/nussbaum-stirnholz-mit-saftrille-1850610674/index.html',template:'product'},
  {route:'/en/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/',file:'en/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/index.html',template:'product'},
  {route:'/pflege.html',file:'pflege.html',template:'editorial'},
  {route:'/en/care.html',file:'en/care.html',template:'editorial'}
];
const set=(n,key,value)=>{const a=n.attrs.find(a=>a.name===key);if(a)a.value=value;else n.attrs.push({name:key,value});};
const has=(n,name)=>(attr(n,'class')||'').split(/\s+/).includes(name);
const addClass=(n,value)=>set(n,'class',[attr(n,'class'),value].filter(Boolean).join(' '));
const remove=n=>{n.parentNode.childNodes=n.parentNode.childNodes.filter(c=>c!==n);};
const append=(parent,node)=>{node.parentNode=parent;parent.childNodes.push(node);};
export function guardLegacyStyleLoads(source){
  for(const name of ['photoStyle','searchStyle','roomStyle','kitchenStyle']){
    const statement=`document.head.appendChild(${name});`;
    if(source.split(statement).length!==2)throw Error('Legacy style loader changed: '+name);
    source=source.replace(statement,`if (!document.body.classList.contains('ds-site')) ${statement}`);
  }
  return source;
}

export function renderReference(reference){
  const document=parse(fs.readFileSync(path.join(root,reference.file),'utf8'));
  const nodes=walk(document),body=nodes.find(n=>n.tagName==='body'),head=nodes.find(n=>n.tagName==='head');
  addClass(body,'ds-site');set(body,'data-ds-template',reference.template);
  const css=reference.template==='legal'?[fs.readFileSync(path.join(root,'styles.css'),'utf8')]:[];
  for(const node of [...nodes]){
    if(attr(node,'style')){
      const declarations=postcss.parse(`x{${attr(node,'style')}}`);
      declarations.walkDecls(decl=>{if(/^(font|line-height|letter-spacing|text-transform|color$|background-color|border-radius|box-shadow)/.test(decl.prop))decl.remove();});
      set(node,'style',declarations.first.nodes.map(n=>n.toString()).join(';'));
    }
    if(node.tagName==='style'){css.push(text(node));remove(node);}
    if(node.tagName==='link'&&/fonts\.google|fonts\.gstatic/.test(attr(node,'href')||''))remove(node);
    else if(node.tagName==='link'&&attr(node,'rel')==='stylesheet'){
      const url=new URL(attr(node,'href'),'https://edlehoelzer.de'+reference.route);
      if(url.hostname!=='edlehoelzer.de')throw Error('Unexpected external stylesheet: '+url.href);
      css.push(fs.readFileSync(path.join(root,url.pathname),'utf8'));remove(node);
    }
  }
  // These four legacy sheets are injected by main.js, so they need the same layer boundary.
  for(const file of ['assets/css/product-photo-viewer.css','assets/css/site-search.css','assets/css/room-discovery.css','assets/css/kitchen-preview-entry.css']){
    const source=fs.readFileSync(path.join(root,file),'utf8');if(!css.includes(source))css.push(source);
  }
  const legacy=postcss.root();
  for(const source of css){
    const parsed=postcss.parse(source);
    parsed.walkAtRules('import',n=>{if(/fonts\.google/.test(n.params))n.remove();});
    parsed.walkDecls(decl=>{
      if(/^(font(?:-.+)?|line-height|letter-spacing|text-transform)$/.test(decl.prop)){decl.remove();return;}
      if(/^(color$|background|border|box-shadow)/.test(decl.prop))decl.important=false;
    });legacy.append(parsed.nodes);
  }
  const layer=postcss.atRule({name:'layer',params:'legacy'});layer.append(legacy.nodes);
  const legacyFile=`assets/css/design-legacy-${createHash('sha256').update(layer.toString()).digest('hex').slice(0,12)}.css`;
  for(const fragment of parseFragment(`<link rel="stylesheet" href="/${legacyFile}"><link rel="stylesheet" href="/assets/css/design-system.css"><script src="/assets/js/design-system.js" defer></script>`).childNodes)append(head,fragment);
  let hero=nodes.find(n=>has(n,reference.template==='home'?'hero':reference.template==='product'?'productPreview':'pflege-hero'));
  if(!hero&&!['legal','tool'].includes(reference.template)){
    let candidate=nodes.find(n=>n.tagName==='h1');
    while(candidate&&candidate.tagName!=='main'&&candidate.tagName!=='section')candidate=candidate.parentNode;
    if(candidate?.tagName==='section')hero=candidate;
  }
  if(hero)addClass(hero,'ds-hero--'+(reference.template==='home'||has(hero,'erbstueckHero')?'immersive':reference.template));
  for(const section of nodes.filter(n=>n.tagName==='section')){
    const actions=walk(section).filter(n=>n.tagName==='a'&&(has(n,'btn--emphasis')||has(n,'pflege-btn')&&!has(n,'pflege-btn--ghost')));
    actions.slice(1).forEach(n=>addClass(n,'ds-secondary'));
  }
  for(const detail of nodes.filter(n=>has(n,'productPreview__detail')))set(detail,'data-ds-read-more','');
  const processGallery=nodes.find(n=>has(n,'beforeAfterGallery'));
  if(processGallery&&reference.template==='service'){
    const sources=new Set(walk(processGallery).filter(n=>n.tagName==='img').map(n=>attr(n,'src')));
    const galleryNodes=new Set(walk(processGallery));
    for(const image of nodes.filter(n=>n.tagName==='img'&&sources.has(attr(n,'src'))&&!galleryNodes.has(n))){
      let figure=image.parentNode;while(figure&&figure.tagName!=='figure'&&figure.tagName!=='section')figure=figure.parentNode;
      if(figure?.tagName==='figure'){set(figure,'hidden','');set(figure,'data-ds-duplicate-media','');set(image,'loading','lazy');}
    }
  }
  for(const section of nodes.filter(n=>n.tagName==='section')){
    let parent=section.parentNode;
    while(parent&&parent.tagName!=='main'&&parent.tagName!=='section')parent=parent.parentNode;
    if(parent?.tagName==='main'&&section!==hero)addClass(section,'ds-section');
  }
  const main=nodes.find(n=>n.tagName==='main');
  if(reference.template==='legal'&&!main){
    const wrapper=parseFragment('<main class="ds-legal"></main>').childNodes[0];
    for(const child of [...body.childNodes])if(child.tagName!=='script'){remove(child);append(wrapper,child);}
    body.childNodes.unshift(wrapper);wrapper.parentNode=body;
    const shared=walk(parse(fs.readFileSync(path.join(root,'index.html'),'utf8')));
    const header=shared.find(n=>n.tagName==='header'&&has(n,'topbar')),footer=shared.find(n=>n.tagName==='footer');
    if(header){body.childNodes.unshift(header);header.parentNode=body;}
    if(footer)append(body,footer);
  }
  refineRefurbishment(document,reference);
  refineContentLayout(document,reference);
  addEnglishProcess(document,reference);
  refineHomepage(document,reference);
  const footer=walk(document).find(n=>n.tagName==='footer');
  const footerGroup=footer&&walk(footer).find(n=>has(n,'footer__group'));
  if(footerGroup){
    const english=reference.route.startsWith('/en/');
    const link=parseFragment(`<a data-ds-added="reviews-navigation" href="${english?'/en/reviews/':'/bewertungen/'}">${english?'Reviews':'Bewertungen'}</a>`).childNodes[0];
    append(footerGroup,link);
  }
  return {html:serialize(document),legacy:layer.toString(),legacyFile};
}

export function buildReference(output=path.join(os.tmpdir(),'edle-design-system-reference'),pages=references){
  const destination=path.resolve(output);
  if(destination===root||destination.startsWith(root+path.sep))throw Error('Reference output must be outside the checkout');
  fs.mkdirSync(destination,{recursive:true});
  const marker=path.join(destination,'design-reference.json');
  if(fs.readdirSync(destination).length&&!fs.existsSync(marker))throw Error('Output must be empty or an existing reference build');
  const write=(file,content)=>{const full=path.join(destination,file);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,content);};
  const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  for(const file of files){
    if(file.startsWith('tools/')||file.startsWith('docs/')||file.startsWith('tests/')||file.startsWith('scripts/')||file.startsWith('.')||/(?:package(?:-lock)?\.json)$/.test(file))continue;
    if(!/\.(?:html|css|js|json|xml|txt|svg|png|jpe?g|webp|avif|mp4|wasm|woff2?|ttf|ico|map)$/.test(file))continue;
    const full=path.join(root,file);if(fs.lstatSync(full).isFile())write(file,fs.readFileSync(full));
  }
  for(const file of ['assets/css/design-system.css','assets/js/design-system.js'])write(file,fs.readFileSync(path.join(root,file)));
  write('main.js',guardLegacyStyleLoads(fs.readFileSync(path.join(root,'main.js'),'utf8')));
  write('assets/fonts/design/montserrat-latin.woff2',fs.readFileSync(path.join(root,'node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2')));
  write('assets/fonts/design/OFL.txt',fs.readFileSync(path.join(root,'node_modules/@fontsource-variable/montserrat/LICENSE')));
  for(const reference of pages){const rendered=renderReference(reference);write(reference.file,rendered.html);write(rendered.legacyFile,rendered.legacy);}
  write('design-reference/index.html',`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Designreferenzen | Edle Hölzer</title><link rel="stylesheet" href="/assets/css/design-system.css"><script src="/assets/js/design-system.js" defer></script></head><body class="ds-site"><header class="container section"><h1>Designreferenzen</h1></header><main class="container"><section class="section"><h2>Vorher und nachher</h2><ul>${references.map(r=>`<li>${r.template}: <a href="${r.route}">${r.route}</a> · <a href="/before${r.route}">main vorher</a></li>`).join('')}</ul></section><section class="section"><h2>Komponentenprüfung</h2><div data-ds-tabs aria-label="Materialwissen"><details open><summary>Material</summary><p>Massivholz zeigt individuelle Maserung und Farbe. Die Auswahl folgt dem konkreten Stück. Materialdaten bleiben auf der Produktseite sichtbar.</p></details><details><summary>Werkstatt</summary><p>Jedes Stück wird in der Werkstatt bearbeitet. Details zur Fertigung ergänzen die Produktdaten. Weitere Fragen klären wir persönlich.</p></details><details><summary>Service</summary><p>Die persönliche Auswahl gehört zur Beratung. Eine Gravur wird vor der Umsetzung abgestimmt. Kaufrelevante Informationen bleiben außerhalb dieser Zusatzthemen sichtbar.</p></details></div><details data-ds-read-more><summary>Mehr zur Gestaltung</summary><p>Zusätzliche Informationen bleiben im HTML und sind ohne JavaScript erreichbar.</p></details><article class="faqItem"><h3>Wie bleibt der Inhalt erreichbar?</h3><p>Ohne JavaScript ist die Antwort direkt sichtbar. Mit JavaScript kann sie per Tastatur geöffnet werden.</p></article><form><label for="example-name">Dein Name</label><input id="example-name" name="example-name" autocomplete="name"><button class="ds-button" type="submit">Anfrage vorbereiten</button></form></section></main></body></html>`);
  write('design-reference.json',JSON.stringify({generator:'edle-design-reference-v1',baseline:'f772f7a',references:pages,checkoutEnabled:false},null,2));
  if(pages.length>references.length){
    const indexFile=path.join(destination,'design-reference/index.html'),overview=parse(fs.readFileSync(indexFile,'utf8'));
    const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
    const groups=new Map();
    for(const page of pages){
      if(!groups.has(page.template))groups.set(page.template,[]);
      const title=walk(parse(fs.readFileSync(path.join(root,page.file),'utf8'))).find(n=>n.tagName==='h1');
      groups.get(page.template).push(`<li><a href="${escape(page.route)}">${escape(text(title)||page.route)}</a>${page.route.startsWith('/en/')?' · EN':''}</li>`);
    }
    const labels={editorial:'Ratgeber & Themen',tool:'Tresenvorschau',legal:'Rechtliches',home:'Startseiten',listing:'Produktübersichten',product:'Produktdetails',service:'Leistungen',b2b:'Unternehmen & Gastronomie'};
    const section=parseFragment(`<section class="section"><h2>Alle gestalteten Seiten (${pages.length})</h2>${[...groups].map(([name,links])=>`<details><summary>${labels[name]||name} (${links.length})</summary><ul>${links.join('')}</ul></details>`).join('')}</section>`).childNodes[0];
    const main=walk(overview).find(n=>n.tagName==='main'),components=main.childNodes.filter(n=>n.tagName==='section')[1];
    main.childNodes.splice(main.childNodes.indexOf(components),0,section);section.parentNode=main;write('design-reference/index.html',serialize(overview));
  }
  return {output:destination,references:pages.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)console.log(buildReference(process.argv[2]));
