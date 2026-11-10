import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import models from './additional-models.js';
const source=fs.readFileSync(new URL('./i18n.js',import.meta.url),'utf8');
const translator=lang=>vm.runInNewContext(source.slice(0,source.lastIndexOf('if (english)')).replaceAll('export ', '')+'\nt',{URLSearchParams,location:{search:lang?'?lang=en':''}});
test('English model names and reference error messages are fully translated',()=>{
 const t=translator(true);
 for(const model of Object.values(models))if(!model.nameEn)assert.notEqual(t(model.name),model.name,model.name);
 for(const label of ['Nussbaum & Eiche','Eiche Stirnholz','Holzart','Tropenholz','Die Referenz passt noch nicht zu einem Rechteck. Bitte Ecken und lange / kurze Blattkante prüfen.'])assert.notEqual(t(label),label);
});
test('German text and unknown product identifiers are not rewritten',()=>{
 assert.equal(translator(false)('Eiche Stirnholz'),'Eiche Stirnholz');
 assert.equal(translator(true)('listing=4455205567'),'listing=4455205567');
});
