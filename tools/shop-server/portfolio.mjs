import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {catalogGroups} from './catalog-groups.mjs';

export function minimumThicknessCm(label) {
  const text=String(label || '').replace(/,/g,'.');
  const unit=text.match(/\b(cm|mm)\b/i);
  if(!unit)return null;
  const values=(text.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter(n=>n>0);
  return values.length ? Math.min(...values)/(unit[1].toLowerCase()==='mm'?10:1) : null;
}
function variantThicknessCm(variant,fallback) {
  if(variant.thicknessLabel)return minimumThicknessCm(variant.thicknessLabel);
  if(!variant.dimensions)return fallback;
  const dimensions=String(variant.dimensions).replace(/,/g,'.').match(/\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(cm|mm)\b/i);
  return dimensions ? Number(dimensions[1])/(dimensions[2].toLowerCase()==='mm'?10:1) : null;
}

export function portfolio(root, config, data) {
  const context = {};
  const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  vm.runInNewContext(source.split('document.documentElement.classList.add("js");')[0], context, {timeout:1000});
  const english = value => context.EdleProductCopy.text(value || '', true);
  const prices = data.purchaseRules.optionPrices;
  const cents = value => Math.round(Number(value) * 100);
  const overrides = new Map(config.offers.map(offer => [offer.listingId, offer]));
  return data.products.filter(p => !p.canonicalProductId).map(p => {
    const override = overrides.get(p.listingId);
    const text = [p.name,p.shortDescription,p.longDescription,...(p.badges || [])].join(' ');
    const sold = !p.active || p.inspirationOnly === true || p.availabilityStatus === 'sold';
    const singlePiece = p.category === 'board' && p.availabilityStatus !== 'made_to_order' && (p.variants?.length > 0 || Number(p.stock) <= 1);
    const facts=[p.material,p.sizeLabel,...(/\d.*[x×].*\d.*[x×].*\d/.test(p.sizeLabel || '') ? [] : [p.thicknessLabel]),p.weight].filter(Boolean);
    const offer = {
      sku: 'product-' + (p.listingId || p.id), listingId:p.listingId,
      name:p.displayName || p.name, nameEn:english(p.displayName || p.name),
      unitCents:cents(p.priceOrder), woods:[], category:p.category,
      minimumThicknessCm:p.dimensionsReviewRequired ? null : minimumThicknessCm(p.thicknessLabel),
      detail:facts.join(' · '),
      detailEn:facts.map(english).join(' · '),
      image:p.image, productPath:p.productPath, sold, singlePiece,
      maxQuantity:singlePiece ? 1 : config.maxQuantity,
      stockLimit:p.category === 'board' && !p.variants?.length && p.availabilityStatus !== 'made_to_order' && Number(p.stock)>0 ? Number(p.stock) : null,
      madeToOrder:p.availabilityStatus === 'made_to_order',
      materialInStock:p.materialInStock,
      availabilityNote:p.availabilityNote,
      availabilityNoteEn:p.availabilityNoteEn,
      weightKg:p.weightKg,
      requiresAgreement:p.dimensionsReviewRequired === true || p.availabilityStatus === 'made_to_order',
      packageContents:context.productPackageItems(p,data.purchaseRules).map(item => ({label:item.label,labelEn:item.labelEn || english(item.label)})),
      catalogGroups:catalogGroups(p),
      gallery:p.gallery || [p.image],videos:p.videos || [],
      ...(p.variants?.length ? {variants:p.variants.map(v=>({...v,nameEn:v.nameEn || english(v.name),unitCents:cents(v.priceOrder),minimumThicknessCm:p.dimensionsReviewRequired ? null : variantThicknessCm(v,minimumThicknessCm(p.thicknessLabel)),sold:v.availabilityStatus === 'sold'}))} : {}),
      sharedVariantStock: p.variants?.every(v=>['plain','groove'].includes(v.id)) || false,
      sourceReviewRequired: !override,
      ...override
    };
    // Mirror the existing product configurator rules; never split mixed wood into invented variants.
    if (!override && ['board','accessory'].includes(p.category) && (p.engravingPossible || /personalisierbar|gravur|engraving|personali[sz]/i.test(text)) && !p.etsyOptionsOnly) {
      offer.engravingCents = cents(p.category === 'accessory' ? prices.engravingAccessory : prices.engravingBoard);
    }
    if (p.category === 'board' && p.finderProfile?.juiceGroove !== true && data.purchaseRules.juiceGrooveOptionListingIds.includes(p.listingId)) offer.juiceGrooveCents = cents(prices.juiceGroove);
    if (p.category === 'board' && p.priceOrder < (data.purchaseRules.careBalmOptionMaximumBasePrice || 150) && !data.purchaseRules.careBalmOptionExcludedListingIds.includes(p.listingId)) {
      offer.careBalmCents = Math.round(cents(prices.careBalmRegular) * (1 - prices.careBalmBundleDiscountPercent / 100));
    }
    if(p.listingId==='4370769708'){
      offer.engravingCents=cents(prices.engravingBoard);
      // Both disputed dimensions exceed the confirmed 4 cm series minimum.
      offer.minimumThicknessCm=4;
    }
    offer.grooveIncluded = p.finderProfile?.juiceGroove === true && !offer.juiceGrooveCents;
    if (p.dimensionsReviewRequired) {
      offer.detail=[p.material,p.weight,'Maße vor Bestellung bestätigen'].filter(Boolean).join(' · ');
      offer.detailEn=[english(p.material),p.weight,'Dimensions to be confirmed before ordering'].filter(Boolean).join(' · ');
    }
    offer.dispatch = offer.sku === 'xxl-custom-board' ? 'custom' : offer.madeToOrder ? 'by-agreement' : 'standard';
    offer.giftEligible = ['dough-scraper','butter-knife','spatula'].includes(offer.sku);
    if(offer.edgeStock)offer.maxQuantity=Math.max(...Object.values(offer.edgeStock).flatMap(edges=>Object.values(edges)));
    offer.expressEligible = offer.sku !== 'xxl-custom-board';
    if (offer.dispatch === 'custom') offer.shippingIncluded = true;
    return offer;
  }).sort((a,b)=>Number(a.sold)-Number(b.sold) || Number(b.category==='board')-Number(a.category==='board'));
}
