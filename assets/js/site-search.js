(() => {
  const en = document.documentElement.lang.startsWith('en');
  const header = document.querySelector('.topbar__inner');
  if (header && !header.querySelector('.siteSearchLink')) {
    const wrapper = document.createElement('div'); wrapper.className = 'siteSearchWrap';
    const link = document.createElement('button');
    link.type = 'button'; link.className = 'siteSearchLink';
    link.setAttribute('aria-label', en ? 'Search' : 'Suche');
    link.setAttribute('aria-expanded','false'); link.setAttribute('aria-controls','header-search');
    const panel = document.createElement('form'); panel.id='header-search'; panel.className='siteSearchPopover';
    panel.action='/suche/'; panel.method='get'; panel.setAttribute('role','search');
    panel.setAttribute('aria-label',en?'Site search':'Website durchsuchen'); panel.inert=true;
    const field=document.createElement('input'); field.type='search';field.name='q';field.maxLength=100;
    field.placeholder=en?'e.g. oak':'z. B. Eiche';
    field.setAttribute('aria-label',en?'Search term':'Suchbegriff');
    const submit=document.createElement('button');submit.type='submit';submit.textContent=en?'Search':'Suchen';
    panel.append(field,submit);wrapper.append(link,panel);
    let actions=header.querySelector('.topbar__right');
    if(!actions){actions=document.createElement('div');actions.className='topbar__right';header.append(actions);}
    actions.append(wrapper);
    let closing;
    const show=()=>{clearTimeout(closing);wrapper.classList.add('is-open');panel.inert=false;link.setAttribute('aria-expanded','true');};
    const hide=()=>{clearTimeout(closing);wrapper.classList.remove('is-open');panel.inert=true;link.setAttribute('aria-expanded','false');};
    link.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')show();});
    wrapper.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')closing=setTimeout(()=>{if(!panel.contains(document.activeElement))hide();},180);});
    link.addEventListener('click',()=>{show();field.focus();});
    wrapper.addEventListener('focusout',()=>setTimeout(()=>{if(!wrapper.contains(document.activeElement))hide();},0));
    wrapper.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();link.focus();hide();}});
    document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target))hide();});
  }
  const form = document.querySelector('#site-search');
  if (!form) return;
  const input = form.elements.q, results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  let data, timer, generation = 0, measured = false;
  const normalize = text => String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss');
  const synonyms = {eichenholz:'eiche',walnuss:'nussbaum',walnussholz:'nussbaum',saftrinne:'saftrille',vesperbrett:'brotzeitbrett',teigkarte:'teigschaber'};
  function node(tag, text, cls) { const el = document.createElement(tag); el.textContent = text || ''; if (cls) el.className = cls; return el; }
  function score(text, words) { const value = normalize(text); return words.every(word => value.includes(word)) ? words.length : 0; }
  function excerpt(text) {
    const firstSentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || text;
    if (firstSentence.length <= 130) return firstSentence;
    const end = firstSentence.lastIndexOf(' ', 127);
    return firstSentence.slice(0, end > 0 ? end : 127).trimEnd() + '…';
  }
  const track = (name, payload) => window.EdleAnalytics?.track(name, payload);
  async function search() {
    const current = ++generation;
    const query = input.value.trim().slice(0, 100);
    results.replaceChildren();
    if (query.length < 2) { status.textContent = 'Suche nach Holzart, Produkt oder Thema.'; return; }
    status.textContent = 'Treffer werden gesucht …';
    try {
      data ||= Promise.all(['/products.json','/assets/search-pages.json'].map(url => fetch(url).then(r => { if (!r.ok) throw Error(); return r.json(); }))).catch(error => { data = null; throw error; });
      const [catalog, pages] = await data;
      if (current !== generation) return;
      const words = normalize(query).split(/\s+/).map(w => synonyms[w] || w);
      const products = (catalog.products || catalog).filter(p => p.active !== false || p.availabilityStatus === 'sold').filter(p => score([p.displayName,p.name,p.material,p.segment,p.shortDescription].join(' '), words));
      products.sort((a,b) => Number(a.availabilityStatus === 'sold') - Number(b.availabilityStatus === 'sold'));
      const articles = pages.filter(p => score(p.title+' '+p.text, words));
      status.textContent = `${products.length} Produkte und ${articles.length} Inhalte gefunden.`;
      if (!measured) { track('site_search_used', {source:'site_search'}); measured = true; }
      if (products.length) {
        results.append(node('h2','Passende Produkte'));
        const grid = node('div','','searchProducts');
        products.slice(0,12).forEach(p => {
          const card = node('article','','searchProduct');
          const button = node('button','','searchProduct__open'); button.type = 'button';
          button.dataset.productPreview = p.id; button.dataset.productSource = 'site_search';
          const img = document.createElement('img'); img.src = p.image; img.alt = ''; img.loading = 'lazy';
          button.append(img,node('span',p.displayName || p.name));
          button.onclick = () => track('site_search_result_click',{product_id:p.id,source:'site_search'});
          card.append(button,node('p',p.availabilityStatus === 'sold' ? 'Verkauft · Inspiration für eine Anfrage' : p.priceLabel || 'Details ansehen'));
          grid.append(card);
        });
        results.append(grid);
        if(products.length>12)results.append(node('p','Weitere Treffer findest du mit einem genaueren Suchbegriff.'));
      }
      if (articles.length) {
        results.append(node('h2','Beratung und Hintergrund'));
        const list = node('ul','','searchArticles');
        articles.forEach(p => {const li=node('li'),a=node('a',p.title);a.href=p.url;a.onclick=()=>track('site_search_result_click',{source:'site_search',content_url:p.url});li.append(a,node('p',excerpt(p.text)));list.append(li);});
        results.append(list);
      }
      if (!products.length && !articles.length) {
        results.append(node('p','Probiere zum Beispiel Eiche, Nussbaum, Pflege oder Gravur.'));
        const a=node('a','Produkte und Brettfinder öffnen');a.href='/produkte.html#produktfinder';results.append(a);
        const p=node('p'),contact=node('a','Ein individuelles Brett anfragen');contact.href='/schneidebrett-nach-mass/#anfrage';p.append(contact);results.append(p);
      }
    } catch { if(current===generation) status.textContent = 'Die Suche konnte nicht geladen werden. Bitte erneut versuchen oder die Produkte direkt öffnen.'; }
  }
  form.addEventListener('submit', event => {event.preventDefault();clearTimeout(timer);search();});
  input.addEventListener('input',()=>{clearTimeout(timer);generation++;timer=setTimeout(search,250);});
  input.value = (window.siteSearchInitialQuery || '').slice(0,100);
  search();
})();
