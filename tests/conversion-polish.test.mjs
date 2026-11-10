import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {formatReviewDate,reviewDateLabel} from '../scripts/review-content.mjs';

test('review dates are localized, including month-only and observed relative Google dates',()=>{
  assert.equal(formatReviewDate('2026-11-09',false),'09.11.2026');
  assert.equal(formatReviewDate('2026-11',false),'November 2026');
  assert.equal(formatReviewDate('2026-11-09',true),'09/11/2026');
  assert.equal(reviewDateLabel({dateLabel:'vor einem Monat',observedAt:'2026-11-09'},false),'vor einem Monat · Anzeige 09.11.2026');
});
test('new-design purchase clicks have one canonical event and policy links are excluded',()=>{
  const source=fs.readFileSync(new URL('../main.js',import.meta.url),'utf8');
  const start=source.indexOf('function initConversionTracking()'),end=source.indexOf('\nfunction ',start+1);
  const listeners=[],events=[];
  const context={window:{location:{pathname:'/produkte/example/',href:'https://edlehoelzer.de/produkte/example/'},EdleAnalytics:{track:(...args)=>events.push(args)}},document:{body:{classList:{contains:()=>true}},addEventListener:(type,cb)=>listeners.push(cb),querySelectorAll:()=>[]},URL};
  vm.runInNewContext(source.slice(start,end)+'\ninitConversionTracking();',context);
  function click({policy=false,placement=null,hero=false,card=false}={}){
    const href=hero?'/produkte.html#produktfinder':card?'/produkte/example/':'https://www.etsy.com/listing/123';
    const link={href,textContent:'Action',getAttribute:name=>name==='href'?href:name==='data-conversion-location'?placement:null,hasAttribute:name=>name==='data-etsy-policy'?policy:name==='data-etsy-link'&&!hero&&!card,closest:s=>s==='.hero__actions'?hero:s==='.homepageProductGrid .productCard'?card:s==='.productPreview__earlyPurchase'?!placement&&!hero&&!card:false};
    listeners[0]({target:{closest:()=>link}});
  }
  click();click({placement:'sticky'});click({policy:true});click({hero:true});click({card:true});
  assert.equal(events.filter(e=>e[0]==='etsy_checkout_click').length,2);
  assert.deepEqual(events.filter(e=>e[0]==='etsy_checkout_click').map(e=>e[1].placement),['main','sticky']);
  assert.equal(events.filter(e=>e[0]==='homepage_hero_click').length,1);
  assert.equal(events.filter(e=>e[0]==='homepage_product_open').length,1);
});
