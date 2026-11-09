import fs from 'node:fs';
import path from 'node:path';
import {parseFragment} from 'parse5';
import {root,text} from './audit-design-system.mjs';
export const reviewsFile=path.join(root,'data/reviews-all.json');
export function allReviews(){
  const file=fs.existsSync(reviewsFile)?reviewsFile:path.join(root,'data/reviews.json');
  return JSON.parse(fs.readFileSync(file,'utf8')).filter(review=>!review.needsReview&&review.text&&review.reviewerName);
}
export function originalText(review){
  return text(parseFragment('<textarea>'+String(review.text).replaceAll('<','&lt;')+'</textarea>')).replace(/\r\n/g,'\n');
}
