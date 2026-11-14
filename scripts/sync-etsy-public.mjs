import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='https://openapi.etsy.com/v3/application';
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const normal=s=>String(s||'').replace(/\s+/g,' ').trim();
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,16);

export async function getJson(url,{key,fetcher=fetch,sleep=ms=>new Promise(r=>setTimeout(r,ms))}){
  for(let attempt=0;attempt<3;attempt++){
    const response=await fetcher(url,{headers:{'x-api-key':key,Accept:'application/json'},signal:AbortSignal.timeout(20000)});
    if((response.status===429||response.status>=500)&&attempt<2){
      const delay=Number(response.headers.get('retry-after'));
      await sleep(Math.min(10000,Math.max(1000,Number.isFinite(delay)?delay*1000:1000*2**attempt)));continue;
    }
    // Never include Etsy response bodies, headers or credentials in public action logs.
    if(!response.ok)throw new Error(`Etsy read failed (HTTP ${response.status}); no data published.`);
    try{return await response.json();}catch{throw new Error('Etsy returned invalid JSON; no data published.');}
  }
}

export async function allPages(endpoint,options){
  const rows=[];let expected;
  for(let offset=0;offset<10000;){
    const data=await getJson(`${endpoint}?limit=100&offset=${offset}`,options);
    if(!integer(data.count)||!Array.isArray(data.results))throw new Error('Invalid Etsy pagination.');
    if(expected!==undefined&&expected!==data.count)throw new Error('Etsy data changed during pagination; retry later.');
    expected=data.count;
    if(data.results.length>100||rows.length+data.results.length>expected)throw new Error('Invalid Etsy result count.');
    rows.push(...data.results);offset=rows.length;
    if(rows.length===expected)return rows;
    if(!data.results.length)throw new Error('Incomplete Etsy pagination; last valid data retained.');
  }
  throw new Error('Etsy pagination exceeded safety limit.');
}

export function prepareUpdate({shop,listings,reviews,catalog,oldReviews,oldMeta,names,previousSnapshot,now=new Date().toISOString()}){
  if(!integer(shop.review_count)||!integer(shop.transaction_sold_count)||!Number.isFinite(shop.review_average)||shop.review_average<1||shop.review_average>5)throw new Error('Invalid shop statistics.');
  if(!integer(shop.listing_active_count)||Math.abs(shop.listing_active_count-listings.length)>Math.max(2,shop.listing_active_count*.1)||shop.review_count!==reviews.length)throw new Error('Incomplete or changing shop snapshot; retry later.');
  if(!listings.length||reviews.filter(r=>normal(r.review)).length<oldReviews.length*.75)throw new Error('Unexpected empty or sharply reduced snapshot; manual review required.');
  const ids=new Set(),quantities={};
  const publicListings=listings.map(l=>{
    const id=String(l.listing_id);
    if(!/^\d+$/.test(id)||ids.has(id)||!integer(l.quantity)||l.quantity<1||!normal(l.title)||l.state!=='active')throw new Error('Invalid or duplicate active listing.');
    ids.add(id);quantities[id]=l.quantity;
    const p=l.price;
    if(!p||!integer(p.amount)||!integer(p.divisor)||p.divisor<1||typeof p.currency_code!=='string')throw new Error('Invalid listing price.');
    return {listingId:id,title:l.title,quantity:l.quantity,price:{amount:p.amount,divisor:p.divisor,currency:p.currency_code}};
  }).sort((a,b)=>a.listingId.localeCompare(b.listingId));
  const previousCount=Object.keys(previousSnapshot.quantities||{}).length;
  if(previousCount&&listings.length<previousCount*.75)throw new Error('More than 25% of active listings disappeared; manual review required.');
  const reviewIds=new Set();
  const nextReviews=reviews.filter(r=>normal(r.review)).map(r=>{
    const timestamp=r.create_timestamp??r.created_timestamp;
    if(!/^\d+$/.test(String(r.listing_id))||!integer(timestamp)||timestamp<946684800||!Number.isInteger(r.rating)||r.rating<1||r.rating>5||typeof r.review!=='string'||r.review.length>30000)throw new Error('Invalid review.');
    const date=new Date(timestamp*1000).toISOString().slice(0,10),listingId=String(r.listing_id);
    const exact=oldReviews.filter(old=>old.listingId===listingId&&normal(old.text)===normal(r.review)&&old.date===date);
    const sameTimestamp=oldReviews.filter(old=>old.listingId===listingId&&old.createdTimestamp===timestamp);
    const old=exact.length===1?exact[0]:sameTimestamp.length===1?sameTimestamp[0]:undefined;
    const id=old?.id||'etsy-review-'+hash(listingId+'|'+timestamp+'|'+r.review);
    if(reviewIds.has(id))throw new Error('Ambiguous or duplicate review; manual review required.');reviewIds.add(id);
    const product=catalog.products.find(p=>String(p.listingId)===listingId);
    const confirmedName=names[id]||(old?.needsAuthorName!==true&&old?.reviewerName!=='Etsy-Kundin oder -Kunde'?old?.reviewerName:null);
    const reviewerName=confirmedName||'Etsy-Kundin oder -Kunde';
    return {id,reviewerName,source:'Etsy',rating:r.rating,text:r.review,product:product?.displayName||old?.product||'Holzprodukt von Edle Hölzer',listingId,date,createdTimestamp:timestamp,featured:Boolean(old?.featured),needsReview:false,...(!confirmedName?{needsAuthorName:true}:{})};
  }).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
  const nextCatalog=structuredClone(catalog),changes=[];
  for(const product of nextCatalog.products){
    // An Etsy listing cannot reactivate an explicitly archived piece or change made-to-order promises.
    if(!product.active||product.inspirationOnly||product.availabilityStatus!=='available')continue;
    if(Object.hasOwn(quantities,String(product.listingId))){
      product.stock=quantities[product.listingId];product.inventoryCheckedAt=now;
    }else{
      changes.push({listingId:String(product.listingId),change:'no-longer-active',action:'Unavailable, not asserted sold'});
      product.active=false;product.stock=0;product.availabilityStatus='unavailable';product.inventoryCheckedAt=now;
      product.availabilityNote='Aktuell nicht im aktiven Etsy-Angebot. Eine ähnliche Anfertigung prüfen wir gerne auf Anfrage.';
      product.availabilityNoteEn='Not currently listed as active on Etsy. Ask us about a similar custom piece.';
    }
  }
  const known=new Map(catalog.products.map(p=>[String(p.listingId),p]));
  for(const listing of publicListings){
    const p=known.get(listing.listingId);
    if(!p)changes.push({listingId:listing.listingId,change:'new-listing',action:'Curate product page before publishing'});
    else if(listing.price.currency!=='EUR'||listing.price.amount/listing.price.divisor!==p.priceOrder)changes.push({listingId:listing.listingId,change:'price-or-variant-difference',action:'Review separately; website price unchanged'});
  }
  return {
    meta:{...oldMeta,ratingAverage:shop.review_average,ratingCount:shop.review_count,transactionSoldCount:shop.transaction_sold_count,lastUpdated:now.slice(0,10),updateMode:'api',needsReview:false},
    reviews:nextReviews,catalog:nextCatalog,
    inventory:{checkedAt:now,source:'Etsy Open API active shop listings; listing totals, not per-wood inventory',quantities},
    listings:{checkedAt:now,listings:publicListings},
    report:{checkedAt:now,activeListings:listings.length,shopReportedActiveListings:shop.listing_active_count,listingCountDiscrepancy:shop.listing_active_count!==listings.length,reviewCount:shop.review_count,textReviews:nextReviews.length,sales:shop.transaction_sold_count,authorNamesNeeded:nextReviews.filter(r=>r.needsAuthorName).map(r=>r.id),changes}
  };
}

export async function syncPublic({directory=root,env=process.env,fetcher=fetch,now=new Date().toISOString(),write=false}={}){
  const key=env.ETSY_API_KEY_HEADER||(env.ETSY_API_KEY&&env.ETSY_SHARED_SECRET?`${env.ETSY_API_KEY}:${env.ETSY_SHARED_SECRET}`:null);
  if(!key||!env.ETSY_SHOP_ID)throw new Error('Configure ETSY_API_KEY_HEADER (or key plus shared secret) and ETSY_SHOP_ID as GitHub Actions secrets.');
  const options={key,fetcher};let shopId=env.ETSY_SHOP_ID;
  if(!/^\d+$/.test(shopId)){
    if(!/^[a-z0-9_]{1,80}$/i.test(shopId))throw new Error('Invalid shop name.');
    const lookup=await getJson(`${base}/shops?shop_name=${encodeURIComponent(shopId)}&limit=100`,options);
    const matches=(lookup.results||[]).filter(s=>String(s.shop_name).toLowerCase()===shopId.toLowerCase());
    if(matches.length!==1||!integer(matches[0].shop_id))throw new Error('Shop name could not be resolved uniquely.');
    shopId=String(matches[0].shop_id);
  }
  const shop=await getJson(`${base}/shops/${shopId}`,options);
  if(String(shop.shop_id)!==shopId)throw new Error('Unexpected Etsy shop identity.');
  const listings=await allPages(`${base}/shops/${shopId}/listings/active`,options);
  const reviews=await allPages(`${base}/shops/${shopId}/reviews`,options);
  const read=file=>JSON.parse(fs.readFileSync(path.join(directory,file),'utf8'));
  const update=prepareUpdate({shop,listings,reviews,catalog:read('products.json'),oldReviews:read('data/reviews-all.json'),oldMeta:read('data/reviews-meta.json'),names:read('data/review-author-names.json').names,previousSnapshot:read('data/inventory-public-snapshot.json'),now});
  // No file is touched until every endpoint, page and payload has passed validation.
  if(write)for(const [file,value] of Object.entries({'products.json':update.catalog,'data/reviews-all.json':update.reviews,'data/reviews-meta.json':update.meta,'data/inventory-public-snapshot.json':update.inventory,'data/etsy-listings-public.json':update.listings,'docs/etsy-sync-report.json':update.report})){
    fs.writeFileSync(path.join(directory,file),JSON.stringify(value,null,2)+'\n');
  }
  return update.report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  syncPublic({write:process.argv.includes('--write')}).then(report=>console.log(JSON.stringify(report,null,2))).catch(error=>{console.error(error instanceof TypeError?'Etsy network request failed; last valid data retained.':error.message);process.exitCode=1;});
}
