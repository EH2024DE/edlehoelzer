const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright'),engine=process.env.BROWSER_ENGINE||'chromium';
const root=process.env.DESIGN_BUILD||'/tmp/edle-revision-a-build',out='/tmp/edle-release-language-'+engine+(process.env.AUDIT_WIDTHS?'-'+process.env.AUDIT_WIDTHS.replaceAll(',','-'):'');
fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:process.env.CHROMIUM_PATH}:{}),results=[];
 const editorial=require('../data/english-editorial-pages.json');
 const routes=[...new Set(['/','/en/','/schneidebrett-nach-mass/','/schneidebretter-aus-holz-gastronomie/','/handgefertigte-holzprodukte-fuer-unternehmen/','/en/corporate-gifts/','/pflege.html','/en/care.html','/en/erbstueck/','/en/refurbishment/','/en/wooden-dough-scraper/',...editorial.map(p=>p.route),...editorial.map(p=>'/'+p.source.replace(/index\.html$/,''))])];
 try{
  for(const width of (process.env.AUDIT_WIDTHS||'320,390,1440').split(',').map(Number))for(const route of routes.filter(route=>!process.env.AUDIT_ROUTES||process.env.AUDIT_ROUTES.split(',').includes(route))){
   const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
   const banner=page.locator('[data-consent-root]');await banner.waitFor();
   const height=(await banner.boundingBox()).height;
   assert.ok(height<=(width>=900?120:150),route+' banner height '+height);
   for(const button of await banner.locator('button').all()){
    const box=await button.boundingBox();assert.ok(box.height>=44&&box.width>=44,'consent targets remain accessible');
   }
   if(route==='/'||route==='/en/'){
    const cta=await page.locator('.hero__actions a').first().boundingBox(),bb=await banner.boundingBox();assert.ok(cta.y+cta.height<=bb.y,'banner does not cover the hero action');
    await page.locator('[data-consent-settings]').click();await page.locator('[data-consent-modal]').waitFor();
    const close=page.locator('[data-consent-close]'),box=await close.boundingBox();assert.ok(box.width>=44&&box.height>=44);
    await close.click();
   }
   await page.locator('[data-consent-necessary]').click();
   assert.ok(await page.locator('#menuButton').isVisible(),'hamburger remains available at every width');
   const headerBoxes=await page.locator('.topbar__inner').evaluate(el=>[...el.children].filter(n=>n.matches('.menuButton,.brand,.desktopNav,.topbar__right')).map(n=>n.getBoundingClientRect()).filter(r=>r.width).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})));
   for(let i=0;i<headerBoxes.length;i++)for(let j=i+1;j<headerBoxes.length;j++)assert.ok(headerBoxes[i].right<=headerBoxes[j].left+1||headerBoxes[j].right<=headerBoxes[i].left+1,route+' header controls do not overlap at '+width);
   if(width>=1200){
    await page.locator('#menuButton').click();assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'true');
    await page.locator('#menuCloseButton').click();assert.equal(await page.locator('#menuButton').getAttribute('aria-expanded'),'false');
    const boxes=await page.locator('.topbar__inner').evaluate(el=>[...el.children].filter(n=>n.matches('.menuButton,.brand,.desktopNav,.topbar__right')).map(n=>n.getBoundingClientRect()).filter(r=>r.width).map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})));
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(boxes[i].right<=boxes[j].left+1||boxes[j].right<=boxes[i].left+1,'header controls do not overlap');
   }
   assert.equal(await page.locator('h1').count(),1);
   assert.ok((await page.locator('h1').evaluate(n=>getComputedStyle(n).fontFamily)).includes('EH Sans'));
   if(route==='/schneidebrett-nach-mass/'){
    await page.locator('.topbar__right .lang a').filter({hasText:'EN'}).click();await page.waitForURL(base+'/en/custom-cutting-board/');
    await page.locator('.topbar__right .lang a').filter({hasText:'DE'}).click();await page.waitForURL(base+route);
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' page overflow');
   const hero=page.locator('.editorialHero__image');
   if(await hero.count())await hero.evaluate(img=>img.decode());
   if(editorial.some(p=>p.route===route)){
    const disclosure=page.locator('.editorialDisclosure').first();
    if(await disclosure.count()){await disclosure.locator('summary').click();assert.equal(await disclosure.getAttribute('open'),'');await disclosure.locator('summary').press('Enter');assert.equal(await disclosure.getAttribute('open'),null);}
   }
   if(/corporate-gifts|unternehmen|gastronomie/.test(route))for(const name of ['budget','budget_basis','quantity']){
    const f=page.locator('[name="'+name+'"]');assert.ok(await f.evaluate(n=>n.required&&!n.closest('details')));
   }
   if(route==='/en/custom-cutting-board/'){
    const galleries=page.locator('.customProjects__gallery');assert.equal(await galleries.count(),2);
    for(let i=0;i<2;i++){
     const gallery=galleries.nth(i);assert.equal(await gallery.locator('img').count(),3);
     await gallery.scrollIntoViewIfNeeded();
     for(const img of await gallery.locator('img').all()){await img.evaluate(n=>{n.loading='eager';return n.decode();});assert.equal(await img.evaluate(n=>getComputedStyle(n).objectFit),'contain');}
     await gallery.locator('..').getByRole('button',{name:'Next project photo'}).click();
     assert.ok(await gallery.evaluate(n=>n.scrollLeft>n.clientWidth*.8),'gallery advances to second view');
     await gallery.locator('..').getByRole('button',{name:'Previous project photo'}).click();
    }
    await page.locator('.customProjects').screenshot({path:path.join(out,'custom-projects-'+width+'.png')});
    let requests=0;await page.route('https://formspree.io/f/maqanpld',r=>{requests++;return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
    await page.locator('[name=email]').fill('preview@example.invalid');await page.locator('[name=message]').fill('Local test only; no message is sent.');
    await page.locator('[data-board-inquiry] [type=submit]').click();await page.locator('[data-board-inquiry] [role=status]').filter({hasText:'Thank you!'}).waitFor();assert.equal(requests,1);
   }
   if(width<760&&['/pflege.html','/schneidebrett-nach-mass/'].includes(route)){
    const bar=page.locator('.mobileStickyCta');assert.equal(await bar.count(),1);
    const box=await bar.boundingBox();assert.ok(box.height<=70,'compact sticky CTA height '+box.height);
    for(const link of await bar.locator('a').all())assert.ok((await link.boundingBox()).height>=44);
   }
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(out,route.replaceAll('/','_')+'-'+width+'.png')});
   assert.deepEqual(errors,[],route);results.push({route,width,bannerHeight:height,pageHeight:await page.evaluate(()=>document.documentElement.scrollHeight)});await page.close();
  }
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));console.log({passed:true,renders:results.length,out});
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
