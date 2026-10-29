const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const files=['atelier-vorschau/index.html','atelier-vorschau/erbstueck/index.html','en/atelier-preview/index.html','en/atelier-preview/erbstueck/index.html'];
files.push('atelier-vorschau/start/index.html','en/atelier-preview/start/index.html');
test('atelier design study stays isolated, bilingual and noindex without third-party scripts',()=>{
 for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.match(html,/assets\/css\/atelier-preview.css/);
  assert.match(html,/assets\/js\/atelier-preview.js/);
  assert.match(html,/data-menu-open aria-controls="atelier-menu" aria-expanded="false"/);
  assert.match(html,/<dialog class="atelierMenu" id="atelier-menu"/);
  assert.doesNotMatch(html,/<script[^>]+src="https:/);
  assert.doesNotMatch(html,/unsplash|tailwindcss|lebenslange.*garantie/i);
 }
});
test('collection presents canonical catalogue without duplicate tropical experiment or configuration forms',()=>{
 for(const file of [files[0],files[2]]){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/data-atelier-piece=/g)||[]).length,46);
  assert.equal((html.match(/data-atelier-group=/g)||[]).length,6);
  assert.doesNotMatch(html,/data-add=|product-4451487112/);
  assert.match(html,/erbstueck\//);
 }
});
test('detail keeps the shared cart, correct product focus and clear preview status',()=>{
 for(const file of [files[1],files[3]]){
  const html=fs.readFileSync(file,'utf8');
  assert.match(html,/data-product-focus="product-4370769708"/);
  for(const id of ['data-shop-checkout','data-shop-mobile-total','data-shop-cart','data-shop-dialog'])assert.ok(html.includes(id));
  assert.match(html,/assets\/js\/shop-pilot.js/);
 }
});
test('Erbstueck retains the origin, beech-line meaning, generational story and all craft steps',()=>{
 for(const file of [files[1],files[3]]){
  const html=fs.readFileSync(file,'utf8');
  for(const name of ['atelierStoryOpening','atelierStoryMeaning','atelierStoryArchive','atelierStoryRequirements','atelierStoryFaq','atelierStoryAlternative'])assert.ok(html.includes(name));
  assert.equal((html.match(/data-craft-step /g)||[]).length,19);
  assert.match(html,/cropped\/verleimen-zwingen.webp/);
  assert.doesNotMatch(html,/erbstueck-entstehung\/(?:\d+|verleimen-[a-z]+)\.jpg/);
  assert.ok(html.indexOf('cropped/11.webp')<html.indexOf('cropped/09.webp'));
  assert.ok(html.indexOf('cropped/10.webp')<html.indexOf('cropped/12.webp'));
  assert.ok(html.indexOf('cropped/12.webp')<html.indexOf('cropped/13.webp'));
 }
});
test('homepage preserves the original video, four themes, kitchen example and sourced reviews',()=>{
 for(const file of files.slice(4)){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/data-home-topic-link/g)||[]).length,4);
  assert.equal((html.match(/<h1 /g)||[]).length,1);
  assert.equal((html.match(/data-atelier-piece=/g)||[]).length,4);
  assert.match(html,/brettvorschau\/\?listing=4370769708/);
  assert.match(html,/Erbstueck.jpg/);
  assert.match(html,/geschenkset-erster-entwurf-1200.jpg/);
  assert.doesNotMatch(html,/giftbox_b2b-1200.jpg/);
  assert.match(html,/custom-projects\/eiche-xxl-dark.jpg/);
  const selected=[...html.matchAll(/data-atelier-piece="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(selected,['product-4522458953','product-1850610674','product-1776273564','xxl-custom-board']);
  assert.match(html,/Halter &amp; Pflegebalsam inklusive|Stand &amp; care balm included/);
  assert.match(html,/7728172613_tg06.jpg/);
  assert.match(html,/data-review-rail/);
  assert.doesNotMatch(html,/data-review-play|data-review-prev|data-review-next|atelierReviewControls/);
  assert.match(html,/Gutes Holz. Persönlicher Service.|Good wood. Personal service./);
  assert.match(html,/Deine Wahl. Unser Service.|Your choice. Our support./);
  assert.match(html,/Holz mit Geschichte. Zum Weitergeben.|Wood with history. Made to be passed on./);
  assert.ok((html.match(/data-review-item/g)||[]).length>=6);
  assert.match(html,/data-home-video-toggle/);
  assert.match(html,/preload="none"/);
  assert.match(html,/kitchen-preview-example.jpg/);
  assert.match(html,/atelierReviewGrid/);
  assert.match(html,/39 (?:reviews on Etsy|Bewertungen auf Etsy)/);
  assert.match(html,/2026-10-08/);
  assert.match(html,/atelierHomeProof/);
  assert.match(html,/atelierHomeWorkshop/);
  assert.doesNotMatch(html,/Bereits vergebenes Referenzstück|Sold reference piece/);
  assert.doesNotMatch(html,/schneidebrett-schleifen-exzenterschleifer-werkstatt/);
  assert.doesNotMatch(html,/Resurfacing|Aufarbeitung/);
 }
});
test('craft photo crops are square WebP exports, excluding screenshot UI by construction',()=>{
 const steps=JSON.parse(fs.readFileSync('data/atelier-craft-steps.json'));
 for(const step of steps.filter(step=>step.file)){
  assert.ok(step.cropTop>=152&&step.cropTop+591<=1039);
  const bytes=fs.readFileSync('assets/erbstueck-entstehung/cropped/'+step.file+'.webp');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.ok(bytes.length>1000);
 }
 assert.equal(steps.length,19);
});
test('review rail has no autoplay or rotating records and retains keyboard and full-text access',()=>{
 const source=fs.readFileSync('assets/js/atelier-preview.js','utf8');
 const reviews=source.slice(source.indexOf("const reviewRail="),source.indexOf("const craft="));
 assert.doesNotMatch(reviews,/requestAnimationFrame|setTimeout|setInterval|IntersectionObserver|data-review-play|track\.append|track\.prepend/);
 assert.match(reviews,/ArrowRight/);assert.match(reviews,/data-review-read/);assert.match(reviews,/showModal/);
});
