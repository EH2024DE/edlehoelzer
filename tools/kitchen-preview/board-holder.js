import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const holderTextures = {
  oak: { image:'/assets/holder-oak.jpg', w:20, d:8, quad:[.30,.635,.84,.624,.84,.806,.30,.822] },
  walnut: { image:'/assets/holder-walnut.jpg', w:20, d:8, quad:[.24,.34,.82,.35,.80,.395,.23,.392] },
  beech: { image:'/assets/holder-beech.jpg', w:20, d:8, quad:[.30,.635,.84,.624,.84,.806,.30,.822] }
};

export function createBackTexture(map, crop) {
  if (!crop) return map;
  const back = map.clone();
  back.offset.set(crop[0], crop[1]);
  back.repeat.set(crop[2] - crop[0], crop[3] - crop[1]);
  back.needsUpdate = true;
  return back;
}

export function createBackGeometry(w, d, crop, frameWidth = 0) {
  if (!frameWidth) return new THREE.PlaneGeometry(w, d);
  // Separate UV patches preserve the oak frame without copying the groove.
  const x = [-w/2, -w/2+frameWidth, w/2-frameWidth, w/2];
  const y = [-d/2, -d/2+frameWidth, d/2-frameWidth, d/2];
  const u = [[0,.025],[crop[0],crop[2]],[.975,1]];
  const v = [[0,.025],[crop[1],crop[3]],[.975,1]];
  const positions = [], uv = [], indices = [];
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){
    const start=positions.length/3;
    positions.push(x[col],y[row],0,x[col+1],y[row],0,x[col+1],y[row+1],0,x[col],y[row+1],0);
    uv.push(u[col][0],v[row][0],u[col][1],v[row][0],u[col][1],v[row][1],u[col][0],v[row][1]);
    indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();
  return geometry;
}

// The opening is made to fit the board; base and rails stay 2 cm thick.
export function createHolder(map, thickness=5) {
  const holder = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({map,roughness:.85});
  const base = new THREE.Mesh(new RoundedBoxGeometry(20,2,thickness+4,3,.15),material);
  base.position.y=1;
  holder.add(base);
  for(const z of [-(thickness/2+1),thickness/2+1]) {
    const rail=new THREE.Mesh(new RoundedBoxGeometry(20,8,2,5,.45),material);
    rail.position.set(0,6,z);
    holder.add(rail);
  }
  return holder;
}

export function standBoard(product, model) {
  product.rotation.set(Math.PI/2,model.d>model.w?Math.PI/2:0,0);
  product.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(product), center=box.getCenter(new THREE.Vector3());
  product.position.set(-center.x,-box.min.y,-center.z);
  const pivot=new THREE.Group();
  pivot.add(product);
  pivot.position.y=2;
  return pivot;
}
