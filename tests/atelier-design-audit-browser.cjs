const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const {sitePages}=await import('../tools/shop-server/site-preview.mjs');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),findings=[];
 try{for(const route of sitePages.keys()){
  await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:8170')+route,{waitUntil:'domcontentloaded'});
  const issues=await page.evaluate(()=>{
   const visible=el=>el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;
   const result=[];
   for(const el of document.querySelectorAll('main section,main aside,main article,main figure')){
    if(!visible(el))continue;
    const style=getComputedStyle(el);
    if(style.backgroundImage.includes('gradient('))result.push({type:'gradient',element:el.className});
    if(parseFloat(style.borderRadius)>8&&style.boxShadow!=='none')result.push({type:'decorative-frame',element:el.className});
   }
   for(const el of document.querySelectorAll('main h1,main h2,main h3,main p')){
    if(!visible(el))continue;
    if(el.closest('.atelierVideoHero,.closingHero'))continue;
    const rgb=value=>(value.match(/[\d.]+/g)||[]).map(Number),colour=rgb(getComputedStyle(el).color);
    if(!colour.slice(0,3).every(n=>n>220))continue;
    let parent=el,background;
    while(parent){const style=getComputedStyle(parent);if(style.backgroundImage!=='none'){background=null;break;}const value=rgb(style.backgroundColor);if(value.length===3||value[3]>0.9){background=value;break;}parent=parent.parentElement;}
    if(background?.slice(0,3).every(n=>n>220))result.push({type:'light-on-light',text:el.textContent.trim().slice(0,90)});
   }
   for(const el of document.querySelectorAll('main img')){
    if(!visible(el))continue;const style=getComputedStyle(el),parts=style.aspectRatio.split('/').map(Number),ratio=parts[0]/(parts[1]||1),box=el.getBoundingClientRect();
    if(Number.isFinite(ratio)&&Math.abs(box.width/box.height-ratio)/ratio>.03)result.push({type:'image-ratio-conflict',element:el.className,alt:el.alt.slice(0,60),declared:style.aspectRatio,actual:Math.round(box.width)+'x'+Math.round(box.height)});
   }
   return result;
  });
  if(issues.length)findings.push({route,issues});
 }
 console.log(JSON.stringify({pages:sitePages.size,findings},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
