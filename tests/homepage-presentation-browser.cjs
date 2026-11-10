const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright'),engine=process.env.BROWSER_ENGINE||'chromium';
const root=process.env.DESIGN_BUILD||'/tmp/edle-revision-a-build',output='/tmp/edle-homepage-portraits'+(engine==='chromium'?'':'-'+engine);fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:process.env.CHROMIUM_PATH}:{});const metrics=[];
  try{
    for(const width of [320,375,430,768,1440])for(const lang of ['','en/']){
      const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/'+lang,{waitUntil:'domcontentloaded'});
      await page.locator('[data-consent-necessary]').click();await page.evaluate(()=>document.fonts.ready);
      await page.locator('#homepage-products .productCard').nth(3).waitFor();
      await page.locator('.siteSearchLink').waitFor();
      const languageLink=page.locator('.topbar__right .lang a').filter({hasText:lang?'DE':'EN'});
      assert.ok(await languageLink.isVisible());
      assert.equal(await languageLink.getAttribute('href'),lang?'/':'/en/');
      assert.equal(await page.locator('.mobileMenu__lang').count(),0);
      const header=await page.locator('.topbar__inner').evaluate(el=>['.menuButton','.brand','.lang a:not(.is-active)','.siteSearchLink'].map(selector=>{const box=el.querySelector(selector).getBoundingClientRect();return {selector,left:box.left,right:box.right,top:box.top,bottom:box.bottom,width:box.width,height:box.height};}).filter(b=>b.width));
      for(const box of header)assert.ok(box.left>=0&&box.right<=width,JSON.stringify(header));
      for(let i=0;i<header.length;i++)for(let j=i+1;j<header.length;j++)assert.ok(header[i].right<=header[j].left+1||header[j].right<=header[i].left+1,'header controls never overlap: '+JSON.stringify(header));
      if(width<=760){const logo=header.find(b=>b.selector==='.brand');assert.ok(Math.abs((logo.left+logo.right)/2-width/2)<2,'logo stays centred');}
      assert.equal(await page.locator('#homepage-products .productCard__inventory').count(),0);
      const cardLayout=await page.locator('#homepage-products .productCard').evaluateAll(cards=>cards.map(card=>({inventory:card.querySelector('.productCard__meta').getBoundingClientRect().bottom,price:card.querySelector('.productCard__price').getBoundingClientRect().top})));
      for(const box of cardLayout)assert.ok(box.price>=box.inventory+7,'inventory text never overlaps the price');
      if(width<=760||width>=1200)assert.ok(Math.max(...cardLayout.map(b=>b.price))-Math.min(...cardLayout.map(b=>b.price))<2,'prices align across the homepage row');
      await page.locator('#homepage-products .productCard').first().scrollIntoViewIfNeeded();
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-products.png`});
      await page.evaluate(()=>window.scrollTo(0,0));
      assert.equal(await page.locator('.heroTrust').count(),0);
      const heroTitle=await page.locator('.hero h1').boundingBox(),heroButton=await page.locator('.hero__actions a').first().boundingBox();
      assert.ok(heroButton.y>=heroTitle.y+heroTitle.height+24,'hero title and CTA have breathing room');
      assert.ok(heroButton.y+heroButton.height<844,'hero CTA is visible without scrolling');
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-hero.png`});
      assert.equal(await page.locator('[data-static-reviews] .reviewCard').count(),6);
      const reviews=page.locator('[data-review-viewport]');
      assert.ok(await reviews.evaluate(el=>el.scrollWidth>el.clientWidth),'reviews stay horizontally swipeable');
      const leftEdge=await reviews.evaluate(el=>({viewport:el.getBoundingClientRect().left,first:el.querySelector('.reviewCard').getBoundingClientRect().left,margin:getComputedStyle(el).marginLeft,scroll:el.scrollLeft}));
      assert.equal(leftEdge.margin,'0px');assert.ok(leftEdge.first>=leftEdge.viewport-1,'the first review is not clipped on the left');
      await reviews.scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-reviews.png`});
      const fullReview=page.locator('.reviewCard__full').first();await fullReview.locator('summary').click();
      assert.equal(await fullReview.getAttribute('open'),'');await fullReview.locator('summary').click();
      const kitchen=page.locator('.roomDiscovery figure');await kitchen.scrollIntoViewIfNeeded();
      const kitchenSize=await kitchen.evaluate(async figure=>{const img=figure.querySelector('img');await img.decode();return {figure:figure.getBoundingClientRect().width,layout:figure.parentElement.getBoundingClientRect().width,image:img.getBoundingClientRect().width,fit:getComputedStyle(img).objectFit};});
      if(width<=900){
        assert.ok(Math.abs(kitchenSize.figure-width)<1,'mobile kitchen photo spans the viewport');
      }else{
        assert.ok(kitchenSize.figure<=520&&kitchenSize.figure>350,'desktop kitchen photo stays compact and readable');
      }
      assert.ok(Math.abs(kitchenSize.image-kitchenSize.figure)<1);assert.equal(kitchenSize.fit,'cover');
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-kitchen.png`});
      await page.locator('.homePerson').first().scrollIntoViewIfNeeded();
      const greetings=await page.locator('.homePerson h3').allTextContents();
      assert.ok(greetings.every(text=>text.startsWith(lang?"Hi, I'm":"Gude, ich bin")),'greetings match the page language');
      for(const image of await page.locator('.homePerson>img').all()){
        const fit=await image.evaluate(async img=>{await img.decode();return {natural:img.naturalWidth/img.naturalHeight,actual:img.clientWidth/img.clientHeight,width:img.clientWidth};});
        assert.ok(Math.abs(fit.natural-fit.actual)<.01,JSON.stringify(fit));
        if(width>=1200)assert.ok(fit.width>=320,'desktop portraits show recognisable faces');
      }
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-people.png`});
      const photo=page.locator('.closingHero>img');await photo.scrollIntoViewIfNeeded();await photo.evaluate(img=>img.decode());
      if(width>900){
        const ratio=await photo.evaluate(img=>({actual:img.clientWidth/img.clientHeight,natural:img.naturalWidth/img.naturalHeight}));
        assert.ok(Math.abs(ratio.actual-ratio.natural)<.01,'desktop workshop photo preserves the complete composition');
      }
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-closing.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.homepageTrustBar,.homeTopic').count(),0);
      assert.ok((await page.locator('[data-review-subline]').textContent()).includes(String(require('../data/reviews-meta.json').transactionSoldCount)),'visible sales count uses the shared metadata');
      assert.deepEqual(errors,[]);metrics.push({width,lang,height:await page.evaluate(()=>document.documentElement.scrollHeight)});await page.close();
    }
    for(const javaScriptEnabled of [false,true])for(const lang of ['','en/']){
      const page=await browser.newPage({javaScriptEnabled,viewport:{width:390,height:844}});
      if(javaScriptEnabled)await page.route('**/products.json',route=>route.abort());
      await page.goto(base+'/'+lang);assert.equal(await page.locator('#homepage-products .productCard').count(),4);
      const link=page.locator('#homepage-products a[href]').first();await link.click();await page.waitForURL(/\/produkte\//);
      await page.close();
    }
    for(const width of [375,1440])for(const route of ['/bewertungen/','/en/reviews/']){
      const page=await browser.newPage({javaScriptEnabled:false,viewport:{width,height:844}});
      await page.goto(base+route);assert.equal(await page.locator('.reviewArchive__item').count(),42);
      await page.locator('.brand__logo').evaluate(img=>img.decode());
      assert.equal(await page.locator('.reviewArchive__item blockquote').count(),42);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:`${output}/reviews-${route.includes('/en/')?'en':'de'}-${width}.png`});await page.close();
    }
    fs.writeFileSync(output+'/metrics.json',JSON.stringify(metrics,null,2));console.log({passed:true,metrics,output});
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
