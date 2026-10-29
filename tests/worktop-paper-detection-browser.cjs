const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const photo=process.env.TEST_WORKTOP_PHOTO;
if(!photo)throw new Error('Set TEST_WORKTOP_PHOTO to a local regression photo; private images must not be committed.');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--enable-unsafe-swiftshader']});
 try{for(const width of [430,1440]){
  const results=[];
  for(const legacy of [true,false]){
   const page=await browser.newPage({viewport:{width,height:950}}),errors=[],blocked=[],uploads=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&/Content Security|Aborted|wasm/i.test(e.text()))blocked.push(e.text());});
   page.on('request',request=>{if(request.method()==='POST')uploads.push(request.url());});
   if(legacy){const old=execFileSync('git',['show','HEAD:brettvorschau/index.html'],{encoding:'utf8'}).replace(/<link[^>]+fonts\.googleapis[^>]+>/g,'');await page.route('**/brettvorschau/?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:old});});}
   await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:8170')+'/brettvorschau/?listing=4370769708',{waitUntil:'domcontentloaded'});
   const tips=page.getByRole('button',{name:'Alles klar',exact:true});if(await tips.isVisible())await tips.click();
   await page.locator('#file').setInputFiles(photo);await page.waitForTimeout(500);
   await page.locator('#detect').click();await page.waitForFunction(()=>!document.querySelector('#detect').disabled,null,{timeout:60000});
   const status=await page.locator('#status').innerText();assert.match(status,/Blattecken vorgeschlagen/);
   const points=await page.locator('#markers').evaluate(el=>{const box=el.viewBox.baseVal;return [...el.querySelectorAll('circle')].map(c=>[Number(c.getAttribute('cx'))/box.width,Number(c.getAttribute('cy'))/box.height]);});
   assert.equal(points.length,4);assert.deepEqual(blocked,[]);assert.deepEqual(errors,[]);assert.deepEqual(uploads,[]);
   results.push(points);console.log(JSON.stringify({width,layout:legacy?'legacy':'new',status,points}));
   if(!legacy)await page.screenshot({path:`/tmp/edle-shop-preview/a4-automatic-${width}.png`,fullPage:true});
   await page.close();
  }
  for(let i=0;i<4;i++)for(let axis=0;axis<2;axis++)assert.ok(Math.abs(results[0][i][axis]-results[1][i][axis])<.003,'layout must not alter detected coordinates');
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
