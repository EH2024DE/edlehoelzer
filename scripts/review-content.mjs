import fs from 'node:fs';
import path from 'node:path';
import {parseFragment} from 'parse5';
import {root,text} from './audit-design-system.mjs';
export const reviewsFile=path.join(root,'data/reviews-all.json');
export function allReviews(){
  const file=fs.existsSync(reviewsFile)?reviewsFile:path.join(root,'data/reviews.json');
  const etsy=JSON.parse(fs.readFileSync(file,'utf8'));
  const google=googleReviewMeta();
  return [...etsy,...google.reviews.map(review=>({...review,sourceUrl:google.sourceUrl}))].filter(review=>!review.needsReview&&review.text&&review.reviewerName);
}
export function googleReviewMeta(){return JSON.parse(fs.readFileSync(path.join(root,'data/google-reviews.json'),'utf8'));}
export function featuredReviews(){
  const reviews=allReviews(),etsy=reviews.filter(r=>r.source==='Etsy'),google=reviews.filter(r=>r.source==='Google Maps');
  const latest=etsy.find(r=>r.id==='etsy-review-8491ddd212bb90c3')||etsy[0];
  return [latest,google[0],etsy.find(r=>r.id==='etsy-review-75b496e06b4e5a2b'),google[1],etsy.find(r=>r.id==='etsy-review-034877d1781c3f53'),google[2]].filter(Boolean).slice(0,6);
}
export function reviewDateLabel(review,english){
  return review.date?formatReviewDate(review.date,english):(english?review.dateLabelEn:review.dateLabel)+' · '+(english?'as displayed':'Anzeige')+' '+formatReviewDate(review.observedAt,english);
}
export function formatReviewDate(value,english){
  if(!/^\d{4}-\d{2}(?:-\d{2})?$/.test(value||''))return value||'';
  const full=value.length===10,date=new Date(value+(full?'T12:00:00Z':'-01T12:00:00Z'));
  return new Intl.DateTimeFormat(english?'en-GB':'de-DE',{year:'numeric',month:full?'2-digit':'long',...(full?{day:'2-digit'}:{}),timeZone:'UTC'}).format(date);
}
export function originalText(review){
  return text(parseFragment('<textarea>'+String(review.text).replaceAll('<','&lt;')+'</textarea>')).replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'');
}
