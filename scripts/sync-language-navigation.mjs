import fs from 'node:fs';
import {parse} from 'parse5';
import {walk,attr,text,pageFile} from './audit-design-system.mjs';
const origin='https://edlehoelzer.de';
const routes=walk(parse(fs.readFileSync('sitemap.xml','utf8'))).filter(n=>n.tagName==='loc').map(text).filter(url=>!new URL(url).pathname.startsWith('/en/'));
let changed=0;
for(const url of routes){
  const deFile=pageFile(url),deNodes=walk(parse(fs.readFileSync(deFile,'utf8')));
  const alternate=deNodes.find(n=>n.tagName==='link'&&attr(n,'hreflang')==='en');if(!alternate)continue;
  const enUrl=attr(alternate,'href');
  for(const [file,active] of [[deFile,'de'],[pageFile(enUrl),'en']]){
    let source=fs.readFileSync(file,'utf8');const nodes=walk(parse(source,{sourceCodeLocationInfo:true})),changes=[];
    const seen=new Set();
    for(const n of nodes.filter(n=>n.tagName==='link'&&attr(n,'rel')==='alternate')){
      const code=attr(n,'hreflang');if(!['de','en','x-default'].includes(code))continue;
      if(seen.has(code)){changes.push({...n.sourceCodeLocation,value:''});continue;}seen.add(code);
      const expected=code==='en'?enUrl:url;
      if(attr(n,'href')!==expected){const loc=n.sourceCodeLocation.attrs.href;changes.push({...loc,value:'href="'+expected+'"'});}
    }
    for(const group of nodes.filter(n=>['lang','mobileMenu__lang'].includes(attr(n,'class')))){
      const expected=[['de',new URL(url).pathname],['en',new URL(enUrl).pathname]];
      const links=walk(group).filter(n=>n.tagName==='a');
      const currentUrl=active==='en'?enUrl:url;
      if(links.length===2&&expected.every(([code,href],i)=>new URL(attr(links[i],'href'),currentUrl).pathname===href&&text(links[i]).trim()===code.toUpperCase()))continue;
      const loc=group.sourceCodeLocation;
      changes.push({startOffset:loc.startTag.endOffset,endOffset:loc.endTag.startOffset,value:expected.map(([code,href])=>`<a href="${href}"${code===active?' class="is-active"':''}>${code.toUpperCase()}</a>`).join('')});
    }
    for(const c of changes.sort((a,b)=>b.startOffset-a.startOffset))source=source.slice(0,c.startOffset)+c.value+source.slice(c.endOffset);
    if(changes.length){fs.writeFileSync(file,source);changed++;}
  }
}
console.log({updatedLanguageNavigation:changed});
