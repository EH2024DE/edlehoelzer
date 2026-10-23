const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = process.env.SITE_ROOT || process.cwd();
const route = fs.existsSync(path.join(root,'schneidebrett-fachwerk-eiche/index.html')) ? 'schneidebrett-fachwerk-eiche/index.html' : 'erbstueck/index.html';
const html = fs.readFileSync(path.join(root, route), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
function setup(fetch, valid = true) {
  let listener, reset = false, focused = false;
  const status = {textContent:'',focus(){focused=true;}};
  const button = {disabled:false};
  const attrs = {};
  const form = {action:'https://formspree.io/f/maqanpld',reportValidity:()=>valid,
    addEventListener:(name, fn)=>{listener=fn;},querySelector:()=>button,
    setAttribute:(k,v)=>{attrs[k]=v;},removeAttribute:k=>{delete attrs[k];},reset:()=>{reset=true;}};
  const document = {querySelector:()=>form,getElementById:()=>status};
  class FormData {constructor(value){assert.equal(value,form);}}
  vm.runInNewContext(script,{document,window:{fetch,FormData},fetch,FormData,Error});
  return {submit:()=>listener({preventDefault(){}}),status,button,attrs,get reset(){return reset;},get focused(){return focused;}};
}
test('confirmed success resets form and announces success without real delivery',async()=>{
  let calls=0;const c=setup(async(url,options)=>{calls++;assert.equal(options.method,'POST');assert.equal(options.headers.Accept,'application/json');return {ok:true};});
  await c.submit();assert.equal(calls,1);assert.equal(c.reset,true);assert.match(c.status.textContent,/angekommen/);assert.equal(c.button.disabled,false);assert.equal(c.focused,true);
});
for(const kind of ['network','server'])test(`${kind} failure keeps input and restores retry`,async()=>{
  const c=setup(async()=>{if(kind==='network')throw Error('offline');return {ok:false};});await c.submit();assert.equal(c.reset,false);assert.match(c.status.textContent,/Eingaben bleiben erhalten/);assert.match(c.status.textContent,/info@edlehoelzer.de/);assert.equal(c.button.disabled,false);assert.ok(!('aria-busy' in c.attrs));
});
test('invalid mandatory input never submits',async()=>{let calls=0;const c=setup(async()=>{calls++;},false);await c.submit();assert.equal(calls,0);});
test('pending request cannot be sent twice',async()=>{let finish,calls=0;const c=setup(()=>{calls++;return new Promise(resolve=>{finish=resolve;});});const first=c.submit();await c.submit();assert.equal(calls,1);finish({ok:true});await first;});
test('native POST contract, validation, schema and status markers remain present',()=>{
  assert.match(html,/<form class="erbstueckForm" action="https:\/\/formspree.io\/f\/maqanpld" method="POST">/);
  assert.match(html,/name="_gotcha"/);assert.match(html,/type="email"[^>]*required/);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.deepEqual(schemas.map(s=>s['@type']),['BreadcrumbList','Product']);
  assert.equal(schemas[1].offers.price,'284.99');assert.ok(!schemas[1].offers.url.includes('utm_'));
  assert.ok(html.includes('utm_campaign=erbstueck'));assert.ok((html.match(/STATUS-No004/g)||[]).length>=7);
  assert.ok(!html.includes('lebensmittelecht'));assert.ok(!html.includes('Ahornstreifen'));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),m[1]);
  for(const m of html.matchAll(/<img[^>]+src="([^"]+)"/g))assert.ok(fs.existsSync(path.join(root,m[1])),m[1]);
});
test('legacy redirect preserves attribution and anchors without duplicating content',()=>{
  const source=fs.readFileSync(path.join(root,'erbstueck/index.html'),'utf8');
  const code=source.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const hash of ['','#anfrage','#verfuegbar','#verfuegbare-hoelzer']){
    let destination;vm.runInNewContext(code,{window:{location:{search:'?utm_source=test',hash,replace:value=>{destination=value;}}}});
    assert.equal(destination,'/schneidebrett-fachwerk-eiche/?utm_source=test'+hash);
  }
  assert.match(source,/http-equiv="refresh"/);assert.ok(!source.includes('noindex'));assert.ok(!source.includes('<h1>'));
  const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.ok(sitemap.includes('https://edlehoelzer.de/schneidebrett-fachwerk-eiche/'));assert.ok(!sitemap.includes('<loc>https://edlehoelzer.de/erbstueck/</loc>'));
});
test('beech is integral to the series and personal line design stays optional',()=>{
  assert.ok(html.includes('Zu jedem Erbstück gehört Buche.'));
  assert.ok(html.includes('Für uns steht Eiche für die Substanz unseres Lebens.'));
  assert.ok(html.includes('Drei senkrechte Buchenlinien stehen bei diesem Erbstück für drei Kinder.'));
  assert.ok(html.includes('keinen festen Zeichencode'));
  assert.ok(html.includes('ohne CNC-Maschine'));
  assert.ok(html.includes('Format und Substanz des historischen Eichenholzes'));
  assert.ok(!html.includes('Ahorn'));
  const field=html.match(/<input[^>]*name="beech_lines"[^>]*>/)[0];
  assert.ok(!field.includes('required'));
  assert.match(html,/for="erbstueck-lines"/);
  assert.ok(html.includes('Welche weiteren Details interessieren dich?'));
});
test('hero has one clear action; availability and secondary enquiry follow below',()=>{
  const hero=html.split('<section class="erbstueckHero">')[1].split('</section>')[0];
  assert.equal((hero.match(/class="btn /g)||[]).length,1);
  assert.ok(!hero.includes('erbstueckBadges'));
  assert.ok(!hero.includes('erbstueckAvailability'));
  assert.ok(!hero.includes('breadcrumb'));
  assert.match(html,/<section class="erbstueckIntro"/);
  assert.ok(html.includes('.erbstueckPage .btn--ghost{color:var(--ink-warm);border-color:var(--ink-warm)'));
  assert.ok(html.includes('aspect-ratio:1588/1059;object-fit:contain'));
  assert.match(hero,/loading="eager" fetchpriority="high"/);
});
test('hero board is archived as sold with its owner-confirmed meaning',()=>{
  const archive=html.split('class="erbstueckArchive"')[1].split('</section>')[0];
  assert.equal((archive.match(/<figure\b/g)||[]).length,3);
  assert.ok(archive.includes('src="/assets/Erbstueck.jpg"'));
  assert.ok(archive.includes('Vergeben · Drei senkrechte Buchenlinien stehen bei diesem Erbstück für drei Kinder.'));
  const available=html.split('id="verfuegbar"')[1].split('</section>')[0];
  assert.ok(available.includes('src="/assets/Erbstueck3.jpg"'));
  assert.ok(available.includes('Erbstück No. 004 kaufen'));
});
test('manual gallery controls and keyboard honour reduced motion and update current dot',()=>{
  const galleryScript=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-2)[1];
  for(const reduced of [false,true]){
    const events={},calls=[];
    const buttons=Array.from({length:3},()=>({attrs:{},addEventListener(name,fn){this[name]=fn;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}}));
    const slides=Array.from({length:3},(_,i)=>({getBoundingClientRect:()=>({left:i*400-archive.scrollLeft})}));
    const archive={scrollLeft:0,querySelectorAll:()=>slides,getBoundingClientRect:()=>({left:0}),addEventListener:(name,fn)=>{events[name]=fn;},scrollTo(options){calls.push(options);this.scrollLeft=options.left;events.scroll();}};
    const navigation={hidden:true,querySelectorAll:()=>buttons};
    vm.runInNewContext(galleryScript,{document:{querySelector:s=>s==='.erbstueckArchive'?archive:navigation},window:{matchMedia:()=>({matches:reduced}),addEventListener(){}}});
    assert.equal(navigation.hidden,false);assert.equal(buttons[0].attrs['aria-current'],'true');
    buttons[2].click();assert.equal(archive.scrollLeft,800);assert.equal(buttons[2].attrs['aria-current'],'true');
    assert.equal(calls.at(-1).behavior,reduced?'auto':'smooth');
    events.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(archive.scrollLeft,400);
    events.keydown({key:'Home',preventDefault(){}});assert.equal(archive.scrollLeft,0);
    events.keydown({key:'End',preventDefault(){}});assert.equal(archive.scrollLeft,800);
  }
});
test('gallery explains the three confirmed line patterns before the processing section',()=>{
  assert.ok(html.indexOf('id="vergeben"')<html.indexOf('id="transformation"'));
  assert.ok(html.includes('Eine senkrechte und eine waagerechte Buchenlinie kreuzen sich.'));
  assert.ok(html.includes('Fachwerk-Eiche, die in Lehm lag'));
  assert.ok(html.includes('Zwei senkrechte Buchenlinien kreuzen zwei waagerechte: eine oben, eine unten.'));
  assert.ok(html.includes('scroll-snap-type:x mandatory'));
  const galleryScript=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-2)[1];
  assert.ok(!galleryScript.includes('setInterval('));
});
test('real beam photo supports origin with a bounded responsive crop',()=>{
  const origin=html.split('id="balken"')[1].split('</section>')[0];
  assert.ok(origin.includes('src="/assets/historische-fachwerkbalken.jpg"'));
  assert.match(origin,/width="728" height="1280" loading="lazy"/);
  assert.ok(html.includes('aspect-ratio:4/3;object-fit:cover;object-position:50% 43%'));
  assert.ok(origin.includes('Aussparungen, Bohrungen und Bearbeitungsspuren'));
  assert.ok(origin.includes('vor der weiteren Bearbeitung'));
});
test('process photos preserve owner sequence, screenshot crops and matching studio ending',()=>{
  const section=html.split('id="transformation"')[1].split('</section>')[0];
  const photos=[...section.matchAll(/<figure class="erbstueckProcessFrame"[\s\S]*?<\/figure>/g)].map(m=>m[0]);
  assert.equal(photos.length,19);
  assert.ok(photos[0].includes('/assets/historische-fachwerkbalken.jpg'));
  for(let i=1;i<18;i++){
    const source=i===6?'verleimen-zusammenfuegen':i===7?'verleimen-zwingen':String(i<6?i+1:i-1).padStart(2,'0');
    assert.ok(photos[i].includes(`/assets/erbstueck-entstehung/${source}.jpg`));
    assert.ok(photos[i].includes('--crop-shift:'));
    assert.ok(photos[i].includes('loading="lazy"'));
  }
  assert.ok(photos[18].includes('/assets/Erbstueck2.webp'));
  assert.ok(photos[18].includes('Dieses Brett ist bereits vergeben.'));
  assert.ok(html.includes('.erbstueckProcessCrop{width:100%;aspect-ratio:1;overflow:hidden}'));
  assert.ok(photos[6].includes('Die Teile zusammenfügen'));
  assert.ok(photos[7].includes('Mit Zwingen spannen'));
  assert.equal((section.match(/data-process-index=/g)||[]).length,6);
  assert.ok(section.includes('<details class="erbstueckProcessSummary">'));
  assert.ok(!section.includes('autoplay'));
});
test('process navigation updates chapters, endpoints, progress and reduced-motion behaviour',()=>{
  const code=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-3)[1];
  for(const reduced of [false,true]){
    const events={},calls=[];
    const control=()=>({disabled:false,attrs:{},addEventListener(k,fn){this[k]=fn;},setAttribute(k,v){this.attrs[k]=v;}});
    const previous=control(),next=control(),count=control(),progress=control(),play=control(),playIcon={},pauseIcon={};
    progress.style={setProperty(){}};
    const names=['Material','Hobeln','Aufbau','Form & Schliff','Ölen','Ergebnis'];
    const starts=[0,1,6,10,16,17];
    const chapters=names.map((name,i)=>Object.assign(control(),{textContent:name,dataset:{processIndex:String(starts[i])}}));
    const slides=Array.from({length:19},(_,i)=>({dataset:{processChapter:names[starts.findLastIndex(start=>start<=i)]},querySelector:()=>({textContent:`Step ${i}`}),getBoundingClientRect:()=>({left:i*400-track.scrollLeft})}));
    const story={querySelectorAll:s=>s==='[data-process-index]'?chapters:[{hidden:true}],querySelector:s=>({'[data-process-prev]':previous,'[data-process-next]':next,'[data-process-count]':count,'[role="progressbar"]':progress,'[data-process-play]':play,'[data-process-play-icon]':playIcon,'[data-process-pause-icon]':pauseIcon}[s])};
    const track={scrollLeft:0,closest:()=>story,querySelectorAll:()=>slides,getBoundingClientRect:()=>({left:0}),addEventListener:(k,fn)=>{events[k]=fn;},scrollTo(options){calls.push(options);this.scrollLeft=options.left;events.scroll();}};
    let timer=null,started=0,intersection;const documentEvents={},windowEvents={};
    const document={hidden:false,querySelector:()=>track,addEventListener:(k,fn)=>{documentEvents[k]=fn;}};
    class IntersectionObserver{constructor(fn){intersection=fn;}observe(element){assert.equal(element,track);}}
    vm.runInNewContext(code,{document,window:{IntersectionObserver,matchMedia:()=>({matches:reduced}),addEventListener(k,fn){windowEvents[k]=fn;},setInterval(fn,ms){assert.equal(ms,5000);started++;timer=fn;return 1;},clearInterval(){timer=null;}}});
    assert.equal(started,0);
    assert.equal(previous.disabled,true);assert.equal(count.textContent,'01 / 19');
    play.click();assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');assert.equal(count.attrs['aria-live'],'off');
    timer();assert.equal(count.textContent,'02 / 19');
    play.click();assert.equal(timer,null);assert.equal(play.attrs['aria-label'],'Bildfolge abspielen');
    play.click();events.pointerdown();assert.equal(timer,null);
    play.click();intersection([{isIntersecting:false}]);assert.equal(timer,null);
    play.click();document.hidden=true;documentEvents.visibilitychange();assert.equal(timer,null);document.hidden=false;
    chapters[4].click();assert.equal(count.textContent,'17 / 19');assert.equal(chapters[4].attrs['aria-pressed'],'true');
    assert.equal(calls.at(-1).behavior,reduced?'auto':'smooth');
    windowEvents.resize();assert.equal(calls.at(-1).behavior,'auto');assert.equal(count.textContent,'17 / 19');
    next.click();assert.equal(count.textContent,'18 / 19');
    play.click();timer();assert.equal(timer,null);assert.equal(next.disabled,true);assert.equal(count.textContent,'19 / 19');
    play.click();assert.equal(count.textContent,'01 / 19');assert.ok(timer);play.click();
    events.keydown({key:'End',preventDefault(){}});assert.equal(next.disabled,true);assert.equal(progress.attrs['aria-valuenow'],'19');
    previous.click();assert.equal(count.textContent,'18 / 19');
    events.keydown({key:'Home',preventDefault(){}});assert.equal(previous.disabled,true);
  }
});
