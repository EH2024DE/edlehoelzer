const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('main.js', 'utf8');
const products = require('../products.json').products;
function engine(isEnglish) {
  const context = {isEnglish, normalizeConstructionTerms:value=>value};
  vm.runInNewContext(source.split('document.documentElement.classList.add("js");')[0], context);
  vm.runInNewContext(source.slice(source.indexOf('function orderProductMedia('),source.indexOf('function buildCardGalleryItems(')),context);
  for (const name of ['productMedia','productMoment','productExperienceText','productImageAlt','displayProductName','isEndGrain','productProof','productUseLabel','productRole']) {
    const start = source.indexOf('  function '+name+'(');
    vm.runInNewContext(source.slice(start,source.indexOf('\n  function ',start+1)),context);
  }
  return context;
}
test('every gallery starts with its thumbnail, then video, then remaining photos in DE and EN', () => {
  for (const en of [false,true]) {
    const e = engine(en);
    for (const product of products) {
      const before = JSON.stringify(product);
      const media = e.productMedia(product);
      assert.equal(media[0].type,'image',product.id);
      assert.equal(media[0].src,product.image,product.id);
      if (product.videos?.length) assert.equal(media[1].type,'video',product.id);
      assert.ok(media.every(m=>m.alt.trim()),product.id);
      assert.equal(JSON.stringify(product),before);
    }
  }
});
test('explicit media and selected variant images retain video in second position without truncating photos', () => {
  const e = engine(false);
  const items = [{type:'video',src:'/film.mp4'},{type:'image',src:'/detail.jpg',alt:'Detailaufnahme'},{type:'image',src:'/main.jpg',alt:'Hauptfoto'},...Array.from({length:8},(_,i)=>({type:'image',src:'/photo'+i+'.jpg'}))];
  const media = e.productMedia({image:'/main.jpg',media:items,displayName:'Test'});
  assert.equal(media.length,items.length);
  assert.equal(media[0].src,'/main.jpg');
  assert.equal(media[0].alt,'Hauptfoto');
  assert.equal(media[1].type,'video');
  const selected = e.orderProductMedia(media,'/detail.jpg');
  assert.equal(selected[0].src,'/detail.jpg');
  assert.equal(selected[1].type,'video');
});
test('coasters and stands have their own purpose, never a cutting-board benefit', () => {
  for (const en of [false,true]) {
    const e = engine(en);
    const coasters = products.find(p=>p.listingId==='1838851839');
    const holder = products.find(p=>p.listingId==='1874454440');
    assert.match(e.productMoment(coasters),en ? /coasters/ : /Holzuntersetzer/);
    assert.match(e.productExperienceText(coasters),en ? /glasses and cups/ : /Gläser und Tassen/);
    assert.match(e.productExperienceText(holder),en ? /upright/ : /aufrechte/);
    for (const product of products.filter(p=>p.category!=='board')) {
      const text = e.productMoment(product)+' '+e.productExperienceText(product);
      assert.doesNotMatch(text,/intensive|Messern|good knives|quer angeschnitten|cross-cut/);
      assert.ok(e.productImageAlt(product).trim());
    }
  }
});
test('serving boards are described for serving, independently of end-grain construction', () => {
  for (const en of [false,true]) {
    const e = engine(en);
    for (const product of products.filter(p=>p.productType==='servingBoard')) {
      assert.match(e.productMoment(product),en ? /serving/ : /Anrichten/);
      assert.doesNotMatch(e.productMoment(product),/intensive|Messern|knives/);
    }
    const balm = products.find(p=>p.category==='care');
    assert.match(e.productProof(balm),en ? /beeswax/ : /Bienenwachs/);
    assert.doesNotMatch(e.productProof(balm),/Metall/);
  }
});
