import test from 'node:test';
import assert from 'node:assert/strict';
import {tropicalGeometry,handledGeometry,swissEdgeGeometry} from './model-shapes.js';

for(const [name,build,w,d,h] of [['tropical',tropicalGeometry,44.2,36,5],['oak',handledGeometry,59.5,38,4.9]]){
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
