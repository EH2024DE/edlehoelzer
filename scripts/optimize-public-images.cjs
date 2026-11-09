const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const root=path.resolve(__dirname,'..');
const sourceRef=process.argv[2];
if(!sourceRef)throw new Error('Pass the original Git revision to avoid repeatedly recompressing derivatives.');
const files=[
  'assets/geschenkset-erster-entwurf-800.jpg','assets/geschenkset-erster-entwurf-1200.jpg',
  'assets/kuechenutensilien-set-geschenkbox-800.jpg','assets/kuechenutensilien-set-geschenkbox-1200.jpg',
  'assets/kitchen-preview-example.jpg','assets/reviews/etsy-review-202609-marlena-buche.jpg'
];
(async()=>{
  const report=[];
  for(const file of files){
    const full=path.join(root,file),input=execFileSync('git',['show',sourceRef+':'+file],{cwd:root,maxBuffer:16*1024*1024}),meta=await sharp(input).metadata();
    const resize=file.includes('/reviews/')?{width:2400,height:2400,fit:'inside',withoutEnlargement:true}:null;
    const pipeline=()=>{let image=sharp(input).rotate().toColourspace('srgb');return resize?image.resize(resize):image;};
    const output=await pipeline().jpeg({quality:resize?76:86,mozjpeg:true}).toBuffer();
    const after=await sharp(output).metadata();
    if(after.exif||after.xmp||after.iptc)throw new Error('Metadata remains: '+file);
    const reference=await pipeline().removeAlpha().raw().toBuffer(),decoded=await sharp(output).removeAlpha().raw().toBuffer();
    if(reference.length!==decoded.length)throw new Error('Unexpected geometry: '+file);
    let difference=0;for(let i=0;i<reference.length;i++)difference+=Math.abs(reference[i]-decoded[i]);
    const meanError=difference/reference.length;
    if(meanError>4)throw new Error('Excessive colour difference: '+file);
    if(output.length>=input.length)throw new Error('No size saving: '+file);
    if(!resize&&(after.width!==meta.width||after.height!==meta.height))throw new Error('Unexpected dimensions: '+file);
    fs.writeFileSync(full,output);
    report.push({file,before:input.length,after:output.length,width:after.width,height:after.height,meanError:Number(meanError.toFixed(2))});
  }
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
