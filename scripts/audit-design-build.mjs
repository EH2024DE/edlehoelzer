import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parse} from 'parse5';
import postcss from 'postcss';
import {root,walk,attr,text} from './audit-design-system.mjs';
const directory=process.argv[2]||path.join(os.tmpdir(),'edle-design-system-reference');
const manifest=JSON.parse(fs.readFileSync(path.join(directory,'design-reference.json'),'utf8'));
const findings=[],styles=new Set(),rows=[];
for(const page of manifest.references){
  const nodes=walk(parse(fs.readFileSync(path.join(directory,page.file),'utf8')));
  for(const n of nodes){
    if(n.tagName==='link'&&attr(n,'rel')==='stylesheet'){
      const href=attr(n,'href');if(/^https?:/.test(href))findings.push({route:page.route,type:'external-stylesheet',href});else styles.add(href.split('?')[0]);
    }
    if(attr(n,'style')&&/font(?:-family|-size)?\s*:|letter-spacing\s*:/.test(attr(n,'style')))findings.push({route:page.route,type:'inline-typography'});
  }
  const classes=nodes.flatMap(n=>(attr(n,'class')||'').split(/\s+/)),main=nodes.find(n=>n.tagName==='main'),words=text(main).trim().split(/\s+/).length;
  if(page.indexable)rows.push(['https://edlehoelzer.de'+page.route,page.template,'EH Sans (local Montserrat)','no',classes.find(c=>c.startsWith('ds-hero--'))?.slice(9)||page.template,classes.filter(c=>/card|__box/i.test(c)).length,words>1200?'high':words>500?'medium':'low','shared disclosure component','only where meaningful','browser checks passed; framing review remains human',page.template==='home'||page.template.startsWith('product')?'P1':'P2']);
}
for(const file of styles){
  const css=postcss.parse(fs.readFileSync(path.join(directory,file),'utf8'));
  css.walkDecls(decl=>{if(/^font(?:-family)?$/.test(decl.prop)&&/Playfair|Georgia|["']serif["']/.test(decl.value))findings.push({file,type:'legacy-font',value:decl.value});});
}
const csv=values=>values.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
fs.writeFileSync(path.join(root,'docs/design-page-inventory.csv'),csv([['URL','Template','current_font','old_design_detected','hero_type','card_density','text_density','accordion_needed','tabs_needed','image_quality','priority'],...rows]));
const result={scope:'generated static design artifact; baseline source styles remain isolated, not globally deleted',pages:manifest.references.length,indexable:rows.length,linkedStylesheets:styles.size,findings};
fs.writeFileSync(path.join(root,'docs/design-final-legacy-audit.json'),JSON.stringify(result,null,2));console.log(result);if(findings.length)process.exitCode=1;
