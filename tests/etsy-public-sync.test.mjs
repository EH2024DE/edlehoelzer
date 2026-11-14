import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {allPages,getJson,prepareUpdate,syncPublic} from '../scripts/sync-etsy-public.mjs';

const fixture=()=>({
  shop:{shop_id:1,review_count:1,review_average:5,transaction_sold_count:12,listing_active_count:1},
  listings:[{listing_id:123,title:'Oak board',quantity:2,state:'active',price:{amount:6500,divisor:100,currency_code:'EUR'},private_field:'not exported'}],
  reviews:[{listing_id:123,create_timestamp:1794182400,rating:5,review:'Original wording',buyer_user_id:999,transaction_id:456,image_url_fullxfull:'https://example.invalid/photo.jpg'}],
  catalog:{products:[{id:'oak',listingId:'123',active:true,availabilityStatus:'available',stock:1,priceOrder:65,displayName:'Oak'}]},
  oldReviews:[],oldMeta:{source:'Etsy',sourceUrl:'https://www.etsy.com/shop/EdleHoelzervonKoc#reviews'},names:{},previousSnapshot:{quantities:{123:1}},now:'2026-11-10T08:00:00.000Z'
});
test('public output is whitelisted, original and does not invent reviewer names or import buyer photos',()=>{
  const result=prepareUpdate(fixture());
  assert.equal(result.meta.transactionSoldCount,12);assert.equal(result.reviews[0].text,'Original wording');
  assert.equal(result.reviews[0].needsAuthorName,true);assert.equal(result.reviews[0].reviewerName,'Etsy-Kundin oder -Kunde');
  assert.equal(result.catalog.products[0].stock,2);assert.equal(result.catalog.products[0].priceOrder,65);
  for(const field of ['buyer_user_id','transaction_id','image_url_fullxfull','private_field'])assert.ok(!JSON.stringify(result).includes(field));
});
test('verified authors and stable review IDs survive edited original text without preserving stale quotes',()=>{
  const f=fixture();f.oldReviews=[{id:'verified-review',listingId:'123',date:'2026-11-09',createdTimestamp:1794182400,text:'Old wording',reviewerName:'Sandra',featured:true}];f.names={'verified-review':'Sandra'};
  const r=prepareUpdate(f).reviews[0];assert.equal(r.id,'verified-review');assert.equal(r.reviewerName,'Sandra');assert.equal(r.text,'Original wording');
});
test('a pending author stays pending on repeated refreshes and cannot acquire a guessed name',()=>{
  const f=fixture();f.oldReviews=prepareUpdate(f).reviews;
  assert.equal(prepareUpdate(f).reviews[0].needsAuthorName,true);
});
test('sold archives and made-to-order inventory are never reactivated or treated as finished stock',()=>{
  const f=fixture();f.catalog.products.push({id:'sold',listingId:'123',active:false,availabilityStatus:'sold',stock:0},{id:'custom',listingId:'123',active:true,availabilityStatus:'made_to_order',stock:0});
  const result=prepareUpdate(f);assert.deepEqual(result.catalog.products.slice(1),f.catalog.products.slice(1));
});
test('inactive listings become unavailable, not asserted sold; new products and prices require curation',()=>{
  const f=fixture();f.catalog.products[0].listingId='456';
  const r=prepareUpdate(f);assert.equal(r.catalog.products[0].availabilityStatus,'unavailable');assert.equal(r.catalog.products[0].active,false);assert.ok(r.report.changes.some(c=>c.change==='new-listing'));
  f.catalog.products[0].listingId='123';f.listings[0].price.amount=9900;
  const changed=prepareUpdate(f);assert.equal(changed.catalog.products[0].priceOrder,65);assert.ok(changed.report.changes.some(c=>c.change==='price-or-variant-difference'));
});
test('all rating levels remain in the original review archive',()=>{
  const f=fixture();f.reviews[0].rating=1;assert.equal(prepareUpdate(f).reviews[0].rating,1);
});
test('a small difference in the aggregate shop counter is visible but pagination remains authoritative',()=>{
  const f=fixture();f.shop.listing_active_count=2;
  const r=prepareUpdate(f);assert.equal(r.report.listingCountDiscrepancy,true);assert.equal(r.report.activeListings,1);
  f.shop.listing_active_count=10;assert.throws(()=>prepareUpdate(f));
});
test('empty, malformed, duplicate and sharply reduced snapshots cannot overwrite good data',()=>{
  for(const mutate of [f=>f.listings=[],f=>f.listings[0].quantity=-1,f=>f.shop.review_average=null,f=>f.reviews.push(f.reviews[0]),f=>f.previousSnapshot.quantities={a:1,b:1,c:1,d:1}]){
    const f=fixture();mutate(f);assert.throws(()=>prepareUpdate(f));
  }
});
test('pagination requires complete stable counts and catches truncated success responses',async()=>{
  const options={key:'secret',fetcher:async()=>new Response(JSON.stringify({count:2,results:[]}))};
  await assert.rejects(allPages('https://example.invalid/reviews',options),/Incomplete/);
  let calls=0;options.fetcher=async()=>new Response(JSON.stringify(++calls===1?{count:2,results:[{id:1}]}:{count:1,results:[]}));
  await assert.rejects(allPages('https://example.invalid/reviews',options),/changed/);
});
test('rate limits retry with a bound; errors never echo response bodies or keys',async()=>{
  let calls=0,sleeps=0;
  const value=await getJson('https://example.invalid',{key:'SECRET',sleep:async()=>sleeps++,fetcher:async()=>++calls===1?new Response('SECRET',{status:429}):new Response('{"ok":true}')});
  assert.equal(value.ok,true);assert.equal(sleeps,1);
  await assert.rejects(getJson('https://example.invalid',{key:'SECRET',fetcher:async()=>new Response('SECRET',{status:401})}),error=>!error.message.includes('SECRET')&&error.message.includes('401'));
});
test('missing credentials and endpoint failure leave every source file untouched',async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'etsy-sync-'));
  try{
    fs.mkdirSync(path.join(directory,'data'));fs.writeFileSync(path.join(directory,'data/reviews-meta.json'),'unchanged');
    await assert.rejects(syncPublic({directory,env:{},write:true}),/Configure/);
    await assert.rejects(syncPublic({directory,env:{ETSY_API_KEY_HEADER:'SECRET',ETSY_SHOP_ID:'1'},write:true,fetcher:async()=>new Response('{}',{status:403})}),/403/);
    assert.equal(fs.readFileSync(path.join(directory,'data/reviews-meta.json'),'utf8'),'unchanged');
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
test('complete validated reads write only curated public files and dry-run writes nothing',async()=>{
  const f=fixture(),directory=fs.mkdtempSync(path.join(os.tmpdir(),'etsy-sync-complete-'));
  try{
    fs.mkdirSync(path.join(directory,'data'));fs.mkdirSync(path.join(directory,'docs'));
    const inputs={'products.json':f.catalog,'data/reviews-all.json':f.oldReviews,'data/reviews-meta.json':f.oldMeta,'data/review-author-names.json':{names:{}},'data/inventory-public-snapshot.json':f.previousSnapshot};
    for(const [file,value] of Object.entries(inputs))fs.writeFileSync(path.join(directory,file),JSON.stringify(value));
    const fetcher=async url=>new Response(JSON.stringify(url.includes('/reviews?')?{count:1,results:f.reviews}:url.includes('/listings/active?')?{count:1,results:f.listings}:f.shop));
    const options={directory,fetcher,env:{ETSY_API_KEY_HEADER:'SECRET',ETSY_SHOP_ID:'1'},now:f.now};
    await syncPublic(options);assert.equal(fs.existsSync(path.join(directory,'docs/etsy-sync-report.json')),false);
    await syncPublic({...options,write:true});
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'data/reviews-all.json')))[0].text,'Original wording');
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'products.json'))).products[0].priceOrder,65);
    assert.ok(!fs.readFileSync(path.join(directory,'data/etsy-listings-public.json'),'utf8').includes('SECRET'));
  }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
