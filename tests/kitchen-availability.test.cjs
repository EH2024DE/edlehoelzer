const test=require('node:test'),assert=require('node:assert/strict');
const catalog=require('../products.json').products,available=require('../tools/kitchen-preview/product-availability.json');
test('preview purchase eligibility mirrors the current public catalogue without copying prices or customer data',()=>{
  for(const [id,state] of Object.entries(available)){
    const product=catalog.find(p=>p.listingId===id);assert.ok(product);
    assert.deepEqual(Object.keys(state).sort(),['available','variants']);
    const expected=product.active===true&&(product.availabilityStatus==='made_to_order'||product.availabilityStatus==='available'&&!(Number.isFinite(product.stock)&&product.stock<=0));
    assert.equal(state.available,expected,id+' requires a kitchen preview rebuild');
    assert.deepEqual(state.variants,Object.fromEntries((product.variants||[]).map(v=>[v.id,['available','made_to_order'].includes(v.availabilityStatus)])));
  }
  for(const id of ['4370769708','1850610674'])assert.equal(available[id].available,false);
});
