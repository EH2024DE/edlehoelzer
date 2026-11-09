const fs=require('node:fs'),assert=require('node:assert/strict'),playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const engine=process.env.BROWSER_ENGINE||'chromium',out='/tmp/owner-decisions-'+engine;
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:process.env.CHROMIUM_PATH}:{});
  const results=[];
  try{
    for(const width of [375,1440])for(const route of ['/en/atelier/','/en/corporate-gifts/','/handgefertigte-holzprodukte-fuer-unternehmen/','/schneidebretter-aus-holz-gastronomie/','/baumspende.html']){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8817'+route,{waitUntil:'domcontentloaded'});
      await page.locator('[data-consent-necessary]').click();await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').count(),1);
      const font=await page.locator('h1').evaluate(n=>getComputedStyle(n).fontFamily);assert.ok(font.includes('EH Sans'),font);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
      const header=await page.locator('.topbar__inner').evaluate(el=>[...el.children].filter(n=>n.matches('.brand,.topbar__right,.desktopNav,.menuButton')).map(n=>{const r=n.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width};}).filter(r=>r.width));
      for(let i=0;i<header.length;i++)for(let j=i+1;j<header.length;j++)assert.ok(header[i].right<=header[j].left+1||header[j].right<=header[i].left+1,route+' header controls overlap');
      if(width>1200)assert.ok(Math.max(...header.map(r=>r.top))-Math.min(...header.map(r=>r.top))<30,route+' header stays in one row');
      await page.screenshot({path:out+'/'+route.replaceAll('/','_')+width+'-hero.png'});
      if(/corporate-gifts|unternehmen|gastronomie/.test(route)){
        for(const name of ['budget','budget_basis','quantity']){
          const field=page.locator('[name="'+name+'"]');await field.scrollIntoViewIfNeeded();
          assert.ok(await field.isVisible());assert.ok(await field.evaluate(n=>n.required&&!n.closest('details')));
        }
        await page.screenshot({path:out+'/'+route.replaceAll('/','_')+width+'-budget.png'});
      }
      if(route.includes('baumspende')){assert.equal(await page.locator('#baumspende-flow').isVisible(),false);assert.equal(await page.locator('[data-free-plaetze]').count(),0);}
      if(route.includes('/en/')){const logo=page.locator('.brand__logo');await logo.evaluate(img=>img.decode());}
      assert.deepEqual(errors,[],route);results.push({width,route});await page.close();
    }
    console.log({passed:true,results,out});
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
