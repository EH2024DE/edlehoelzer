import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { portfolio } from './portfolio.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shop-pilot.json')));
const productData = JSON.parse(fs.readFileSync(path.join(ROOT, 'products.json')));
export const customisation = JSON.parse(fs.readFileSync(path.join(ROOT,'data/shop-customisation.json')));
export const catalogVersion = createHash('sha256').update(JSON.stringify([config,productData,customisation])).digest('hex').slice(0, 24);
export class ShopError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

export function unitPrice(offer, wood) {
  if (offer.unavailableWoods?.includes(wood)) throw new ShopError('VARIANT_UNAVAILABLE', 409);
  if (offer.checkoutReady === false) throw new ShopError('VARIANT_PRICE_UNCONFIRMED', 409);
  const amount = offer.woodPrices ? offer.woodPrices[wood] : offer.unitCents;
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new ShopError('VARIANT_PRICE_UNCONFIRMED', 409);
  return amount;
}

export function publicCatalog(mode = 'demo', soldUnits = {}) {
  return {
    mode, version: catalogVersion, country: config.country, maxQuantity: config.maxQuantity,
    shippingConfirmed: config.shippingConfirmed, approved: config.approved,
    customisation,
    offers: portfolio(ROOT,config,productData).map(offer => {
      if(offer.edgeStock){
        offer.edgeStock=Object.fromEntries(Object.entries(offer.edgeStock).map(([wood,edges])=>[wood,Object.fromEntries(Object.entries(edges).map(([edge,stock])=>[edge,Math.max(0,stock-(soldUnits[offer.sku+':'+wood+':'+edge] || 0))]))]));
        offer.sold=offer.sold || Object.values(offer.edgeStock).every(edges=>Object.values(edges).every(stock=>stock===0));
      }
      if (!offer.singlePiece && offer.stockLimit) {
        offer.stockLimit=Math.max(0,offer.stockLimit-(soldUnits[offer.sku+':'] || 0));
        offer.maxQuantity=Math.min(config.maxQuantity,offer.stockLimit);
        offer.sold=offer.sold || offer.stockLimit===0;
      }
      if (offer.singlePiece) {
        if (offer.variants && !offer.sharedVariantStock) {
          offer.variants = offer.variants.map(v=>({...v,sold:v.sold || (v.availabilityStatus !== 'made_to_order' && (soldUnits[offer.sku+':'+v.id] || 0) >= 1)}));
          offer.sold = offer.sold || offer.variants.every(v=>v.sold);
        } else offer.sold = offer.sold || (soldUnits[offer.sku+':'] || 0) >= 1;
      }
      return offer;
    })
  };
}

function cleanText(value,limit) {
  if(typeof value!=='string' || value.length>limit || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)) throw new ShopError('INVALID_PERSONALISATION');
  return value.trim();
}

function personalisationFor(item,offer,resolveUpload) {
  if (!item.engraving) {
    if(item.personalisation!==undefined) throw new ShopError('INVALID_PERSONALISATION');
    return null;
  }
  if(item.personalisation===undefined) return null;
  const p=item.personalisation;
  if(!p || typeof p!=='object' || Array.isArray(p) || Object.keys(p).some(key=>!['kind','text','font','position','uploadId'].includes(key))) throw new ShopError('INVALID_PERSONALISATION');
  const thickness=offer.variants ? offer.variants.find(v=>v.id===item.variant)?.minimumThicknessCm : offer.minimumThicknessCm;
  const positions=offer.category==='board' ? customisation.boardPositions.filter(p=>p.id.startsWith('face-') || (Number.isFinite(thickness) && thickness>=2)).map(p=>p.id) : ['by-arrangement'];
  if(!positions.includes(p.position)) throw new ShopError('INVALID_PERSONALISATION');
  if(p.kind==='text') {
    const text=cleanText(p.text,customisation.textLimit);
    if(!text || !customisation.fonts.some(f=>f.id===p.font) || p.uploadId!==undefined) throw new ShopError('INVALID_PERSONALISATION');
    return {kind:'text',text,font:p.font,position:p.position};
  }
  if(p.kind==='logo') {
    if(p.text!==undefined || p.font!==undefined || !/^[a-f0-9]{64}$/.test(p.uploadId || '') || !resolveUpload(p.uploadId)) throw new ShopError('INVALID_LOGO');
    return {kind:'logo',uploadId:p.uploadId,position:p.position};
  }
  throw new ShopError('INVALID_PERSONALISATION');
}

export function quote(body, soldUnits = {}, resolveUpload = ()=>false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ShopError('INVALID_CART');
  if (body.country !== 'DE') throw new ShopError('COUNTRY_NOT_SUPPORTED');
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20) throw new ShopError('INVALID_CART');
  const offers = publicCatalog('demo',soldUnits).offers;
  const combined = new Map();
  const stockCounts = new Map();
  const configurationCounts=new Map();
  for (const item of body.items) {
    if (!item || Object.keys(item).some(key => !['sku', 'wood', 'edge', 'accent', 'variant', 'engraving', 'personalisation', 'note', 'bundleId', 'juiceGroove', 'grooveType', 'careBalm', 'quantity'].includes(key))) throw new ShopError('INVALID_ITEM');
    const offer = offers.find(o => o.sku === item.sku);
    const maxQuantity=offer?.edgeStock ? offer.maxQuantity : config.maxQuantity;
    if (!offer || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > maxQuantity) throw new ShopError('INVALID_ITEM');
    if (offer.sold) throw new ShopError('PRODUCT_UNAVAILABLE',409);
    const variant = item.variant || '';
    const chosen = offer.variants?.find(v=>v.id === variant);
    if (offer.variants ? !chosen : variant !== '') throw new ShopError('INVALID_VARIANT');
    if (chosen?.sold) throw new ShopError('VARIANT_UNAVAILABLE',409);
    const wood = item.wood || '';
    if (offer.woods.length ? !offer.woods.includes(wood) : wood !== '') throw new ShopError('INVALID_WOOD');
    const edge=item.edge ?? '';
    if(offer.edgeStock ? edge!=='' && !Object.hasOwn(offer.edgeStock[wood],edge) : item.edge!==undefined)throw new ShopError('INVALID_EDGE');
    if(offer.edgeStock && edge && offer.edgeStock[wood][edge]===0)throw new ShopError('VARIANT_UNAVAILABLE',409);
    const accent = item.accent ?? '';
    if (offer.accents ? !offer.accents.includes(accent) : accent !== '') throw new ShopError('INVALID_ACCENT');
    if (item.engraving !== undefined && typeof item.engraving !== 'boolean') throw new ShopError('INVALID_ENGRAVING');
    const engraving = item.engraving === true;
    if (engraving && (!Number.isSafeInteger(offer.engravingCents) || offer.engravingCents <= 0)) throw new ShopError('INVALID_ENGRAVING');
    for (const option of ['juiceGroove','careBalm']) {
      if (item[option] !== undefined && typeof item[option] !== 'boolean') throw new ShopError('INVALID_OPTION');
      if (item[option] && !Number.isSafeInteger(offer[option+'Cents'])) throw new ShopError('INVALID_OPTION');
    }
    const personalisation=personalisationFor(item,offer,resolveUpload);
    const fontAgreement=customisation.fonts.find(font=>font.id===personalisation?.font)?.previewUnavailable===true;
    const grooveType=item.juiceGroove ? (item.grooveType ?? 'perimeter') : '';
    const groove=customisation.grooveTypes.find(type=>type.id===grooveType);
    if(item.juiceGroove ? !groove : item.grooveType!==undefined) throw new ShopError('INVALID_GROOVE_TYPE');
    let note;
    if(item.note!==undefined) {
      if(offer.sku!=='xxl-custom-board') throw new ShopError('INVALID_NOTE');
      note=cleanText(item.note,customisation.noteLimit);
    }
    const bundleId=item.bundleId || '';
    if(bundleId && (!offer.giftEligible || !/^[0-9a-f-]{36}$/i.test(bundleId))) throw new ShopError('INVALID_BUNDLE');
    const key = JSON.stringify([offer.sku, wood, edge, accent, variant, engraving, !!item.juiceGroove, grooveType, !!item.careBalm,personalisation,note || '',bundleId]);
    const stockKey = offer.sku + ':' + (offer.edgeStock ? wood+':'+edge : offer.sharedVariantStock ? '' : variant);
    const configurationKey=JSON.stringify([offer.sku,wood,edge,variant]);
    configurationCounts.set(configurationKey,(configurationCounts.get(configurationKey)||0)+item.quantity);
    if(configurationCounts.get(configurationKey)>maxQuantity)throw new ShopError('QUANTITY_LIMIT');
    stockCounts.set(stockKey,(stockCounts.get(stockKey) || 0) + item.quantity);
    const limited = offer.singlePiece && chosen?.availabilityStatus !== 'made_to_order';
    const stockLimit=offer.edgeStock && edge ? offer.edgeStock[wood][edge] : limited ? 1 : chosen?.availabilityStatus === 'made_to_order' ? null : offer.stockLimit;
    if (stockLimit && stockCounts.get(stockKey) > stockLimit) throw new ShopError('QUANTITY_LIMIT');
    const old = combined.get(key);
    const quantity = (old?.quantity || 0) + item.quantity;
    if (quantity > maxQuantity) throw new ShopError('QUANTITY_LIMIT');
    let amount = chosen ? chosen.unitCents : unitPrice(offer, wood);
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new ShopError('VARIANT_PRICE_UNCONFIRMED');
    for (const option of ['engraving','juiceGroove','careBalm']) if (item[option]) amount += offer[option+'Cents'];
    combined.set(key, { sku: offer.sku, listingId: offer.listingId, wood, ...(offer.accents ? {accent} : {}), ...(chosen ? {variant,variantName:chosen.name,variantNameEn:chosen.nameEn} : {}), ...(engraving ? {engraving:true,...(personalisation ? {personalisation} : {})} : {}), ...(note ? {note} : {}), ...(bundleId ? {bundleId} : {}), ...(item.juiceGroove ? {juiceGroove:true,grooveType} : {}), ...(item.careBalm ? {careBalm:true} : {}), ...(stockLimit ? {stockKey} : {}), ...(offer.requiresAgreement || fontAgreement || groove?.requiresAgreement || chosen?.availabilityStatus === 'made_to_order' || personalisation?.kind==='logo' ? {requiresAgreement:true} : {}), quantity, unitCents: amount, name: offer.name, nameEn: offer.nameEn });
    if(edge)combined.get(key).edge=edge;
  }
  for(const item of combined.values())if(item.engraving)item.mockupApprovalRequired=true;
  const identity=item=>JSON.stringify([item.sku,item.wood,item.edge || '',item.accent || '',item.variant || '',!!item.engraving,!!item.juiceGroove,item.grooveType || '',!!item.careBalm,item.personalisation || null,item.note || '',item.bundleId || '']);
  const items = [...combined.values()].sort((a, b) => identity(a).localeCompare(identity(b)));
  if (items.reduce((sum, item) => sum + item.quantity, 0) > 20) throw new ShopError('QUANTITY_LIMIT');
  const subtotalCents = items.reduce((sum, item) => sum + item.unitCents * item.quantity, 0);
  const groups=new Map();
  for(const item of items) if(item.bundleId) groups.set(item.bundleId,[...(groups.get(item.bundleId) || []),item]);
  const bundles=[...groups].map(([id,lines])=>{
    const quantity=lines.reduce((n,item)=>n+item.quantity,0);
    if(quantity<2) throw new ShopError('INVALID_BUNDLE');
    return {id,quantity,subtotalCents:lines.reduce((n,item)=>n+item.unitCents*item.quantity,0),packagingCents:0};
  });
  const configurationPending=items.some(item=>(item.engraving && !item.personalisation) || (offers.find(o=>o.sku===item.sku).edgeStock && !item.edge));
  const shippingChoice = body.shippingChoice || 'standard';
  if (!['standard','insured'].includes(shippingChoice)) throw new ShopError('INVALID_SHIPPING');
  const balmOnly = items.every(item=>item.sku === 'care-balm');
  const shippingPending = subtotalCents < 15000 && (items.some(item=>!['care-balm','dough-scraper','spatula','butter-knife'].includes(item.sku)) || (balmOnly && items.reduce((n,item)=>n+item.quantity,0)>1));
  const shippingCents = subtotalCents >= 15000 ? 0 : shippingPending ? null : balmOnly && shippingChoice === 'standard' ? 270 : 619;
  return { version: catalogVersion, currency: 'eur', country: 'DE', items, bundles, configurationPending, subtotalCents, shippingCents, shippingPending, balmOnly, shippingChoice, freeShippingRemainingCents:Math.max(0,15000-subtotalCents), totalCents: shippingPending ? null : subtotalCents + shippingCents, shippingConfirmed: config.shippingConfirmed };
}

export function checkoutParams(order, publicOrigin, english = false) {
  if(order.quote.configurationPending) throw new ShopError('PERSONALISATION_REQUIRED',409);
  if (order.quote.shippingPending || !Number.isSafeInteger(order.quote.totalCents)) throw new ShopError('SHIPPING_REVIEW_REQUIRED',409);
  const prefix = english ? '/en/shop-preview/' : '/shop-vorschau/';
  const grooveName=item=>{
    const type=customisation.grooveTypes.find(type=>type.id===(item.grooveType || 'perimeter'));
    return english ? type?.nameEn : type?.name;
  };
  const params = {
    mode: 'payment', client_reference_id: order.id,
    ...(Number.isSafeInteger(order.checkoutExpiresAt)?{expires_at:order.checkoutExpiresAt}:{}),
    line_items: order.quote.items.map(item => ({
      quantity: item.quantity,
      price_data: { currency: 'eur', unit_amount: item.unitCents, product_data: { name: (english ? item.nameEn : item.name) + (item.wood ? ' · ' + item.wood : '') + (item.variant ? ' · ' + (english?item.variantNameEn:item.variantName) : '') + ['engraving','juiceGroove','careBalm'].filter(key=>item[key]).map(key=>' · '+({engraving:english?'Engraving':'Gravur',juiceGroove:grooveName(item),careBalm:english?'Care balm':'Pflegebalsam'})[key]).join(''), ...(item.accent !== undefined ? {description: (english ? 'Inlay (included): ' : 'Intarsie (inklusive): ') + (item.accent || (english ? 'None (one wood)' : 'Keine (ein Holz)'))} : {}) } }
    })),
    shipping_address_collection: { allowed_countries: ['DE'] },
    shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: order.quote.shippingCents, currency: 'eur' }, display_name: english ? 'Shipping within Germany' : 'Versand innerhalb Deutschlands' } }],
    success_url: publicOrigin + prefix + '?payment=return&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: publicOrigin + prefix + '?payment=cancelled',
    locale: english ? 'en' : 'de',
    consent_collection: { terms_of_service: 'required' },
    custom_text: { submit: { message: english ? 'No VAT charged under the German small business exemption (§19 UStG).' : 'Kein Umsatzsteuerausweis gemäß §19 UStG.' } },
    metadata: { order_id: order.id, catalog_version: catalogVersion }
  };
  order.quote.items.forEach((item,index)=>{
    if(item.edge){const edge=config.offers.find(o=>o.sku===item.sku).edgeChoices.find(e=>e.id===item.edge);params.line_items[index].price_data.product_data.name+=' · '+(english?edge.nameEn:edge.name);}
  });
  return params;
}
