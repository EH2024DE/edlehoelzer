const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const plan=JSON.parse(read('data/product-naming-2026-11-09.json'));
const catalog=JSON.parse(read('products.json'));
const migrationFile='data/product-url-migration.json';
const previous=fs.existsSync(path.join(root,migrationFile))?JSON.parse(read(migrationFile)):[];
const migrations=plan.products.map(item=>{
  const product=catalog.products.find(p=>p.listingId===item.listingId);
  if(!product)throw Error('Unknown product '+item.listingId);
  const old=previous.find(p=>p.listingId===item.listingId);
  return {...item,previousTitle:old?.previousTitle||product.displayName,previousPath:old?.previousPath||product.productPath,productPath:'/produkte/'+item.slug+'/'};
});
if(new Set(migrations.map(p=>p.productPath)).size!==migrations.length)throw Error('Duplicate product URL');
for(const item of migrations){
  const product=catalog.products.find(p=>p.listingId===item.listingId);
  if(catalog.products.some(p=>p.listingId!==item.listingId&&p.productPath===item.productPath))throw Error('URL collision '+item.productPath);
  product.displayName=item.de;product.productPath=item.productPath;
}
for(const product of catalog.products.filter(p=>p.canonicalProductId)){
  const owner=catalog.products.find(p=>p.id===product.canonicalProductId);
  if(!owner)throw Error('Missing canonical product '+product.canonicalProductId);
  product.productPath=owner.productPath;
}
fs.writeFileSync(path.join(root,migrationFile),JSON.stringify(migrations,null,2)+'\n');
fs.writeFileSync(path.join(root,'products.json'),JSON.stringify(catalog,null,2)+'\n');
const translations=Object.fromEntries(migrations.map(p=>[p.de,p.en]));
let main=read('main.js').replace(/\n    \/\/ BEGIN reviewed product names[\s\S]*?\/\/ END reviewed product names\n/,'\n');
main=main.replace('  var names = {','  var names = {\n    // BEGIN reviewed product names\n'+Object.entries(translations).map(([de,en])=>'    '+JSON.stringify(de)+': '+JSON.stringify(en)+',').join('\n')+'\n    // END reviewed product names');
fs.writeFileSync(path.join(root,'main.js'),main);
// Rebuild only reviewed products; archived pages keep their own original titles.
for(const item of migrations)execFileSync(process.execPath,['scripts/build-product-pages.cjs','--listing='+item.listingId],{cwd:root,stdio:'pipe'});
const oldFiles=new Set(migrations.flatMap(p=>[p.previousPath.slice(1)+'index.html','en'+p.previousPath+'index.html']));
const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(file=>/\.(html|js)$/.test(file)&&!file.startsWith('tests/')&&!file.startsWith('docs/')&&!file.startsWith('scripts/')&&!oldFiles.has(file));
for(const file of files){
  let source=read(file),updated=source;
  for(const item of migrations)updated=updated.replaceAll(item.previousPath,item.productPath);
  if(updated!==source)fs.writeFileSync(path.join(root,file),updated);
}
for(const item of migrations)for(const en of [false,true]){
  const old=(en?'/en':'')+item.previousPath,target=(en?'/en':'')+item.productPath;
  const label=en?'This product has moved.':'Dieses Produkt hat eine neue Adresse.';
  const html=`<!doctype html>\n<html lang="${en?'en':'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${label} | Edle Hölzer</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://edlehoelzer.de${target}"><meta http-equiv="refresh" content="0;url=${target}"></head><body><p>${label} <a href="${target}">${en?'View product':'Produkt ansehen'}</a></p><script>location.replace(${JSON.stringify(target)}+location.search+location.hash);</script></body></html>\n`;
  fs.writeFileSync(path.join(root,old.slice(1),'index.html'),html);
}
const csvFile='config/cloudflare-bulk-redirects.csv';
let rows=read(csvFile).trim().split('\n').filter(row=>!migrations.some(p=>row.startsWith('https://edlehoelzer.de'+p.previousPath+',')||row.startsWith('https://edlehoelzer.de/en'+p.previousPath+',')));
for(const item of migrations)for(const prefix of ['','/en'])rows.push(`https://edlehoelzer.de${prefix}${item.previousPath},https://edlehoelzer.de${prefix}${item.productPath},301,false,false,true,false`);
fs.writeFileSync(path.join(root,csvFile),rows.join('\n')+'\n');
console.log('Reviewed product names and URL migrations:',migrations.length);
