const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8171';
(async()=>{
  const {sitePages}=await import('../tools/shop-server/site-preview.mjs');
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  const findings=[];
  try{
    const context=await browser.newContext();
    for(const width of [375,768,1440]){
      const page=await context.newPage({viewport:{width,height:900}});
      for(const route of sitePages.keys()){
        const errors=[],assets=[];
        const onError=error=>errors.push(error.message);
        const onResponse=response=>{if(response.url().startsWith(base+'/')&&response.status()>=400)assets.push({url:response.url().slice(base.length),status:response.status()});};
        page.on('pageerror',onError);page.on('response',onResponse);
        const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
        await page.waitForTimeout(80);
        const consent=page.getByRole('button',{name:'Nur notwendige',exact:true});
        if(await consent.isVisible())await consent.click();
        const issues=await page.evaluate(()=>{
          const visible=node=>{const r=node.getBoundingClientRect();return r.width>0&&r.height>0;};
          const result=[];
          if(document.documentElement.scrollWidth>innerWidth+1)result.push({type:'overflow',width:document.documentElement.scrollWidth});
          for(const node of document.querySelectorAll('main h1,main h2,main h3,main input,main select,main textarea')){
            if(!visible(node))continue;
            const style=getComputedStyle(node);
            if(/Playfair/i.test(style.fontFamily))result.push({type:'old-display-font',element:node.tagName,text:node.textContent.slice(0,50)});
          }
          for(const node of document.querySelectorAll('main section,main aside'))if(visible(node)){
            const style=getComputedStyle(node);
            if(style.backgroundImage.includes('gradient('))result.push({type:'old-gradient',element:node.className});
          }
          if(!document.querySelector('.atelierHeader [data-menu-open]'))result.push({type:'missing-menu'});
          if(!document.querySelector('.atelierHeader .siteSearchLink'))result.push({type:'missing-search'});
          return result;
        });
        if(response.status()!==200||errors.length||assets.length||issues.length)findings.push({width,route,status:response.status(),errors,assets,issues});
        page.off('pageerror',onError);page.off('response',onResponse);
      }
      await page.close();console.log(`Checked ${sitePages.size} static pages at ${width}px`);
    }
    const report={pages:sitePages.size,widths:[375,768,1440],findings};
    fs.writeFileSync('/tmp/edle-production-browser-audit.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
    assert.equal(findings.length,0,'static release audit has findings');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
