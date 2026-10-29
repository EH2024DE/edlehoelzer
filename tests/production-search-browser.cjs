const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.PREVIEW_URL||'http://127.0.0.1:8171';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try{for(const width of [375,430,768,1024,1440])for(const en of [false,true]){
    const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+(en?'/en/':'/'));
    const consent=page.locator('[data-consent-necessary]');if(await consent.isVisible())await consent.click();
    const menu=page.locator('[data-menu-open]');await menu.click();
    await page.locator('#atelier-menu[open]').waitFor();await page.keyboard.press('Escape');
    await page.locator('#atelier-menu[open]').waitFor({state:'hidden'});
    await page.waitForFunction(()=>document.querySelector('[data-menu-open]').getAttribute('aria-expanded')==='false');
    assert.equal(await menu.getAttribute('aria-expanded'),'false');
    assert.equal(await menu.evaluate(node=>node===document.activeElement),true);
    await page.locator('.siteSearchLink').click();
    await page.locator('#header-search [name=q]').fill(en?'walnut':'Walnuss');
    await page.locator('#header-search [name=q]').press('Enter');
    await page.waitForURL(base+(en?'/en/search/':'/suche/')+'**');
    await page.locator('.searchProduct__open').first().waitFor();
    assert.match(await page.locator('#search-status').innerText(),en?/products and/:/Produkte und/);
    const links=await page.locator('.searchProduct__open').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
    assert.ok(links.length>0);assert.ok(links.every(href=>href.startsWith(en?'/en/produkte/':'/produkte/')));
    const articles=await page.locator('.searchArticles a').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
    assert.ok(articles.every(href=>href.startsWith('/en/')===en),'guide results stay in their language');
    if(en)assert.match(await page.locator('.searchProduct__open').first().innerText(),/Walnut/i);
    await page.locator('#search-query').fill('zzzznomatch');await page.locator('#site-search button').click();
    await page.locator('#search-results').getByText(en?'Try oak, walnut, care or engraving.':'Probiere zum Beispiel Eiche, Nussbaum, Pflege oder Gravur.',{exact:true}).waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
    await page.close();console.log(`PASS ${en?'EN':'DE'} ${width}: menu keyboard, localized header search, products, guides, empty state`);
  }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
