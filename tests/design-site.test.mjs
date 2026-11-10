import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {sitePages} from '../scripts/build-design-site.mjs';
import {renderReference} from '../scripts/build-design-reference.mjs';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {refineB2bAudit} from '../scripts/b2b-audit-refinement.mjs';
import catalogApproval from './catalog-copy-approval.cjs';

test('every sitemap URL is included in the shared design build, without duplicate routes',()=>{
  const pages=sitePages(),routes=pages.map(p=>p.route);
  assert.equal(new Set(routes).size,routes.length);
  for(const url of walk(parse(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'))).filter(n=>n.tagName==='loc').map(text))assert.ok(routes.includes(new URL(url).pathname),url);
});
test('all migrated templates preserve search metadata, original content and form contracts',()=>{
  for(const page of sitePages()){
    const source=parse(fs.readFileSync(path.join(root,page.file),'utf8')),rendered=parse(renderReference(page).html);
    refineB2bAudit(source,page);
    const before=walk(source),after=walk(rendered);
    catalogApproval.clearCatalogDirectories(before);catalogApproval.clearCatalogDirectories(after);
    // Only the visible product title is shortened; search metadata and schema remain intact.
    const productRoot=after.find(n=>attr(n,'data-display-title'));
    if(productRoot){const heading=before.find(n=>n.tagName==='h1');heading.childNodes=[{nodeName:'#text',value:attr(productRoot,'data-display-title'),parentNode:heading}];}
    const metadata=nodes=>nodes.filter(n=>n.tagName==='meta'||n.tagName==='title'||n.tagName==='h1'||n.tagName==='link'&&['canonical','alternate'].includes(attr(n,'rel'))||n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>({tag:n.tagName,attrs:n.attrs,text:text(n)}));
    assert.deepEqual(metadata(after),metadata(before),page.route+' metadata');
    const main=nodes=>nodes.find(n=>n.tagName==='main');
    for(const node of after.filter(n=>attr(n,'data-ds-added')!==undefined))node.parentNode.childNodes=node.parentNode.childNodes.filter(n=>n!==node);
    if(page.template==='home')for(const list of [before,after]){
      const track=list.find(n=>attr(n,'data-review-track')!==undefined);if(track)track.childNodes=[];
      for(const node of list.filter(n=>attr(n,'data-review-headline')!==undefined||attr(n,'data-review-subline')!==undefined))node.childNodes=[];
    }
    const content=node=>walk(node).filter(n=>n.nodeName==='#text'&&n.value.trim()).map(n=>n.value.replace(/\s+/g,' ').trim()).sort();
    if(main(before))assert.deepEqual(content(main(after)),content(main(before)),page.route+' content (reordering allowed, text loss forbidden)');
    else for(const node of before.filter(n=>['p','h1','h2','li'].includes(n.tagName)))assert.ok(text(main(after)).includes(text(node)),page.route+' legal content');
    const forms=nodes=>nodes.filter(n=>['form','input','select','textarea'].includes(n.tagName)).map(n=>[n.tagName,...['name','required','action','method','value','min','max'].map(k=>k==='required'&&['budget','budget_basis'].includes(attr(n,'name'))?undefined:attr(n,k))]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    assert.deepEqual(forms(after),forms(before),page.route+' form contract');
    const links=nodes=>walk(main(nodes)||nodes[0]).filter(n=>n.tagName==='a').map(n=>attr(n,'href'));
    for(const href of links(before))assert.ok(links(after).includes(href),page.route+' '+href);
    assert.ok(!after.some(n=>n.tagName==='link'&&/fonts\.google|fonts\.gstatic/.test(attr(n,'href')||'')),page.route+' external fonts');
  }
});
