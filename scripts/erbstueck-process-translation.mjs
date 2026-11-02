import fs from 'node:fs';
import path from 'node:path';
import {parse,parseFragment} from 'parse5';
import {root,walk,attr} from './audit-design-system.mjs';

const captions=[
  ['Material','The starting material','Historic beams with old joints and signs of earlier craftsmanship. This is where selection begins.'],
  ['Planing','Flattening one face','The historic beam passes over the surface planer.'],
  ['Planing','Squaring an edge','The beam is guided along the fence for the next stage.'],
  ['Planing','The prepared surface','Freshly worked wood and the original rough surface remain visible side by side.'],
  ['Planing','Planing to thickness','The beam passes through the thickness planer.'],
  ['Planing','Preparing the individual pieces','The cut pieces are also planed to thickness.'],
  ['Assembly','Joining the pieces','The glue-coated pieces are brought together to form the board.'],
  ['Assembly','Clamping the board','Clamps hold the joined pieces while the glue sets.'],
  ['Assembly','Making room for the beech lines','The glued assembly is cut to accommodate the beech accents.'],
  ['Assembly','The board takes shape','End grain and beech lines now form one surface, ready for further finishing.'],
  ['Shaping and sanding','Routing the grip recess','The router cuts a grip recess into the side of the board.'],
  ['Shaping and sanding','Chamfering the edges','A chamfer helps prevent the outer edges from chipping during further work.'],
  ['Shaping and sanding','Sanding the surface','The board is worked on the belt sander.'],
  ['Shaping and sanding','Machine sanding','An orbital sander further refines the surface.'],
  ['Shaping and sanding','Finishing by hand','After machine sanding, the wood is dampened. Once dry, it receives its final hand sanding.'],
  ['Shaping and sanding','Our maker’s mark','The Edle Hölzer mark on the finished edge.'],
  ['Oiling','Bringing out the grain','Oil makes the colour and character of the wood more pronounced.'],
  ['Result','The finished Erbstück','The finished board with a vertical and a horizontal beech line.'],
  ['Result','A home found','The same Erbstück photographed in the studio. This board has already been sold.']
];

export function addEnglishProcess(document,reference){
  if(reference.route!=='/en/erbstueck/')return;
  const nodes=walk(document),old=nodes.find(n=>(attr(n,'class')||'').split(' ').includes('erbstueckProcess'));
  if(!old)return;
  const source=walk(parse(fs.readFileSync(path.join(root,'schneidebrett-fachwerk-eiche/index.html'),'utf8')));
  const frames=source.filter(n=>(attr(n,'class')||'').split(' ').includes('erbstueckProcessFrame'));
  if(frames.length!==captions.length)throw Error('Translate the changed Erbstück process before building');
  const gallery=parseFragment(`<div class="erbstueckStoryGallery" data-ds-added role="region" aria-label="Selected steps in making an Erbstück" tabindex="0">${frames.map((frame,i)=>{
    const image=walk(frame).find(n=>n.tagName==='img'),crop=walk(frame).find(n=>(attr(n,'class')||'').includes('erbstueckProcessCrop'));
    const [chapter,title,description]=captions[i];
    return `<figure><div class="erbstueckProcessCrop" style="${attr(crop,'style')||''}"><img src="${attr(image,'src')}" width="${attr(image,'width')}" height="${attr(image,'height')}" alt="${title}" loading="lazy" decoding="async"></div><figcaption><p class="eyebrow">${String(i+1).padStart(2,'0')} · ${chapter}</p><h3>${title}</h3><p>${description}</p></figcaption></figure>`;
  }).join('')}</div>`).childNodes[0];
  const parent=old.parentNode;parent.childNodes.splice(parent.childNodes.indexOf(old),0,gallery);gallery.parentNode=parent;
  const details=parseFragment('<details class="editorialDisclosure"><summary data-ds-added>Workshop background</summary></details>').childNodes[0];
  parent.childNodes.splice(parent.childNodes.indexOf(old),1,details);details.parentNode=parent;details.childNodes.push(old);old.parentNode=details;
}
