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
  assert.ok((html.match(/STATUS-No004/g)||[]).length>=7);
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
  assert.ok(available.includes('Erbstück No. 004 ansehen'));
  assert.ok(!available.includes('data-etsy-link'));
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
test('product has its exact counter preview and the finder alternative follows the FAQs',()=>{
  const product=html.split('id="verfuegbar"')[1].split('</section>')[0];
  assert.ok(product.includes('href="/brettvorschau/?listing=4370769708&amp;entry=product"'));
  assert.ok(product.includes('data-kitchen-preview="4370769708"'));
  assert.ok(product.includes('class="btn btn--ghost" data-kitchen-preview'));
  assert.ok(product.includes('data-product-preview="etsy-live-20260726-erbstueck-no-004-eiche-buche"'));
  const hero=html.split('<section class="erbstueckHero">')[1].split('</section>')[0];
  assert.ok(hero.includes('data-product-source="erbstueck"'));
  const models=JSON.parse(fs.readFileSync(path.join(root,'brettvorschau/models.json'),'utf8'));
  assert.ok(models.some(model=>model.listingId==='4370769708'));
  const main=html.split('<main')[1].split('</main>')[0];
  assert.ok(!main.includes('href="/pflege.html"'));
  assert.ok(!main.includes('href="/schneidebrett-aufbereiten/"'));
  assert.ok(!main.includes('<h3>Pflege und Aufarbeitung</h3>'));
  assert.ok(main.includes('<summary>Wie pflege ich mein Erbstück?</summary>'));
  assert.equal((main.match(/href="\/produkte.html#produktfinder"/g)||[]).length,1);
  assert.ok(main.indexOf('erbstueckFinderAlternative')>main.indexOf('Häufige Fragen'));
  assert.ok(main.trimEnd().endsWith('</aside>'));
  assert.ok(html.includes('min-height:112px'));
  assert.ok(html.includes('width:44px;height:44px'));
});
test('No.004 dialog uses the verified starting price and defers conflicting dimensions',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8'));
  const product=data.products.find(p=>p.listingId==='4370769708');
  assert.equal(product.priceOrder,284.99);assert.equal(product.priceLabel,'ab 284,99 EUR');
  assert.equal(product.dimensionsReviewRequired,true);assert.equal(product.etsyOptionsOnly,true);
  assert.ok(!/\d/.test(product.shortDescription));
  assert.ok(!product.badges.some(b=>/cm|kg/.test(b)));
  const js=fs.readFileSync(path.join(root,'main.js'),'utf8');
  assert.ok(js.includes('source === "erbstueck"'));
  assert.ok(js.includes('Zum Produktfinder'));
  assert.ok(js.indexOf('Zum Produktfinder')<js.indexOf('renderExperiencePromise(product) +'));
  assert.equal(product.includesMatchingHolder,true);assert.equal(product.includesCareBalm,true);
  assert.ok(html.includes('Passender Halter, Pflegebalsam und Pflegeanleitung inklusive.'));
  assert.ok(!html.includes('Stirnholzhalter'));
  assert.ok(html.includes('id="andere-bretter"'));
  assert.equal((js.match(/if \(product.dimensionsReviewRequired\) return isEnglish/g)||[]).length,2);
  assert.ok(js.includes('if (product.dimensionsReviewRequired) return "";'));
});
test('confirmed No.004 holder and balm are included independently of generic order thresholds',()=>{
  const js=fs.readFileSync(path.join(root,'main.js'),'utf8');
  const code=js.slice(js.indexOf('  function purchaseBenefit(product) {'),js.indexOf('  function renderPurchaseHeadline(product) {'));
  for(const isEnglish of [false,true]){
    const context={isEnglish,purchaseRules:{},labels:{careBalmThreshold:'threshold',benefitBasis:'basis'},purchaseSubtotalWithoutCareBalm:()=>100,minimumBoardThickness:()=>null,purchaseSelection:()=>({})};
    vm.runInNewContext(code,context);
    const included=context.purchaseBenefit({includesMatchingHolder:true,includesCareBalm:true});
    assert.equal(included.active,true);
    assert.match(included.title,isEnglish?/Matching stand, care balm and care instructions included/:/Passender Halter, Pflegebalsam und Pflegeanleitung inklusive/);
    assert.equal(context.purchaseBenefit({}).active,false);
    assert.equal(context.purchaseBenefit({}).title,'threshold');
  }
});
test('series story explains presentation, standard kit and one-edge minimum without unconditional restoration promise',()=>{
  const story=html.split('id="weitergabe"')[1].split('</section>')[0];
  assert.ok(story.includes('Ein Erbstück ist nichts, was man versteckt.'));
  assert.ok(story.includes('Zu deinem Brett gehören immer ein passender Halter, Pflegebalsam und eine Pflegeanleitung.'));
  assert.ok(story.includes('Bei Balken aus unseren eigenen Rückbauten'));
  assert.ok(story.includes('Erbstückkarte aus Holz'));
  assert.ok(story.includes('Herkunftsort oder Ortsteil in Mittelhessen'));
  const material=html.split('id="material"')[1].split('</section>')[0];
  assert.ok(material.includes('Mindestens 30 cm an einer Seite.'));
  assert.ok(material.includes('Mindestens 4 cm stark.'));
  assert.ok(material.includes('hängt vom Zustand des Bretts ab'));
  assert.ok(!material.includes('30 × 30'));
  assert.ok(html.includes('Mindestens eine Seite muss 30 cm lang sein'));
  assert.ok(html.includes('Das ist keine Garantie für jeden Schaden'));
});
test('origin card names locality for own reclamations without promising private building locations',()=>{
  assert.ok(html.includes('<summary>Was erzählt die Erbstückkarte?</summary>'));
  assert.ok(html.includes('Bei Erbstücken aus unseren eigenen Rückbauten'));
  assert.ok(html.includes('Herkunftsort oder Ortsteil des Balkens in Mittelhessen'));
  assert.ok(!html.includes('Können wir die Herkunft eindeutig belegen'));
  assert.ok(!html.includes('Ist der Herkunftsort des Balkens dokumentiert'));
  assert.ok(!html.includes('Holzvisitenkarte'));
  assert.ok(!html.includes('GPS-Koordinaten'));
  assert.ok(!html.includes('Herkunftszertifikat'));
});
test('process photos preserve owner sequence, screenshot crops and matching studio ending',()=>{
  const section=html.split('id="transformation"')[1].split('</section>')[0];
  assert.ok(section.includes('Einige Ausschnitte aus der Fertigung eines Erbstücks.'));
  const photos=[...section.matchAll(/<figure class="erbstueckProcessFrame"[\s\S]*?<\/figure>/g)].map(m=>m[0]);
  assert.equal(photos.length,19);
  assert.ok(photos[0].includes('/assets/historische-fachwerkbalken.jpg'));
  for(let i=1;i<18;i++){
    const source=i===6?'verleimen-zusammenfuegen':i===7?'verleimen-zwingen':({10:'11',11:'09',12:'10'}[i]||String(i<6?i+1:i-1).padStart(2,'0'));
    assert.ok(photos[i].includes(`/assets/erbstueck-entstehung/${source}.jpg`));
    assert.ok(photos[i].includes('--crop-shift:'));
    assert.ok(photos[i].includes('loading="lazy"'));
  }
  assert.ok(photos[18].includes('/assets/Erbstueck2.webp'));
  assert.ok(photos[18].includes('Dieses Brett ist bereits vergeben.'));
  assert.ok(html.includes('.erbstueckProcessCrop{width:100%;aspect-ratio:1;overflow:hidden}'));
  assert.ok(photos[6].includes('Die Teile zusammenfügen'));
  assert.ok(photos[7].includes('Mit Zwingen spannen'));
  assert.ok(photos[10].includes('Die Griffmulde fräsen'));
  assert.ok(photos[11].includes('Die Kanten brechen'));
  assert.ok(photos[11].includes('eine Fase'));
  assert.ok(!photos[11].includes('abgerundet'));
  assert.ok(photos[12].includes('Bandschleifmaschine'));
  assert.ok(photos[13].includes('Exzenterschleifer'));
  assert.ok(photos[14].includes('gewässert'));
  assert.ok(photos[14].includes('wieder trocken'));
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
    vm.runInNewContext(code,{document,window:{IntersectionObserver,matchMedia:()=>({matches:reduced}),addEventListener(k,fn){windowEvents[k]=fn;},setTimeout(fn,ms){assert.equal(ms,3000);started++;timer=fn;return started;},clearTimeout(){timer=null;}}});
    assert.equal(started,0);
    assert.equal(previous.disabled,true);assert.equal(count.textContent,'01 / 19');
    play.click();assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');assert.equal(count.attrs['aria-live'],'off');
    timer();assert.equal(count.textContent,'02 / 19');
    play.click();assert.equal(timer,null);assert.equal(play.attrs['aria-label'],'Bildfolge abspielen');
    play.click();events.pointerdown();assert.equal(timer,null);assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');
    windowEvents.pointerup();assert.ok(timer);
    const beforeSwipe=started;track.scrollLeft=1200;events.scroll();assert.equal(count.textContent,'04 / 19');assert.ok(started>beforeSwipe);assert.ok(timer);
    const beforeTap=started;events.pointerdown();windowEvents.pointerup();assert.ok(started>beforeTap);assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');
    assert.ok(!events.focusin);
    intersection([{isIntersecting:false}]);assert.equal(timer,null);assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');
    intersection([{isIntersecting:true}]);assert.ok(timer);
    document.hidden=true;documentEvents.visibilitychange();assert.equal(timer,null);document.hidden=false;documentEvents.visibilitychange();assert.ok(timer);
    chapters[4].click();assert.equal(count.textContent,'17 / 19');assert.equal(chapters[4].attrs['aria-pressed'],'true');
    assert.ok(timer);assert.equal(play.attrs['aria-label'],'Bildfolge pausieren');
    assert.equal(calls.at(-1).behavior,reduced?'auto':'smooth');
    windowEvents.resize();assert.equal(calls.at(-1).behavior,'auto');assert.equal(count.textContent,'17 / 19');
    next.click();assert.equal(count.textContent,'18 / 19');
    timer();assert.ok(timer);assert.equal(next.disabled,true);assert.equal(count.textContent,'19 / 19');
    timer();assert.equal(count.textContent,'01 / 19');assert.ok(timer);
    play.click();assert.equal(timer,null);
    events.keydown({key:'End',preventDefault(){}});assert.equal(next.disabled,true);assert.equal(progress.attrs['aria-valuenow'],'19');
    previous.click();assert.equal(count.textContent,'18 / 19');
    assert.equal(timer,null);
    events.keydown({key:'Home',preventDefault(){}});assert.equal(previous.disabled,true);
  }
});
