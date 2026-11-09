const fs=require('node:fs');
const path=require('node:path');
const source=process.argv[2];
if(!source)throw new Error('Pass the camera ingest directory as the first argument.');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const output=path.join(__dirname,'../assets/team');
fs.mkdirSync(output,{recursive:true});
(async()=>{
  for(const [name,target,widths] of [
    ['Edle_Hoelzer_Portrait_Oezguer.jpg','oezguer',[480,800]],
    ['Edle_Hoelzer_Portrait_Serkan.jpg','serkan',[480,800]],
    ['Edle_Hoelzer_Ueber_Uns_Portraits_Oezguer_Workshop.jpg','oezguer-workshop',[800,1400]]
  ])for(const width of widths){
    const file=path.join(output,`${target}-${width}.webp`);
    await sharp(path.join(source,name)).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(file);
    console.log(path.basename(file),fs.statSync(file).size);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
