const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=process.env.DESIGN_BUILD;
if(!root)throw new Error('Set DESIGN_BUILD to the built site.');
const output=process.env.SCREENSHOT_DIR||'/tmp/edle-revision-a-screenshots';
fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  let file=path.join(root,new URL(req.url,'http://localhost').pathname);
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  const catalog=JSON.parse(fs.readFileSync(path.join(root,'products.json'),'utf8')).products;
  const metrics=[];
  try{
    for(const width of [320,390,1440]){
      const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      for(const lang of ['', 'en/']){
        await page.goto(base+'/'+lang,{waitUntil:'domcontentloaded'});
        const banner=page.locator('[data-consent-root]');await banner.waitFor();
        await page.evaluate(()=>document.fonts.ready);
        const height=await banner.evaluate(el=>el.getBoundingClientRect().height);
        assert.ok(height<=(width<375?180:150),`banner ${width} ${lang}: ${height}`);
        for(const selector of ['[data-consent-accept-all]','[data-consent-necessary]','[data-consent-settings]']){
          const button=banner.locator(selector);assert.ok((await button.boundingBox()).height>=44);
        }
        metrics.push({width,lang,bannerHeight:height});
        await page.screenshot({path:path.join(output,`home-${lang?'en':'de'}-${width}.png`)});
        await banner.locator('[data-consent-necessary]').click();
        await page.evaluate(()=>localStorage.clear());
      }
      for(const lang of ['', 'en/']){
        await page.goto(base+(lang?'/en/wooden-cutting-boards-for-restaurants/':'/schneidebretter-aus-holz-gastronomie/'),{waitUntil:'domcontentloaded'});
        await page.locator('.gastroHero').waitFor();
        const layout=await page.locator('.gastroHero').evaluate(hero=>{
          const image=hero.querySelector('img').getBoundingClientRect(),copy=hero.querySelector('.gastroHero__copy').getBoundingClientRect();
          return {overlap:image.left<copy.right-1&&image.right>copy.left+1&&image.top<copy.bottom-1&&image.bottom>copy.top+1,overflow:document.documentElement.scrollWidth>innerWidth};
        });
        assert.equal(layout.overlap,false,JSON.stringify({width,lang,layout}));assert.equal(layout.overflow,false);
        await page.screenshot({path:path.join(output,`gastro-${lang?'en':'de'}-${width}.png`)});
      }
      for(const id of ['1776273564','1818046728']){
        const product=catalog.find(p=>p.listingId===id);assert.ok(product);
        await page.goto(base+product.productPath,{waitUntil:'domcontentloaded'});
        await page.locator('.productPreview__earlyPurchase').waitFor();
        const facts=await page.locator('.productPreview__content').evaluate(content=>{
          const children=Array.from(content.children);
          return {prices:content.querySelectorAll('[data-purchase-price]').length,headline:children.indexOf(content.querySelector('.productPreview__purchaseHeadline')),options:children.indexOf(content.querySelector('.productPreview__configuration')),action:children.indexOf(content.querySelector('.productPreview__earlyPurchase')),note:content.querySelector('.productPreview__earlyPurchase').textContent,delivery:content.querySelector('[data-purchase-delivery]').textContent};
        });
        assert.equal(facts.prices,1);assert.ok(facts.headline<facts.options&&facts.options<facts.action,JSON.stringify(facts));
        if(id==='1776273564'){
          assert.match(facts.note,/nicht an Etsy übertragen/);
          const price=page.locator('[data-purchase-price]');
          assert.match(await price.textContent(),/459,99/);
          await page.locator('[data-purchase-option="juiceGroove"]').check();
          await page.waitForFunction(()=>document.querySelector('[data-purchase-price]').textContent.includes('474,99'));
          assert.equal(await price.count(),1);
        }
        else assert.match(facts.delivery,/nicht auf Lager/);
        await page.locator('.productPreview__purchaseHeadline').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(output,`product-${id}-${width}.png`)});
      }
      assert.deepEqual(errors,[]);await page.close();
    }
    fs.writeFileSync(path.join(output,'metrics.json'),JSON.stringify(metrics,null,2));
    console.log(JSON.stringify({passed:true,metrics,screenshots:output},null,2));
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
