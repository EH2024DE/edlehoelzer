import test from 'node:test';
import assert from 'node:assert/strict';
import {publicCatalog,quote,customisation} from '../tools/shop-server/catalog.mjs';

test('every catalogue configuration preserves its own option arithmetic and engraving constraints',()=>{
  let configurations=0,personalised=0;
  for(const offer of publicCatalog().offers){
    for(const variant of offer.variants||[null])for(const wood of offer.woods.length?offer.woods:['']){
      const edges=offer.edgeStock?Object.keys(offer.edgeStock[wood]):[''];
      for(const edge of edges)for(const accent of offer.accents||['']){
        const item={sku:offer.sku,quantity:1,...(variant?{variant:variant.id}:{}),...(wood?{wood}:{}),...(edge?{edge}:{}),...(offer.accents?{accent}:{})};
        const input=items=>({country:'DE',items});
        const unavailable=offer.sold||variant?.sold||offer.unavailableWoods?.includes(wood)||(offer.edgeStock&&offer.edgeStock[wood][edge]===0);
        if(unavailable){assert.throws(()=>quote(input([item])));continue;}
        const base=quote(input([item]));configurations++;
        assert.equal(base.configurationPending,false,offer.sku);
        assert.ok(Number.isSafeInteger(base.subtotalCents)&&base.subtotalCents>0,offer.sku);
        assert.ok(offer.nameEn&&offer.productPath,offer.sku);
        for(const [option,amount]of [['juiceGroove',offer.juiceGrooveCents],['careBalm',offer.careBalmCents]])if(Number.isSafeInteger(amount)){
          for(const groove of option==='juiceGroove'?customisation.grooveTypes:[null]){
            const configured=quote(input([{...item,[option]:true,...(groove?{grooveType:groove.id}:{})}]));
            assert.equal(configured.subtotalCents,base.subtotalCents+amount,offer.sku+' '+option);
            if(groove){assert.equal(amount,1500);assert.equal(configured.items[0].grooveType,groove.id);}
          }
        }
        if(Number.isSafeInteger(offer.engravingCents)){
          const thickness=variant?variant.minimumThicknessCm:offer.minimumThicknessCm;
          const positions=offer.category==='board'?customisation.boardPositions.filter(position=>position.id.startsWith('face-')||Number.isFinite(thickness)&&thickness>=2).map(position=>position.id):['by-arrangement'];
          for(const font of customisation.fonts)for(const position of positions){
            const configured=quote(input([{...item,engraving:true,personalisation:{kind:'text',text:'Local option test',font:font.id,position}}]));
            assert.equal(configured.configurationPending,false);
            assert.equal(configured.subtotalCents,base.subtotalCents+offer.engravingCents);
            assert.equal(configured.items[0].personalisation.position,position);
            assert.equal(configured.items[0].personalisation.font,font.id);
            assert.equal(configured.items[0].mockupApprovalRequired,true);personalised++;
          }
        }
        if(offer.singlePiece&&variant?.availabilityStatus!=='made_to_order')assert.throws(()=>quote(input([{...item,quantity:2}])),/QUANTITY_LIMIT/);
      }
    }
  }
  assert.ok(configurations>100,'enumerate real wood, edge, inlay and product variants');
  assert.ok(personalised>100,'enumerate supported fonts and product-dependent positions');
  console.log(`Audited ${configurations} base configurations and ${personalised} text engraving configurations; this is validation, not stock or payment approval.`);
});
