import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {sitePages,renderSitePreview,walk,attr,approvedHome} from '../tools/shop-server/site-preview.mjs';
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');
const findings=[];
for(const route of sitePages.keys()){
 const result=renderSitePreview(route);
 if(!result&&!['/','/en/'].includes(route))continue;
 const doc=parse(result?result.html:approvedHome(route==='/en/'));
 const main=walk(doc).find(node=>node.tagName==='main');
 if(!main)continue;
 const nodes=walk(main),sources=new Map();
 for(const image of nodes.filter(node=>node.tagName==='img')){
  let parent=image.parentNode,excluded=false;
  while(parent&&parent!==main){if(parent.tagName==='noscript')excluded=true;parent=parent.parentNode;}
  if(excluded)continue;
  const src=attr(image,'src');sources.set(src,(sources.get(src)||0)+1);
 }
 const duplicates=[...sources].filter(([,count])=>count>1);
 const headings=nodes.filter(node=>node.tagName==='h2').length;
 if(duplicates.length||headings>12)findings.push({route,headings,duplicateImages:duplicates});
}
console.log(JSON.stringify({scope:sitePages.size,note:'Source-content audit, excluding noscript fallbacks and dynamic product galleries. Repeated photos are review candidates, not automatically defects.',findings},null,2));
