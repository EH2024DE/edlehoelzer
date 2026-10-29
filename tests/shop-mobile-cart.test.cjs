const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('assets/js/shop-pilot.js','utf8');
const implementation=source.slice(source.indexOf('  function renderMobileCart()'),source.indexOf('  function renderCart()'));
function render(overrides={}){
  const amount={},label={};
  const context={cart:[{sku:'balm',quantity:1}],catalog:{offers:[{sku:'balm',unitCents:999}]},currentQuote:null,pending:true,en:false,t:{total:'Gesamtsumme',subtotal:'Warenwert'},itemPrice:o=>o.unitCents,money:c=>(c/100).toFixed(2),document:{querySelectorAll:()=>[amount],querySelector:()=>label},...overrides};
  vm.runInNewContext(implementation+'\nrenderMobileCart();',context);
  return {amount:amount.textContent,label:label.textContent};
}
test('fixed cart immediately shows goods value while shipping is loading',()=>{
  assert.deepEqual(render(),{amount:'9.99',label:'Warenwert · Versand wird berechnet'});
});
test('fixed cart shows confirmed total without waiting for scrolling',()=>{
  assert.deepEqual(render({currentQuote:{totalCents:1269},pending:false}),{amount:'12.69',label:'Gesamtsumme'});
});
test('unresolved shipping and failed requests retain a monetary goods subtotal',()=>{
  assert.deepEqual(render({currentQuote:{totalCents:null,shippingPending:true},pending:false}),{amount:'9.99',label:'Warenwert · Versand offen'});
  assert.deepEqual(render({pending:false}),{amount:'9.99',label:'Warenwert · Berechnung nicht verfügbar'});
  assert.equal(render({cart:[],pending:false}).amount,'0.00');
});
