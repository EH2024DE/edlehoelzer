const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8184';
const build=process.env.DESIGN_BUILD;
if(!build)throw new Error('Set DESIGN_BUILD to the served design build.');
const routes=fs.readdirSync(build,{recursive:true}).filter(file=>file.endsWith('.html')&&/class="[^"]*ds-image--portrait/.test(fs.readFileSync(path.join(build,file),'utf8')));

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{
    for(const width of [390,1024,1440]){
      const page=await browser.newPage({viewport:{width,height:900}});
      let germanIds;
      for(const route of ['/','/en/']){
        await page.goto(base+route,{waitUntil:'domcontentloaded'});
        const grid=page.locator('#homepage-products'),cards=grid.locator('.productCard');
        await cards.nth(3).waitFor({state:'attached'});
        await page.evaluate(()=>document.fonts.ready);
        const layout=await cards.evaluateAll(elements=>elements.map(card=>({
          id:card.querySelector('[data-product-preview]').dataset.productPreview,
          row:card.getBoundingClientRect().top,
          positions:['name','meta','price','cta','compareUtility'].map(part=>card.querySelector('.productCard__'+part).getBoundingClientRect().top)
        })));
        assert.equal(layout.length,4);
        if(route==='/')germanIds=layout.map(card=>card.id);
        else assert.deepEqual(layout.map(card=>card.id),germanIds);
        for(const card of layout)for(const peer of layout.filter(peer=>Math.abs(peer.row-card.row)<1)){
          assert.ok(card.positions.every((top,i)=>Math.abs(top-peer.positions[i])<2),JSON.stringify({width,route,card,peer}));
        }
        if(width===390)assert.ok(await grid.evaluate(el=>el.scrollWidth>el.clientWidth),'mobile cards can be swiped');
      }
      if(width!==1024)for(const route of routes){
        await page.goto(base+'/'+route,{waitUntil:'domcontentloaded'});
        const frames=await page.locator('img.ds-image--portrait').evaluateAll(imgs=>Promise.all(imgs.map(async img=>{
          await img.decode();
          const style=getComputedStyle(img);
          return {fit:style.objectFit,padding:style.padding,width:img.clientWidth,height:img.clientHeight,ratio:img.naturalWidth/img.naturalHeight};
        })));
        for(const frame of frames){
          assert.equal(frame.fit,'cover',route);
          assert.equal(frame.padding,'0px',route);
          assert.ok(frame.width>0&&frame.height>0&&Math.abs(frame.width/frame.height-frame.ratio)<.02,JSON.stringify({route,width,frame}));
        }
      }
      await page.close();
    }
    console.log('PASS: both homepages and '+routes.length+' portrait routes');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
