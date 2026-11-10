import fs from 'node:fs';

// This configuration deliberately contains only unquoted URL/boolean fields.
const csv=fs.readFileSync('config/cloudflare-bulk-redirects.csv','utf8').trim();
if(csv.includes('"'))throw Error('Quoted CSV fields require a CSV parser');
const [header,...lines]=csv.split(/\r?\n/).map(line=>line.split(','));
const rules=lines.map(values=>{if(values.length!==header.length)throw Error('Invalid redirect row');return Object.fromEntries(header.map((key,i)=>[key,values[i]]));});
const queue=rules.flatMap(rule=>[false,true].map(query=>({rule,query}))),results=[];
async function worker(){
  while(queue.length){
    const {rule,query}=queue.shift(),source=new URL(rule.source_url),target=new URL(rule.target_url);
    if(query){source.searchParams.set('redirect_check','20261110');if(rule.preserve_query_string==='true')target.search=source.search;}
    try{
      const response=await fetch(source,{redirect:'manual',signal:AbortSignal.timeout(20000)});
      const location=response.headers.get('location'),html=response.status===200?await response.text():'';
      results.push({source:source.href,expectedStatus:Number(rule.status_code),expectedLocation:target.href,status:response.status,location,server:response.headers.get('server'),htmlFallback:/http-equiv=["']refresh["']/i.test(html),passed:response.status===Number(rule.status_code)&&location!==null&&new URL(location,source).href===target.href});
    }catch(error){results.push({source:source.href,passed:false,error:error.message});}
  }
}
await Promise.all(Array.from({length:4},worker));
results.sort((a,b)=>a.source.localeCompare(b.source));
const report={checkedAt:new Date().toISOString(),rules:rules.length,requests:results.length,passed:results.filter(r=>r.passed).length,htmlFallbacks:results.filter(r=>r.htmlFallback).length,results};
fs.writeFileSync('docs/http-redirect-audit-2026-11-10.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({rules:report.rules,requests:report.requests,passed:report.passed,htmlFallbacks:report.htmlFallbacks,firstResult:results[0]},null,2));
if(report.passed!==report.requests)process.exitCode=1;
