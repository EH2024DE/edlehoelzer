import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {renderReference,references} from '../scripts/build-design-reference.mjs';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {featuredReviews,originalText} from '../scripts/review-content.mjs';
for(const reference of references.filter(r=>r.template==='home'))test(reference.route+' has static products, real portraits and one closing workshop photo',()=>{
  const document=parse(renderReference(reference).html),nodes=walk(document);
  const grid=nodes.find(n=>attr(n,'id')==='homepage-products');
  const cards=walk(grid).filter(n=>attr(n,'data-ds-added')==='static-product');
  assert.equal(cards.length,4);
  for(const card of cards){
    const links=walk(card).filter(n=>n.tagName==='a');assert.ok(links.length>=2);
    for(const link of links)assert.ok(fs.existsSync(path.join(root,attr(link,'href'),'index.html')));
    assert.ok(walk(card).some(n=>(attr(n,'class')||'').includes('productCard__price')&&text(n).includes('€')));
  }
  assert.match(text(cards[3]),/1[.,]?199/);
  const people=nodes.filter(n=>(attr(n,'class')||'').split(' ').includes('homePerson'));
  assert.equal(people.length,2);
  assert.ok(text(people[0]).includes('Özgür'));assert.ok(text(people[1]).includes('Serkan'));
  for(const person of people)assert.match(text(walk(person).find(n=>n.tagName==='h3')),reference.route==='/en/'?/^Hi, I'm /:/^Gude, ich bin /);
  for(const person of people){const img=walk(person).find(n=>n.tagName==='img');assert.match(attr(img,'src'),/assets\/team\//);assert.equal(attr(img,'height'),'1199');}
  const workshop=nodes.filter(n=>n.tagName==='img'&&(attr(n,'src')||'').includes('team/oezguer-workshop'));
  assert.equal(workshop.length,1);assert.match(attr(workshop[0].parentNode,'class'),/closingHero/);
  const trust=nodes.find(n=>attr(n,'data-ds-added')==='hero-trust');
  const meta=JSON.parse(fs.readFileSync(path.join(root,'data/reviews-meta.json'),'utf8'));
  assert.equal(trust,undefined,'reviews do not belong in the hero');
  assert.ok(text(nodes.find(n=>attr(n,'data-review-subline')!==undefined)).includes(String(meta.ratingCount)));
  assert.ok(text(nodes.find(n=>attr(n,'data-review-subline')!==undefined)).includes(String(meta.transactionSoldCount)));
  const reviews=featuredReviews();
  const quotes=nodes.filter(n=>attr(n,'data-review-id'));
  assert.equal(quotes.length,6);
  assert.ok(!nodes.some(n=>attr(n,'data-ds-added')==='review-date'),'sync date stays out of the homepage presentation');
  assert.ok(text(quotes[0]).includes('Sandra'),'Sandra is featured first with her original review');
  for(const review of reviews)assert.ok(text(quotes.find(n=>attr(n,'data-review-id')===review.id)).includes(originalText(review)),'full original review remains available');
  if(reference.route==='/en/'){
    assert.ok(!nodes.some(n=>(attr(n,'class')||'').includes('homepageTrustBar')));
    assert.ok(!nodes.some(n=>(attr(n,'class')||'').includes('homeTopic')));
    assert.ok(nodes.some(n=>attr(n,'id')==='your-board-your-kitchen'));
    assert.equal(attr(nodes.find(n=>attr(n,'data-hero-video')!==undefined),'autoplay'),undefined);
  }
});
test('English homepage follows the German section template without a separate trust bar',()=>{
  const sections=route=>{
    const nodes=walk(parse(renderReference(references.find(r=>r.route===route)).html));
    const main=nodes.find(n=>n.tagName==='main');
    return main.childNodes.filter(n=>n.tagName==='section').map(section=>({
      classes:attr(section,'class').split(/\s+/).sort(),
      images:walk(section).filter(n=>n.tagName==='img').map(n=>attr(n,'src')),
      primaryActions:walk(section).filter(n=>(attr(n,'class')||'').split(/\s+/).includes('btn--emphasis')).length
    }));
  };
  assert.equal(sections('/').length,9);
  assert.deepEqual(sections('/en/'),sections('/'));
});
