import { createIcons, ArrowLeft, ArrowRight } from 'lucide';
export function createSavedViews({host,capture,english,onBuy,models=[],onChoose}){
 const key='edle-worktop-comparisons-v1',ttl=86400000;
 const words=english?{save:'Save comparison view',title:'Your saved views',note:'On your device for 24 hours. Photos may show different positions and angles.',remove:'Remove',buy:'Buy this board in the shop',close:'Close',full:'Two views saved. Remove one before adding another.',error:'Could not save on this device. Please use the image download instead.'}:{save:'Ansicht zum Vergleich merken',title:'Deine gemerkten Ansichten',note:'Für 24 Stunden auf deinem Gerät. Fotos können unterschiedliche Positionen und Blickwinkel zeigen.',remove:'Entfernen',buy:'Dieses Brett im Shop kaufen',close:'Schließen',full:'Zwei Ansichten gemerkt. Entferne eine, bevor du eine weitere hinzufügst.',error:'Speichern auf diesem Gerät nicht möglich. Nutze bitte den Bild-Download.'};
 const save=document.createElement('button');save.textContent=words.save;save.hidden=true;
 const section=document.createElement('section');section.className='saved-views';
 const heading=document.createElement('h2');heading.textContent=words.title;
 const note=document.createElement('p');note.textContent=words.note;
 const message=document.createElement('p');message.setAttribute('role','status');
 const grid=document.createElement('div');grid.className='saved-views-grid';
 section.append(heading,note,message,grid);host.append(save,section);
 function read(){try{const stored=JSON.parse(localStorage.getItem(key)||'[]');const views=stored.filter(v=>v.expires>Date.now()&&/^data:image\/jpeg;base64,/.test(v.image)&&/^\d+$/.test(v.id)).slice(0,2);if(views.length!==stored.length)localStorage.setItem(key,JSON.stringify(views));return views;}catch{return [];}}
 function write(views){try{localStorage.setItem(key,JSON.stringify(views));return true;}catch{message.textContent=words.error;return false;}}
 const zoom=document.createElement('dialog');zoom.className='saved-view-zoom';
 const close=document.createElement('button');close.textContent=words.close;close.onclick=()=>zoom.close();
 zoom.setAttribute('aria-label',english?'Compare saved views':'Gemerkte Ansichten vergleichen');
 const slides=document.createElement('div');slides.className='saved-view-slides';
 const nav=document.createElement('div');nav.className='saved-view-nav';
 const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');
 for(const [button,icon,label] of [[previous,'arrow-left',english?'Previous image':'Vorheriges Bild'],[next,'arrow-right',english?'Next image':'Nächstes Bild']]){
  button.innerHTML=`<i data-lucide="${icon}"></i>`;button.title=label;button.setAttribute('aria-label',label);
 }
 counter.setAttribute('aria-live','polite');nav.append(previous,counter,next);
 zoom.append(close,slides,nav);host.append(zoom);
 const chooser=document.createElement('select');chooser.setAttribute('aria-label',english?'Try another board':'Anderes Brett ausprobieren');
 const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=english?'Try another board …':'Anderes Brett ausprobieren …';chooser.append(placeholder);
 for(const model of models){const option=document.createElement('option');option.value=model.key;option.textContent=model.name;chooser.append(option);}
 const addSecond=document.createElement('button');addSecond.textContent=english?'Compare with a second favourite':'Mit einem zweiten Favoriten vergleichen';
 chooser.hidden=true;addSecond.onclick=()=>{chooser.hidden=false;chooser.focus();};
 section.append(addSecond,chooser);
 chooser.onchange=async()=>{if(!chooser.value)return;const key=chooser.value;chooser.value='';chooser.hidden=true;addSecond.disabled=true;try{await onChoose(key);}catch{message.textContent=english?'Could not load the board. Please try again.':'Das Brett konnte nicht geladen werden. Bitte erneut versuchen.';}finally{addSecond.disabled=false;}};
 function purchaseLink(view){
  const buy=document.createElement('a');buy.textContent=words.buy;buy.target='_blank';buy.rel='noopener';buy.className='saved-view-buy';
  const url=new URL(`https://www.etsy.com/listing/${view.id}`);url.search=new URLSearchParams({utm_source:'edlehoelzer.de',utm_medium:'referral',utm_campaign:'kitchen_preview',utm_content:`compare_buy_${view.id}`});buy.href=url.href;buy.onclick=()=>onBuy(view.id);return buy;
 }
 createIcons({icons:{ArrowLeft,ArrowRight}});
 let active=0,opener=null;
 const wide=matchMedia('(min-width: 800px)');
 function sync(){
  if(!slides.children.length)return;
  active=Math.max(0,Math.min(slides.children.length-1,Math.round(slides.scrollLeft/(slides.clientWidth||1))));
  counter.textContent=`${active+1} / ${slides.children.length}`;previous.setAttribute('aria-disabled',String(active===0));next.setAttribute('aria-disabled',String(active===slides.children.length-1));
  nav.hidden=wide.matches||slides.children.length<2;
 }
 function go(index){const target=Math.max(0,Math.min(slides.children.length-1,index));slides.scrollTo({left:target*slides.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 previous.onclick=()=>go(active-1);next.onclick=()=>go(active+1);
 slides.addEventListener('scroll',sync,{passive:true});
 wide.addEventListener('change',()=>{if(zoom.open){slides.scrollLeft=0;sync();}});
 zoom.addEventListener('keydown',event=>{if(!wide.matches&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();go(active+(event.key==='ArrowRight'?1:-1));}});
 zoom.addEventListener('close',()=>opener?.focus());
 function openComparison(id,button){
  const views=read();if(!views.length){render();return;}
  slides.replaceChildren(...views.map(view=>{
   const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');
   image.src=view.image;image.alt=view.name;
   // Legacy snapshots already contain their name inside the image.
   caption.textContent=view.cleanImage?`${view.name}${view.details?' · '+view.details:''}`:'';
   figure.append(image,caption,purchaseLink(view));return figure;
  }));
  opener=button;zoom.showModal();
  slides.scrollLeft=wide.matches?0:Math.max(0,views.findIndex(view=>view.id===id))*slides.clientWidth;sync();
 }
 function render(){
  const views=read();section.hidden=!views.length;grid.replaceChildren();
  addSecond.hidden=views.length!==1;
  if(views.length!==1)chooser.hidden=true;
  for(const option of chooser.options){const model=models.find(m=>m.key===option.value);option.disabled=!!model&&views.some(v=>v.id===model.id);}
  for(const view of views){
   const card=document.createElement('article'),open=document.createElement('button'),thumb=document.createElement('img');
   thumb.src=view.image;thumb.alt=view.name;open.setAttribute('aria-label',`${view.name} · ${english?'Enlarge':'Vergrößern'}`);open.append(thumb);
   open.onclick=()=>openComparison(view.id,open);
   const name=document.createElement('p');name.textContent=view.cleanImage?`${view.name}${view.details?' · '+view.details:''}`:'';
   const buy=purchaseLink(view);
   const remove=document.createElement('button');remove.textContent=words.remove;remove.onclick=()=>{if(write(read().filter(v=>v.id!==view.id))){message.textContent='';render();}};
   card.append(open,name,buy,remove);grid.append(card);
  }
 }
 save.onclick=()=>{
  const views=read();
  try{
   const view=capture();if(!view)return;
   if(views.length===2&&!views.some(v=>v.id===view.id)){message.textContent=words.full;section.hidden=false;section.scrollIntoView({block:'nearest'});return;}
   const next=[...views.filter(v=>v.id!==view.id),{...view,expires:Date.now()+ttl}];
   if(write(next)){render();message.textContent=english?'View saved. You can now try another board.':'Ansicht gemerkt. Du kannst jetzt ein anderes Brett ausprobieren.';}
   else section.hidden=false;
  }catch{section.hidden=false;message.textContent=words.error;}
 };
 window.addEventListener('storage',event=>{if(event.key===key)render();});
 render();return {update:ready=>{save.hidden=!ready;render();}};
}
