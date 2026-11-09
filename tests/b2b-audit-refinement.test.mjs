import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {parse,serialize} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {refineB2bAudit} from '../scripts/b2b-audit-refinement.mjs';

const pages=['handgefertigte-holzprodukte-fuer-unternehmen/index.html','schneidebretter-aus-holz-gastronomie/index.html','en/wooden-cutting-boards-for-restaurants/index.html','en/corporate-gifts/index.html'];
const route=file=>'/'+file.replace(/index\.html$/,'');
const load=file=>parse(fs.readFileSync(path.join(root,file),'utf8'));
const fields=doc=>walk(doc).filter(n=>['input','select','textarea','button'].includes(n.tagName));
const inside=(node,parent)=>{for(let p=node.parentNode;p;p=p.parentNode)if(p===parent)return true;return false;};
const budget=n=>['budget','budget_basis'].includes(attr(n,'name'));

for(const file of pages)test(`${file}: optional extras preserve submission and content contracts`,()=>{
  const doc=load(file),before=walk(doc),originalFields=fields(doc);
  const attributes=new Map(originalFields.map(n=>[n,structuredClone(n.attrs)]));
  const forms=before.filter(n=>n.tagName==='form').map(n=>[n,structuredClone(n.attrs)]);
  const json=before.filter(n=>attr(n,'type')==='application/ld+json').map(serialize);
  const copy=before.filter(n=>n.nodeName==='#text').map(n=>[n,n.value]);
  refineB2bAudit(doc,{route:route(file)});
  const legacyEnglish=file==='en/wooden-cutting-boards-for-restaurants/index.html';
  const disclosure=walk(doc).find(n=>n.tagName==='details'&&walk(n).some(c=>attr(c,'name')==='phone'));
  assert.ok(disclosure);
  assert.equal(text(disclosure.childNodes.find(n=>n.tagName==='summary')),file.startsWith('en/')?'Further details (optional)':'Weitere Angaben (optional)');
  assert.equal(attr(disclosure,'open'),undefined);
  for(const field of originalFields.filter(n=>['company','phone','dimensions','wood','engraving','timing','timeline'].includes(attr(n,'name'))))assert.ok(inside(field,disclosure));
  assert.equal(fields(doc).length,originalFields.length);
  for(const field of originalFields){
    assert.ok(fields(doc).includes(field));
    assert.deepEqual(field.attrs,attributes.get(field).filter(a=>!legacyEnglish||!budget(field)||!['required','aria-required'].includes(a.name)));
    if(budget(field)){
      assert.equal(inside(field,disclosure),legacyEnglish);
      if(legacyEnglish)assert.match(text(field.parentNode),/\(optional\)/);
      else assert.notEqual(attr(field,'required'),undefined);
    }
  }
  for(const [form,attrs] of forms)assert.deepEqual(form.attrs,attrs);
  assert.deepEqual(walk(doc).filter(n=>attr(n,'type')==='application/ld+json').map(serialize),json);
  for(const [node,value] of copy){
    const inSummary=before.some(n=>n.tagName==='summary'&&n.childNodes.includes(node));
    const inBudget=originalFields.some(n=>budget(n)&&inside(node,n.parentNode));
    if(!inSummary&&!inBudget)assert.equal(node.value,value);
  }
  const core=originalFields.filter(n=>['name','email','product_idea','quantity','message'].includes(attr(n,'name')));
  assert.deepEqual(fields(doc).filter(n=>core.includes(n)),core);
  const once=serialize(doc);refineB2bAudit(doc,{route:route(file)});assert.equal(serialize(doc),once);
});

test('gastronomy message hooks still support both JavaScript-required states',()=>{
  for(const file of pages.slice(1,3)){
    const doc=load(file);refineB2bAudit(doc,{route:route(file)});
    const nodes=walk(doc),find=name=>nodes.find(n=>attr(n,name)!==undefined);
    const description=find('data-gastro-description'),anchor=find('data-gastro-description-anchor'),optional=find('data-gastro-optional-message');
    const message=fields(doc).find(n=>attr(n,'name')==='message');
    const idea={value:file.startsWith('en/')?'undecided':'noch offen',addEventListener(){}};
    const label={},help={};
    description.querySelector=()=>label;
    anchor.after=node=>{assert.equal(node,description);description.destination=anchor;};
    optional.append=node=>{assert.equal(node,description);description.destination=optional;};
    const form={elements:{product_idea:idea,message},querySelector:selector=>selector.includes('anchor')?anchor:selector.includes('optional')?optional:description,addEventListener(){}};
    const context={document:{documentElement:{lang:file.startsWith('en/')?'en':'de'},querySelectorAll:()=>[],querySelector:()=>form,getElementById:()=>help}};
    const script=fs.readFileSync(path.join(root,'assets/js/gastronomie.js'),'utf8');
    vm.runInNewContext(script,context);
    assert.equal(message.required,true);assert.equal(description.destination,anchor);
    idea.value='Servierbrett';vm.runInNewContext(script,context);
    assert.equal(message.required,file.startsWith('en/')?false:true);assert.equal(description.destination,file.startsWith('en/')?optional:anchor);
  }
});

test('required business controls remain visible and non-target pages are unchanged',()=>{
  const doc=parse('<form class="b2b-form"><label>Company<input name="company" required></label><label>Quantity<input name="quantity" required></label><label>Budget (required)<input name="budget" required></label><button type="submit">Send</button></form>');
  refineB2bAudit(doc,{route:'/b2b.html'});
  const details=walk(doc).find(n=>n.tagName==='details');
  for(const name of ['company','quantity']){
    const field=fields(doc).find(n=>attr(n,'name')===name);
    assert.equal(attr(field,'required'),'');assert.equal(inside(field,details),false);
  }
  for(const [document,reference] of [[load('b2b.html'),{route:'/b2b.html'}],[load(pages[1]),{route:'/atelier/'}]]){
    const before=serialize(document);refineB2bAudit(document,reference);assert.equal(serialize(document),before);
  }
});
