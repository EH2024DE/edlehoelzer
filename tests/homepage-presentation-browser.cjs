const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=process.env.DESIGN_BUILD||'/tmp/edle-revision-a-build',output='/tmp/edle-homepage-portraits';fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{let f=path.join(root,new URL(req.url,'http://localhost').pathname);if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});const metrics=[];
  try{
    for(const width of [375,430,768,1440])for(const lang of ['','en/']){
      const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/'+lang,{waitUntil:'domcontentloaded'});
      await page.locator('[data-consent-necessary]').click();await page.evaluate(()=>document.fonts.ready);
      await page.locator('#homepage-products .productCard').nth(3).waitFor();
      const trust=await page.locator('.heroTrust').boundingBox();assert.ok(trust.y>=0&&trust.y+trust.height<844);
      assert.equal(await page.locator('[data-static-reviews] .reviewCard').count(),6);
      const reviews=page.locator('[data-review-viewport]');
      assert.ok(await reviews.evaluate(el=>el.scrollWidth>el.clientWidth),'reviews stay horizontally swipeable');
      const fullReview=page.locator('.reviewCard__full').first();await fullReview.locator('summary').click();
      assert.equal(await fullReview.getAttribute('open'),'');await fullReview.locator('summary').click();
      await page.locator('.homePerson').first().scrollIntoViewIfNeeded();
      for(const image of await page.locator('.homePerson>img').all()){
        const fit=await image.evaluate(async img=>{await img.decode();return {natural:img.naturalWidth/img.naturalHeight,actual:img.clientWidth/img.clientHeight};});
        assert.ok(Math.abs(fit.natural-fit.actual)<.01,JSON.stringify(fit));
      }
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-people.png`});
      const photo=page.locator('.closingHero>img');await photo.scrollIntoViewIfNeeded();await photo.evaluate(img=>img.decode());
      await page.screenshot({path:`${output}/${lang?'en':'de'}-${width}-closing.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      if(lang){const topic=page.locator('.homeTopic').first();await topic.locator('summary').click();assert.equal(await topic.getAttribute('open'),'');await topic.locator('summary').click();}
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
      await page.goto(base+route);assert.equal(await page.locator('.reviewArchive__item').count(),39);
      await page.locator('.brand__logo').evaluate(img=>img.decode());
      assert.equal(await page.locator('.reviewArchive__item blockquote').count(),39);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:`${output}/reviews-${route.includes('/en/')?'en':'de'}-${width}.png`});await page.close();
    }
    fs.writeFileSync(output+'/metrics.json',JSON.stringify(metrics,null,2));console.log({passed:true,metrics,output});
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
