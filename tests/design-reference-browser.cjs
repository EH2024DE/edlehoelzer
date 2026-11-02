const{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const base=process.env.REFERENCE_URL||'http://127.0.0.1:8184';
const output='/tmp/edle-design-system-qa';
(async()=>{
 const{references}=await import('../scripts/build-design-reference.mjs');
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch();const report=[];
 try{
  for(const width of [375,430,768,1024,1440])for(const [index,ref]of references.entries()){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',r=>{const url=new URL(r.request().url());return url.origin===new URL(base).origin||url.hostname==='i.etsystatic.com'?r.continue():r.abort();});
   await page.goto(base+ref.route,{waitUntil:'networkidle'});
   const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
   await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>Promise.race([img.decode().catch(()=>{}),new Promise(r=>setTimeout(r,4000))])));});
   const issues=await page.evaluate(()=>{
    const issues=[],visible=n=>{if(!n)return false;const r=n.getBoundingClientRect();return r.width>0&&r.height>0;};
    if(document.documentElement.scrollWidth>innerWidth+1)issues.push('horizontal overflow');
    if(document.querySelectorAll('main h1').length!==1)issues.push('H1 count');
    if(!document.fonts.check('400 17px "EH Sans"','ÄÖÜäöüß'))issues.push('font not ready');
    for(const n of document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button,main strong,main span,main li,main dt,main dd,main summary,main label,footer a'))if(visible(n)){
      const s=getComputedStyle(n);if(!s.fontFamily.includes('EH Sans'))issues.push('legacy font '+n.tagName+' '+n.textContent.slice(0,25)+' '+s.fontFamily);
      if(parseFloat(s.fontSize)<14)issues.push('small text '+n.tagName+' '+s.fontSize+' '+n.textContent.slice(0,25));
      if(n.matches('.btn,.pflege-btn')&&n.scrollWidth>n.clientWidth+2)issues.push('clipped CTA');
    }
    for(const n of document.querySelectorAll('main img'))if(visible(n)){
      const r=n.getBoundingClientRect(),s=getComputedStyle(n);if(n.complete&&!n.naturalWidth)issues.push('broken image '+n.getAttribute('src'));
      if(s.objectFit==='fill'&&n.naturalWidth&&Math.abs(r.width/r.height-n.naturalWidth/n.naturalHeight)>.05)issues.push('stretched image');
    }
    const media=document.querySelector('.productPreview__mainMedia');if(media){const r=media.getBoundingClientRect();if(Math.abs(r.width-r.height)>2)issues.push('non-square product media');}
    if(document.body.dataset.dsTemplate==='home'){
      const supporting=document.querySelector('.hero__supportingCopy'),hint=document.querySelector('.hero__finderHint'),actions=[...document.querySelectorAll('.hero__actions>a')];
      if(innerWidth<=760){
        if(visible(supporting)||visible(hint)||actions.filter(visible).length!==1)issues.push('mobile hero is not reduced to title and one action');
        const a=actions.find(visible)?.getBoundingClientRect(),play=document.querySelector('.hero__videoToggle')?.getBoundingClientRect();
        if(a&&play&&a.left<play.right&&a.right>play.left&&a.top<play.bottom&&a.bottom>play.top)issues.push('hero CTA overlaps video control');
      }else if(supporting&&!visible(supporting)||hint&&!visible(hint)||actions.filter(visible).length!==2)issues.push('desktop hero content changed');
    }
    return [...new Set(issues)];
   });
   const file=`after-${width}-${index}.jpg`;await page.screenshot({path:output+'/'+file,fullPage:true,type:'jpeg',quality:75});
   if([375,1440].includes(width)){
     await page.goto(base+'/before'+ref.route,{waitUntil:'networkidle'});
     const c=page.locator('[data-consent-necessary]');if(await c.isVisible())await c.click();
     await page.screenshot({path:`${output}/before-${width}-${index}.jpg`,fullPage:true,type:'jpeg',quality:75});
   }
   report.push({width,route:ref.route,issues,errors,file});console.log(width,ref.route,issues.length?'ISSUES '+issues.join('; '):'PASS');await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(base+'/design-reference/');
  await page.getByRole('tab',{name:'Werkstatt',exact:true}).click();
  if(await page.getByRole('tab',{name:'Werkstatt',exact:true}).getAttribute('aria-selected')!=='true')throw Error('Tabs selection');
  await page.getByRole('tab',{name:'Werkstatt',exact:true}).press('End');
  if(await page.getByRole('tab',{name:'Service',exact:true}).getAttribute('aria-selected')!=='true')throw Error('Tabs keyboard');
  const more=page.locator('.readMore__button');await more.click();if(await more.getAttribute('aria-expanded')!=='true')throw Error('Read more');await more.click();
  const faq=page.locator('.faqQuestion');await faq.click();if(await faq.getAttribute('aria-expanded')!=='true')throw Error('FAQ');
  await page.setViewportSize({width:375,height:900});if(await page.getByRole('tablist').isVisible())throw Error('Mobile tabs should become disclosures');await page.close();
 }finally{await browser.close();}
 fs.writeFileSync(output+'/report.json',JSON.stringify(report,null,2));const findings=report.filter(r=>r.issues.length||r.errors.length);console.log(JSON.stringify({views:report.length,findings,output},null,2));if(findings.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
