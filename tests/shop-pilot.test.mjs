import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import Stripe from '../tools/shop-server/node_modules/stripe/esm/stripe.esm.node.js';
import { config, customisation, catalogVersion, publicCatalog, quote, checkoutParams, ROOT } from '../tools/shop-server/catalog.mjs';
import { openStore } from '../tools/shop-server/store.mjs';
import { createShopServer } from '../tools/shop-server/server.mjs';
import { openUploads } from '../tools/shop-server/uploads.mjs';
import {minimumThicknessCm,portfolio} from '../tools/shop-server/portfolio.mjs';
import sharp from '../tools/shop-server/node_modules/sharp/dist/index.mjs';

const cart = () => ({ country: 'DE', items: [{sku:'dough-scraper',wood:'Eiche',quantity:1},{sku:'care-balm',wood:'',quantity:1}] });
const directory = () => fs.mkdtempSync(path.join(os.tmpdir(), 'edle-pilot-test-'));
async function running(options, fn) {
  const store = openStore(directory());
  const server = createShopServer({...options,store});
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  try { await fn(url,store); } finally { await new Promise(resolve => server.close(resolve)); store.close(); }
}
const request = (url, endpoint, value, origin = url) => fetch(url + '/api/shop/' + endpoint,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(value)});

test('atelier public catalogue uses complete existing package rules for the featured heirloom',()=>{
  const offer=publicCatalog().offers.find(o=>o.sku==='product-4370769708');
  for(const text of ['Erbstück','Halter','Pflegebalsam','Pflegeanleitung','Karte'])assert.ok(offer.packageContents.some(p=>p.label.toLowerCase().includes(text.toLowerCase())),text);
  assert.equal(offer.gallery.length,10);
  assert.ok(offer.catalogGroups.includes('board'));assert.ok(!offer.catalogGroups.includes('serving'));
  assert.equal(offer.engravingCents,1000);assert.equal(offer.minimumThicknessCm,4);
});

test('atelier routes are isolated noindex pages using the existing protected preview server',async()=>{
  await running({mode:'demo'},async url=>{
    for(const route of ['/atelier-vorschau/','/atelier-vorschau/erbstueck/','/en/atelier-preview/','/en/atelier-preview/erbstueck/']){
      const response=await fetch(url+route);assert.equal(response.status,200);
      assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
      assert.ok(response.headers.get('content-security-policy').includes("script-src 'self'"));
      assert.match(await response.text(),/assets\/css\/atelier-preview.css/);
    }
  });
});

test('spatula screenshot matrix contains 39 pieces and only verified wood/edge combinations',()=>{
  const expected={Eiche:[3,3],Nussbaum:[2,1],Esche:[4,1],Rotbuche:[1,1],Kastanie:[6,5],Wildkirsche:[1,1],Meranti:[1,2],Zwetschge:[1,1],Kambala:[1,0],Wenge:[4]};
  const offer=publicCatalog().offers.find(o=>o.sku==='spatula');
  assert.equal(offer.woods.length,10);
  assert.equal(Object.values(offer.edgeStock).flatMap(Object.values).reduce((n,q)=>n+q,0),39);
  for(const [wood,counts]of Object.entries(expected)){
    assert.deepEqual(Object.values(offer.edgeStock[wood]),counts);
    for(const [edge,stock]of Object.entries(offer.edgeStock[wood])){
      const item={sku:'spatula',wood,edge,quantity:1};
      if(!stock){assert.throws(()=>quote({country:'DE',items:[item]}),/VARIANT_UNAVAILABLE/);continue;}
      assert.equal(quote({country:'DE',items:[{...item,quantity:stock}]}).items[0].quantity,stock);
      assert.throws(()=>quote({country:'DE',items:[{...item,quantity:stock+1}]}));
    }
  }
  assert.throws(()=>quote({country:'DE',items:[{sku:'spatula',wood:'Wenge',edge:'beveled',quantity:1}]}),/INVALID_EDGE/);
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',edge:'straight',quantity:1}]}),/INVALID_EDGE/);
  const missing=quote({country:'DE',items:[{sku:'spatula',wood:'Eiche',quantity:1}]});
  assert.equal(missing.configurationPending,true);
  assert.throws(()=>checkoutParams({quote:missing},'https://shop.example.invalid'),/PERSONALISATION_REQUIRED/);
});

test('spatula stock is shared across engravings and bundles but independent for different edges',()=>{
  const base={sku:'spatula',wood:'Eiche',edge:'straight',quantity:2};
  const engraving={kind:'text',text:'Anna',font:'allura',position:'by-arrangement'};
  assert.throws(()=>quote({country:'DE',items:[base,{...base,engraving:true,personalisation:engraving}]}),/QUANTITY_LIMIT/);
  assert.throws(()=>quote({country:'DE',items:[{...base,bundleId:randomUUID()},{...base,bundleId:randomUUID()}]}),/QUANTITY_LIMIT/);
  const q=quote({country:'DE',items:[{...base,quantity:3},{...base,quantity:3,edge:'beveled'}]});
  assert.equal(q.items.length,2);assert.equal(q.subtotalCents,2999*6);
  assert.deepEqual(q.items.map(i=>i.stockKey).sort(),['spatula:Eiche:beveled','spatula:Eiche:straight']);
});

test('verified payment decrements only its spatula combination durably and keeps edge in fulfilment',()=>{
  const store=openStore(directory());
  const input={country:'DE',items:[{sku:'spatula',wood:'Wildkirsche',edge:'beveled',quantity:1}]};
  try{
    const q=quote(input),order=store.prepare(randomUUID(),'spatula-edge',q);
    assert.ok(checkoutParams(order,'https://shop.example.invalid').line_items[0].price_data.product_data.name.includes('Abgeschrägte Kante'));
    store.attach(order.id,'cs_test_spatula_edge');
    const event={id:'evt_spatula_edge',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_spatula_edge',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'paid'}}};
    store.process(event);store.process(event);
    for(let i=0;i<2;i++){
      const offer=publicCatalog('demo',store.soldUnits()).offers.find(o=>o.sku==='spatula');
      assert.equal(offer.edgeStock.Wildkirsche.beveled,0);assert.equal(offer.edgeStock.Wildkirsche.straight,1);
    }
    assert.equal(config.offers.find(o=>o.sku==='spatula').edgeStock.Wildkirsche.beveled,1);
    assert.equal(store.tasks()[0].items[0].edge,'beveled');
    assert.throws(()=>quote(input,store.soldUnits()),/VARIANT_UNAVAILABLE/);
  }finally{store.close();}
});

test('edge engraving requires at least 2 cm confirmed thickness, for text and logos',()=>{
  for(const sku of ['product-1827805914','product-4389604739'])for(const kind of ['text','logo']){
    const details=kind==='text'?{text:'Familie',font:'allura'}:{uploadId:'a'.repeat(64)};
    const item={sku,wood:'',quantity:1,engraving:true,personalisation:{kind,...details,position:'edge-front-left'}};
    assert.throws(()=>quote({country:'DE',items:[item]},{},()=>true),/INVALID_PERSONALISATION/);
    item.personalisation.position='face-bottom-left';
    assert.equal(quote({country:'DE',items:[item]},{},()=>true).items[0].personalisation.position,'face-bottom-left');
  }
  const item={sku:'product-4398179153',wood:'',quantity:1,engraving:true,personalisation:{kind:'text',text:'Genau 2 cm',font:'allura',position:'edge-front-right'}};
  assert.equal(quote({country:'DE',items:[item]}).items[0].mockupApprovalRequired,true);
  for(const font of ['marker-felt','noto-sans','noto-serif'])assert.throws(()=>quote({country:'DE',items:[{...item,personalisation:{...item.personalisation,font}}]}),/INVALID_PERSONALISATION/);
});

test('thickness metadata uses conservative ranges and actual variant dimensions',()=>{
  assert.equal(minimumThicknessCm('1,5–2,3 cm'),1.5);
  assert.equal(minimumThicknessCm('20 mm'),2);
  assert.equal(minimumThicknessCm('nicht angegeben'),null);
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,'products.json')));
  const p=data.products.find(p=>p.listingId==='4417507555');
  p.variants[0].dimensions='40 × 30 × 1,8 cm';
  p.variants[1].dimensions='nicht bestätigt';
  const offer=portfolio(ROOT,config,data).find(o=>o.listingId===p.listingId);
  assert.equal(offer.variants[0].minimumThicknessCm,1.8);
  assert.equal(offer.variants[1].minimumThicknessCm,null);
  assert.equal(offer.variants[2].minimumThicknessCm,5);
});

test('three owner-confirmed groove designs stay distinct at the same EUR 15 option price',()=>{
  const base={sku:'product-4417507555',variant:'oak',wood:'',quantity:1,juiceGroove:true};
  const items=customisation.grooveTypes.map(type=>({...base,grooveType:type.id}));
  const q=quote({country:'DE',items});
  assert.equal(q.items.length,3);
  assert.deepEqual(q.items.map(item=>item.grooveType).sort(),['basin-front-right','basin-left','perimeter']);
  const plain=quote({country:'DE',items:[{...base,juiceGroove:false}]}).items[0];
  assert.ok(q.items.every(item=>item.unitCents===plain.unitCents+1500));
  assert.ok(customisation.grooveTypes.every(type=>type.requiresAgreement===false));
  assert.equal(quote({country:'DE',items:[base]}).items[0].grooveType,'perimeter');
  assert.throws(()=>quote({country:'DE',items:[{...base,grooveType:'invented'}]}),/INVALID_GROOVE_TYPE/);
  assert.throws(()=>quote({country:'DE',items:[{...base,juiceGroove:false,grooveType:'perimeter'}]}),/INVALID_GROOVE_TYPE/);
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',quantity:1,juiceGroove:true,grooveType:'perimeter'}]}),/INVALID_OPTION/);
});

test('groove type survives private fulfilment and appears in checkout line description',()=>{
  const q=quote({country:'DE',items:[{sku:'product-4417507555',variant:'oak',wood:'',quantity:1,juiceGroove:true,grooveType:'basin-front-right'}]});
  const store=openStore(directory());
  try{
    const order=store.prepare(randomUUID(),'groove-fixture',q);
    assert.ok(checkoutParams(order,'https://shop.example.invalid').line_items[0].price_data.product_data.name.includes('vorne rechts'));
    store.attach(order.id,'cs_test_groove_fixture');
    store.process({id:'evt_groove_fixture',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_groove_fixture',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'paid'}}});
    assert.equal(store.tasks()[0].items[0].grooveType,'basin-front-right');
  }finally{store.close();}
});

test('engraving includes requested fonts and excludes the two side-edge positions',()=>{
  assert.ok(customisation.fonts.length>=5);
  for(const font of ['montserrat','playfair-display']) {
    assert.ok(fs.existsSync(path.join(ROOT,'assets/fonts/shop',font+'.ttf')));
    const input={country:'DE',items:[{sku:'product-1783351692',wood:'',quantity:1,engraving:true,personalisation:{kind:'text',text:'Test',font,position:'edge-front-left'}}]};
    assert.equal(quote(input).items[0].personalisation.font,font);
    for(const position of ['edge-left','edge-right']) assert.throws(()=>quote({...input,items:[{...input.items[0],personalisation:{...input.items[0].personalisation,position}}]}),/INVALID_PERSONALISATION/);
  }
});

test('owner-confirmed popular fonts are Amatic and Allura; all requested fonts validate',()=>{
  assert.deepEqual(customisation.fonts.filter(f=>f.popular).map(f=>f.id).sort(),['allura','amatic-sc']);
  for(const font of ['allura','amatic-sc','caveat','marcellus']){
    const input={country:'DE',items:[{sku:'dough-scraper',wood:'Eiche',quantity:1,engraving:true,personalisation:{kind:'text',text:'Familie',font,position:'by-arrangement'}}]};
    const q=quote(input);assert.equal(q.items[0].personalisation.font,font);
    assert.ok(fs.existsSync(path.join(ROOT,'assets/fonts/shop',font+'.ttf')));
  }
});

test('engraving requires valid text, font and position before checkout, without passing private text to Stripe',()=>{
  const base={sku:'dough-scraper',wood:'Eiche',quantity:1,engraving:true};
  const input=personalisation=>({country:'DE',items:[{...base,personalisation}]});
  const missing=quote({country:'DE',items:[base]});
  assert.equal(missing.configurationPending,true);
  assert.throws(()=>checkoutParams({quote:missing},'https://shop.example.invalid'),/PERSONALISATION_REQUIRED/);
  const details={kind:'text',text:'Privater Name',font:'allura',position:'by-arrangement'};
  const q=quote(input(details));
  assert.deepEqual(q.items[0].personalisation,details);
  assert.equal(q.configurationPending,false);
  assert.ok(!JSON.stringify(checkoutParams({id:randomUUID(),quote:q},'https://shop.example.invalid')).includes(details.text));
  for(const p of [{...details,text:''},{...details,text:'a'.repeat(121)},{...details,font:'unknown'},{...details,position:'face-top-left'},{...details,uploadId:'a'.repeat(64)}]) assert.throws(()=>quote(input(p)),/INVALID_PERSONALISATION/);
  assert.throws(()=>quote(input({kind:'logo',uploadId:'a'.repeat(64),position:'by-arrangement'})),/INVALID_LOGO/);
  const logo=quote(input({kind:'logo',uploadId:'a'.repeat(64),position:'by-arrangement'}),{},()=>true);
  assert.equal(logo.items[0].requiresAgreement,true);
  assert.throws(()=>quote({country:'DE',items:[{...base,engraving:false,personalisation:details}]}),/INVALID_PERSONALISATION/);
});

test('free gift bundles require two eligible units and cannot bypass quantity limits',()=>{
  const bundleId=randomUUID(), item={sku:'spatula',wood:'Eiche',edge:'straight',quantity:2,bundleId};
  const q=quote({country:'DE',items:[item]});
  assert.equal(q.bundles.length,1);
  assert.equal(q.bundles[0].packagingCents,0);
  assert.equal(q.subtotalCents,5998);
  assert.throws(()=>quote({country:'DE',items:[{...item,quantity:1}]}),/INVALID_BUNDLE/);
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',quantity:2,bundleId}]}),/INVALID_BUNDLE/);
  assert.throws(()=>quote({country:'DE',items:[{...item,quantity:3},{...item,quantity:3,bundleId:randomUUID()}]}),/QUANTITY_LIMIT/);
});

test('different engravings remain separate while finite stock applies across all lines',()=>{
  const p=text=>({kind:'text',text,font:'montserrat',position:'by-arrangement'});
  const items=['Anna','Ben'].map(text=>({sku:'dough-scraper',wood:'Eiche',quantity:1,engraving:true,personalisation:p(text)}));
  assert.equal(quote({country:'DE',items}).items.length,2);
  const offer=publicCatalog().offers.find(o=>o.stockLimit>1 && !o.sold);
  assert.ok(offer);
  assert.throws(()=>quote({country:'DE',items:[{sku:offer.sku,wood:'',quantity:offer.stockLimit},{sku:offer.sku,wood:'',quantity:1,engraving:true}]}),/QUANTITY_LIMIT/);
  assert.throws(()=>quote({country:'DE',items:[{...items[0],note:'Not supported'}]}),/INVALID_NOTE/);
  const custom=quote({country:'DE',items:[{sku:'xxl-custom-board',wood:'Eiche',quantity:1,note:'Bitte Maße abstimmen'}]});
  assert.equal(custom.items[0].note,'Bitte Maße abstimmen');
});

test('private logo uploads validate bytes, remove metadata and expire safely',async()=>{
  const store=openStore(directory()), uploads=openUploads(store);
  try {
    const png=await sharp({create:{width:20,height:20,channels:3,background:'#ffffff'}}).withMetadata().png().toBuffer();
    const upload=await uploads.save(png,'image/png');
    assert.equal(uploads.has(upload.id),true);
    const metadata=await sharp(uploads.read(upload.id)).metadata();
    assert.equal(metadata.exif,undefined);
    assert.equal(metadata.icc,undefined);
    await assert.rejects(uploads.save(Buffer.from('<svg/>'),'image/png'),/INVALID_IMAGE/);
    await assert.rejects(uploads.save(png,'image/jpeg'),/INVALID_IMAGE/);
    await assert.rejects(uploads.save(Buffer.alloc(4194305),'image/png'),/INVALID_IMAGE/);
    assert.throws(()=>uploads.read('../secret'),/UPLOAD_NOT_FOUND/);
    store.db.prepare('UPDATE logo_uploads SET expires=0 WHERE id=?').run(upload.id);
    uploads.prune();assert.equal(uploads.has(upload.id),false);
    assert.equal(fs.readdirSync(path.join(store.directory,'logos')).length,0);
  }finally{store.close();}
});

test('HTTP logos are never publicly retrievable and cross-origin uploads are refused',async()=>{
  await running({mode:'demo'},async url=>{
    const png=await sharp({create:{width:10,height:10,channels:3,background:'#fff'}}).png().toBuffer();
    const send=origin=>fetch(url+'/api/shop/uploads',{method:'POST',headers:{Origin:origin,'Content-Type':'image/png'},body:png});
    assert.equal((await send('https://wrong.invalid')).status,403);
    const response=await send(url);assert.equal(response.status,201);
    const upload=await response.json();
    assert.equal((await fetch(url+'/api/shop/uploads/'+upload.id)).status,401);
    assert.equal((await fetch(url+'/logos/'+upload.id+'.png')).status,404);
  });
});

test('full portfolio includes every canonical product, archives sold pieces and does not duplicate tropical wood', () => {
  const source=JSON.parse(fs.readFileSync(path.join(ROOT,'products.json'))).products;
  const offers=publicCatalog().offers;
  assert.equal(offers.length,source.filter(p=>!p.canonicalProductId).length);
  assert.equal(offers.filter(o=>o.listingId==='4451487112').length,0);
  assert.ok(offers.find(o=>o.listingId==='4417507555').variants.some(v=>v.id==='tropical'));
  for (const p of source.filter(p=>!p.canonicalProductId)) {
    const offer=offers.find(o=>o.listingId===p.listingId && (p.listingId || o.sku.endsWith(p.id)));
    assert.ok(offer,p.id);
    if (!p.active || p.inspirationOnly || p.availabilityStatus==='sold') {
      assert.equal(offer.sold,true);
      assert.throws(()=>quote({country:'DE',items:[{sku:offer.sku,wood:'',quantity:1}]}),/PRODUCT_UNAVAILABLE/);
    }
  }
});

test('catalog variants use their actual prices; invalid or omitted variants are rejected', () => {
  for (const offer of publicCatalog().offers.filter(o=>o.variants)) {
    assert.throws(()=>quote({country:'DE',items:[{sku:offer.sku,wood:'',quantity:1}]}),/INVALID_VARIANT/);
    for (const variant of offer.variants.filter(v=>!v.sold)) {
      const q=quote({country:'DE',items:[{sku:offer.sku,wood:'',variant:variant.id,quantity:1}]});
      assert.equal(q.items[0].unitCents,Math.round(variant.priceOrder*100));
      assert.equal(q.items[0].variantName,variant.name);
    }
    assert.throws(()=>quote({country:'DE',items:[{sku:offer.sku,wood:'',variant:'invented',quantity:1}]}),/INVALID_VARIANT/);
  }
});

test('groove, engraving and care add-ons use existing rules, not arbitrary client prices', () => {
  const offer=publicCatalog().offers.find(o=>o.listingId==='1783351692');
  const q=quote({country:'DE',items:[{sku:offer.sku,wood:'',juiceGroove:true,engraving:true,personalisation:{kind:'text',text:'Familie',font:'playfair-display',position:'edge-front-left'},careBalm:true,quantity:1}]});
  assert.equal(q.items[0].unitCents,13499+1500+1000+899);
  const params=checkoutParams({id:randomUUID(),quote:q},'https://shop.example.invalid');
  for (const label of ['Saftrille','Gravur','Pflegebalsam']) assert.ok(params.line_items[0].price_data.product_data.name.includes(label));
  const included=publicCatalog().offers.find(o=>o.listingId==='1850610674');
  assert.equal(included.grooveIncluded,true);
  assert.throws(()=>quote({country:'DE',items:[{sku:included.sku,wood:'',quantity:1,juiceGroove:true}]}),/INVALID_OPTION/);
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',quantity:1,careBalm:true}]}),/INVALID_OPTION/);
});

test('one-offs cannot be duplicated through quantity or different options, including shared groove variants', () => {
  const item={sku:'product-1894223313',wood:'',quantity:1};
  assert.throws(()=>quote({country:'DE',items:[{...item,quantity:2}]}),/QUANTITY_LIMIT/);
  assert.throws(()=>quote({country:'DE',items:[item,{...item,engraving:true}]}),/QUANTITY_LIMIT/);
  const base={sku:'product-4598989614',wood:'',quantity:1};
  assert.throws(()=>quote({country:'DE',items:[{...base,variant:'plain'},{...base,variant:'groove'}]}),/QUANTITY_LIMIT/);
});

test('variant/options quotes normalise ordering and preserve made-to-order reproducibility', () => {
  const items=[{sku:'product-4417507555',wood:'',variant:'beech',juiceGroove:true,quantity:1},{sku:'product-4417507555',wood:'',variant:'tropical',engraving:true,quantity:1}];
  assert.deepEqual(quote({country:'DE',items}),quote({country:'DE',items:[...items].reverse()}));
  const q=quote({country:'DE',items:[{sku:'product-4417507555',wood:'',variant:'oak',quantity:2}]});
  assert.equal(q.items[0].unitCents,28499);
  assert.equal(q.items[0].stockKey,undefined);
  assert.equal(q.items[0].requiresAgreement,true);
});

test('paid one-off becomes sold durably, retries do not sell twice, stale quote is rejected', () => {
  const store=openStore(directory());
  const input={country:'DE',items:[{sku:'product-1894223313',wood:'',quantity:1}]};
  try {
    const q=quote(input), order=store.prepare(randomUUID(),'one-off',q);
    store.attach(order.id,'cs_test_one_off_fixture');
    const event={id:'evt_one_off',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_one_off_fixture',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'paid'}}};
    store.process(event);store.process(event);store.process({...event,id:'evt_one_off_duplicate'});
    assert.equal(store.soldUnits()['product-1894223313:'],1);
    assert.equal(publicCatalog('test',store.soldUnits()).offers.find(o=>o.sku==='product-1894223313').sold,true);
    assert.throws(()=>quote(input,store.soldUnits()),/PRODUCT_UNAVAILABLE/);
    assert.equal(store.tasks().length,1);
  } finally {store.close();}
});

test('German shipping rules separate balm-only upgrade, insured mixed orders and unresolved packages', () => {
  const balm={country:'DE',items:[{sku:'care-balm',wood:'',quantity:1}]};
  assert.equal(quote(balm).shippingCents,270);
  assert.equal(quote({...balm,shippingChoice:'insured'}).shippingCents,619);
  assert.equal(quote(cart()).shippingCents,619);
  assert.throws(()=>quote({...balm,shippingChoice:'express'}),/INVALID_SHIPPING/);
  const unresolved=quote({country:'DE',items:[{sku:'product-4358136560',wood:'',quantity:1}]});
  assert.equal(unresolved.shippingPending,true);
  assert.equal(unresolved.totalCents,null);
  assert.throws(()=>checkoutParams({id:randomUUID(),quote:unresolved},'https://shop.example.invalid'),/SHIPPING_REVIEW_REQUIRED/);
  const xxl=quote({country:'DE',items:[{sku:'xxl-custom-board',wood:'Eiche',quantity:1}]});
  assert.equal(xxl.shippingCents,0);
});

test('free German standard shipping begins at exactly EUR 150 including configured goods options', () => {
  const balm=config.offers.find(o=>o.sku==='care-balm'), price=balm.unitCents;
  try {
    balm.unitCents=14999;
    const input={country:'DE',items:[{sku:'care-balm',wood:'',quantity:1}]};
    assert.equal(quote(input).freeShippingRemainingCents,1);
    assert.equal(quote(input).shippingCents,270);
    balm.unitCents=15000;
    assert.equal(quote(input).shippingCents,0);
    assert.equal(quote(input).freeShippingRemainingCents,0);
  } finally {balm.unitCents=price;}
});

test('four repeatable families and the owner-requested XXL reference enter the pilot', () => {
  assert.deepEqual(config.offers.map(p=>p.listingId).sort(),['1881802291','4470469056','4471048251','4484195050','4549962555']);
  assert.equal(config.approved,false);
  assert.equal(config.shippingConfirmed,false);
});
test('XXL owner-confirmed wood prices, sold-out Wenge and free inlays are enforced', () => {
  const offer = config.offers.find(p => p.sku === 'xxl-custom-board');
  const input = wood => ({country:'DE',items:[{sku:offer.sku,wood,quantity:2}]});
  for (const [wood, cents] of Object.entries({Eiche:139900,Buche:129900,Nussbaum:169900,Ahorn:119900,Esche:119900,Kastanie:119900,Kirsche:169900})) {
    assert.equal(quote(input(wood)).subtotalCents,cents*2);
    for (const accent of offer.accents) assert.equal(quote({country:'DE',items:[{sku:offer.sku,wood,accent,quantity:1}]}).subtotalCents,cents);
  }
  assert.throws(() => quote(input('Wenge')), /VARIANT_UNAVAILABLE/);
  assert.throws(() => quote({country:'DE',items:[{sku:offer.sku,wood:'Eiche',accent:'Wenge',quantity:1}]}), /INVALID_ACCENT/);
  assert.throws(() => quote({country:'DE',items:[{sku:'care-balm',wood:'',accent:'Eiche',quantity:1}]}), /INVALID_ACCENT/);
  const prices = offer.woodPrices, ready = offer.checkoutReady;
  try {
    // Fixture amounts exercise the mechanism, not actual Etsy prices.
    offer.checkoutReady = true;
    offer.woodPrices = {Eiche:123456,Nussbaum:234567,Buche:null,Esche:0};
    assert.equal(quote(input('Eiche')).subtotalCents,246912);
    assert.equal(quote(input('Nussbaum')).subtotalCents,469134);
    assert.throws(() => quote(input('Buche')), /VARIANT_PRICE_UNCONFIRMED/);
    assert.throws(() => quote(input('Esche')), /VARIANT_PRICE_UNCONFIRMED/);
    const params = checkoutParams({id:randomUUID(),quote:quote(input('Nussbaum'))},'https://shop.example.invalid');
    assert.equal(params.line_items[0].price_data.unit_amount,234567);
    assert.throws(() => quote({country:'DE',items:[{...input('Eiche').items[0],unitCents:1}]}));
  } finally { offer.woodPrices=prices; offer.checkoutReady=ready; }
});
test('inlay variants remain distinct through checkout, private storage and seller tasks', () => {
  const items = ['', 'Buche', 'Ahorn'].map(accent => ({sku:'xxl-custom-board',wood:'Eiche',accent,quantity:1}));
  const q = quote({country:'DE',items});
  assert.equal(q.items.length,3);
  assert.equal(q.totalCents,139900*3);
  const store = openStore(directory());
  try {
    const order=store.prepare(randomUUID(),'inlay-variants',q);
    const params=checkoutParams(order,'https://shop.example.invalid');
    assert.ok(params.line_items.some(item=>item.price_data.product_data.description.includes('Buche')));
    store.attach(order.id,'cs_test_inlay_fixture');
    store.process({id:'evt_inlay',livemode:false,type:'checkout.session.completed',data:{object:{id:'cs_test_inlay_fixture',client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'paid'}}});
    assert.deepEqual(store.tasks()[0].items.map(item=>item.accent).sort(),['','Ahorn','Buche']);
  } finally { store.close(); }
});
test('integer server prices, explicit preview shipping and no client price authority', () => {
  const result = quote(cart());
  assert.equal(result.subtotalCents,3598);
  assert.equal(result.shippingCents,619);
  assert.equal(result.totalCents,4217);
  assert.equal(quote({...cart(),totalCents:1}).totalCents,4217);
  assert.equal(quote({country:'DE',items:[{sku:'butter-knife',wood:'Nussbaum',quantity:2}]}).totalCents,5217);
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',quantity:1,unitCents:1}]}));
});
test('all three tools charge exactly EUR 5.99 engraving per item and retain distinct variants', () => {
  const products = JSON.parse(fs.readFileSync(path.join(ROOT,'products.json')));
  assert.equal(products.purchaseRules.optionPrices.engravingAccessory,5.99);
  for (const sku of ['dough-scraper','butter-knife','spatula']) {
    const offer=config.offers.find(o=>o.sku===sku), plain={sku,wood:sku==='spatula'?'Kastanie':offer.woods[0],quantity:2,...(sku==='spatula'?{edge:'straight'}:{})};
    const q=quote({country:'DE',items:[plain,{...plain,engraving:true,personalisation:{kind:'text',text:'Anna',font:'allura',position:'by-arrangement'}}]});
    assert.equal(q.items.length,2);
    assert.equal(q.subtotalCents,offer.unitCents*4+599*2);
    const engraved=q.items.find(item=>item.engraving);
    assert.equal(engraved.unitCents,offer.unitCents+599);
    const params=checkoutParams({id:randomUUID(),quote:q},'https://shop.example.invalid');
    assert.ok(params.line_items.some(item=>item.price_data.product_data.name.includes('Gravur')));
    for (const engraving of ['true',599,{},null]) assert.throws(()=>quote({country:'DE',items:[{...plain,engraving}]}),/INVALID_ENGRAVING/);
  }
  assert.throws(()=>quote({country:'DE',items:[{sku:'care-balm',wood:'',quantity:1,engraving:true}]}),/INVALID_ENGRAVING/);
});
test('scraper pilot includes eight woods including owner-confirmed maple', () => {
  const offer=config.offers.find(o=>o.sku==='dough-scraper');
  assert.deepEqual(offer.woods,['Eiche','Nussbaum','Esche','Rotbuche','Kambala','Wildkirsche','Kastanie','Ahorn']);
  for (const wood of offer.woods) assert.equal(quote({country:'DE',items:[{sku:offer.sku,wood,quantity:1}]}).subtotalCents,2599);
});
test('unapproved boards, countries, arbitrary woods, fractional and oversized quantities are rejected', () => {
  for(const item of [
    {sku:'board',wood:'Eiche',quantity:1}, {sku:'care-balm',wood:'Eiche',quantity:1},
    {sku:'dough-scraper',wood:'Unknown',quantity:1}, {sku:'care-balm',wood:'',quantity:0},
    {sku:'care-balm',wood:'',quantity:-1}, {sku:'care-balm',wood:'',quantity:1.5},
    {sku:'care-balm',wood:'',quantity:6}
  ]) assert.throws(()=>quote({country:'DE',items:[item]}));
  assert.throws(()=>quote({...cart(),country:'US'}));
  assert.throws(()=>quote({country:'DE',items:[]}));
  assert.throws(()=>quote({country:'DE',items:Array(2).fill({sku:'care-balm',wood:'',quantity:3})}));
});
test('Stripe parameters use server amounts and only hosted payment data collection', () => {
  const params = checkoutParams({id:randomUUID(),quote:quote(cart())},'https://shop.example.invalid');
  assert.equal(params.line_items[0].price_data.currency,'eur');
  assert.equal(params.shipping_options[0].shipping_rate_data.fixed_amount.amount,619);
  assert.deepEqual(params.shipping_address_collection.allowed_countries,['DE']);
  assert.equal(params.consent_collection.terms_of_service,'required');
  assert.equal(params.payment_method_types,undefined,'payment methods remain Dashboard-driven');
  assert.equal(params.customer_email,undefined);
});
test('private store rejects repository paths', () => {
  assert.throws(()=>openStore(ROOT),/outside/);
});
test('order retries are idempotent; mismatched cart is not silently reused', () => {
  const store = openStore(directory());
  try {
    const id=randomUUID(), q=quote(cart());
    const a=store.prepare(id,'fingerprint',q), b=store.prepare(id,'fingerprint',q);
    assert.equal(a.id,b.id);
    assert.throws(()=>store.prepare(id,'changed',q),/IDEMPOTENCY_CONFLICT/);
  } finally { store.close(); }
});
test('pending payment never fulfils; paid retries make exactly one Etsy task and store no customer payload', () => {
  const store=openStore(directory());
  try {
    const q=quote(cart()), order=store.prepare(randomUUID(),'test',q), sid='cs_test_123456789';
    store.attach(order.id,sid);
    const session={id:sid,client_reference_id:order.id,livemode:false,currency:'eur',amount_total:q.totalCents,payment_status:'unpaid',customer_details:{email:'private@example.invalid',address:{line1:'Sensitive address'}}};
    const event={id:'evt_pending',livemode:false,type:'checkout.session.completed',data:{object:session}};
    assert.equal(store.process(event),'awaiting_payment');
    assert.equal(store.tasks().length,0);
    session.payment_status='paid';
    store.process({...event,id:'evt_paid'});
    store.process({...event,id:'evt_paid'});
    store.process({...event,id:'evt_other',type:'checkout.session.async_payment_succeeded'});
    assert.equal(store.tasks().length,1);
    assert.equal(store.tasks()[0].items.length,2);
    const rows=JSON.stringify(store.db.prepare('SELECT * FROM orders').all());
    assert.ok(!rows.includes('private@example.invalid'));
    assert.ok(!rows.includes('Sensitive address'));
    assert.equal(store.db.prepare('SELECT status FROM orders').get().status,'paid');
    store.process({...event,id:'evt_failed',type:'checkout.session.async_payment_failed'});
    assert.equal(store.db.prepare('SELECT status FROM orders').get().status,'paid');
    assert.throws(()=>store.process({...event,id:'evt_wrong',data:{object:{...session,amount_total:1}}}),/AMOUNT_MISMATCH/);
    assert.throws(()=>store.process({...event,livemode:true}),/LIVE_EVENT_REJECTED/);
  } finally { store.close(); }
});
test('HTTP demo preserves amounts, rejects cross-origin writes and denies private files/admin', async () => {
  await running({},async(url)=>{
    for(const target of ['/.env','/.git/config','/tools/shop-server/server.mjs','/logs/etsy-active-listings.json','/data/shop-pilot.json','/api/shop/seller-tasks']) {
      const response=await fetch(url+target);
      assert.ok([401,404].includes(response.status),target);
    }
    assert.equal((await request(url,'quote',cart(),'https://attacker.invalid')).status,403);
    const q=await (await request(url,'quote',cart())).json();
    const response=await request(url,'checkout',{...cart(),version:q.version,requestId:randomUUID()});
    const result=await response.json();
    assert.equal(result.mode,'demo');
    assert.equal(result.quote.totalCents,4217);
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
    assert.equal(response.headers.get('access-control-allow-origin'),null);
    assert.equal((await request(url,'checkout',{...cart(),version:'old',requestId:randomUUID()})).status,409);
    const bad=await fetch(url+'/api/shop/quote',{method:'POST',headers:{Origin:url,'Content-Type':'application/json'},body:'{'});
    assert.equal(bad.status,400);
  });
});
test('preview film supports bounded byte ranges without exposing other video paths', async()=>{
  await running({},async url=>{
    const video=url+'/assets/hero_intro_video_edle_hoelzer.mp4';
    const response=await fetch(video,{headers:{Range:'bytes=0-1023'}});
    assert.equal(response.status,206);
    assert.equal(response.headers.get('content-type'),'video/mp4');
    assert.match(response.headers.get('content-range'),/^bytes 0-1023\/\d+$/);
    assert.equal((await response.arrayBuffer()).byteLength,1024);
    assert.ok(response.headers.get('content-security-policy').includes("media-src 'self'"));
    for(const range of ['bytes=999999999-','bytes=100-1','bytes=-100','bytes=0-1,3-4'])assert.equal((await fetch(video,{headers:{Range:range}})).status,416);
    const head=await fetch(video,{method:'HEAD'});assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
    assert.equal((await fetch(url+'/assets/private.mp4')).status,404);
  });
});
test('real Stripe signature verification rejects spoofed events before state changes', async () => {
  const secret='whsec_local_test_fixture_only';
  const sdk=new Stripe('sk_test_local_fixture_only');
  await running({mode:'test',publicOrigin:'https://shop.example.invalid',stripe:sdk,webhookSecret:secret},async(url,store)=>{
    const event={id:'evt_irrelevant',livemode:false,type:'ignored.event',data:{object:{}}};
    const payload=JSON.stringify(event);
    const headers={'Content-Type':'application/json','Stripe-Signature':'invalid'};
    assert.equal((await fetch(url+'/api/shop/webhook',{method:'POST',headers,body:payload})).status,400);
    headers['Stripe-Signature']=Stripe.webhooks.generateTestHeaderString({payload,secret});
    const valid=await fetch(url+'/api/shop/webhook',{method:'POST',headers,body:payload});
    assert.equal(valid.status,200);
    assert.equal(store.tasks().length,0);
    assert.equal((await request(url,'checkout',{...cart(),version:catalogVersion,requestId:randomUUID()},'https://shop.example.invalid')).status,503,'unapproved checkout fails closed');
  });
});
test('live keys and unsupported modes are refused at startup', () => {
  assert.throws(()=>createShopServer({mode:'live'}),/Only demo/);
  const old=process.env.STRIPE_SECRET_KEY;
  process.env.STRIPE_SECRET_KEY='sk_live_not_a_real_key';
  try { assert.throws(()=>createShopServer(),/Only Stripe test/); }
  finally { if(old)process.env.STRIPE_SECRET_KEY=old;else delete process.env.STRIPE_SECRET_KEY; }
});

test('configured sandbox Checkout uses server totals and reuses its session on retry', async () => {
  const oldApproved=config.approved, oldShipping=config.shippingConfirmed, oldApproval=process.env.SHOP_TEST_APPROVED,oldListingIds=config.checkoutListingIds;
  config.approved=true; config.shippingConfirmed=true; config.checkoutListingIds=['4471048251','1881802291']; process.env.SHOP_TEST_APPROVED='yes';
  let created=0, params;
  const session={id:'cs_test_generated_fixture',url:'https://checkout.stripe.com/c/pay/cs_test_fixture',livemode:false};
  const sdk={checkout:{sessions:{create:async(p,key)=>{created++;params=p;assert.ok(key.idempotencyKey);Object.assign(session,{client_reference_id:p.client_reference_id,currency:'eur',amount_total:p.line_items.reduce((sum,item)=>sum+item.quantity*item.price_data.unit_amount,0)+p.shipping_options[0].shipping_rate_data.fixed_amount.amount});return session;},retrieve:async()=>session}}};
  try {
    await running({mode:'test',stripe:sdk,publicOrigin:'https://shop.example.invalid'},async(url)=>{
      const input={...cart(),version:catalogVersion,requestId:randomUUID(),totalCents:1};
      for(let n=0;n<2;n++){
        const response=await request(url,'checkout',input,'https://shop.example.invalid');
        assert.equal(response.status,200);
        assert.equal((await response.json()).url,session.url);
        assert.equal(response.headers.get('access-control-allow-origin'),'https://shop.example.invalid');
      }
      assert.equal(created,1);
      const goods=params.line_items.reduce((sum,i)=>sum+i.quantity*i.price_data.unit_amount,0);
      assert.equal(goods,3598);
      assert.equal(params.shipping_options[0].shipping_rate_data.fixed_amount.amount,619);
      const preflight=await fetch(url+'/api/shop/checkout',{method:'OPTIONS',headers:{Origin:'https://shop.example.invalid'}});
      assert.equal(preflight.status,204);
      const evil=await fetch(url+'/api/shop/checkout',{method:'OPTIONS',headers:{Origin:'https://attacker.invalid'}});
      assert.equal(evil.headers.get('access-control-allow-origin'),null);
    });
  } finally {
    config.approved=oldApproved;config.shippingConfirmed=oldShipping;config.checkoutListingIds=oldListingIds;
    if(oldApproval)process.env.SHOP_TEST_APPROVED=oldApproval;else delete process.env.SHOP_TEST_APPROVED;
  }
});

test('oversized input is rejected without disclosing provider internals', async () => {
  await running({},async(url)=>{
    const response=await request(url,'quote',{...cart(),padding:'x'.repeat(20000)});
    assert.equal(response.status,413);
    assert.deepEqual(await response.json(),{error:'BODY_TOO_LARGE'});
  });
});
