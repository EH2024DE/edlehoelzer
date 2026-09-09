import exifr from 'exifr';
import {plane,cameraAxes} from './geometry.js';
import cvScriptUrl from '@techstark/opencv-js/dist/opencv.js?url';

let cvPromise;
function loadOpenCV() {
  // Load the official browser build intact: bundler interop can wrap its Promise incorrectly.
  if (!cvPromise) cvPromise = new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=cvScriptUrl;script.async=true;
    script.onload=()=>Promise.resolve(window.cv).then(resolve,reject);
    script.onerror=()=>{script.remove();reject(new Error('OpenCV could not be loaded'));};
    document.head.append(script);
  }).catch(error=>{cvPromise=null;throw error;});
  return cvPromise;
}

export async function cameraMetadata(file) {
  try {
    const data = await exifr.parse(file, ['FocalLengthIn35mmFormat', 'Model']);
    const mm = Number(data?.FocalLengthIn35mmFormat);
    return mm >= 14 && mm <= 120 ? { mm, model: data.Model || 'Kamera' } : null;
  } catch { return null; }
}

export function photoCanvas(image, max = 1200) {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function detectPaper(image, coolPass = false, focal35 = null) {
  const cv = await loadOpenCV();
  const canvas = photoCanvas(image, 1200), src = cv.imread(canvas);
  const rgb = new cv.Mat(), hsv = new cv.Mat(), mask = new cv.Mat();
  const contours = new cv.MatVector(), hierarchy = new cv.Mat();
  let low, high;
  try {
    cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
    cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
    low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 0, 145, 0]);
    high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [180, 45, 255, 255]);
    cv.inRange(hsv, low, high, mask);
    // A second neutral/cool pass separates paper from pale timber when the
    // broader warm-light mask connects both surfaces.
    if(coolPass)for(let i=0;i<mask.data.length;i++){
      if(rgb.data[i*3]>rgb.data[i*3+2]+3)mask.data[i]=0;
    }
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let best = null;
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i), quad = new cv.Mat();
      try {
        const area = cv.contourArea(contour) / (canvas.width * canvas.height);
        if (area < .0004 || area > .15) continue;
        cv.approxPolyDP(contour, quad, .025 * cv.arcLength(contour, true), true);
        if (quad.rows !== 4 || !cv.isContourConvex(quad)) continue;
        let points = Array.from({length:4}, (_,j)=>[quad.data32S[j*2]/canvas.width,quad.data32S[j*2+1]/canvas.height]);
        const cy=points.reduce((s,p)=>s+p[1],0)/4;
        if (points.some(p=>p[0]<.005||p[0]>.995||p[1]<.005||p[1]>.995)) continue;
        const cx=points.reduce((s,p)=>s+p[0],0)/4;
        points.sort((a,b)=>Math.atan2(a[1]-cy,a[0]-cx)-Math.atan2(b[1]-cy,b[0]-cx));
        const start=points.reduce((best,p,j)=>p[0]+p[1]<points[best][0]+points[best][1]?j:best,0);
        points=[...points.slice(start),...points.slice(0,start)];
        const variants=[points,[...points.slice(1),points[0]]];
        const error=Math.min(...variants.map(q=>{try{return cameraAxes(plane(q,29.7,21).coeffs,canvas.width/canvas.height,focal35).error;}catch{return Infinity;}}));
        if(error>.3)continue;
        const score=area*(.5+cy)/(1+error*5);
        if(!best||score>best.score)best={points,score};
      } finally { contour.delete();quad.delete(); }
    }
    return best?.points || (coolPass ? null : detectPaper(image,true,focal35));
  } finally { [src,rgb,hsv,mask,contours,hierarchy,low,high].forEach(m=>m?.delete()); }
}

// A white reference gives the photographed illuminant, not the wood reflectance.
export function samplePaper(image, points) {
  const canvas=photoCanvas(image),ctx=canvas.getContext('2d');
  const cx=points.reduce((s,p)=>s+p[0],0)/4,cy=points.reduce((s,p)=>s+p[1],0)/4;
  const samples=[];
  // Sample several inset patches, so a printed word at the centre is not
  // mistaken for the paper's white point. Discard ink and clipped highlights.
  for(const p of [...points,[cx,cy]]){
    const x=Math.round((p[0]*.65+cx*.35)*canvas.width),y=Math.round((p[1]*.65+cy*.35)*canvas.height);
    const patch=ctx.getImageData(Math.max(0,Math.min(canvas.width-10,x-5)),Math.max(0,Math.min(canvas.height-10,y-5)),10,10).data;
    for(let i=0;i<patch.length;i+=4){const rgb=Array.from(patch.slice(i,i+3)),lo=Math.min(...rgb),hi=Math.max(...rgb);if(lo<110||hi>248||(hi-lo)/hi>.22)continue;samples.push(rgb);}
  }
  if(samples.length<30)return null;
  samples.sort((a,b)=>a.reduce((s,v)=>s+v,0)-b.reduce((s,v)=>s+v,0));
  const whites=samples.slice(Math.floor(samples.length*.5));
  return [0,1,2].map(j=>whites.reduce((s,rgb)=>s+rgb[j],0)/whites.length/255);
}
