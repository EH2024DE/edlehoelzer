import PerspT from './perspective.js';
export function validQuad(p) {
  if (p.length !== 4) return false;
  let signs = [];
  for (let i = 0; i < 4; i++) {
    let a = p[i],
      b = p[(i + 1) % 4],
      c = p[(i + 2) % 4];
    signs.push((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]));
  }
  return signs.every((v) => v > 0.000001);
}
export function plane(p, w, d) {
  if (!validQuad(p) || !(w >= 5 && w <= 400 && d >= 5 && d <= 400))
    throw Error(
      "Die vier Ecken müssen ein Rechteck in der angegebenen Reihenfolge umschließen. Prüfe auch die Maße.",
    );
  return PerspT([0, 0, w, 0, w, d, 0, d], p.flat());
}

export function cameraAxes(coeffs, aspect, focal35) {
  const c=coeffs;
  const a=[(2*c[0]-c[6])*aspect,c[6]-2*c[3],c[6]];
  const b=[(2*c[1]-c[7])*aspect,c[7]-2*c[4],c[7]];
  const t=[(2*c[2]-c[8])*aspect,c[8]-2*c[5],c[8]];
  const estimated=-(a[0]*b[0]+a[1]*b[1])/(a[2]*b[2]);
  const f=focal35 ? 2*focal35*Math.sqrt(1+aspect*aspect)/Math.hypot(36,24) : estimated>.5&&estimated<30 ? Math.sqrt(estimated) : 2.4;
  const ra=[a[0]/f,a[1]/f,a[2]],rb=[b[0]/f,b[1]/f,b[2]];
  const la=Math.hypot(...ra),lb=Math.hypot(...rb);
  const cross=[ra[1]*rb[2]-ra[2]*rb[1],ra[2]*rb[0]-ra[0]*rb[2],ra[0]*rb[1]-ra[1]*rb[0]];
  const scale=Math.sqrt(la*lb)/Math.hypot(...cross)*(cross[1]<0?-1:1);
  const vertical=cross.map((v,i)=>v*scale*(i<2?f:1));
  const error=Math.max(Math.abs(la/lb-1),Math.abs(ra.reduce((s,v,i)=>s+v*rb[i],0)/(la*lb)));
  return {a,b,t,vertical,error,f};
}
