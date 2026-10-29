import fs from 'node:fs';
import path from 'node:path';
import sharp from '../tools/shop-server/node_modules/sharp/dist/index.mjs';
import {ROOT} from '../tools/shop-server/catalog.mjs';
const steps=JSON.parse(fs.readFileSync(path.join(ROOT,'data/atelier-craft-steps.json')));
const dir=path.join(ROOT,'assets/erbstueck-entstehung');
fs.mkdirSync(path.join(dir,'cropped'),{recursive:true});
for(const step of steps.filter(step=>step.file)){
  const input=path.join(dir,step.file+'.jpg');
  const {width,height}=await sharp(input).metadata();
  if(step.cropTop<152 || step.cropTop+width>1039 || step.cropTop+width>height)throw new Error('Crop crosses photograph boundary: '+step.file);
  await sharp(input).extract({left:0,top:step.cropTop,width,height:width}).webp({quality:90}).toFile(path.join(dir,'cropped',step.file+'.webp'));
}
console.log('Created 17 square photo-only crops; originals unchanged.');
