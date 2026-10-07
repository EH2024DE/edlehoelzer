import * as THREE from 'three';

// Trace of listing 4451487112: broad rounded grips, gently rounded shoulders.
export function tropicalGeometry(width, depth, height) {
  const shape = new THREE.Shape();
  const p = (u,v) => [width*(u-.5),depth*(.5-v)];
  shape.moveTo(...p(.10,0));
  shape.lineTo(...p(.90,0));
  shape.bezierCurveTo(...p(.914,.05),...p(.911,.17),...p(.915,.23));
  shape.bezierCurveTo(...p(.918,.29),...p(.968,.28),...p(.984,.35));
  shape.bezierCurveTo(...p(1,.40),...p(1,.59),...p(.984,.65));
  shape.bezierCurveTo(...p(.968,.73),...p(.918,.71),...p(.915,.77));
  shape.bezierCurveTo(...p(.911,.84),...p(.914,.95),...p(.90,1));
  shape.lineTo(...p(.10,1));
  shape.bezierCurveTo(...p(.086,.95),...p(.089,.84),...p(.085,.77));
  shape.bezierCurveTo(...p(.082,.71),...p(.032,.73),...p(.016,.65));
  shape.bezierCurveTo(...p(0,.59),...p(0,.40),...p(.016,.35));
  shape.bezierCurveTo(...p(.032,.28),...p(.082,.29),...p(.085,.23));
  shape.bezierCurveTo(...p(.089,.17),...p(.086,.05),...p(.10,0));
  shape.closePath();
  const contour=shape.getPoints(24), distances=[0];
  for(let i=1;i<contour.length;i++) distances.push(distances[i-1]+contour[i].distanceTo(contour[i-1]));
  const edgeUV=(vertices,i)=>{
    const x=vertices[i*3],y=vertices[i*3+1];
    let nearest=0,best=Infinity;
    contour.forEach((point,index)=>{const d=(point.x-x)**2+(point.y-y)**2;if(d<best){best=d;nearest=index;}});
    return new THREE.Vector2(distances[nearest]/(width*.8),vertices[i*3+2]/height);
  };
  const geometry=new THREE.ExtrudeGeometry(shape,{
    depth:height,bevelEnabled:false,curveSegments:24,
    UVGenerator:{
      generateTopUV:(_,vertices,a,b,c)=>[a,b,c].map(i=>new THREE.Vector2(vertices[i*3]/width+.5,vertices[i*3+1]/depth+.5)),
      generateSideWallUV:(_,vertices,a,b,c,d)=>[a,b,c,d].map(i=>edgeUV(vertices,i))
    }
  });
  geometry.rotateX(-Math.PI/2);
  return geometry;
}

export function handledGeometry(width, depth, height) {
  const shape = new THREE.Shape();
  const point = (u, v) => [width * (u - .5), depth * (.5 - v)];
  shape.moveTo(...point(.115, 0));
  shape.lineTo(...point(.925, 0));
  shape.lineTo(...point(.925, .23));
  shape.bezierCurveTo(...point(.925,.30), ...point(1,.27), ...point(1,.39));
  shape.lineTo(...point(1,.62));
  shape.bezierCurveTo(...point(1,.74), ...point(.925,.70), ...point(.925,.77));
  shape.lineTo(...point(.925,1));
  shape.lineTo(...point(.115,1));
  shape.lineTo(...point(.115,.77));
  shape.bezierCurveTo(...point(.115,.70), ...point(0,.74), ...point(0,.62));
  shape.lineTo(...point(0,.39));
  shape.bezierCurveTo(...point(0,.27), ...point(.115,.30), ...point(.115,.23));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height, bevelEnabled: false, curveSegments: 12,
    UVGenerator: {
      generateTopUV: (_, vertices, a, b, c) => [a,b,c].map(i => new THREE.Vector2(vertices[i*3]/width+.5, vertices[i*3+1]/depth+.5)),
      generateSideWallUV: () => [new THREE.Vector2(0,0),new THREE.Vector2(1,0),new THREE.Vector2(1,1),new THREE.Vector2(0,1)]
    }
  });
  geometry.rotateX(-Math.PI/2);
  return geometry;
}

// The serving boards are upright silhouettes, not a guessed solid model of the holder.
export function servingGeometry(width, height, handleX = .54) {
  const shape = new THREE.Shape();
  const p = (u,v) => [width*(u-.5),height*(1-v)];
  shape.moveTo(...p(0,1)); shape.lineTo(...p(1,1));
  shape.lineTo(...p(.985,.53));
  shape.bezierCurveTo(...p(.985,.47),...p(handleX-.035,.23),...p(handleX-.015,.19));
  shape.lineTo(...p(handleX+.09,.15));
  shape.bezierCurveTo(...p(handleX+.10,.11),...p(handleX+.16,.10),...p(handleX+.13,.04));
  shape.bezierCurveTo(...p(handleX+.09,-.01),...p(handleX-.12,-.01),...p(handleX-.13,.04));
  shape.bezierCurveTo(...p(handleX-.17,.10),...p(handleX-.07,.11),...p(handleX-.09,.17));
  shape.bezierCurveTo(...p(handleX-.10,.25),...p(.015,.39),...p(.015,.46));
  shape.closePath();
  const hole = new THREE.Path();
  hole.absellipse(width*(handleX-.5),height*.925,width*.07,height*.027,0,Math.PI*2,true);
  shape.holes.push(hole);
  const geometry = new THREE.ShapeGeometry(shape,24);
  const positions=geometry.attributes.position, uv=geometry.attributes.uv;
  for(let i=0;i<positions.count;i++)uv.setXY(i,positions.getX(i)/width+.5,positions.getY(i)/height);
  return geometry;
}
