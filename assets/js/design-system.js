(() => {
  let serial=0;
  function layerRuntimeStyles(){
    const legacySheets=['/assets/css/product-photo-viewer.css','/assets/css/site-search.css','/assets/css/room-discovery.css','/assets/css/kitchen-preview-entry.css'];
    document.querySelectorAll('link[rel=stylesheet]').forEach(link=>{
      if(legacySheets.includes(new URL(link.href,location.href).pathname))link.media='not all';
    });
    document.querySelectorAll('style[data-consent-styles],style#backToTopStyles').forEach(style=>{
      if(style.dataset.dsLayered)return;
      style.dataset.dsLayered='true';style.textContent=`@layer legacy {${style.textContent}}`;
    });
  }
  layerRuntimeStyles();
  new MutationObserver(layerRuntimeStyles).observe(document.head,{childList:true});
  const unique=prefix=>`${prefix}-${++serial}`;
  function enhance(scope=document){
    scope.querySelectorAll('details[data-ds-read-more]:not([data-ds-ready])').forEach(details=>{
      details.dataset.dsReady='true';
      const summary=details.querySelector('summary');if(!summary)return;
      const en=document.documentElement.lang==='en',label=summary.textContent.trim();
      details.id ||= unique('read-more');
      const button=document.createElement('button');button.type='button';button.className='readMore__button';
      button.setAttribute('aria-controls',details.id);details.before(button);summary.hidden=true;
      const sync=()=>{button.setAttribute('aria-expanded',String(details.open));button.textContent=`${label} · ${details.open?(en?'Show less':'Weniger anzeigen'):(en?'Read more':'Mehr lesen')}`;};
      button.addEventListener('click',()=>{details.open=!details.open;sync();});
      details.addEventListener('toggle',sync);sync();
    });
    scope.querySelectorAll('.faqItem:not([data-ds-ready])').forEach(item=>{
      item.dataset.dsReady='true';
      const heading=item.querySelector('h3');if(!heading||heading.querySelector('button'))return;
      const answer=document.createElement('div');answer.className='faqAnswer';answer.id=unique('faq-answer');
      for(const child of [...item.childNodes])if(child!==heading)answer.append(child);
      const button=document.createElement('button');button.className='faqQuestion';button.type='button';button.textContent=heading.textContent;
      button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',answer.id);heading.replaceChildren(button);answer.hidden=true;item.append(answer);
      button.addEventListener('click',()=>{answer.hidden=!answer.hidden;button.setAttribute('aria-expanded',String(!answer.hidden));});
    });
  }
  document.querySelectorAll('[data-ds-tabs]').forEach(root=>{
    const panels=[...root.children].filter(n=>n.tagName==='DETAILS');if(panels.length<2)return;
    const desktop=matchMedia('(min-width: 761px)'),list=document.createElement('div');
    list.className='ds-tabs__list';list.setAttribute('role','tablist');list.setAttribute('aria-label',root.getAttribute('aria-label')||'Product information');
    let active=0;
    const buttons=panels.map((panel,i)=>{
      panel.id ||= unique('topic');const button=document.createElement('button');button.type='button';button.id=unique('tab');button.textContent=panel.querySelector('summary').textContent;button.setAttribute('role','tab');button.setAttribute('aria-controls',panel.id);
      button.addEventListener('click',()=>select(i));
      button.addEventListener('keydown',event=>{const target={ArrowRight:(i+1)%panels.length,ArrowLeft:(i+panels.length-1)%panels.length,Home:0,End:panels.length-1}[event.key];if(target===undefined)return;event.preventDefault();select(target);buttons[target].focus();});
      list.append(button);return button;
    });root.before(list);
    function select(index){active=index;panels.forEach((panel,i)=>{panel.hidden=desktop.matches&&i!==active;if(desktop.matches)panel.open=true;buttons[i].tabIndex=i===active?0:-1;buttons[i].setAttribute('aria-selected',String(i===active));});}
    function adapt(){
      const focus=document.activeElement,focused=panels.findIndex(p=>p.contains(focus));if(focused>=0)active=focused;
      list.hidden=!desktop.matches;
      panels.forEach((panel,i)=>{const summary=panel.querySelector('summary');summary.hidden=desktop.matches;if(desktop.matches){panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',buttons[i].id);}else{panel.removeAttribute('role');panel.removeAttribute('aria-labelledby');panel.open=i===active;}});
      select(active);
      if(!desktop.matches&&buttons.includes(focus))panels[active].querySelector('summary').focus();
      if(desktop.matches&&panels.some(p=>p.querySelector('summary')===focus))buttons[active].focus();
    }desktop.addEventListener('change',adapt);adapt();
  });
  enhance();
  // The existing product engine replaces its fallback HTML after loading the catalogue.
  const product=document.querySelector('[data-product-page]');
  if(product){
    const observer=new MutationObserver(()=>{
      const content=product.querySelector('.productPreview__content'),headline=content?.querySelector('.productPreview__purchaseHeadline'),action=content?.querySelector('.productPreview__earlyPurchase');
      if(headline&&action&&headline.nextElementSibling!==action)headline.after(action);
      product.querySelectorAll('.productPreview__detail').forEach(details=>{details.dataset.dsReadMore='';});
      enhance(product);
    });observer.observe(product,{childList:true,subtree:true});
    product.querySelectorAll('.productPreview__detail').forEach(details=>{details.dataset.dsReadMore='';});enhance(product);
  }
})();
