const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const products=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;

test('both homepages retain the four ascending price tiers and custom XXL anchor',()=>{
  let german;
  for(const file of ['index.html','en/index.html']){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    const ids=JSON.parse(html.match(/var homepageProductIds = (\[[\s\S]*?\]);/)[1]);
    assert.equal(ids.length,4);
    if(german)assert.deepEqual(ids,german);else german=ids;
    const selected=ids.map(id=>products.find(p=>p.id===id));
    selected.forEach(p=>{
      assert.ok(p&&p.active===true&&!p.inspirationOnly);
      assert.ok(['available','made_to_order'].includes(p.availabilityStatus));
    });
    const ranges=[[50,150],[200,300],[400,600],[1000,Infinity]];
    selected.forEach((p,i)=>assert.ok(p.priceOrder>=ranges[i][0]&&p.priceOrder<ranges[i][1],file+' tier '+(i+1)));
    assert.equal(selected[3].listingId,'4484195050');
    assert.equal(selected[2].listingId,'1776273564','only the current square 3D board belongs on the homepage');
    assert.equal(products.find(p=>p.listingId==='1803930088').active,false,'the retired rectangular 3D board stays archived');
    assert.equal(selected[3].availabilityStatus,'made_to_order');
  }
});
