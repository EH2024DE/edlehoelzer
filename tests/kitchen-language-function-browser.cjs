const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright'),sharp=require(process.env.SHARP_MODULE||'sharp');
const engine=process.env.BROWSER_ENGINE||'chromium';
const root=path.resolve(__dirname,'..'),out='/tmp/edle-kitchen-language-function-'+engine+(process.env.KITCHEN_TEST_PHOTO?'-original':'-example');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await playwright[engine].launch(engine==='chromium'?{executablePath:process.env.CHROMIUM_PATH}:{}),results=[];
 try{
  for(const width of [375,1440])for(const en of [false,true]){
   const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<500}),errors=[],posts=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',req=>{if(req.method()==='POST')posts.push(req.url());});
   await page.addInitScript(()=>localStorage.setItem('edle-kitchen-photo-tips-seen','1'));
   await page.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8817')+'/brettvorschau/?listing=4455205567'+(en?'&lang=en':''),{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('#modelChoice').options.length>5);
   const canvas=page.locator('#renderer canvas');await canvas.waitFor({state:'visible'});
   const original=await canvas.screenshot(),stats=await sharp(original).stats();assert.ok(stats.channels.slice(0,3).some(c=>c.stdev>8));
   assert.equal(await page.locator('html').getAttribute('lang'),en?'en':'de');
   assert.equal(await page.getByRole('link',{name:en?'Choose another board':'Anderes Brett auswählen',exact:true}).getAttribute('href'),en?'/en/products.html':'/produkte.html');
   if(en){
    const names=await page.locator('#modelChoice option').allTextContents();assert.ok(names.every(n=>!/Eiche|Nussbaum|Buche|Stirnholz|Schweizer|Griffen|Maß/.test(n)),names.join('\n'));
    assert.equal(await page.locator('#room').innerText(),'Your worktop');
   }
   await page.locator('#angle').fill('45');await page.locator('#angle').dispatchEvent('input');
   await page.waitForFunction(()=>document.querySelector('#angleValue').textContent.includes('45'));assert.ok(!original.equals(await canvas.screenshot()));
   await page.locator('#expand').click();assert.equal(await page.locator('.workspace').evaluate(n=>n.classList.contains('expanded')),true);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.workspace').evaluate(n=>n.classList.contains('expanded')),false);
   await page.locator('#file').setInputFiles({name:'unsupported.heic',mimeType:'image/heic',buffer:Buffer.from('test')});
   await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('HEIC'));
   assert.ok((await page.locator('#status').innerText()).includes(en?'Choose a JPEG':'Bitte ein JPEG'));
   await page.locator('#file').setInputFiles(process.env.KITCHEN_TEST_PHOTO||path.join(root,'tools/kitchen-preview/assets/worktop-example.jpg'));
   await page.locator('#calibration').waitFor({state:'visible'});
   await page.locator('#detect').click();
   await page.waitForFunction(()=>!document.querySelector('#detect').disabled,{},{timeout:90000});
   const detection=await page.locator('#status').innerText();
   assert.ok(await page.locator('#apply').isEnabled(),'A4 detection should propose the known reference photo: '+detection);
   assert.equal(await page.locator('#markers circle').count(),4);
   await page.locator('#editReference').click();await page.locator('.reference-editor').waitFor({state:'visible'});
   await page.locator('.editor-canvas').press('ArrowRight');await page.locator('.editor-save').click();
   await page.locator('#apply').click();await page.locator('#recalibrate').waitFor({state:'visible'});
   assert.ok((await page.locator('#status').innerText()).includes(en?'Reference confirmed':'Referenz übernommen'));
   assert.equal(await page.locator('#markers circle').count(),0);
   assert.ok(await page.locator('#purchase').isVisible());assert.match(await page.locator('#purchase').getAttribute('href'),/^https:\/\/www\.etsy\.com\//);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('#stage').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${en?'en':'de'}-${width}-placed.png`});
   await page.getByRole('button',{name:en?'Save comparison view':'Ansicht zum Vergleich merken',exact:true}).click();
   assert.equal(await page.locator('.saved-views .saved-view-buy').count(),1);
   await page.waitForFunction(()=>new Promise(resolve=>{const request=indexedDB.open('edle-worktop-preview',1);request.onerror=()=>resolve(false);request.onsuccess=()=>{const db=request.result,read=db.transaction('photos','readonly').objectStore('photos').get('worktop');read.onsuccess=()=>{const saved=read.result;db.close();resolve(!!saved?.confirmed);};read.onerror=()=>{db.close();resolve(false);};};}),{},{timeout:10000}).catch(async error=>{console.log('Photo cache diagnostics',await page.evaluate(()=>({memory:!!window.__edleWorktopPhoto?.confirmed,status:document.querySelector('#status').textContent})));throw error;});
   await page.goto((process.env.REFERENCE_URL||'http://127.0.0.1:8817')+'/brettvorschau/?listing=4370769708'+(en?'&lang=en':''),{waitUntil:'networkidle'});
   await page.locator('#recalibrate').waitFor({state:'visible',timeout:10000}).catch(async error=>{console.log('Restored photo diagnostics',await page.evaluate(async()=>({status:document.querySelector('#status').textContent,photo:[document.querySelector('#photo').naturalWidth,document.querySelector('#photo').naturalHeight],apply:{hidden:document.querySelector('#apply').hidden,disabled:document.querySelector('#apply').disabled},memory:window.__edleWorktopPhoto?{confirmed:window.__edleWorktopPhoto.confirmed,proposed:window.__edleWorktopPhoto.proposed,type:window.__edleWorktopPhoto.file?.type}:null})));throw error;});
   await page.waitForFunction(()=>document.querySelector('#size').textContent.includes('004'));
   assert.equal(await page.locator('#purchase').isVisible(),false,'Archived reference boards must not show a buy button');
   await page.getByRole('button',{name:en?'Save comparison view':'Ansicht zum Vergleich merken',exact:true}).click();
   assert.equal(await page.locator('.saved-views-grid article').count(),2);
   assert.equal(await page.locator('.saved-views .saved-view-buy').count(),1,'Only the available saved model has a purchase action');
   await page.locator('#recalibrate').click();assert.equal(await page.locator('#markers circle').count(),4);
   assert.deepEqual(errors,[]);assert.deepEqual(posts,[],'Kitchen photos must not be posted');
   results.push({width,language:en?'en':'de',detection,photoUploadLocalOnly:true,placement:true,cornerEditing:true,fullscreenEscape:true});await page.close();
  }
  fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2)+'\n');console.log({passed:true,results,out});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
