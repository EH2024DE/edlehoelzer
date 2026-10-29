const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const files=['production-inquiry-browser.cjs','production-search-browser.cjs','catalog-filters-browser.cjs','production-worktop-canvas-browser.cjs'];
const results=[];
for(const file of files){
  const result=spawnSync(process.execPath,['tests/'+file],{stdio:'inherit',env:process.env});
  results.push({file,status:result.status,error:result.error?.message});
}
fs.writeFileSync('/tmp/edle-design-interactions.json',JSON.stringify(results,null,2));
if(results.some(result=>result.status!==0))process.exitCode=1;
