import { plane, validQuad } from './geometry.js';

// Conservative guards: a frontal photo alone is not a reason to reject it.
export function referenceQuality(points, width, height, w, d) {
  if(!validQuad(points))return 'corners';
  const pixels=points.map(([x,y])=>[x*width,y*height]);
  const edges=pixels.map((p,i)=>Math.hypot(p[0]-pixels[(i+1)%4][0],p[1]-pixels[(i+1)%4][1]));
  const area=Math.abs(pixels.reduce((sum,p,i)=>sum+p[0]*pixels[(i+1)%4][1]-p[1]*pixels[(i+1)%4][0],0))/2;
  if(Math.min(...edges)<18||area<900)return 'small';
  if(area/Math.max(...edges)**2<.065)return 'flat';
  try {
    const base=plane(points,w,d),locations=[[0,0],[w,d],[w*1.5,d*1.5]];
    const diagonal=Math.hypot((points[2][0]-points[0][0])*width,(points[2][1]-points[0][1])*height);
    for(let corner=0;corner<4;corner++)for(let axis=0;axis<2;axis++)for(const sign of [-1,1]){
      const shifted=points.map(p=>[...p]);shifted[corner][axis]+=sign*1.5/(axis?height:width);
      const candidate=plane(shifted,w,d);
      for(const location of locations){
        const a=base.transform(...location),b=candidate.transform(...location);
        const delta=Math.hypot((a[0]-b[0])*width,(a[1]-b[1])*height);
        if(!Number.isFinite(delta)||delta>diagonal*.15)return 'unstable';
      }
    }
  }catch{return 'corners';}
  return null;
}
