const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const file of [path.resolve(root,'../listing-generator/.env'),path.resolve(root,'../.env'),path.join(root,'.env')])if(fs.existsSync(file))process.loadEnvFile(file);
const key=process.env.ETSY_API_KEY_HEADER||(process.env.ETSY_API_KEY&&process.env.ETSY_SHARED_SECRET?process.env.ETSY_API_KEY+':'+process.env.ETSY_SHARED_SECRET:process.env.ETSY_API_KEY);
const token=process.env.ETSY_ACCESS_TOKEN||process.env.ETSY_OAUTH_TOKEN;
const ids=process.argv.slice(2).filter(value=>/^\d+$/.test(value));
if(!ids.length)ids.push('4471048251','4470469056','4549962555','1874454440','4417507555');
(async()=>{
  if(!key||!token){console.log(JSON.stringify({available:false,reason:'Inventory read authorization is not configured'}));return;}
  const results=[];
  for(const id of ids){
    const response=await fetch('https://openapi.etsy.com/v3/application/listings/'+id+'/inventory',{headers:{'x-api-key':key,Authorization:'Bearer '+token,Accept:'application/json'},signal:AbortSignal.timeout(15000)});
    if(!response.ok){results.push({listingId:id,status:response.status});continue;}
    const data=await response.json();
    results.push({listingId:id,status:response.status,quantityOnProperty:data.quantity_on_property||[],variants:(data.products||[]).filter(p=>!p.is_deleted).map(p=>({properties:(p.property_values||[]).map(v=>({id:v.property_id,name:v.property_name,values:v.values})),offerings:(p.offerings||[]).filter(o=>!o.is_deleted).map(o=>({quantity:o.quantity,enabled:o.is_enabled}))}))});
  }
  const snapshot={checkedAt:new Date().toISOString(),results};
  fs.mkdirSync(path.join(root,'logs'),{recursive:true});fs.writeFileSync(path.join(root,'logs/etsy-wood-stock.json'),JSON.stringify(snapshot,null,2)+'\n');
  console.log(JSON.stringify({checkedAt:snapshot.checkedAt,listings:results.map(r=>({listingId:r.listingId,status:r.status,variants:r.variants?.length||0})),saved:'logs/etsy-wood-stock.json'},null,2));
})().catch(error=>{console.error(error.name==='TimeoutError'?'Inventory read timed out':'Inventory read failed; no catalogue changes made');process.exitCode=1;});
