(() => {
  const en = document.documentElement.lang.startsWith('en');
  const copy = en ? {
    title:'Your board in your kitchen', choose:'Choose a board', close:'Close preview',
    view:'View on my worktop', loading:'Preparing your preview…', error:'The preview could not be loaded. Please try again.'
  } : {
    title:'Dein Brett in deiner Küche', choose:'Brett auswählen', close:'Vorschau schließen',
    view:'Auf meinem Tresen ansehen', loading:'Deine Vorschau wird vorbereitet …', error:'Die Vorschau konnte nicht geladen werden. Bitte versuche es erneut.'
  };
  let modelsPromise, catalogPromise, dialog;
  const catalog = () => catalogPromise ||= fetch('/products.json').then(r => {
    if (!r.ok) throw Error('product catalog');
    return r.json();
  }).then(data => Array.isArray(data) ? data : data.products).catch(error => { catalogPromise = null; throw error; });
  const models = () => modelsPromise ||= fetch('/brettvorschau/models.json').then(r => {
    if (!r.ok) throw Error('model manifest');
    return r.json();
  }).catch(error => { modelsPromise = null; throw error; });
  const element = (tag, className, text) => {
    const el = document.createElement(tag); el.className = className || ''; if (text) el.textContent = text; return el;
  };
  function close() { dialog?.close(); }
  async function open(id, trigger) {
    if (dialog?.open) return;
    dialog = element('dialog','kitchenPreviewDialog');
    const currentDialog = dialog;
    currentDialog.dataset.entrySource=id?'product':'homepage';
    window.EdleAnalytics?.track('kitchen_preview_start',{source:currentDialog.dataset.entrySource,product_id:id||'',cta_location:id?'product_detail':'homepage_after_finder'});
    const head = element('div','kitchenPreviewDialog__head');
    const title = element('h2','',copy.title); title.id = 'kitchen-preview-heading';
    const closeButton = element('button','kitchenPreviewDialog__close','×'); closeButton.type='button';closeButton.setAttribute('aria-label',copy.close);closeButton.onclick=close;
    head.append(title,closeButton);
    const content=element('div','kitchenPreviewDialog__content',copy.loading);
    content.setAttribute('role','status');dialog.setAttribute('aria-labelledby',title.id);dialog.append(head,content);
    document.body.append(dialog);
    const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    dialog.addEventListener('close',()=>{currentDialog.remove();if(dialog===currentDialog){document.body.style.overflow=previousOverflow;dialog=null;trigger?.focus();}},{once:true});
    dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
    dialog.showModal();
    try {
      const list=await models();if(dialog!==currentDialog || !currentDialog.open)return;
      const show = model => {
        content.replaceChildren();content.removeAttribute('role');
        const frame=element('iframe','kitchenPreviewDialog__frame');frame.title=copy.title;
        frame.src=`/brettvorschau/?listing=${encodeURIComponent(model.listingId)}&entry=${id?'product':'homepage'}&lang=${en?'en':'de'}&embedded=1`;
        frame.allow='fullscreen';content.append(frame);
        window.EdleAnalytics?.track('kitchen_preview_open',{product_id:model.listingId,source:id?'product':'homepage'});
      };
      const chosen=list.find(model=>model.listingId===id);
      if(chosen){show(chosen);return;}
      if(id){content.textContent=en?'This board is not yet available in the room preview.':'Dieses Brett ist noch nicht für die Raumvorschau aufbereitet.';return;}
      content.replaceChildren();content.removeAttribute('role');
      content.append(element('h3','',copy.choose));
      const products=await catalog();if(dialog!==currentDialog || !currentDialog.open)return;
      const grid=element('div','kitchenPreviewDialog__products');
      for(const model of list){
        const product=products.find(item=>String(item.listingId)===model.listingId);
        const button=element('button','kitchenPreviewDialog__product');button.type='button';
        const img=element('img');img.src=model.image;img.alt='';img.loading='lazy';
        img.width=144;img.height=144;
        const details=element('span','kitchenPreviewDialog__details');
        const name=element('strong','kitchenPreviewDialog__name',model.name);name.title=model.name;
        const price=element('span','kitchenPreviewDialog__price',product?.priceLabel?.replace('EUR','€')||(en?'Price on request':'Preis auf Anfrage'));
        const dimensions=element('span','kitchenPreviewDialog__dimensions',model.dimensions.replace(/(\d)\.(\d)/g,en?'$1.$2':'$1,$2'));
        details.append(name,price,dimensions);button.append(img,details);
        button.setAttribute('aria-label',`${model.name}: ${copy.view}`);button.onclick=()=>show(model);grid.append(button);
      }
      content.append(grid);
    }catch{content.textContent=copy.error;}
  }
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-kitchen-preview]');if(!trigger)return;
    event.preventDefault();open(trigger.dataset.kitchenPreview,trigger);
  });
  window.addEventListener('message',event=>{
    const frame=dialog?.querySelector('iframe');
    if(event.origin!==location.origin||event.source!==frame?.contentWindow)return;
    const entrySource=dialog.dataset.entrySource;
    if(event.data?.type==='kitchen-preview-close')close();
    if(event.data?.type==='kitchen-preview-event'&&['kitchen_preview_placed','kitchen_preview_compare'].includes(event.data.event)&&typeof event.data.listingId==='string'){
      models().then(list=>{
        if(list.some(model=>model.listingId===event.data.listingId))window.EdleAnalytics?.track(event.data.event,{product_id:event.data.listingId,source:entrySource});
      }).catch(()=>{});
    }
    if(event.data?.type==='kitchen-preview-buy'&&typeof event.data.listingId==='string'){
      models().then(list=>{
        if(list.some(model=>model.listingId===event.data.listingId))window.EdleAnalytics?.track('kitchen_preview_buy_click',{
          product_id:event.data.listingId,cta_location:'kitchen_preview',source:entrySource
        });
      }).catch(()=>{});
    }
  });
})();
