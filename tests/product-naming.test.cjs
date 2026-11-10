const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),catalog=require('../products.json').products,migrations=require('../data/product-url-migration.json');
test('reviewed product names are concise, bilingual and have unique readable URLs',()=>{
  assert.equal(new Set(migrations.map(p=>p.productPath)).size,migrations.length);
  for(const item of migrations){
    const product=catalog.find(p=>p.listingId===item.listingId);
    assert.equal(product.displayName,item.de);assert.equal(product.productPath,item.productPath);
    assert.ok(item.de.length<=65&&item.en.length<=75,item.de);
    assert.match(item.productPath,/^\/produkte\/[a-z0-9-]+\/$/);
    assert.ok(!item.productPath.includes(item.listingId));
    for(const en of [false,true]){
      const prefix=en?'/en':'',html=fs.readFileSync(path.join(root,(prefix+item.productPath).slice(1),'index.html'),'utf8');
      assert.ok(html.includes('<title>'),item.productPath);
      assert.ok(html.includes('https://edlehoelzer.de'+prefix+item.productPath));
      assert.ok(!html.includes('http-equiv="refresh"'));
      const old=fs.readFileSync(path.join(root,(prefix+item.previousPath).slice(1),'index.html'),'utf8');
      assert.ok(old.includes('content="0;url='+prefix+item.productPath+'"'));
      assert.ok(old.includes('location.search+location.hash'));
      const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
      assert.ok(sitemap.includes('<loc>https://edlehoelzer.de'+prefix+item.productPath+'</loc>'));
      assert.ok(!sitemap.includes('<loc>https://edlehoelzer.de'+prefix+item.previousPath+'</loc>'));
      const redirects=fs.readFileSync(path.join(root,'config/cloudflare-bulk-redirects.csv'),'utf8');
      assert.ok(redirects.includes('https://edlehoelzer.de'+prefix+item.previousPath+',https://edlehoelzer.de'+prefix+item.productPath+',301,'));
    }
  }
});
test('new page titles and product schema use the reviewed short names',async()=>{
  const {parse}=await import('parse5');const {walk,attr,text}=await import('../scripts/audit-design-system.mjs');
  for(const item of migrations)for(const en of [false,true]){
    const file=((en?'/en':'')+item.productPath).slice(1)+'index.html';
    const nodes=walk(parse(fs.readFileSync(path.join(root,file),'utf8'))),title=en?item.en:item.de;
    assert.equal(text(nodes.find(n=>n.tagName==='h1')),title);
    assert.equal(text(nodes.find(n=>n.tagName==='title')),title+' | Edle Hölzer');
    const schema=JSON.parse(text(nodes.find(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json')));
    assert.equal(schema.name,title);
    assert.equal(attr(nodes.find(n=>n.tagName==='meta'&&attr(n,'property')==='og:title'),'content'),title);
  }
});
