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
