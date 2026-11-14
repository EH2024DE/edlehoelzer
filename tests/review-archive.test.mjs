import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'parse5';
import {root,walk,attr,text} from '../scripts/audit-design-system.mjs';
import {allReviews,originalText} from '../scripts/review-content.mjs';
const reviews=allReviews();
test('all review records have unique public identifiers and no customer account identifiers',()=>{
  const etsy=JSON.parse(fs.readFileSync(path.join(root,'data/reviews-all.json'),'utf8'));
  const google=JSON.parse(fs.readFileSync(path.join(root,'data/google-reviews.json'),'utf8'));
  const meta=JSON.parse(fs.readFileSync(path.join(root,'data/reviews-meta.json'),'utf8'));
  assert.equal(reviews.length,etsy.length+google.reviews.length);assert.equal(new Set(reviews.map(r=>r.id)).size,reviews.length);
  assert.ok(etsy.length<=meta.ratingCount);assert.equal(reviews.filter(r=>r.source==='Google Maps').length,google.reviews.length);
  assert.equal(reviews.find(r=>r.id==='google-review-nidya').reviewerName,'Nidya');
  const names=JSON.parse(fs.readFileSync(path.join(root,'data/review-author-names.json'),'utf8')).names;
  for(const review of reviews.filter(r=>r.source==='Etsy')){
    if(names[review.id])assert.equal(review.reviewerName,names[review.id]);
    else {assert.equal(review.needsAuthorName,true);assert.equal(review.reviewerName,'Etsy-Kundin oder -Kunde');}
  }
  for(const review of reviews){assert.ok(review.text.trim());assert.equal(review.needsReview,false);for(const key of ['buyer_user_id','transaction_id','email','address'])assert.equal(review[key],undefined);}
});
for(const [file,route] of [['bewertungen/index.html','/bewertungen/'],['en/reviews/index.html','/en/reviews/']])test(file+' contains every complete original text and indexable metadata',()=>{
  const nodes=walk(parse(fs.readFileSync(path.join(root,file),'utf8')));
  const cards=nodes.filter(n=>attr(n,'data-review-id'));assert.equal(cards.length,reviews.length);
  for(const review of reviews)assert.equal(text(walk(cards.find(n=>attr(n,'data-review-id')===review.id)).find(n=>n.tagName==='blockquote')),originalText(review));
  assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
  assert.equal(attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://edlehoelzer.de'+route);
  assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes('https://edlehoelzer.de'+route));
  const schema=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(text).join('');
  assert.ok(!schema.includes('AggregateRating'),'no self-serving organization rating rich-result markup');
  assert.ok(nodes.some(n=>n.tagName==='header'&&attr(n,'class')==='topbar'));
  assert.ok(nodes.some(n=>n.tagName==='footer'));
});
