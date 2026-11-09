import {parseFragment} from 'parse5';
import {walk,attr} from './audit-design-system.mjs';

const routes=new Set(['/b2b.html','/handgefertigte-holzprodukte-fuer-unternehmen/','/schneidebretter-aus-holz-gastronomie/','/en/wooden-cutting-boards-for-restaurants/']);
const secondary=new Set(['company','phone','dimensions','wood','engraving','timing','timeline']);
const controls=node=>walk(node).filter(n=>['input','select','textarea'].includes(n.tagName));
const ancestor=(node,predicate)=>{for(let parent=node.parentNode;parent;parent=parent.parentNode)if(predicate(parent))return parent;};
const has=(node,name)=>attr(node,name)!==undefined;

function move(node,parent,before){
  node.parentNode.childNodes.splice(node.parentNode.childNodes.indexOf(node),1);
  parent.childNodes.splice(before?parent.childNodes.indexOf(before):parent.childNodes.length,0,node);
  node.parentNode=parent;
}

function optionalLabel(control){
  const label=ancestor(control,n=>n.tagName==='label');
  if(!label)return;
  const copy=walk(label).filter(n=>n.nodeName==='#text'&&!ancestor(n,p=>['input','select','textarea'].includes(p.tagName)));
  for(const node of copy)node.value=node.value.replace(/\((?:Pflichtfeld|required)\)|\*/gi,'(optional)');
  const first=copy.find(n=>n.value.trim());
  if(first&&!copy.some(n=>/\(optional\)/i.test(n.value)))first.value+=' (optional)';
}

export function refineB2bAudit(document,reference){
  if(!routes.has(reference.route))return;
  const en=reference.route.startsWith('/en/');
  for(const form of walk(document).filter(n=>n.tagName==='form'&&(has(n,'data-board-inquiry')||(attr(n,'class')||'').split(/\s+/).includes('b2b-form')))){
    const fields=controls(form),budgets=fields.filter(n=>['budget','budget_basis'].includes(attr(n,'name')));
    if(!budgets.length)continue;
    for(const field of budgets){
      field.attrs=field.attrs.filter(a=>!['required','aria-required'].includes(a.name));
      optionalLabel(field);
    }
    let details=walk(form).find(n=>n.tagName==='details'&&controls(n).some(c=>secondary.has(attr(c,'name'))||budgets.includes(c)));
    if(!details){
      details=parseFragment('<details data-b2b-audit-optional><summary></summary></details>').childNodes[0];
      const submit= form.childNodes.find(n=>n.tagName==='button'&&attr(n,'type')==='submit');
      form.childNodes.splice(submit?form.childNodes.indexOf(submit):form.childNodes.length,0,details);
      details.parentNode=form;
    }
    const summary=details.childNodes.find(n=>n.tagName==='summary');
    summary.childNodes=[{nodeName:'#text',value:en?'Further details (optional)':'Weitere Angaben (optional)',parentNode:summary}];
    const before=details.childNodes[details.childNodes.indexOf(summary)+1];
    // Move whole direct form groups to preserve help text, layout hooks and field order.
    for(const node of [...form.childNodes]){
      const group=controls(node);
      if(node===details||!group.length)continue;
      if(group.every(c=>budgets.includes(c)||(secondary.has(attr(c,'name'))&&!has(c,'required')&&attr(c,'aria-required')!=='true')))move(node,details,before);
    }
    const help=form.childNodes.find(n=>attr(n,'id')==='budget-help');
    if(help)move(help,details,before);
  }
}
