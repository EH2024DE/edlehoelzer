import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {sitePages} from './build-design-site.mjs';
import {root,walk,attr} from './audit-design-system.mjs';
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const pages=sitePages();
const approved=['/atelier/','/handgefertigte-holzprodukte-fuer-unternehmen/','/schneidebrett-nach-mass/','/schneidebrett-fachwerk-eiche/','/pflege.html','/schneidebrett-aufbereiten/','/teigschaber-holz/','/pfannenwender-holz/','/holzarten-schneidebrett/','/stirnholz-vs-langholz/','/schneidebrett-saftrille/','/schneidebrett-mit-gravur/','/hochwertige-kuechenaccessoires/','/holz-statt-plastik/','/brotzeitbrett/','/schneidebrett-nussbaum/','/barbecue-geschenk/','/hochwertige-geschenke-holz/','/presse/','/bewertungen/','/produkte.html'];
const rows=approved.map(route=>{
  const de=pages.find(p=>p.route===route),source=walk(parse(read(de.file)));
  const alternate=source.find(n=>n.tagName==='link'&&attr(n,'hreflang')==='en');
  const enRoute=alternate?new URL(attr(alternate,'href')).pathname:null,en=pages.find(p=>p.route===enRoute);
  const shape=file=>{const n=walk(parse(read(file))),main=n.find(n=>n.tagName==='main');return walk(main).filter(x=>x.tagName==='section').map(x=>attr(x,'class')||'');};
  const sameStructure=!!en&&JSON.stringify(shape(de.file))===JSON.stringify(shape(en.file));
  return {de:route,en:enRoute,englishPageExists:!!en,sharedDesignBuild:!!en,sameSourceSectionStructure:sameStructure,status:!en?'English page missing':sameStructure?'Shared structure; browser QA required':'Shared design system; content/section alignment still needs review'};
});
const report={checkedAt:'2026-11-09',scope:'Current repository and built design system, not a claim of live deployment',rows,exceptions:[{route:'/schneidebretter-aus-holz-gastronomie/',decision:'Germany-only; existing English page deliberately unchanged'},{route:'/baumspende.html',decision:'German only; 2026 intake closed'},{route:'/brettvorschau/',decision:'Shared interactive application; translation and interaction need separate browser QA'}]};
fs.writeFileSync(path.join(root,'docs/language-design-audit-2026-11-09.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:rows.length,missingEnglish:rows.filter(r=>!r.englishPageExists).map(r=>r.de),structureReview:rows.filter(r=>r.englishPageExists&&!r.sameSourceSectionStructure).map(r=>r.de)},null,2));
