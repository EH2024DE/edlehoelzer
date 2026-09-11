import { t, english, translateDOM } from './i18n.js';
export function createReferenceEditor({image,onSave}){
 const dialog=document.createElement('dialog');dialog.className='reference-editor';
 dialog.innerHTML=`<div class="editor-head"><h2>Blattecken präzisieren</h2><button type="button" class="editor-close" aria-label="Schließen">×</button></div><p class="editor-help" role="status">Tippe auf das Blatt, um es zu vergrößern.</p><canvas class="editor-canvas" aria-label="Vergrößerte Referenzfläche"></canvas><div class="editor-corners" role="group" aria-label="Ecke auswählen">${[1,2,3,4].map(i=>`<button type="button" data-corner="${i-1}">Ecke ${i}</button>`).join('')}</div><label class="editor-zoom">Vergrößerung <input type="range" min="1" max="14" step=".25" value="1" aria-label="Referenz vergrößern"></label><div class="editor-foot"><span>Tippen setzt die Ecke. Ziehen verschiebt den Ausschnitt.</span><button type="button" class="editor-save primary">Ecken übernehmen</button></div>`;
 document.body.append(dialog);translateDOM(dialog);
 dialog.querySelector('.editor-save').textContent=english?'Confirm corners':'Ecken bestätigen';
 dialog.querySelector('.editor-close').title=english?'Close without confirming':'Ohne Bestätigung schließen';
 if(english)dialog.querySelectorAll('[data-corner]').forEach((button,i)=>button.textContent=`Corner ${i+1}`);
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();dialog.close();}});
 const canvas=dialog.querySelector('canvas'),ctx=canvas.getContext('2d'),zoom=dialog.querySelector('input'),help=dialog.querySelector('.editor-help');
 let pts=[],active=0,focus=[.5,.5],scale=1,offset=[0,0],pointer=null,dirty=false,returnFocus=null;
 canvas.tabIndex=0;
 canvas.style.touchAction='none';
 const touches=new Map();
 let pinch=null,multiTouch=false;
 function startPinch(){
  const [a,b]=[...touches.values()];
  const x=(a.clientX+b.clientX)/2,y=(a.clientY+b.clientY)/2;
  pinch={distance:Math.max(1,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),zoom:Number(zoom.value),anchor:point({clientX:x,clientY:y})};
  multiTouch=true;pointer=null;
 }
 canvas.addEventListener('pointerdown',e=>{
  touches.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY});
  if(touches.size>=2){if(touches.size===2)startPinch();canvas.setPointerCapture(e.pointerId);e.preventDefault();e.stopImmediatePropagation();}
 },true);
 canvas.addEventListener('pointermove',e=>{
  if(!touches.has(e.pointerId))return;
  touches.set(e.pointerId,{clientX:e.clientX,clientY:e.clientY});
  if(!multiTouch)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(touches.size!==2||!pinch)return;
  const [a,b]=[...touches.values()],r=canvas.getBoundingClientRect();
  zoom.value=Math.max(1,Math.min(14,pinch.zoom*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/pinch.distance));
  const nextScale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight)*Number(zoom.value);
  focus=[pinch.anchor[0]-((a.clientX+b.clientX)/2-r.left-r.width/2)/(image.naturalWidth*nextScale),pinch.anchor[1]-((a.clientY+b.clientY)/2-r.top-r.height/2)/(image.naturalHeight*nextScale)];
  layout();
 },true);
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>{
  touches.delete(e.pointerId);
  if(!multiTouch)return;
  // Lifting a pinch finger must never place or move a reference corner.
  e.stopImmediatePropagation();pointer=null;pinch=null;
  if(touches.size===0)multiTouch=false;
 },true);
 canvas.addEventListener('keydown',e=>{const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!delta)return;e.preventDefault();const step=e.shiftKey?10:1;setPoint([pts[active][0]+delta[0]*step/image.naturalWidth,pts[active][1]+delta[1]*step/image.naturalHeight]);});
 function layout(){const r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*devicePixelRatio);canvas.height=Math.round(r.height*devicePixelRatio);ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);scale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight)*Number(zoom.value);offset=[r.width/2-focus[0]*image.naturalWidth*scale,r.height/2-focus[1]*image.naturalHeight*scale];draw();}
 function draw(){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='#e5e1dc';ctx.fillRect(0,0,r.width,r.height);ctx.drawImage(image,offset[0],offset[1],image.naturalWidth*scale,image.naturalHeight*scale);ctx.beginPath();pts.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](p[0]*image.naturalWidth*scale+offset[0],p[1]*image.naturalHeight*scale+offset[1]));ctx.closePath();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();pts.forEach((p,i)=>{const x=p[0]*image.naturalWidth*scale+offset[0],y=p[1]*image.naturalHeight*scale+offset[1];ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fillStyle=i===active?'#a4774c':'#333';ctx.fill();ctx.stroke();ctx.fillStyle='white';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1),x,y+4);});dialog.querySelectorAll('[data-corner]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.corner===active)));}
 function point(e){const r=canvas.getBoundingClientRect();return [(e.clientX-r.left-offset[0])/(image.naturalWidth*scale),(e.clientY-r.top-offset[1])/(image.naturalHeight*scale)];}
 function setPoint(p){pts[active]=p.map(v=>Math.max(.001,Math.min(.999,v)));dirty=true;dialog.querySelector('.editor-save').disabled=false;draw();}
 canvas.addEventListener('pointerdown',e=>{const p=point(e);const hit=pts.findIndex(q=>Math.hypot((q[0]-p[0])*image.naturalWidth*scale,(q[1]-p[1])*image.naturalHeight*scale)<22);if(hit>=0)active=hit;pointer={x:e.clientX,y:e.clientY,focus:[...focus],hit,moved:false,offset:hit>=0?[pts[hit][0]-p[0],pts[hit][1]-p[1]]:null};canvas.setPointerCapture(e.pointerId);e.preventDefault();draw();});
 canvas.addEventListener('pointermove',e=>{if(!pointer)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(dx,dy)>4)pointer.moved=true;if(!pointer.moved)return;if(pointer.hit>=0){const p=point(e);setPoint([p[0]+pointer.offset[0],p[1]+pointer.offset[1]]);}else{focus=[pointer.focus[0]-dx/(image.naturalWidth*scale),pointer.focus[1]-dy/(image.naturalHeight*scale)];layout();}e.preventDefault();});
 canvas.addEventListener('pointerup',e=>{if(!pointer)return;if(!pointer.moved){if(Number(zoom.value)===1){focus=point(e);zoom.value=5;help.textContent='Wähle eine Ecke und tippe auf ihre genaue Position. Der Ausschnitt lässt sich verschieben.';layout();}else{setPoint(point(e));active=(active+1)%4;draw();}}pointer=null;});
 for(const name of ['pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>pointer=null);
 const resizeLayout=layout;
 layout=function(){translateDOM(dialog);resizeLayout();};
 zoom.oninput=layout;
 dialog.querySelectorAll('[data-corner]').forEach(b=>b.onclick=()=>{active=+b.dataset.corner;draw();});
 dialog.querySelector('.editor-close').onclick=()=>dialog.close();
 dialog.querySelector('.editor-save').onclick=()=>{if(!dialog.querySelector('.editor-save').disabled){onSave(pts.map(p=>[...p]));dialog.close();}};
 dialog.addEventListener('close',()=>{touches.clear();pinch=null;multiTouch=false;pointer=null;document.body.classList.remove('reference-open');returnFocus?.focus();});
 new ResizeObserver(()=>{if(dialog.open)layout();}).observe(canvas);
 return {open(points,hasProposal){pts=points.map(p=>[...p]);active=0;dirty=false;dialog.querySelector('.editor-save').disabled=!hasProposal;returnFocus=document.activeElement;focus=hasProposal?[pts.reduce((s,p)=>s+p[0],0)/4,pts.reduce((s,p)=>s+p[1],0)/4]:[.5,.5];const span=Math.max(...pts.map(p=>p[0]))-Math.min(...pts.map(p=>p[0]));zoom.value=hasProposal?Math.min(10,Math.max(2,.65/span)):1;help.textContent=hasProposal?'Ecke wählen und genau setzen. Ziehen verschiebt den Ausschnitt.':'Tippe auf das Blatt, um es zu vergrößern.';document.body.classList.add('reference-open');dialog.showModal();layout();}};
}
