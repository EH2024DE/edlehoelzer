(() => {
  const menu=document.querySelector('#atelier-menu'),open=document.querySelector('[data-menu-open]');
  if(menu&&open&&!menu.dataset.atelierMenuBound){menu.dataset.atelierMenuBound='true';open.addEventListener('click',()=>{menu.showModal();open.setAttribute('aria-expanded','true');document.body.classList.add('atelierMenuOpen');});menu.querySelector('[data-menu-close]').addEventListener('click',()=>menu.close());menu.addEventListener('close',()=>{open.setAttribute('aria-expanded','false');document.body.classList.remove('atelierMenuOpen');open.focus();});menu.addEventListener('click',event=>{if(event.target!==menu)return;const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)menu.close();});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));}
  function count(event){
    if(Number.isInteger(event?.detail?.count)){document.querySelectorAll('[data-atelier-count]').forEach(el=>el.textContent=event.detail.count);return;}
    try{const cart=JSON.parse(localStorage.getItem('edle-shop-pilot-cart-v1')||'[]');document.querySelectorAll('[data-atelier-count]').forEach(el=>el.textContent=Array.isArray(cart)?cart.reduce((n,item)=>n+(Number.isInteger(item.quantity)?item.quantity:0),0):0);}catch{}
  }
  count();document.addEventListener('shop:cart-updated',count);window.addEventListener('storage',count);
  let soldWorktopProducts=[];
  function filterWorktopProducts(){
    for(const product of soldWorktopProducts){
      document.querySelectorAll('#modelChoice option').forEach(option=>{if(option.textContent.trim()===product.displayName){option.disabled=true;option.hidden=true;document.querySelectorAll('[data-product="'+CSS.escape(option.value)+'"]').forEach(node=>node.hidden=true);}});
      document.querySelectorAll('dialog button').forEach(button=>{if(button.textContent.trim()===product.displayName)button.hidden=true;});
    }
  }
  if(document.body.classList.contains('atelierWorktop'))fetch('/products.json').then(response=>{if(!response.ok)throw Error('catalog unavailable');return response.json();}).then(data=>{
    soldWorktopProducts=data.products.filter(product=>product.availabilityStatus==='sold');
    const selected=soldWorktopProducts.find(product=>product.listingId===new URLSearchParams(location.search).get('listing'));
    if(selected){location.replace((new URLSearchParams(location.search).get('lang')==='en'?'/en':'')+selected.productPath);return;}
    filterWorktopProducts();
  }).catch(()=>{});
  function guarantees(){document.querySelectorAll('.legalGuarantee,.pilotCart details:has(.pilotGuarantee)').forEach(details=>{
    if(details.dataset.guaranteeReady)return;details.dataset.guaranteeReady='true';details.open=true;
    const link=details.querySelector('a[href*="eu-legal-guarantee-"]');if(!link)return;
    link.classList.add('legalGuaranteePreview');link.title=document.documentElement.lang==='en'?'Open complete EU notice':'Vollständigen EU-Hinweis öffnen';
    link.addEventListener('click',event=>{
      event.preventDefault();const dialog=document.createElement('dialog');dialog.className='legalGuaranteeDialog';dialog.setAttribute('aria-label',link.title);
      const close=document.createElement('button');close.type='button';close.className='atelierZoomClose';close.setAttribute('aria-label',document.documentElement.lang==='en'?'Close':'Schließen');
      const icon=document.createElement('img');icon.src='/assets/icons/lucide/x.svg';icon.alt='';icon.width=20;icon.height=20;close.append(icon);
      const image=document.createElement('img');image.src=link.href;image.alt=link.querySelector('img').alt;image.className='legalGuaranteeFull';dialog.append(close,image);document.body.append(dialog);
      close.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{dialog.remove();link.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.showModal();
    });
  });}
  function focusProduct(){const root=document.querySelector('.atelierShop [data-shop-products][data-product-focus]');if(!root)return;root.querySelectorAll('.pilotProduct').forEach(article=>{if(article.dataset.siteStyled)return;article.dataset.siteStyled='true';const photo=article.querySelector('.pilotProduct__photo');if(!photo)return;const buy=document.createElement('div');buy.className='siteShopBuy';for(const child of [...article.children])if(child!==photo)buy.append(child);article.append(buy);});}
  function localise(){document.querySelectorAll('a[href]').forEach(link=>{try{const url=new URL(link.href),own=url.hostname==='edlehoelzer.de'||url.origin===location.origin;if(own&&url.pathname==='/en/custom-cutting-board/'){link.href='/en/#customwork';return;}if(own&&url.pathname==='/en/products.html'&&url.hash==='#produktfinder'){link.href='/en/products.html'+url.search+'#product-finder';return;}if(own&&document.documentElement.lang==='en'&&url.pathname==='/'&&url.hash==='#service'){link.href='/en/refurbishment/';return;}if(url.hostname==='edlehoelzer.de')link.href=url.pathname+url.search+url.hash;}catch{}});}
  new MutationObserver(()=>{localise();focusProduct();guarantees();filterWorktopProducts();}).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});localise();focusProduct();guarantees();
})();
