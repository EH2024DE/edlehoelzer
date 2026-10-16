import test from 'node:test';
import assert from 'node:assert/strict';
import {tropicalGeometry,handledGeometry,swissEdgeGeometry} from './model-shapes.js';
import models from './additional-models.js';

for(const [name,build,w,d,h] of [['tropical',tropicalGeometry,44.2,36,5],['oak',handledGeometry,60,40,5],['beech',handledGeometry,50,37,5]]){
  test(`${name} grips keep a flush cutting face and taper only underneath`,()=>{
    const geometry=build(w,d,h),positions=geometry.getAttribute('position');
    let flushGrip=false,taperedGrip=false,flatBase=false;
    for(let i=0;i<positions.count;i++){
      const x=positions.getX(i),y=positions.getY(i);
      assert.ok(Number.isFinite(x)&&Number.isFinite(y));
      assert.ok(y>=-1e-5&&y<=h+1e-5);
      if(Math.abs(x)>w*.48){
        if(Math.abs(y-h)<1e-5)flushGrip=true;
        if(y>h*.35&&y<h*.65)taperedGrip=true;
      }
      if(Math.abs(x)<w*.43&&Math.abs(y)<1e-5)flatBase=true;
    }
    assert.ok(flushGrip);assert.ok(taperedGrip);assert.ok(flatBase);
    geometry.dispose();
  });
}
test('merged listing exposes three dimensioned models without removing the standalone tropical board',()=>{
  const variants=Object.values(models).filter(p=>p.listingId==='4417507555');
  assert.deepEqual(variants.map(p=>p.variant),['oak','tropical','beech']);
  assert.deepEqual(variants.map(p=>[p.w,p.d,p.h]),[[60,40,5],[44.2,36,5],[50,37,5]]);
  assert.equal(models.premiumOak.availability,'made_to_order');
  assert.equal(models.tropical.listingId,'4451487112');
});
test('shared handle template rounds the four cutting-face body corners',()=>{
  for(const p of [models.premiumOak,models.handledTropical,models.handledBeech]){
    const geometry=handledGeometry(p.w,p.d,p.h),positions=geometry.getAttribute('position');
    for(let i=0;i<positions.count;i++){
      const x=Math.abs(positions.getX(i)),z=Math.abs(positions.getZ(i));
      assert.ok(!(Math.abs(x-(p.w/2-4.5))<.001&&Math.abs(z-p.d/2)<.001),'no sharp body corner');
    }
    geometry.dispose();
  }
});
test('Swiss edge retains full cutting face above a recessed sloping underside',()=>{
  const {bevel,lip,inset}=swissEdgeGeometry(40,30,3),p=bevel.getAttribute('position');
  for(let i=0;i<p.count;i++)if(p.getY(i)===0){
    assert.ok(Math.abs(Math.abs(p.getX(i))-(20-inset))<1e-5);
    assert.ok(Math.abs(Math.abs(p.getZ(i))-(15-inset))<1e-5);
  }
  lip.computeBoundingBox();
  assert.equal(lip.boundingBox.max.x-lip.boundingBox.min.x,40);
  assert.ok(Math.abs(lip.boundingBox.max.y-3)<1e-5);
  bevel.dispose();lip.dispose();
});
