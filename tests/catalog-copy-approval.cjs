const assert=require('node:assert/strict');
const review=require('../data/wood-range-review-2026-11-09.json');
exports.restoreApprovedWoodCopy=(before,after)=>{
  for(const current of after.products.filter(p=>p.canonicalProductId))current.productPath=before.products.find(p=>p.id===current.id).productPath;
  for(const item of require('../data/product-url-migration.json')){
    const current=after.products.find(p=>p.listingId===item.listingId);
    assert.equal(current.displayName,item.de);assert.equal(current.productPath,item.productPath);
    current.displayName=item.previousTitle;current.productPath=item.previousPath;
  }
  for(const update of review.updates){
    const old=before.products.find(p=>p.listingId===update.listingId),current=after.products.find(p=>p.listingId===update.listingId);
    for(const [key,expected] of Object.entries(update.fields)){
      assert.ok(['displayName','material','shortDescription','longDescription','badges'].includes(key));
      assert.deepEqual(current[key],expected,update.listingId+' '+key);
      if(key in old)current[key]=old[key];else delete current[key];
    }
  }
};
exports.clearCatalogDirectories=nodes=>{
  const belongs=node=>{for(let parent=node.parentNode;parent;parent=parent.parentNode)if((parent.attrs?.find(a=>a.name==='class')?.value||'').split(/\s+/).some(c=>['productDirectory','productDetail__browse'].includes(c)))return true;return false;};
  for(const node of nodes.filter(n=>n.tagName==='ul'&&belongs(n)))node.childNodes=[];
};
