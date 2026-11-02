const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
const output=process.env.DESIGN_ROUTE?'/tmp/edle-design-site-qa-filtered':'/tmp/edle-design-site-qa';
(async()=>{
  const {sitePages}=await import('../scripts/build-design-site.mjs');
  const pages=sitePages().filter(p=>!process.env.DESIGN_ROUTE||process.env.DESIGN_ROUTE.split(',').some(part=>p.route.includes(part)));
  const widths=(process.env.DESIGN_WIDTHS||'375,1440').split(',').map(Number);
  fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report=[];
  try{
    for(const width of widths){
      const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
      await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===new URL(base).origin||u.hostname==='i.etsystatic.com'?r.continue():r.abort();});
      for(const [index,ref] of pages.entries()){
        const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
        try{
          const response=await page.goto(base+ref.route,{waitUntil:'load',timeout:30000});
          if(await page.locator('[data-product-page]').count())await page.locator('[data-product-package]').waitFor({timeout:10000});
          const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
          await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>Promise.race([img.decode().catch(()=>{}),new Promise(r=>setTimeout(r,2000))])));});
          const result=await page.evaluate(()=>{
            const issues=[],unknown=[];const visible=n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>2&&r.height>2&&s.visibility!=='hidden'&&Number(s.opacity)>.05&&s.clipPath!=='inset(50%)';};
            const rgba=s=>{const m=s.match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2],m[3]===undefined?1:+m[3]]:[0,0,0,0];};
            const blend=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3]));
            const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
            const describe=n=>n.tagName.toLowerCase()+(n.className&&typeof n.className==='string'?'.'+n.className.trim().replace(/\s+/g,'.'):'');
            if(document.documentElement.scrollWidth>innerWidth+2)issues.push({type:'overflow',excess:document.documentElement.scrollWidth-innerWidth});
            if(document.querySelectorAll('h1').length!==1)issues.push({type:'h1-count',count:document.querySelectorAll('h1').length});
            const tree=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
            while(node=tree.nextNode()){
              const n=node.parentElement;if(!node.textContent.trim()||!n||n.closest('script,style,svg,noscript,[aria-hidden=true],.sr-only')||!visible(n))continue;
              const s=getComputedStyle(n),size=parseFloat(s.fontSize),element=describe(n),sample=node.textContent.trim().slice(0,70);
              if(!s.fontFamily.includes('EH Sans'))issues.push({type:'font',element,sample,font:s.fontFamily});
              if(size<14)issues.push({type:'small-text',element,sample,size});
              let bg=[255,255,255],photo=false;const chain=[];for(let p=n;p;p=p.parentElement)chain.unshift(p);
              for(const p of chain){const c=getComputedStyle(p);if(c.backgroundImage!=='none')photo=true;bg=blend(rgba(c.backgroundColor),bg);}
              if(photo){unknown.push(element);continue;}
              if(s.opacity<1||n.closest('button:disabled,[aria-disabled=true]'))continue;
              const fg=blend(rgba(s.color),bg),l1=lum(fg),l2=lum(bg),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05),required=size>=24||size>=18.66&&+s.fontWeight>=700?3:4.5;
              if(ratio+.02<required)issues.push({type:'contrast',element,sample,ratio:+ratio.toFixed(2),foreground:s.color,background:bg.map(Math.round)});
            }
            for(const n of document.querySelectorAll('main img'))if(visible(n)){
              const r=n.getBoundingClientRect(),s=getComputedStyle(n);
              if(n.complete&&!n.naturalWidth)issues.push({type:'broken-image',src:n.getAttribute('src')});
              if(s.objectFit==='fill'&&n.naturalWidth&&Math.abs(r.width/r.height-n.naturalWidth/n.naturalHeight)>.05)issues.push({type:'image-distortion',element:describe(n),src:n.getAttribute('src')});
            }
            return {issues:[...new Map(issues.map(i=>[JSON.stringify(i),i])).values()],imageBackgroundText:[...new Set(unknown)]};
          });
          const file=`${width}-${index}.jpg`;await page.screenshot({path:output+'/'+file,type:'jpeg',quality:65});
          report.push({route:ref.route,template:ref.template,width,status:response.status(),...result,errors,screenshot:file});
          fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2));
          console.log(width,ref.route,result.issues.length?result.issues.length+' findings':'PASS');
        }catch(error){report.push({route:ref.route,width,errors:[error.message],issues:[]});console.log('ERROR',ref.route,error.message);}
        await page.close();
      }
      await context.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2));
  const findings=report.filter(r=>r.status!==200||r.issues.length||r.errors.length);console.log(JSON.stringify({views:report.length,pages:pages.length,findings:findings.length,output}));if(findings.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
