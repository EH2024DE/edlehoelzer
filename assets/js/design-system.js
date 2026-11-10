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
  const disclosureStates=new WeakMap();
  const motionReduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disclosureTarget=(node,current)=>disclosureStates.get(node)?.open??current;
  function animateDisclosure(node,open,{details=false}={}){
    const previous=disclosureStates.get(node),from=node.getBoundingClientRect().height,fromOpacity=getComputedStyle(node).opacity;
    previous?.animation?.cancel();
    const overflow=previous?.overflow??node.style.overflow;
    const state={open,overflow,animation:null};disclosureStates.set(node,state);
    const complete=()=>{
      if(disclosureStates.get(node)!==state)return;
      if(details)node.open=open;else node.hidden=!open;
      node.style.overflow=overflow;disclosureStates.delete(node);
      node.dispatchEvent(new Event('ds-disclosure-change'));
    };
    if(motionReduced()||!node.animate){complete();return;}
    let to;
    if(details){
      node.open=false;const closed=node.getBoundingClientRect().height;
      node.open=true;to=open?node.getBoundingClientRect().height:closed;
    }else{
      node.hidden=false;to=open?node.scrollHeight:0;
    }
    node.style.overflow='hidden';
    const start={height:from+'px'},end={height:to+'px'};
    if(!details){
      const padding=getComputedStyle(node).paddingBottom;
      start.opacity=previous?fromOpacity:open?0:1;end.opacity=open?1:0;
      start.paddingBottom=from?padding:'0px';end.paddingBottom=open?padding:'0px';
    }
    const duration=parseFloat(getComputedStyle(node).getPropertyValue('--duration-disclosure'))||240;
    state.animation=node.animate([start,end],{duration,easing:'cubic-bezier(.2,.7,.2,1)'});
    state.animation.finished.then(complete).catch(()=>{});
    node.dispatchEvent(new Event('ds-disclosure-change'));
  }
  function enhance(scope=document){
    scope.querySelectorAll('details[data-ds-read-more]:not([data-ds-ready])').forEach(details=>{
      details.dataset.dsReady='true';
      const summary=details.querySelector('summary');if(!summary)return;
      const en=document.documentElement.lang==='en',label=summary.textContent.trim();
      details.id ||= unique('read-more');
      const button=document.createElement('button');button.type='button';button.className='readMore__button';
      button.setAttribute('aria-controls',details.id);details.before(button);summary.hidden=true;
      const sync=()=>{const open=disclosureTarget(details,details.open);button.setAttribute('aria-expanded',String(open));button.textContent=`${label} · ${open?(en?'Show less':'Weniger anzeigen'):(en?'Read more':'Mehr lesen')}`;};
      button.addEventListener('click',()=>animateDisclosure(details,!disclosureTarget(details,details.open),{details:true}));
      details.addEventListener('toggle',sync);details.addEventListener('ds-disclosure-change',sync);sync();
    });
    scope.querySelectorAll('.faqItem:not([data-ds-ready])').forEach(item=>{
      item.dataset.dsReady='true';
      const heading=item.querySelector('h3');if(!heading||heading.querySelector('button'))return;
      const answer=document.createElement('div');answer.className='faqAnswer';answer.id=unique('faq-answer');
      for(const child of [...item.childNodes])if(child!==heading)answer.append(child);
      const button=document.createElement('button');button.className='faqQuestion';button.type='button';button.textContent=heading.textContent;
      button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',answer.id);heading.replaceChildren(button);answer.hidden=true;item.append(answer);
      button.addEventListener('click',()=>{const open=!disclosureTarget(answer,!answer.hidden);button.setAttribute('aria-expanded',String(open));animateDisclosure(answer,open);});
    });
    scope.querySelectorAll('details:not([data-ds-motion])').forEach(details=>{
      details.dataset.dsMotion='true';
      const summary=[...details.children].find(n=>n.tagName==='SUMMARY');if(!summary)return;
      summary.addEventListener('click',event=>{
        if(event.target.closest('a,button,input,select,textarea')||details.getAttribute('role')==='tabpanel')return;
        event.preventDefault();animateDisclosure(details,!disclosureTarget(details,details.open),{details:true});
      });
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
      panels.forEach(panel=>{const state=disclosureStates.get(panel);if(state){state.animation?.cancel();panel.style.overflow=state.overflow;disclosureStates.delete(panel);}});
      const focus=document.activeElement,focused=panels.findIndex(p=>p.contains(focus));if(focused>=0)active=focused;
      list.hidden=!desktop.matches;
      panels.forEach((panel,i)=>{const summary=panel.querySelector('summary');summary.hidden=desktop.matches;if(desktop.matches){panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',buttons[i].id);}else{panel.removeAttribute('role');panel.removeAttribute('aria-labelledby');panel.open=i===active;}});
      select(active);
      if(!desktop.matches&&buttons.includes(focus))panels[active].querySelector('summary').focus();
      if(desktop.matches&&panels.some(p=>p.querySelector('summary')===focus))buttons[active].focus();
    }desktop.addEventListener('change',adapt);adapt();
  });
  enhance();
  if(document.body.dataset.dsTemplate==='home'&&'IntersectionObserver' in window&&!motionReduced()){
    const sections=[...document.querySelectorAll('main .reveal-on-scroll')];
    const reveal=node=>{node.dataset.dsReveal='visible';};
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){reveal(entry.target);observer.unobserve(entry.target);}
    }),{threshold:0,rootMargin:'0px 0px -24px 0px'});
    sections.forEach(section=>{
      if(section.getBoundingClientRect().top>=innerHeight){section.dataset.dsReveal='pending';observer.observe(section);}
    });
    document.addEventListener('focusin',event=>{const section=event.target.closest('[data-ds-reveal=pending]');if(section){section.style.transition='none';reveal(section);observer.unobserve(section);}});
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches){sections.forEach(reveal);observer.disconnect();}});
  }
  // Equalise the decision area per visual row, including cards with extra availability notes.
  const gridSelector='.productGrid,.landingProductGrid,.homepageProductGrid';
  let alignmentFrame=0;
  function alignProductRows(){
    alignmentFrame=0;
    document.querySelectorAll(gridSelector).forEach(grid=>{
      const cards=[...grid.children].filter(n=>n.classList.contains('productCard'));
      cards.forEach(card=>{card.style.setProperty('--card-action-height','0px');card.style.setProperty('--card-primary-height','0px');card.style.setProperty('--card-price-height','0px');});
      const rows=new Map();
      cards.forEach(card=>{const top=Math.round(card.getBoundingClientRect().top);if(!rows.has(top))rows.set(top,[]);rows.get(top).push(card);});
      rows.forEach(row=>{
        const actions=row.map(card=>card.querySelector('.productCard__body>.ctaRow'));
        const primaryHeight=Math.max(0,...actions.map(action=>action?.querySelector(':scope>.btn')?.getBoundingClientRect().height||0));
        row.forEach(card=>card.style.setProperty('--card-primary-height',primaryHeight+'px'));
        const actionHeight=Math.max(0,...actions.map(action=>action?.getBoundingClientRect().height||0));
        row.forEach(card=>card.style.setProperty('--card-action-height',actionHeight+'px'));
        const priceHeight=Math.max(0,...row.map(card=>card.querySelector('.productCard__price')?.getBoundingClientRect().height||0));
        row.forEach(card=>card.style.setProperty('--card-price-height',priceHeight+'px'));
      });
    });
  }
  const scheduleAlignment=()=>{if(!alignmentFrame)alignmentFrame=requestAnimationFrame(alignProductRows);};
  const grids=[...document.querySelectorAll(gridSelector)];
  if(grids.length){
    const resize=new ResizeObserver(scheduleAlignment);grids.forEach(grid=>resize.observe(grid));
    const mutation=new MutationObserver(scheduleAlignment);grids.forEach(grid=>mutation.observe(grid,{childList:true,subtree:true}));
    window.addEventListener('resize',scheduleAlignment,{passive:true});document.fonts.ready.then(scheduleAlignment);scheduleAlignment();
  }
  const revealServiceTarget=()=>{
    if(!location.hash)return;
    let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return;}
    const details=target?.closest('.serviceCompareDetails,.homeTopic');
    if(details)details.open=true;
  };
  revealServiceTarget();window.addEventListener('hashchange',revealServiceTarget);
  const serviceComparison=document.querySelector('[data-service-comparison]');
  if(serviceComparison&&'IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      document.body.classList.toggle('is-comparing-services',entries[0].isIntersecting);
    }).observe(serviceComparison);
  }
  // The existing product engine replaces its fallback HTML after loading the catalogue.
  const product=document.querySelector('[data-product-page]');
  if(product){
    const en=document.documentElement.lang==='en';
    const additions=[...product.querySelectorAll('[data-ds-added="inventory"],[data-ds-added="care-bridge"],[data-ds-added="purchase-trust"]')].map(n=>n.cloneNode(true));
    const bar=document.createElement('aside');bar.className='productPurchaseBar';bar.hidden=true;
    bar.setAttribute('aria-label',en?'Purchase summary':'Kaufübersicht');
    const price=document.createElement('div');price.className='productPurchaseBar__price';
    const priceLabel=document.createElement('small'),priceValue=document.createElement('span');price.append(priceLabel,priceValue);
    const buy=document.createElement('a');buy.className='btn btn--emphasis';buy.target='_blank';buy.rel='noopener';buy.dataset.conversionLocation='sticky';
    bar.append(price,buy);document.body.append(bar);
    let observedAction,actionObserver;
    const setBar=open=>{bar.hidden=!open;document.body.classList.toggle('has-product-purchase-bar',open);};
    const updatePurchaseVisibility=()=>setBar(!!observedAction&&matchMedia('(max-width:760px)').matches&&observedAction.getBoundingClientRect().bottom<0);
    let visibilityFrame=0;
    const schedulePurchaseVisibility=()=>{if(!visibilityFrame)visibilityFrame=requestAnimationFrame(()=>{visibilityFrame=0;updatePurchaseVisibility();});};
    window.addEventListener('scroll',schedulePurchaseVisibility,{passive:true});window.addEventListener('resize',schedulePurchaseVisibility,{passive:true});
    function syncPurchaseBar(){
      const heading=product.querySelector('h1');
      if(heading&&product.dataset.displayTitle&&heading.textContent!==product.dataset.displayTitle)heading.textContent=product.dataset.displayTitle;
      const content=product.querySelector('.productPreview__content');
      if(content)for(const template of additions)if(!content.querySelector('[data-ds-added="'+template.dataset.dsAdded+'"]'))content.append(template.cloneNode(true));
      const inventory=content?.querySelector('.productInventory'),headline=content?.querySelector('.productPreview__purchaseHeadline');
      if(inventory&&headline&&inventory.nextElementSibling!==headline)headline.before(inventory);
      const action=product.querySelector('.productPreview__earlyPurchase a[data-etsy-link]');
      const trust=content?.querySelector('[data-ds-added="purchase-trust"]');
      if(action&&trust&&action.parentNode.nextElementSibling!==trust)action.parentNode.after(trust);
      const value=product.querySelector('[data-purchase-price]'),label=product.querySelector('[data-purchase-price-label]');
      if(!action||!value){setBar(false);return;}
      if(priceValue.textContent!==value.textContent)priceValue.textContent=value.textContent;
      if(priceLabel.textContent!==label?.textContent)priceLabel.textContent=label?.textContent||'';
      if(buy.href!==action.href)buy.href=action.href;
      if(buy.textContent!==action.textContent)buy.textContent=action.textContent;
      if(action!==observedAction){
        actionObserver?.disconnect();observedAction=action;
        if('IntersectionObserver' in window){actionObserver=new IntersectionObserver(updatePurchaseVisibility);actionObserver.observe(action);}
      }
      updatePurchaseVisibility();
    }
    let productFrame=0;
    const updateProductPresentation=()=>{
      productFrame=0;
      const content=product.querySelector('.productPreview__content'),headline=content?.querySelector('.productPreview__purchaseHeadline'),action=content?.querySelector('.productPreview__earlyPurchase');
      const configuration=content?.querySelector('.productPreview__configuration');
      if(headline&&configuration&&headline.nextElementSibling!==configuration)headline.after(configuration);
      const purchaseEnd=configuration||headline;
      if(purchaseEnd&&action&&purchaseEnd.nextElementSibling!==action)purchaseEnd.after(action);
      if(headline)headline.setAttribute('aria-live','polite');
      if(configuration&&!configuration.dataset.dsObserved){
        configuration.dataset.dsObserved='true';
        new IntersectionObserver(entries=>document.body.classList.toggle('is-configuring-product',entries[0].isIntersecting)).observe(configuration);
      }
      product.querySelectorAll('.productPreview__detail').forEach(details=>{details.dataset.dsReadMore='';});
      enhance(product);
      syncPurchaseBar();
    };
    const observer=new MutationObserver(()=>{if(!productFrame)productFrame=requestAnimationFrame(updateProductPresentation);});observer.observe(product,{childList:true,subtree:true});
    product.querySelectorAll('.productPreview__detail').forEach(details=>{details.dataset.dsReadMore='';});enhance(product);
    syncPurchaseBar();
  }
})();
