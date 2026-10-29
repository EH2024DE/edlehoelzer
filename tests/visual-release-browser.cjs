const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8172';
const output=process.env.VISUAL_OUTPUT||'/tmp/edle-visual-release';
const widths=(process.env.VISUAL_WIDTHS||'375,430,768,1024,1440').split(',').map(Number);
(async()=>{
  const {sitePages}=await import('../tools/shop-server/site-preview.mjs');
  for(const route of ['/brettvorschau/','/suche/','/en/search/'])sitePages.set(route,route.slice(1)+'index.html');
  const sharp=require('../tools/shop-server/node_modules/sharp');
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  const reports=[];
  try{
    for(const width of widths){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      await page.route('**/*',route=>{
        const url=new URL(route.request().url());
        return url.origin===new URL(base).origin||url.hostname==='i.etsystatic.com'?route.continue():route.abort();
      });
      let number=0;
      const tiles=[];
      for(const route of sitePages.keys()){
        const errors=[],violations=[];
        const onError=error=>errors.push(error.message);
        const onConsole=entry=>{if(entry.type()==='error'&&/Content Security Policy|violates.*directive/i.test(entry.text()))violations.push(entry.text());};
        page.on('pageerror',onError);page.on('console',onConsole);
        const response=await page.goto(base+route,{waitUntil:'networkidle'});
        const consent=page.getByRole('button',{name:/^(Nur notwendige|Necessary only|Only necessary)$/i});
        if(await consent.count()&&await consent.first().isVisible())await consent.first().click();
        await page.evaluate(async()=>{
          await document.fonts.ready;
          for(const image of document.images)image.loading='eager';
          await Promise.all([...document.images].map(image=>Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,5000))])));
        });
        const issues=await page.evaluate(()=>{
          const visible=node=>{const r=node.getBoundingClientRect(),s=getComputedStyle(node);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
          const issues=[];
          if(document.documentElement.scrollWidth>innerWidth+1)issues.push('horizontal overflow');
          for(const image of document.querySelectorAll('main img'))if(visible(image)){
            const rect=image.getBoundingClientRect(),style=getComputedStyle(image);
            if(image.complete&&!image.naturalWidth)issues.push('broken image: '+image.getAttribute('src'));
            if(!image.complete)issues.push('image not loaded: '+image.getAttribute('src'));
            if(image.naturalWidth&&Math.abs(rect.width/rect.height-image.naturalWidth/image.naturalHeight)>0.05&&style.objectFit==='fill')issues.push('stretched image: '+image.getAttribute('src'));
          }
          for(const media of document.querySelectorAll('.productPreview__mainMedia,.productCard__media'))if(visible(media)){
            const rect=media.getBoundingClientRect();
            if(Math.abs(rect.width-rect.height)>2)issues.push('non-square product media: '+media.className+' '+Math.round(rect.width)+'x'+Math.round(rect.height));
          }
          for(const node of document.querySelectorAll('main h1, main h2,main h3, main button,main select,main input,main textarea')){
            if(!visible(node))continue;
            const style=getComputedStyle(node);
            if(/Playfair/i.test(style.fontFamily))issues.push('old display font: '+node.tagName);
            if(node.tagName==='BUTTON'&&node.scrollWidth>node.clientWidth+3)issues.push('clipped button: '+node.textContent.trim().slice(0,50));
          }
          return issues;
        });
        const filename=`${width}-${String(++number).padStart(3,'0')}.jpg`;
        const bytes=await page.screenshot({path:path.join(output,filename),fullPage:true,type:'jpeg',quality:65});
        const imageHeight=(await sharp(bytes).metadata()).height;
        const preview=await sharp(bytes).extract({left:0,top:0,width,height:Math.min(imageHeight,Math.round(width*1.75))}).resize({width:240,height:420,fit:'contain',background:'#e9e9e9'}).jpeg().toBuffer();
        tiles.push(preview);
        const images=await page.locator('main img').evaluateAll(nodes=>nodes.map(image=>{const r=image.getBoundingClientRect(),s=getComputedStyle(image);return {src:image.getAttribute('src'),width:r.width,height:r.height,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,fit:s.objectFit,position:s.objectPosition};}));
        reports.push({width,route,file:filename,status:response.status(),errors,violations,issues,images});
        page.off('pageerror',onError);page.off('console',onConsole);
        if(number%25===0)console.log(`${width}: ${number}/${sitePages.size}`);
      }
      for(let start=0;start<tiles.length;start+=20){
        const group=tiles.slice(start,start+20);
        await sharp({create:{width:1200,height:Math.ceil(group.length/5)*420,channels:3,background:'#e9e9e9'}}).composite(group.map((input,index)=>({input,left:index%5*240,top:Math.floor(index/5)*420}))).jpeg({quality:85}).toFile(path.join(output,`sheet-${width}-${start+1}.jpg`));
      }
      await page.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(reports,null,2));
  const findings=reports.filter(row=>row.status!==200||row.errors.length||row.violations.length||row.issues.length);
  console.log(JSON.stringify({views:reports.length,findings,output},null,2));
  if(findings.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
