const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=process.env.DESIGN_BUILD||'/tmp/edle-revision-a-build',output='/tmp/edle-audit-followup';fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  const product=require('../products.json').products.find(p=>p.listingId==='1776273564');
  const routes=['/','/en/','/presse/','/pflege.html','/en/care.html','/schneidebrett-aufbereiten/','/en/refurbishment/','/handgefertigte-holzprodukte-fuer-unternehmen/','/schneidebretter-aus-holz-gastronomie/','/en/wooden-cutting-boards-for-restaurants/',product.productPath,'/en'+product.productPath];
  const results=[];
  try{
    for(const width of [390,1440])for(const route of routes){
      const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('[data-consent-necessary]').click();await page.evaluate(()=>document.fonts.ready);
      if(width===1440){assert.equal(await page.locator('.desktopNav').isVisible(),true);const nav=await page.locator('.desktopNav').boundingBox();assert.ok(nav.x>=0&&nav.x+nav.width<=width);}
      if(route==='/'||route==='/en/'||route==='/presse/'){
        const people=page.locator('.homePeople,.storyGrid:has(>.homePerson)').first();await people.scrollIntoViewIfNeeded();
        await people.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
        if(width===390){
          await page.screenshot({path:output+'/'+(route.replace(/[^a-z0-9]/gi,'_')||'home')+'-people-initial.png'});
          const fit=await people.evaluate(el=>{const cards=[...el.querySelectorAll('.homePerson')],box=el.getBoundingClientRect(),next=cards[1].getBoundingClientRect();return {scroll:el.scrollWidth>el.clientWidth,next:next.left<box.right&&next.right>box.right};});
          assert.ok(fit.scroll&&fit.next,'second person peeks into the swipe row');
          await people.evaluate(el=>{el.scrollLeft=el.scrollWidth;});
        }
        for(const img of await people.locator('img').all()){const size=await img.evaluate(async el=>{await el.decode();return {source:el.naturalWidth/el.naturalHeight,rendered:el.clientWidth/el.clientHeight,height:el.clientHeight};});assert.ok(Math.abs(size.source-size.rendered)<.01);if(width===390)assert.ok(size.height<=301);}
      }
      if(route.includes('care.html')||route==='/pflege.html'||route.includes('refurbishment')||route.includes('aufbereiten')){
        const comparison=page.locator('[data-service-comparison]');await comparison.scrollIntoViewIfNeeded();assert.equal(await comparison.locator('.serviceOption').count(),3);
        assert.ok(await comparison.locator('[data-service-option=full] .serviceOption__features').isVisible());
        if(width===390)assert.ok(await comparison.locator('.serviceOptions__grid').evaluate(el=>el.scrollWidth>el.clientWidth));
        await comparison.locator('summary').first().click();assert.equal(await comparison.locator('details').first().getAttribute('open'),'');
      }
      if(route.includes('gastronomie')||route.includes('restaurants')||route.includes('unternehmen')){
        for(const field of await page.locator('[name=budget],[name=budget_basis]').all())assert.equal(await field.getAttribute('required'),null);
      }
      if(route.includes('/produkte/')){
        await page.locator('.productPreview__earlyPurchase a').waitFor();
        assert.equal(await page.locator('[data-product-page] h1').textContent(),route.startsWith('/en/')?'3D end grain – Oak & other woods':product.displayName);
        if(width===390){
          const option=page.locator('[data-purchase-option=engraving]');if(await option.count()){await option.check();}
          await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
          await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
          await page.locator('.productPurchaseBar:not([hidden])').waitFor();
          assert.equal(await page.locator('.productPurchaseBar__price span').textContent(),await page.locator('[data-purchase-price]').textContent());
          assert.equal(await page.locator('.productPurchaseBar a').getAttribute('href'),await page.locator('.productPreview__earlyPurchase a').getAttribute('href'));
          assert.equal(await page.locator('.backToTop').isVisible(),false);
        }
      }
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      if(overflow)console.log(await page.evaluate(()=>[...document.querySelectorAll('main *')].filter(el=>el.getBoundingClientRect().right>innerWidth&&!el.closest('.serviceOptions__grid,.homePeople,.storyGrid,[data-review-viewport]')).slice(0,10).map(el=>({tag:el.tagName,class:el.className,width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right}))));
      assert.equal(overflow,false,route+' overflow');assert.deepEqual(errors,[]);
      await page.screenshot({path:output+'/'+(route.replace(/[^a-z0-9]/gi,'_')||'home')+'-'+width+'.png'});results.push({route,width});await page.close();
    }
    console.log({passed:true,renders:results.length,output});
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
