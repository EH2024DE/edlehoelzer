import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {walk,attr,approvedHome} from '../tools/shop-server/site-preview.mjs';
const read=file=>parse(fs.readFileSync(file,'utf8'));
const formIn=(doc,en)=>walk(doc).find(node=>node.tagName==='form'&&(en?walk(node).some(child=>attr(child,'id')==='b2b-budget-help-en'):attr(node,'class')==='b2b-form'));
for(const [file,en]of [['handgefertigte-holzprodukte-fuer-unternehmen/index.html',false],['en/index.html',true]]){
 test(file+': quantity and budget basis are explicit, required and never hidden in optional details',()=>{
  const form=formIn(read(file),en);assert.ok(form);
  assert.equal(attr(form,'action'),'https://formspree.io/f/maqanpld');assert.equal(attr(form,'method'),'POST');
  for(const name of ['name','email','quantity','budget','budget_basis','message']){
   const fields=walk(form).filter(node=>attr(node,'name')===name);assert.equal(fields.length,1,name);
   assert.notEqual(attr(fields[0],'required'),undefined,name);
   for(let parent=fields[0].parentNode;parent&&parent!==form;parent=parent.parentNode)assert.notEqual(parent.tagName,'details',name+' visible');
  }
  const quantity=walk(form).find(node=>attr(node,'name')==='quantity');assert.equal(attr(quantity,'type'),'number');assert.equal(attr(quantity,'min'),'1');assert.equal(attr(quantity,'step'),'1');
  const budget=walk(form).find(node=>attr(node,'name')==='budget_basis');
  assert.deepEqual(walk(budget).filter(node=>node.tagName==='option').map(node=>attr(node,'value')),en?['','per piece','entire project']:['','pro Stück','Gesamtprojekt']);
 });
}
test('English home preview blocks submission of its new enquiry form',()=>{
 assert.match(approvedHome(true),/site-preview-bootstrap.js/);
 assert.ok(formIn(parse(approvedHome(true)),true));
});
test('restaurant enquiry retains required budget and budget basis in both languages',()=>{
 for(const file of ['schneidebretter-aus-holz-gastronomie/index.html','en/wooden-cutting-boards-for-restaurants/index.html']){
  for(const name of ['budget','budget_basis'])assert.notEqual(attr(walk(read(file)).find(node=>attr(node,'name')===name),'required'),undefined,file+' '+name);
 }
});
