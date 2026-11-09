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
  return [etsy[0],google[0],etsy[4],google[1],etsy[5],google[2]].filter(Boolean).slice(0,6);
}
export function reviewDateLabel(review,english){
  return review.date||(english?review.dateLabelEn:review.dateLabel)+' · '+(english?'as displayed':'Anzeige')+' '+review.observedAt;
}
export function originalText(review){
  return text(parseFragment('<textarea>'+String(review.text).replaceAll('<','&lt;')+'</textarea>')).replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'');
}
