const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
(async()=>{
 const browser=await chromium.launch();const metrics=[];fs.mkdirSync('docs/design-reference-screenshots',{recursive:true});
 try{
  for(const [name,route]of [['home','/'],['product','/produkte/nussbaum-stirnholz-mit-saftrille-1850610674/'],['care','/pflege.html']])for(const width of [375,1440])for(const state of ['before','after']){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   await page.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===new URL(base).origin||['i.etsystatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)?r.continue():r.abort();});
   await page.goto(base+(state==='before'?'/before':'')+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
   await page.screenshot({path:`docs/design-reference-screenshots/${state}-${name}-${width}.png`,fullPage:false});
   const assets=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.(?:css|js|woff2?|ttf)(?:[?]|$)|fonts\.googleapis/.test(r.name)).map(r=>({bytes:r.transferSize,type:r.initiatorType,font:/woff|fonts\./.test(r.name),local:new URL(r.name).origin===location.origin})));
   metrics.push({name,width,state,requests:assets.length,reportedTransferBytes:assets.reduce((n,a)=>n+a.bytes,0),fontRequests:assets.filter(a=>a.font).length,notes:'Cross-origin timing may report zero; not a complete performance benchmark.'});
   await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync('docs/design-reference-network.json',JSON.stringify(metrics,null,2)+'\n');console.log('Saved 12 review screenshots and indicative network measurements.');
})().catch(e=>{console.error(e);process.exitCode=1;});
