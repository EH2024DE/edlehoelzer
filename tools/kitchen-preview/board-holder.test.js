import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createHolder, standBoard, createBackTexture, createBackGeometry } from './board-holder.js';

test('plain rear texture excludes the groove without modifying the front',()=>{
  const front=new THREE.Texture(),back=createBackTexture(front,[.1,.1,.9,.9]);
  assert.notEqual(front,back);
  assert.deepEqual(front.offset.toArray(),[0,0]);
  assert.deepEqual(front.repeat.toArray(),[1,1]);
  assert.deepEqual(back.offset.toArray(),[.1,.1]);
  assert.deepEqual(back.repeat.toArray(),[.8,.8]);
  assert.equal(createBackTexture(front),front);
});

test('framed rear preserves outer oak strips and excludes groove UV bands',()=>{
  const geometry=createBackGeometry(36.5,48,[.1,.1,.9,.9],1.5);
  geometry.computeBoundingBox();
  const size=geometry.boundingBox.getSize(new THREE.Vector3());
  assert.deepEqual(size.toArray(),[36.5,48,0]);
  assert.equal(geometry.index.count,54);
  const uv=geometry.getAttribute('uv');
  for(let i=0;i<uv.count;i++){
    for(const value of [uv.getX(i),uv.getY(i)]){
      assert.ok(value<=.026||value>=.974||(value>=.099&&value<=.901));
    }
  }
  geometry.dispose();
});

test('holder has the confirmed outside dimensions and a 5 cm opening',()=>{
  const holder=createHolder(null),size=new THREE.Box3().setFromObject(holder).getSize(new THREE.Vector3());
  [20,10,9].forEach((value,i)=>assert.ok(Math.abs(size.getComponent(i)-value)<.001));
  assert.equal(holder.children[2].position.z-holder.children[1].position.z-2,5);
});

for(const model of [{w:44.2,d:36,h:5},{w:36.5,d:48,h:4.2},{w:40,d:30,h:3},{w:75,d:60,h:7}]){
  test(`standing board ${model.w} x ${model.d} x ${model.h} rests on its long edge within the slot`,()=>{
    const product=new THREE.Group(),mesh=new THREE.Mesh(new THREE.BoxGeometry(model.w,model.h,model.d));
    mesh.position.y=model.h/2;product.add(mesh);
    const pivot=standBoard(product,model);pivot.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(pivot);
    assert.ok(Math.abs(box.min.y-2)<.001);
    assert.ok(Math.abs(box.max.x-box.min.x-Math.max(model.w,model.d))<.001);
    assert.ok(Math.abs(box.max.y-box.min.y-Math.min(model.w,model.d))<.001);
    const holder=createHolder(null,model.h),size=new THREE.Box3().setFromObject(holder).getSize(new THREE.Vector3());
    assert.ok(Math.abs(size.z-(model.h+4))<.001);
    assert.equal(holder.children[2].position.z-holder.children[1].position.z-2,model.h);
    const vertices=mesh.geometry.attributes.position;
    for(let i=0;i<vertices.count;i+=3){
      const triangle=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(vertices,i+j).applyMatrix4(mesh.matrixWorld));
      for(let j=0;j<3;j++){
        const a=triangle[j],b=triangle[(j+1)%3];
        if((a.y-10)*(b.y-10)>=0)continue;
        const z=a.z+(b.z-a.z)*(10-a.y)/(b.y-a.y);
        assert.ok(z>=-model.h/2-.001&&z<=model.h/2+.001,`slot intersection ${z}`);
      }
    }
  });
}
