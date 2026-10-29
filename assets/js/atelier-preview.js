(() => {
  'use strict';
  const en=document.documentElement.lang==='en';
  const root=document.querySelector('[data-shop-products]');
  const menu=document.querySelector('#atelier-menu'),menuOpen=document.querySelector('[data-menu-open]');
  if(menu&&menuOpen&&!menu.dataset.atelierMenuBound){
    menu.dataset.atelierMenuBound='true';
    menuOpen.addEventListener('click',()=>{menu.showModal();menuOpen.setAttribute('aria-expanded','true');document.body.classList.add('atelierMenuOpen');});
    menu.querySelector('[data-menu-close]').addEventListener('click',()=>menu.close());
    menu.addEventListener('click',event=>{if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)menu.close();}});
    menu.addEventListener('close',()=>{menuOpen.setAttribute('aria-expanded','false');document.body.classList.remove('atelierMenuOpen');menuOpen.focus();});
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));
    window.matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches&&menu.open)menu.close();});
  }
  const money=cents=>new Intl.NumberFormat(en?'en-IE':'de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  const collection=document.querySelector('.atelierGrid');
  let group='all',catalog;
  function cartCount(event){
    if(Number.isInteger(event?.detail?.count)){document.querySelectorAll('[data-atelier-count]').forEach(el=>el.textContent=event.detail.count);return;}
    let cart=[];try{cart=JSON.parse(localStorage.getItem('edle-shop-pilot-cart-v1') || '[]');}catch{}
    const count=Array.isArray(cart)?cart.reduce((n,item)=>n+(Number.isInteger(item.quantity)&&item.quantity>0?item.quantity:0),0):0;
    document.querySelectorAll('[data-atelier-count]').forEach(el=>{el.textContent=count;});
  }
  function filter(){
    const search=document.querySelector('[data-atelier-search]').value.trim().toLocaleLowerCase();
    const archive=document.querySelector('[data-atelier-archive]').checked;
    let count=0;
    collection.querySelectorAll('[data-atelier-piece]').forEach(article=>{
      article.hidden=(!archive && article.dataset.sold==='true') || (group!=='all' && !article.dataset.groups.split(' ').includes(group)) || !article.textContent.toLocaleLowerCase().includes(search);
      if(!article.hidden)count++;
    });
    document.querySelector('[data-atelier-results]').textContent=count+(en?(count===1?' piece':' pieces'):(count===1?' Stück':' Stücke'));
    document.querySelector('[data-atelier-empty]').hidden=count>0;
  }
  if(collection){
    document.querySelectorAll('[data-atelier-group]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.atelierGroup;document.querySelectorAll('[data-atelier-group]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));filter();}));
    document.querySelector('[data-atelier-search]').addEventListener('input',filter);
    document.querySelector('[data-atelier-archive]').addEventListener('change',filter);filter();
  }
  function decorate(){
    if(!root || !catalog)return;
    const article=root.querySelector('[data-offer]');if(!article || article.dataset.atelierReady)return;
    article.dataset.atelierReady='true';
    const offer=catalog.offers.find(o=>o.sku===article.dataset.offer);
    const photo=article.querySelector('.pilotProduct__photo'),img=photo.querySelector('img');
    img.loading='eager';
    const gallery=document.createElement('div');gallery.className='atelierGallery';
    const buy=document.createElement('div');buy.className='atelierBuy';
    for(const child of [...article.children])if(child!==photo)buy.append(child);
    gallery.append(photo);article.append(gallery,buy);
    buy.querySelector('h2').textContent=en?'Historical oak & beech':'Historische Eiche & Buche';
    if(offer.singlePiece){const quantity=buy.querySelector('[name="quantity"]');if(quantity)quantity.closest('label').hidden=true;const note=buy.querySelector(':scope > .pilotFine');if(note)note.textContent=en?'One-of-a-kind piece':'Einzelstück';}
    const images=[...new Set([offer.image,...offer.gallery])];
    const choices=document.createElement('div');choices.className='atelierGalleryChoices';choices.setAttribute('role','group');choices.setAttribute('aria-label',en?'Product views':'Produktansichten');
    images.forEach((src,index)=>{
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',(en?'Product view ':'Produktansicht ')+(index+1));button.setAttribute('aria-pressed',String(index===0));
      const thumb=document.createElement('img');thumb.src=src.replace('/il_fullxfull.','/il_794xN.');thumb.alt='';thumb.width=72;thumb.height=72;thumb.loading='lazy';button.append(thumb);
      button.addEventListener('click',()=>{img.src=thumb.src;img.alt=(en?offer.nameEn:offer.name)+' · '+(en?'Product view ':'Produktansicht ')+(index+1);choices.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));});choices.append(button);
    });
    gallery.append(choices);
    const zoom=document.createElement('button');zoom.type='button';zoom.className='atelierZoom';zoom.title=en?'Enlarge image':'Bild vergrößern';zoom.setAttribute('aria-label',zoom.title);
    const zoomIcon=document.createElement('img');zoomIcon.src='/assets/icons/lucide/plus.svg';zoomIcon.alt='';zoomIcon.width=20;zoomIcon.height=20;zoom.append(zoomIcon);photo.append(zoom);
    function enlarge(){
      let dialog=document.querySelector('[data-atelier-image-dialog]');
      if(!dialog){
        dialog=document.createElement('dialog');dialog.dataset.atelierImageDialog='';dialog.className='atelierImageDialog';dialog.setAttribute('aria-label',en?'Enlarged product image':'Vergrößertes Produktbild');
        const close=document.createElement('button');close.type='button';close.className='atelierZoomClose';close.title=en?'Close image':'Bild schließen';close.setAttribute('aria-label',close.title);
        const x=document.createElement('img');x.src='/assets/icons/lucide/x.svg';x.width=20;x.height=20;x.alt='';close.append(x);close.addEventListener('click',()=>dialog.close());
        const large=document.createElement('img');large.className='atelierLargeImage';const status=document.createElement('p');status.setAttribute('role','status');
        dialog.append(close,large,status);dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});document.body.append(dialog);
      }
      const large=dialog.querySelector('.atelierLargeImage'),status=dialog.querySelector('[role="status"]');status.textContent=en?'Loading image…':'Bild wird geladen…';large.alt=img.alt;
      large.onload=()=>{status.textContent='';};large.onerror=()=>{status.textContent=en?'The image could not be loaded.':'Das Bild konnte nicht geladen werden.';};
      large.src=img.src.replace('/il_794xN.','/il_fullxfull.');dialog.onclose=()=>zoom.focus();dialog.showModal();
    }
    zoom.addEventListener('click',enlarge);img.addEventListener('click',enlarge);
    const caption=document.createElement('p');caption.className='atelierGalleryCaption';caption.textContent=en?'The actual piece. Natural colour and grain are part of its character.':'Das konkrete Stück. Holzfarbe und Maserung gehören zu seinem Charakter.';gallery.append(caption);
    const contents=buy.querySelector('.pilotContents');if(contents)contents.open=true;
    const room=document.createElement('a');room.className='atelierRoomLink';room.href='/brettvorschau/?listing='+encodeURIComponent(offer.listingId)+'&lang='+(en?'en':'de');room.target='_blank';room.rel='noopener';
    const text=document.createElement('span');text.textContent=en?'View on my worktop':'Auf meinem Tresen ansehen';const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');room.append(text,arrow);
    const roomSection=document.createElement('section');roomSection.className='atelierRoomBenefit';
    const roomTitle=document.createElement('h3');roomTitle.textContent=en?'See it in your kitchen.':'So wirkt es in deiner Küche.';
    const roomCopy=document.createElement('p');roomCopy.textContent=en?'Place this Erbstück in a photo of your worktop. Explore proportions and find its place before deciding.':'Platziere dieses Erbstück in einem Foto deines Tresens. Probiere seinen Platz aus und schau, wie es in deiner Küche wirkt.';
    const roomNote=document.createElement('small');roomNote.textContent=en?'Visual orientation, not an exact measurement or colour reference.':'Visuelle Orientierung, kein exaktes Aufmaß oder Farbmuster.';
    roomSection.append(roomTitle,roomCopy,room,roomNote);buy.append(roomSection);
    const storyLink=document.createElement('a');storyLink.className='atelierEngravingLink';storyLink.href='#erbstueck-geschichte';storyLink.textContent=en?'Read the story & see the making':'Geschichte & Fertigung entdecken';buy.append(storyLink);
  }
  async function refresh(){
    cartCount();
    if(!root&&!collection)return;
    try{
      const response=await fetch('/api/shop/catalog');if(!response.ok)return;catalog=await response.json();
      if(collection){for(const offer of catalog.offers){const article=collection.querySelector('[data-atelier-piece="'+CSS.escape(offer.sku)+'"]');if(!article)continue;article.dataset.sold=String(offer.sold);article.querySelector('[data-atelier-price]').textContent=offer.sold?(en?'Sold':'Vergeben'):(en?'From ':'Ab ')+money(offer.unitCents);}filter();}
      decorate();
    }catch{}
  }
  if(root)new MutationObserver(decorate).observe(root,{childList:true});
  document.addEventListener('shop:cart-updated',cartCount);window.addEventListener('storage',cartCount);window.addEventListener('pageshow',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  const video=document.querySelector('[data-home-video]'),videoToggle=document.querySelector('[data-home-video-toggle]');
  if(video&&videoToggle){
    const update=()=>{const playing=!video.paused;videoToggle.setAttribute('aria-pressed',String(playing));videoToggle.setAttribute('aria-label',en?(playing?'Pause workshop film':'Play workshop film'):(playing?'Werkstattfilm pausieren':'Werkstattfilm abspielen'));videoToggle.querySelector('img').src='/assets/icons/lucide/'+(playing?'pause':'play')+'.svg';};
    videoToggle.addEventListener('click',async()=>{const status=document.querySelector('[data-home-video-status]');status.textContent='';if(!video.paused){video.pause();update();return;}if(!video.src){video.src=video.dataset.src;video.load();}try{await video.play();}catch{status.textContent=en?'The film could not be played.':'Der Film konnte nicht abgespielt werden.';}update();});
    video.addEventListener('play',update);video.addEventListener('pause',update);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:.1}).observe(video);
  }
  const reviewRail=document.querySelector('[data-review-rail]');
  if(reviewRail){
    const track=reviewRail.querySelector('.atelierReviewGrid'),motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const move=direction=>{const step=track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);reviewRail.scrollBy({left:direction*step,behavior:motion.matches?'instant':'smooth'});};
    reviewRail.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
    reviewRail.addEventListener('click',event=>{const button=event.target.closest('[data-review-read]');if(!button)return;const item=button.closest('[data-review-item]');let dialog=document.querySelector('[data-review-dialog]');
      if(!dialog){dialog=document.createElement('dialog');dialog.className='atelierReviewDialog';dialog.dataset.reviewDialog='';dialog.setAttribute('aria-label',en?'Full customer review':'Vollständige Kundenbewertung');const close=document.createElement('button');close.type='button';close.className='atelierZoomClose';close.setAttribute('aria-label',en?'Close review':'Bewertung schließen');const icon=document.createElement('img');icon.src='/assets/icons/lucide/x.svg';icon.alt='';icon.width=20;icon.height=20;close.append(icon);close.addEventListener('click',()=>dialog.close());const stars=document.createElement('p');stars.className='atelierReviewStars';const quote=document.createElement('blockquote'),meta=document.createElement('p');meta.className='atelierReviewMeta';dialog.append(close,stars,quote,meta);dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});document.body.append(dialog);}
      dialog.querySelector('.atelierReviewStars').textContent=item.querySelector('.atelierReviewStars').textContent;dialog.querySelector('blockquote').textContent=item.querySelector('blockquote').textContent;dialog.querySelector('.atelierReviewMeta').textContent=item.querySelector('figcaption').textContent+' · Etsy';dialog.onclose=()=>button.focus({preventScroll:true});dialog.showModal();
    });
  }
  const craft=document.querySelector('[data-craft-stage]');
  if(craft){
    const frames=[...craft.querySelectorAll('[data-craft-step]')],play=document.querySelector('[data-craft-play]'),chapters=[...document.querySelectorAll('[data-craft-index]')];let current=0,playing=false,timer,visible=true,start;
    const schedule=()=>{clearTimeout(timer);if(playing&&visible&&!document.hidden)timer=setTimeout(()=>show(current+1),3000);};
    const show=index=>{current=(index+frames.length)%frames.length;frames.forEach((frame,i)=>frame.hidden=i!==current);document.querySelector('[data-craft-count]').textContent=String(current+1).padStart(2,'0')+' / '+frames.length;chapters.forEach(button=>button.setAttribute('aria-pressed',String(frames[Number(button.dataset.craftIndex)].dataset.chapter===frames[current].dataset.chapter)));schedule();};
    play.addEventListener('click',()=>{playing=!playing;const label=en?(playing?'Pause sequence':'Play sequence'):(playing?'Bildfolge pausieren':'Bildfolge abspielen');play.setAttribute('aria-label',label);play.title=label;play.setAttribute('aria-pressed',String(playing));play.querySelector('img').src='/assets/icons/lucide/'+(playing?'pause':'play')+'.svg';schedule();});
    document.querySelector('[data-craft-prev]').addEventListener('click',()=>show(current-1));document.querySelector('[data-craft-next]').addEventListener('click',()=>show(current+1));chapters.forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.craftIndex))));
    craft.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1));}});
    craft.addEventListener('touchstart',event=>{start=event.touches[0].clientX;},{passive:true});craft.addEventListener('touchend',event=>{if(start===undefined)return;const delta=event.changedTouches[0].clientX-start;if(Math.abs(delta)>40)show(current+(delta<0?1:-1));else schedule();start=undefined;},{passive:true});
    craft.addEventListener('click',schedule);document.addEventListener('visibilitychange',schedule);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.1}).observe(craft);
  }
  refresh();
})();
