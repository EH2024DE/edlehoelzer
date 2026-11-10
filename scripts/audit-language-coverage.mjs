import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text,pageFile} from './audit-design-system.mjs';
import {renderReference} from './build-design-reference.mjs';
import {sitePages} from './build-design-site.mjs';

export function auditLanguageCoverage(){
  const urls=walk(parse(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'))).filter(n=>n.tagName==='loc').map(text);
  const excluded=new Map([['/baumspende.html','German-only donation programme'],['/schneidebretter-aus-holz-gastronomie/','Germany-only hospitality offering; no new English expansion']]);
  const pages=sitePages(),rows=[];
  for(const url of urls.filter(u=>!new URL(u).pathname.startsWith('/en/'))){
    const route=new URL(url).pathname;
    if(excluded.has(route)){rows.push({de:route,exception:excluded.get(route),issues:[]});continue;}
    const nodes=walk(parse(fs.readFileSync(path.join(root,pageFile(url)),'utf8'))),issues=[];
    const alternates=nodes.filter(n=>n.tagName==='link'&&attr(n,'hreflang')==='en');
    const enUrl=attr(alternates[0],'href');
    if(alternates.length!==1)issues.push('expected exactly one English alternate');
    const enFile=enUrl&&path.join(root,pageFile(enUrl));
    if(!enFile||!fs.existsSync(enFile)){issues.push('English destination missing');rows.push({de:route,en:enUrl,issues});continue;}
    if(!urls.includes(enUrl))issues.push('English destination missing from sitemap');
    const english=walk(parse(fs.readFileSync(enFile,'utf8')));
    if(attr(english.find(n=>n.tagName==='html'),'lang')!=='en')issues.push('English page language mismatch');
    if(!english.some(n=>n.tagName==='link'&&attr(n,'hreflang')==='de'&&attr(n,'href')===url))issues.push('missing reciprocal German alternate');
    for(const [current,target,label] of [[route,new URL(enUrl).pathname,'EN'],[new URL(enUrl).pathname,route,'DE']]){
      const page=pages.find(p=>p.route===current);
      if(!page){issues.push('missing build destination '+current);continue;}
      const rendered=walk(parse(renderReference(page).html));
      const header=rendered.find(n=>n.tagName==='header'&&(attr(n,'class')||'').split(' ').includes('topbar'));
      const group=header&&walk(header).find(n=>attr(n,'class')==='lang');
      if(!group||!walk(group).some(n=>n.tagName==='a'&&text(n).trim()===label&&attr(n,'href')===target))issues.push('missing header switch '+current+' -> '+target);
    }
    rows.push({de:route,en:new URL(enUrl).pathname,issues});
  }
  return {checkedAt:'2026-11-10',scope:'Entire indexable sitemap in the current build, including product and legal pages; not a claim of live publication',germanPages:rows.length,pairs:rows.filter(r=>r.en).length,exceptions:rows.filter(r=>r.exception),issues:rows.filter(r=>r.issues.length),rows};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){
  const report=auditLanguageCoverage();
  fs.writeFileSync(path.join(root,'docs/language-coverage-2026-11-10.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({germanPages:report.germanPages,pairs:report.pairs,exceptions:report.exceptions,issues:report.issues},null,2));
  if(report.issues.length)process.exitCode=1;
}
