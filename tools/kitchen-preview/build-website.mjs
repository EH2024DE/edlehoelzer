import { build } from 'vite';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import extra from './additional-models.js';
const root=fileURLToPath(new URL('.',import.meta.url));
const output=path.resolve(root,root.includes('/tools/kitchen-preview/')?'../../brettvorschau':'../github-pr/brettvorschau');
const eligible=JSON.parse(await readFile(path.join(root,'preview-eligibility.json'),'utf8'));
const catalog={walnut:{listingId:'4297472161',name:'Nussbaum & Eiche',image:'/assets/walnut.jpg',w:48,d:36.5,h:4.2},oak:{listingId:'4455205567',name:'Eiche Stirnholz',image:'/assets/oak.jpg',w:41.5,d:39.8,h:5},...extra};
await build({root,base:'/brettvorschau/',publicDir:false,build:{outDir:output,emptyOutDir:true,chunkSizeWarningLimit:1500}});
const models=Object.values(catalog).filter(model=>eligible.listingIds.includes(model.listingId));
const missing=eligible.listingIds.filter(id=>!models.some(model=>model.listingId===id));
if(missing.length)throw new Error(`Missing premium-board models: ${missing.join(', ')}`);
for(const model of models){
  const relative=model.image.replace(/^\//,'');
  await mkdir(path.dirname(path.join(output,relative)),{recursive:true});
  await copyFile(path.join(root,relative),path.join(output,relative));
}
await writeFile(path.join(output,'models.json'),JSON.stringify(models.map(model=>({
  listingId:model.listingId,name:model.name,image:'/brettvorschau'+model.image,dimensions:model.dimensionLabel || `${model.approximateDimensions ? 'ca. ' : ''}${model.w} × ${model.d} × ${model.h} cm`
})),null,2)+'\n');
await copyFile(path.join(root,'vendor/LICENSE-perspective-transform'),path.join(output,'LICENSE-perspective-transform'));
await copyFile(path.join(root,'assets/worktop-example.jpg'),path.join(output,'assets/worktop-example.jpg'));
console.log(`Website preview built with ${models.length} models. Private photos and local review data excluded.`);
