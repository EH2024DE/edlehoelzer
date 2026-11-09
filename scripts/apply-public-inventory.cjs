const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const snapshot=JSON.parse(fs.readFileSync(process.argv[2]||path.join(root,'logs/etsy-active-listings.json'),'utf8'));
if(!snapshot.fetchedAt||!Array.isArray(snapshot.listings)||snapshot.listings.length<1)throw new Error('A dated, nonempty public Etsy snapshot is required');
const file=path.join(root,'products.json'),catalog=JSON.parse(fs.readFileSync(file,'utf8'));
const listings=new Map(snapshot.listings.map(item=>[String(item.listing_id),item]));
let updated=0,unavailable=0;
for(const product of catalog.products){
  if(!product.active||product.availabilityStatus!=='available')continue;
  const listing=listings.get(String(product.listingId));
  if(listing&&Number.isInteger(listing.quantity)&&listing.quantity>=0){
    product.stock=listing.quantity;product.inventoryCheckedAt=snapshot.fetchedAt;updated++;
  }else if(!listing){
    product.active=false;product.stock=0;product.availabilityStatus='unavailable';
    product.inventoryCheckedAt=snapshot.fetchedAt;
    product.availabilityNote='Aktuell nicht im aktiven Etsy-Angebot. Eine ähnliche Anfertigung prüfen wir gerne auf Anfrage.';
    product.availabilityNoteEn='Not currently listed as active on Etsy. Ask us about a similar custom piece.';
    unavailable++;
  }
}
fs.writeFileSync(file,JSON.stringify(catalog,null,2)+'\n');
console.log({updated,unavailable,checkedAt:snapshot.fetchedAt,preserved:'Prices, made-to-order status and explicitly sold products'});
