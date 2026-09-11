import * as THREE from "three";
import { loadPhoto, savePhoto } from './photo-cache.js';
import { t, english, translateDOM } from './i18n.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { handledGeometry, servingGeometry } from './model-shapes.js';
import PerspT from "./perspective.js";
import { createIcons, Camera, ImagePlus, RotateCcw, Download, Maximize, Minimize, SlidersHorizontal } from "lucide";
import { plane, cameraAxes } from "./geometry.js";
import { cameraMetadata, detectPaper, samplePaper } from './photo-analysis.js';
import { createReferenceEditor } from './reference-editor.js';
import additionalModels from './additional-models.js';
import eligibility from './preview-eligibility.json';
createIcons({ icons: { Camera, ImagePlus, RotateCcw, Download, Maximize, Minimize, SlidersHorizontal } });
const $ = (id) => document.getElementById(id),
  stage = $("stage");
const assetPath = path => `${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`;
const journey=document.createElement('div');
journey.className='preview-journey';
journey.innerHTML='<ol></ol><h2 aria-live="polite"></h2>';
const stepNames=english?['Photo','Reference','Check','Preview']:['Foto','Referenz','Prüfen','Vorschau'];
journey.querySelector('ol').replaceChildren(...stepNames.map(name=>{const item=document.createElement('li');item.textContent=name;return item;}));
document.querySelector('.workspace').prepend(journey);
journey.append($('photoSources'));
// Android photo pickers do not consistently offer a camera alongside the gallery.
const touchInput=window.matchMedia('(any-pointer: coarse)');
function updateCameraOption(){
  $('takePhoto').hidden=!(touchInput.matches||/Android|iPhone|iPad/i.test(navigator.userAgent));
}
updateCameraOption();
touchInput.addEventListener('change',updateCameraOption);
$('takePhoto').onclick=()=>$('cameraFile').click();
const photoTips=document.createElement('div');
photoTips.className='photo-preparation';
photoTips.innerHTML=english?`<p><strong>Before you take your photo</strong></p><ul><li>Lay a flat A4 sheet (29.7 × 21 cm) where the board will go. Keep all four corners visible and its long edge parallel to the front of the worktop.</li><li>Photograph from slightly above and to one side, using the normal 1× camera. Include some of the kitchen, but keep the paper clearly visible.</li><li>Use even light without strong glare. White paper is best; printed paper with a clear white border usually works too.</li></ul><details><summary>See an example photo</summary><figure><img alt="Kitchen photographed diagonally from above, with an A4 sheet lying flat on the worktop" width="2880" height="3840"><figcaption>All four paper corners are visible, with enough of the surrounding worktop to judge the space.</figcaption></figure></details>`:`<p><strong>Bevor du dein Foto aufnimmst</strong></p><ul><li>Lege ein A4-Blatt (29,7 × 21 cm) flach an die Stelle, an der dein Brett liegen soll. Alle vier Ecken bleiben sichtbar, die lange Blattkante liegt parallel zur vorderen Tresenkante.</li><li>Fotografiere leicht schräg von oben und seitlich mit der normalen 1×-Kamera. Zeige etwas von deiner Küche, aber lass das Blatt gut erkennbar im Bild.</li><li>Achte auf gleichmäßiges Licht ohne starke Spiegelungen. Weißes Papier ist ideal; ein bedrucktes Blatt mit freiem weißen Rand funktioniert meist ebenfalls.</li></ul><details><summary>Beispielfoto ansehen</summary><figure><img alt="Küche schräg von oben fotografiert, mit einem flach auf dem Tresen liegenden A4-Blatt" width="2880" height="3840"><figcaption>Alle vier Blattecken sind sichtbar. Der umliegende Tresen vermittelt ein Gefühl für den verfügbaren Platz.</figcaption></figure></details>`;
const tipsDialog=document.createElement('dialog');
tipsDialog.className='photo-tips-dialog';
tipsDialog.setAttribute('aria-label',english?'Photo tips':'Fotohinweise');
const tipsClose=document.createElement('button');
tipsClose.type='button';tipsClose.className='primary';
tipsClose.textContent=english?'Got it':'Alles klar';
tipsDialog.append(photoTips,tipsClose);document.body.append(tipsDialog);
const tipsHelp=document.createElement('button');
tipsHelp.type='button';tipsHelp.className='photo-tips-help';
tipsHelp.textContent=english?'Photo tips':'Fotohinweise';
journey.append(tipsHelp);
const tipsKey='edle-kitchen-photo-tips-seen';
function rememberTips(){try{localStorage.setItem(tipsKey,'1');}catch{}try{window.parent.__edlePhotoTipsSeen=true;}catch{}}
function closeTips(){rememberTips();tipsDialog.close();}
tipsClose.onclick=closeTips;
tipsDialog.addEventListener('cancel',event=>{event.preventDefault();closeTips();});
tipsDialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeTips();}});
tipsDialog.addEventListener('close',()=>tipsHelp.focus());
tipsHelp.onclick=()=>tipsDialog.showModal();
let tipsSeen=false;
try{tipsSeen=localStorage.getItem(tipsKey)==='1';}catch{}
try{tipsSeen=tipsSeen||window.parent.__edlePhotoTipsSeen===true;}catch{}
if(!tipsSeen)requestAnimationFrame(()=>{if(!new URLSearchParams(location.search).has('listing')||Object.values(catalog).some(model=>model.listingId===new URLSearchParams(location.search).get('listing')))tipsDialog.showModal();});
const exampleDetails=photoTips.querySelector('details');
const exampleKey='edle-kitchen-example-collapsed-until';
function exampleCollapsed(){
  let until=0;
  try{until=Number(localStorage.getItem(exampleKey))||0;}catch{}
  try{until=Math.max(until,Number(window.parent.__edleExampleCollapsedUntil)||0);}catch{}
  return until>Date.now();
}
function loadExample(){const image=photoTips.querySelector('img');if(!image.hasAttribute('src'))image.src=assetPath('assets/worktop-example.jpg');}
exampleDetails.open=!exampleCollapsed();
if(exampleDetails.open)loadExample();
let exampleWasOpen=exampleDetails.open;
exampleDetails.addEventListener('toggle',()=>{
  if(exampleDetails.open)loadExample();
  if(exampleWasOpen&&!exampleDetails.open){
    const until=Date.now()+24*60*60*1000;
    try{localStorage.setItem(exampleKey,String(until));}catch{}
    try{window.parent.__edleExampleCollapsedUntil=until;}catch{}
  }
  exampleWasOpen=exampleDetails.open;
});
stage.insertAdjacentElement('afterend',$('calibration'));
const viewDock=document.createElement('div');
viewDock.className='view-dock';
stage.after(viewDock);
for(const el of [$('calibration'),document.querySelector('.live-controls'),$('status'),document.querySelector('.bottom'),$('purchase')])viewDock.append(el);
const catalog = {
  ...additionalModels,
  walnut: {
    listingId: '4297472161',
    name: "Nussbaum & Eiche",
    w: 36.5,
    d: 48,
    h: 4.2,
    quad: [0.307, 0.141, 0.713, 0.185, 0.712, 0.699, 0.309, 0.758],
    side: "#a78753",
  },
  oak: {
    listingId: '4455205567',
    name: "Eiche Stirnholz",
    w: 39.8,
    d: 41.5,
    h: 5,
    quad: [0.213, 0.245, 0.795, 0.266, 0.795, 0.662, 0.218, 0.695],
    side: "#98703e",
  },
};
let cameraInfo=null, paperWhite=null;
for(const key of Object.keys(catalog)){
  if(!eligibility.listingIds.includes(catalog[key].listingId))delete catalog[key];
}
let referenceProposed=false;
const rawTextures={};

function correctColor(source){
  const out=document.createElement('canvas');out.width=source.width;out.height=source.height;
  const ctx=out.getContext('2d');ctx.drawImage(source,0,0);
  const pixels=ctx.getImageData(0,0,out.width,out.height),amount=Number($('color').value)/100;
  // Conservative adaptation of already processed warm JPEGs, not RAW recovery.
  const neutral=[.79,1.02,1.42];
  const mean=paperWhite?paperWhite.reduce((s,v)=>s+v,0)/3:1;
  const target=paperWhite?paperWhite.map(v=>Math.max(.85,Math.min(1.15,v/mean))):[1,1,1];
  for(let i=0;i<pixels.data.length;i+=4){
    const rgb=[0,1,2].map(j=>pixels.data[i+j]*((1-amount)+amount*neutral[j])*target[j]);
    const l=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
    for(let j=0;j<3;j++)pixels.data[i+j]=Math.max(0,Math.min(255,l+(rgb[j]-l)*(1-.18*amount)));
  }
  ctx.putImageData(pixels,0,0);return out;
}
function refreshColor(){
  for(const [key,tex] of Object.entries(textures)){tex.image=correctColor(rawTextures[key]);tex.needsUpdate=true;}
  const body=board.children[0];
  if(body?.userData.sideTexture && textures[selected]){body.material.map.image=textures[selected].image;body.material.map.needsUpdate=true;}
}
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
$("renderer").append(renderer.domElement);
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000),
  photoCamera = new THREE.Camera();
camera.position.set(65, 65, 85);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
controls.enableDamping = true;
controls.minDistance = 45;
controls.maxDistance = 220;
controls.maxPolarAngle = Math.PI * 0.49;
scene.add(new THREE.HemisphereLight(0xffffff, 0x7d847e, 2.3));
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(-30, 80, 60);
scene.add(light);
const board = new THREE.Group();
scene.add(board);
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(260, 260),
  new THREE.MeshStandardMaterial({ color: "#d9dfda", roughness: 1 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.15;
scene.add(floor);
const shadowCanvas = document.createElement("canvas");
shadowCanvas.width = shadowCanvas.height = 128;
const sc = shadowCanvas.getContext("2d"),
  gradient = sc.createRadialGradient(64, 64, 10, 64, 64, 64);
gradient.addColorStop(0, "rgba(0,0,0,.35)");
gradient.addColorStop(1, "rgba(0,0,0,0)");
sc.fillStyle = gradient;
sc.fillRect(0, 0, 128, 128);
const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(shadowCanvas),
    transparent: true,
    depthWrite: false,
  }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.015;
scene.add(shadow);
let selected = "walnut",
  mode = "studio",
  photoURL = null,
  calibrating = false,
  homography = null,
  points = [
    [0.32, 0.38],
    [0.66, 0.38],
    [0.76, 0.68],
    [0.24, 0.68],
  ],
  center = [14.85, 10.5],
  drag = null,
  loadToken = 0;
const textures = {};
async function texture(key, model = catalog[key]) {
  if (textures[key]) return textures[key];
  const img = new Image();
  img.src = assetPath(model.image || `/assets/${key}.jpg`);
  await img.decode();
  const source = document.createElement("canvas");
  source.width = img.width;
  source.height = img.height;
  let ctx = source.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const src = ctx.getImageData(0, 0, img.width, img.height).data;
  const out = document.createElement("canvas");
  out.width = 640;
  out.height = Math.round((640 * model.d) / model.w);
  const oc = out.getContext("2d"),
    pixels = oc.createImageData(out.width, out.height),
    q = model.quad.map((v, i) => v * (i % 2 ? img.height : img.width));
  const t = PerspT(
    [0, 0, out.width, 0, out.width, out.height, 0, out.height],
    q,
  );
  for (let y = 0; y < out.height; y++)
    for (let x = 0; x < out.width; x++) {
      const [sx, sy] = t.transform(x, y),
        a =
          (Math.min(img.height - 1, Math.max(0, Math.round(sy))) * img.width +
            Math.min(img.width - 1, Math.max(0, Math.round(sx)))) *
          4,
        b = (y * out.width + x) * 4;
      pixels.data.set(src.subarray(a, a + 4), b);
    }
  oc.putImageData(pixels, 0, 0);
  rawTextures[key]=out;
  const tex = new THREE.CanvasTexture(correctColor(out));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  textures[key] = tex;
  return tex;
}
async function select(key) {
  const token = ++loadToken;
  $("status").textContent = t("Holzansicht wird vorbereitet …");
  const p = catalog[key];
  const maps = p.standing ? await Promise.all(p.parts.map((part,i)=>texture(`${key}-${i}`,{...part,d:part.h,image:p.image}))) : [await texture(key)];
  const map = maps[0];
  if (token !== loadToken) return;
  selected = key;
  $('modelChoice').value=key;
  while (board.children.length) {
    const child = board.children[0];
    child.geometry.dispose();
    if (child.userData.sideTexture) child.material.map.dispose();
    child.material.dispose();
    board.remove(child);
  }
  if(p.standing){
    p.parts.forEach((part,i)=>{
      const mesh=new THREE.Mesh(servingGeometry(part.w,part.h,[.67,.60,.54][i]),new THREE.MeshBasicMaterial({map:maps[i],side:THREE.DoubleSide}));
      mesh.position.x=part.x;
      board.add(mesh);
    });
  } else if(p.handles){
    board.add(new THREE.Mesh(handledGeometry(p.w,p.d,p.h),new THREE.MeshBasicMaterial({map})));
  } else {
  const sideMap = map.clone();
  sideMap.repeat.set(1, 0.035);
  sideMap.offset.set(0, 0.015);
  sideMap.needsUpdate = true;
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(p.w, p.h, p.d, 3, 0.3),
    new THREE.MeshStandardMaterial({ map: sideMap, color: '#c9c2b6', roughness: 1 }),
  );
  body.userData.sideTexture = true;
  body.position.y = p.h / 2;
  board.add(body);
  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(p.w - 0.55, p.d - 0.55),
    new THREE.MeshBasicMaterial({ map }),
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = p.h + 0.015;
  board.add(top);
  }
  shadow.scale.set(p.w * 1.22, p.d * 1.22, 1);
  document
    .querySelectorAll(".product")
    .forEach((b) => b.classList.toggle("selected", b.dataset.product === key));
  $("size").textContent = `${p.name} · ${p.dimensionLabel || `${p.approximateDimensions ? (english?'approx. ':'ca. ') : ''}${p.w} × ${p.d} cm · ${p.h} cm ${english?'thick':'Stärke'}`}`;
  const purchaseUrl=new URL(`https://www.etsy.com/listing/${p.listingId}`);
  purchaseUrl.search=new URLSearchParams({utm_source:'edlehoelzer.de',utm_medium:'referral',utm_campaign:'kitchen_preview',utm_content:`buy_${p.listingId}_${entryPoint}`}).toString();
  $('purchase').href=purchaseUrl.href;
  $('purchase').hidden=mode!=='room'||calibrating||!homography;
  $('purchase').setAttribute('aria-label',english?`Buy ${p.name} in the shop (new tab)`:`${p.name} im Shop kaufen (neuer Tab)`);
  position();
  status();
}
function status(message) {
  updateJourney();
  $("status").textContent =
    t(message ||
    (mode === "studio"
      ? "Ziehen zum Betrachten · Scrollen zum Zoomen. Seitenholz und Details sind angenähert."
      : calibrating
        ? "Die Punkte auf die vier Referenzecken ziehen."
        : "Brett auf der Arbeitsplatte verschieben. Höhenwirkung geschätzt; keine exakte Vermessung."));
}
function updateJourney(){
  const busy=$('detect').disabled;
  const ready=mode==='room'&&!calibrating&&!!homography;
  const step=!photoURL?0:!referenceProposed?1:!ready?2:3;
  journey.querySelectorAll('li').forEach((item,index)=>{
    if(index===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
    item.classList.toggle('complete',index<step);
  });
  const headings=english?['1. Choose your worktop photo','2. Find the A4 paper','3. Check the four corners','4. Your board on your worktop']:['1. Dein Tresenfoto auswählen','2. A4-Blatt finden','3. Die vier Ecken prüfen','4. Dein Brett auf deinem Tresen'];
  journey.querySelector('h2').textContent=headings[step];
  document.querySelector('.upload').classList.toggle('secondary',!!photoURL);
  document.querySelector('.upload').lastChild.textContent=english?(photoURL?' Choose another photo':' Choose worktop photo'):(photoURL?' Anderes Foto auswählen':' Tresenfoto auswählen');
  $('file').disabled=busy;
  $('apply').hidden=!referenceProposed||!calibrating||mode!=='room';
  $('apply').disabled=busy||!referenceProposed;
  $('editReference').disabled=busy;
  $('detect').classList.toggle('primary',!referenceProposed);
  $('detect').textContent=english?(referenceProposed?'Find again':'Find A4 paper'):(referenceProposed?'Erneut suchen':'A4-Blatt finden');
  $('editReference').textContent=english?'Adjust corners':'Ecken feinjustieren';
  $('apply').textContent=english?'Corners correct · Place board':'Ecken stimmen · Brett platzieren';
  $('purchase').hidden=!ready;
  $('download').hidden=!ready;
}
function position() {
  board.position.set(
    mode === "room" ? center[0] : 0,
    0,
    mode === "room" ? center[1] : 0,
  );
  const baseAngle = catalog[selected].d > catalog[selected].w ? 90 : 0;
  board.rotation.y = (-(baseAngle + Number($("angle").value)) * Math.PI) / 180;
  shadow.position.x = board.position.x;
  shadow.position.z = board.position.z;
  shadow.rotation.z = -board.rotation.y;
}
function resize() {
  const r = stage.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return;
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
  drawMarkers();
  if (homography) projectCamera();
}
function fitStage(){
  const box=document.querySelector('.workspace'),cs=getComputedStyle(box);
  const width=Math.max(100,box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight));
  const ratio=mode==='room'&&$('photo').naturalWidth?$('photo').naturalWidth/$('photo').naturalHeight:1.15;
  const vh=window.visualViewport?.height||innerHeight;
  const full=box.classList.contains('expanded');
  const used=[...box.children].filter(el=>el!==stage&&getComputedStyle(el).display!=='none').reduce((sum,el)=>{const s=getComputedStyle(el);return sum+el.getBoundingClientRect().height+parseFloat(s.marginTop||0)+parseFloat(s.marginBottom||0);},0);
  const padding=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
  const top=full?box.querySelector('.toolbar').getBoundingClientRect().bottom-box.getBoundingClientRect().top+12:0;
  const bottom=full&&!box.classList.contains('controls-hidden')?Math.max(0,vh-viewDock.getBoundingClientRect().top)+12:12;
  const limit=full?Math.max(40,vh-top-bottom):Math.min(620,vh*(innerWidth<800?.42:.65));
  if(full)stage.style.top=`${top+limit/2}px`;else stage.style.removeProperty('top');
  const h=Math.min(limit,width/ratio);
  stage.style.width=`${h*ratio}px`;stage.style.height=`${h}px`;
}
window.addEventListener('resize',()=>{fitStage();resize();});
window.visualViewport?.addEventListener('resize',()=>{fitStage();resize();});
new ResizeObserver(resize).observe(stage);
function projectCamera() {
  const aspect = stage.clientWidth / stage.clientHeight;
  const axes=cameraAxes(homography.coeffs,aspect,cameraInfo?.mm);
  const [a,b,t,vertical]=['a','b','t','vertical'].map(key=>new THREE.Vector3(...axes[key]));
  $('cameraNote').textContent=`${cameraInfo?`${cameraInfo.model} · ${cameraInfo.mm} mm ${english?'from photo metadata':'aus Fotodaten'}`:(english?'No camera metadata · estimated focal length':'Ohne Kameradaten · Brennweite geschätzt')}${axes.error>.18?(english?' · Check reference corners or A4 orientation':' · Referenzecken oder A4-Ausrichtung prüfen'):''}`;
  photoCamera.projectionMatrix.set(
    a.x / aspect,
    vertical.x / aspect,
    b.x / aspect,
    t.x / aspect,
    a.y,
    vertical.y,
    b.y,
    t.y,
    a.z,
    vertical.z,
    b.z,
    t.z - 0.01,
    a.z,
    vertical.z,
    b.z,
    t.z,
  );
  photoCamera.projectionMatrixInverse
    .copy(photoCamera.projectionMatrix)
    .invert();
}
function setMode(next) {
  stage.style.maxHeight = next === 'room' ? 'none' : '72vh';
  mode = next;
  controls.enabled = next === "studio";
  floor.visible = next === "studio";
  $("photo").hidden = next !== "room";
  $("calibration").hidden = next !== "room";
  $("studio").setAttribute("aria-pressed", next === "studio");
  $("room").setAttribute("aria-pressed", next === "room");
  stage.style.aspectRatio =
    next === "room"
      ? `${$("photo").naturalWidth}/${$("photo").naturalHeight}`
      : "1.15";
  stage.style.setProperty('--stage-ratio',next==='room'?$('photo').naturalWidth/$('photo').naturalHeight:1.15);
  $("sceneTag").textContent = t(
    next === "room"
      ? "Dein Foto · Perspektivische Annäherung"
      : "Freie 3D-Ansicht");
  board.visible = next === "studio" || (!!homography && !calibrating);
  shadow.visible = board.visible;
  position();
  $('editReference').hidden=!calibrating;
  $('referenceDetails').hidden=!calibrating;
  document.querySelector('.live-controls').hidden=next==='room'&&calibrating;
  fitStage();
  resize();
  status();
}
function drawMarkers() {
  const w = stage.clientWidth,
    h = stage.clientHeight;
  $("markers").setAttribute("viewBox", `0 0 ${w} ${h}`);
  $("markers").innerHTML =
    mode === "room" && calibrating
      ? `<polygon points="${points.map((p) => `${p[0] * w},${p[1] * h}`).join(" ")}" fill="#2c795333" stroke="#fff" stroke-width="2"/>` +
        points
          .map(
            (p, i) =>
              `<g><circle data-point="${i}" cx="${p[0] * w}" cy="${p[1] * h}" r="18"/><text x="${p[0] * w}" y="${p[1] * h + 5}">${i + 1}</text></g>`,
          )
          .join("")
      : "";
}
let currentPhoto=null;
function rememberPhoto(){if(currentPhoto)savePhoto({file:currentPhoto,points:points.map(p=>[...p]),w:$('refW').value,d:$('refD').value,confirmed:!!homography&&!calibrating,proposed:referenceProposed,white:$('whiteReference').checked});}
const forgetPhoto=document.createElement('button');forgetPhoto.type='button';forgetPhoto.className='photo-tips-help';forgetPhoto.hidden=true;
forgetPhoto.textContent=english?'Remove saved photo':'Gespeichertes Foto entfernen';journey.append(forgetPhoto);
forgetPhoto.onclick=async()=>{await savePhoto(null);currentPhoto=null;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;$('photo').removeAttribute('src');homography=null;referenceProposed=false;calibrating=true;paperWhite=null;$('room').disabled=true;forgetPhoto.hidden=true;refreshColor();setMode('studio');};
const cacheNote=document.createElement('p');cacheNote.className='note';cacheNote.textContent=english?'Your photo stays only on your device and is not uploaded. It expires after one day; you can remove it at any time.':'Dein Foto bleibt nur auf deinem Gerät und wird nicht hochgeladen. Nach einem Tag verfällt die Speicherung automatisch; du kannst es jederzeit entfernen.';journey.append(cacheNote);
async function usePhoto(file,saved){
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    status(
      "Bitte ein JPEG-, PNG- oder WebP-Foto wählen. HEIC vorher als JPEG exportieren.",
    );
    return;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = url;
    $("photo").src = url;
    await $("photo").decode();
    cameraInfo=await cameraMetadata(file);
    paperWhite=null;
    refreshColor();
    $('cameraNote').textContent=cameraInfo?`${cameraInfo.model} · ${cameraInfo.mm} mm ${english?'from photo metadata':'aus Fotodaten'}`:(english?'No camera metadata · estimated height':'Keine Kameradaten · Höhenwirkung nur geschätzt');
    homography = null;
    referenceProposed=false;
    calibrating = true;
    points = [
      [0.32, 0.38],
      [0.66, 0.38],
      [0.76, 0.68],
      [0.24, 0.68],
    ];
    $("room").disabled = false;
    $("apply").hidden = false;
    $('apply').disabled=true;
    $("recalibrate").hidden = true;
    $('refW').disabled=$('refD').disabled=false;
    $('detect').hidden=false;
    $('swap').hidden=false;
    setMode("room");
    currentPhoto=file;forgetPhoto.hidden=false;
    if(saved){points=saved.points;$('refW').value=saved.w;$('refD').value=saved.d;$('whiteReference').checked=saved.white;referenceProposed=saved.proposed;setMode('room');if(saved.confirmed)$('apply').click();}
    rememberPhoto();
  } catch {
    URL.revokeObjectURL(url);
    status("Das Foto konnte nicht geöffnet werden. Bitte als JPEG versuchen.");
  }
}
const handlePhotoSelection = async (e) => {
  await usePhoto(e.target.files[0]);
  e.target.value='';
};
$("file").onchange=handlePhotoSelection;
$("cameraFile").onchange=handlePhotoSelection;
$("apply").onclick = () => {
  try {
    const w = +$("refW").value,
      d = +$("refD").value;
    homography = plane(points, w, d);
    let assessment=cameraAxes(homography.coeffs,$('photo').naturalWidth/$('photo').naturalHeight,cameraInfo?.mm);
    if(assessment.error>.35){
      const rotated=[...points.slice(1),points[0]],candidate=plane(rotated,w,d),q=cameraAxes(candidate.coeffs,$('photo').naturalWidth/$('photo').naturalHeight,cameraInfo?.mm);
      if(q.error<assessment.error){points=rotated;homography=candidate;assessment=q;}
    }
    if(assessment.error>.35){homography=null;throw Error('Die Referenz passt noch nicht zu einem Rechteck. Bitte Ecken und lange / kurze Blattkante prüfen.');}
    if($('whiteReference').checked)paperWhite=samplePaper($('photo'),points);
    else paperWhite=null;
    refreshColor();
    center = [w / 2, d / 2];
    calibrating = false;
    $('detectStatus').hidden=true;
    $("apply").hidden = true;
    $("recalibrate").hidden = false;
    $("refW").disabled = $("refD").disabled = true;
    $('detect').hidden=$('swap').hidden=true;
    setMode("room");
    status('Referenz übernommen. Du kannst das Brett jetzt auf dem Tresen verschieben.');
    rememberPhoto();
    if(!document.querySelector('.workspace').classList.contains('expanded'))document.querySelector('.workspace').scrollIntoView({block:'start',behavior:'smooth'});
  } catch (e) {
    homography=null;
    calibrating=true;
    setMode('room');
    status(e.message);
    $('detectStatus').hidden=false;$('detectStatus').textContent=t(e.message);
  }
  fitStage();resize();
};
$("recalibrate").onclick = () => {
  $('detect').hidden=$('swap').hidden=false;
  $("refW").disabled = $("refD").disabled = false;
  calibrating = true;
  $("apply").hidden = false;
  $("recalibrate").hidden = true;
  setMode("room");
};
$("studio").onclick = () => setMode("studio");
$("room").onclick = () => setMode("room");
document
  .querySelectorAll(".product")
  .forEach((b) => (b.onclick = () => select(b.dataset.product)));
for(const [key,model] of Object.entries(catalog)){
  const option=document.createElement('option');option.value=key;option.textContent=model.name;
  $('modelChoice').append(option);
}
$('modelChoice').value='walnut';
$('modelChoice').onchange=()=>{
  const key=$('modelChoice').value,model=catalog[key];
  const existing=[...document.querySelectorAll('.product')].find(b=>b.dataset.product===key);
  if(!existing){
    const slot=document.querySelector('.product.selected')||document.querySelector('.product');
    slot.dataset.product=key;
    slot.querySelector('img').src=model.image||`/assets/${key}.jpg`;
    slot.querySelector('img').alt=model.name;
    const caption=slot.querySelector('span');caption.textContent=model.name;
    const small=document.createElement('small');small.textContent=`${model.w} × ${model.d} × ${model.h} cm`;caption.append(small);
  }
  select(key);
};
$("angle").oninput = () => {
  $("angleValue").value = `${$("angle").value}°`;
  position();
};
function coords(e) {
  const r = stage.getBoundingClientRect();
  return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
}
stage.addEventListener("pointerdown", (e) => {
  if (mode !== "room") return;
  const index = e.target.dataset.point;
  if (calibrating && index !== undefined) drag = { index: +index };
  else if (!calibrating && homography) {
    const p = homography.transformInverse(...coords(e));
    drag = { offset: [center[0] - p[0], center[1] - p[1]] };
  }
  if (drag) {
    stage.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
});
stage.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = coords(e);
  if (drag.index !== undefined) {
    referenceProposed=true;
    $('apply').disabled=false;
    updateJourney();
    points[drag.index] = p.map((v) => Math.max(0.01, Math.min(0.99, v)));
    drawMarkers();
  } else {
    const q = homography.transformInverse(...p);
    if (q.every(Number.isFinite)) {
      center = [q[0] + drag.offset[0], q[1] + drag.offset[1]];
      position();
    }
  }
});
for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
  stage.addEventListener(event, () => (drag = null));
$("reset").onclick = () => {
  $("angle").value = 0;
  $("angleValue").value = "0°";
  camera.position.set(65, 65, 85);
  controls.target.set(0, 2, 0);
  center = [+$("refW").value / 2, +$("refD").value / 2];
  position();
};
$("download").onclick = () => {
  if (calibrating) {
    status("Bitte zuerst die Referenzfläche bestätigen.");
    return;
  }
  renderer.render(scene, mode === "room" ? photoCamera : camera);
  const c = document.createElement("canvas");
  c.width = renderer.domElement.width;
  c.height = renderer.domElement.height;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#e9edea";
  ctx.fillRect(0, 0, c.width, c.height);
  if (mode === "room") ctx.drawImage($("photo"), 0, 0, c.width, c.height);
  ctx.drawImage(renderer.domElement, 0, 0);
  ctx.fillStyle = "#ffffffee";
  ctx.fillRect(0, c.height - 64, c.width, 64);
  ctx.fillStyle = "#26382e";
  ctx.font = "16px sans-serif";
  ctx.fillText(
    `${$("size").textContent} | ${english?'Approximate preview, not a measurement':'Annäherung, kein Aufmaß'}`,
    14,
    c.height - 24,
  );
  const a = document.createElement("a");
  a.download = "edle-hoelzer-raumprobe.png";
  a.href = c.toDataURL();
  a.click();
};
$('color').oninput=()=>{$('colorValue').value=`${$('color').value} %`;refreshColor();};
$('whiteReference').onchange=()=>{paperWhite=$('whiteReference').checked&&homography&&!calibrating?samplePaper($('photo'),points):null;refreshColor();};
$('swap').onclick=()=>{const w=$('refW').value;$('refW').value=$('refD').value;$('refD').value=w;};
$('detect').onclick=async()=>{
  $('detect').disabled=true;$('detect').setAttribute('aria-busy','true');$('detectStatus').hidden=false;$('detectStatus').textContent=t('Kleinen Augenblick – wir hobeln noch. Die Blattecken werden gesucht.');status('Die Blattecken werden gesucht …');
  await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,60)));
  try{const found=await detectPaper($('photo'),false,cameraInfo?.mm);if(found){
    const variants=[found,[...found.slice(1),found[0]]];
    const quality=q=>{try{return cameraAxes(plane(q,+$('refW').value,+$('refD').value).coeffs,$('photo').naturalWidth/$('photo').naturalHeight,cameraInfo?.mm).error;}catch{return Infinity;}};
    points=variants.sort((a,b)=>quality(a)-quality(b))[0];referenceProposed=true;
    $('apply').disabled=false;drawMarkers();status('Blattecken vorgeschlagen. Bitte alle vier Ecken und die lange Kante kontrollieren, dann bestätigen.');
  }else status('Kein eindeutiges Blatt gefunden. Über „Ecken vergrößert setzen“ kannst du das Blatt heranholen.');}
  catch(e){console.warn(e);status('Automatische Erkennung nicht verfügbar. Die Ecken können manuell gesetzt werden.');}
  finally{$('detect').disabled=false;$('detect').removeAttribute('aria-busy');$('detectStatus').textContent=$('status').textContent;updateJourney();fitStage();resize();}
};
const referenceEditor=createReferenceEditor({image:$('photo'),onSave:next=>{points=next;referenceProposed=true;homography=null;calibrating=true;$('apply').hidden=false;$('apply').disabled=false;$('recalibrate').hidden=true;$('refW').disabled=$('refD').disabled=false;$('detect').hidden=$('swap').hidden=false;setMode('room');status('Ecken angepasst. Bitte Referenz bestätigen.');}});
$('editReference').onclick=()=>referenceEditor.open(points,referenceProposed);
const workspace=document.querySelector('.workspace');
$('referenceDetails').addEventListener('toggle',()=>{fitStage();resize();});
let expanded=false,savedScroll=0;
const controlsHint=document.createElement('p');
controlsHint.className='controls-hint';controlsHint.hidden=true;controlsHint.setAttribute('role','status');
controlsHint.textContent=english?'Use this button for rotation and warmer or more neutral wood colour.':'Hier kannst du das Brett drehen und die Holzfarbe wärmer oder neutraler einstellen.';
document.querySelector('.toolbar').append(controlsHint);
let hintTimer;
function hideControlsHint(){clearTimeout(hintTimer);controlsHint.hidden=true;}
function showControlsHintOnce(){
  let seen=false;try{seen=localStorage.getItem('edle-preview-controls-hint')==='1';}catch{}
  try{seen=seen||window.parent.__edleControlsHintSeen===true;}catch{}
  if(seen)return;
  controlsHint.hidden=false;
  try{localStorage.setItem('edle-preview-controls-hint','1');}catch{}
  try{window.parent.__edleControlsHintSeen=true;}catch{}
  hintTimer=setTimeout(hideControlsHint,6000);
}
function expandView(value){
  expanded=value;
  if(value)savedScroll=window.scrollY;
  workspace.classList.toggle('expanded',value);
  workspace.classList.toggle('controls-hidden',value);
  $('toggleControls').setAttribute('aria-pressed','false');
  $('toggleControls').setAttribute('aria-label',t('Bedienung einblenden'));
  $('toggleControls').title=t('Bedienung einblenden');
  hideControlsHint();if(value)showControlsHintOnce();
  $('toggleControls').hidden=!value;
  document.body.classList.toggle('view-expanded',value);
  for(const el of [document.querySelector('header'),document.querySelector('aside'),document.querySelector('.page-heading')])el.inert=value;
  if(value){workspace.setAttribute('role','dialog');workspace.setAttribute('aria-modal','true');workspace.setAttribute('aria-label','Brettvorschau');}
  else{workspace.removeAttribute('role');workspace.removeAttribute('aria-modal');workspace.removeAttribute('aria-label');window.scrollTo(0,savedScroll);}
  $('expand').setAttribute('aria-expanded',String(value));
  $('expand').setAttribute('aria-label',value?'Vollbildansicht schließen':'Vollbildansicht öffnen');
  $('expand').title=value?'Vollbildansicht schließen':'Vollbildansicht öffnen';
  $('expand').innerHTML=value?t('Schließen'):'<i data-lucide="maximize"></i>';
  translateDOM(workspace);
  createIcons({icons:{ImagePlus,RotateCcw,Download,Maximize,Minimize,SlidersHorizontal}});$('expand').focus();fitStage();resize();
  requestAnimationFrame(()=>{fitStage();resize();});
}
$('expand').onclick=()=>expandView(!expanded);
$('toggleControls').onclick=()=>{
  hideControlsHint();
  const hidden=workspace.classList.toggle('controls-hidden');
  $('toggleControls').setAttribute('aria-pressed',String(!hidden));
  $('toggleControls').setAttribute('aria-label',hidden?'Bedienung einblenden':'Bedienung ausblenden');
  $('toggleControls').title=hidden?'Bedienung einblenden':'Bedienung ausblenden';
  translateDOM(workspace);
  fitStage();resize();
};
new ResizeObserver(()=>{if(expanded){fitStage();resize();}}).observe(viewDock);
document.addEventListener('keydown',e=>{
  if(!expanded||document.querySelector('.reference-editor')?.open)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();expandView(false);}
  if(e.key==='Tab'){
    const items=[...workspace.querySelectorAll('button:not(:disabled),input:not(:disabled)')].filter(el=>el.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, mode === "room" ? photoCamera : camera);
});
const params=new URLSearchParams(location.search);
const entryPoint=params.get('entry')==='product'?'product':'homepage';
const requestedListing=params.get('listing');
const initialKey=requestedListing?Object.keys(catalog).find(key=>catalog[key].listingId===requestedListing):'walnut';
document.querySelector('.products').hidden=true;
document.querySelector('.model-choice').hidden=true;
const changeBoard=document.createElement('a');changeBoard.href='/produkte.html';changeBoard.textContent='Anderes Brett auswählen';
document.querySelector('aside').prepend(changeBoard);
$('purchase').addEventListener('click',()=>{
  window.EdleAnalytics?.track('kitchen_preview_buy_click',{
    product_id:catalog[selected].listingId,product_category:'board',cta_location:'kitchen_preview',source:entryPoint
  });
  if(window.parent!==window)window.parent.postMessage({type:'kitchen-preview-buy',listingId:catalog[selected].listingId,entry:entryPoint},location.origin);
});
if(params.get('embedded')==='1'){
  document.body.classList.add('embedded');
  changeBoard.remove();
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.defaultPrevented&&!expanded&&!document.querySelector('.reference-editor')?.open)window.parent.postMessage({type:'kitchen-preview-close'},location.origin);});
}
if(!initialKey){
  $('purchase').hidden=true;
  document.querySelector('.workspace').hidden=true;
  document.querySelector('aside').hidden=true;
  document.querySelector('.page-heading').textContent=params.get('lang')==='en'?'This board is not available for preview.':'Dieses Brett ist nicht für die Vorschau verfügbar.';
}else select(initialKey).then(async()=>{const saved=await loadPhoto();if(saved?.file&&!currentPhoto)await usePhoto(saved.file,saved);}).catch(() =>
  status("Die Produktansicht konnte nicht geladen werden. Bitte neu laden."),
);
resize();
translateDOM(document.body);
