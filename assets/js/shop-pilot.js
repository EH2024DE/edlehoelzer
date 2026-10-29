(function () {
  'use strict';
  var en = document.documentElement.lang === 'en';
  var t = en ? {
    add: 'Add to cart', wood: 'Wood', quantity: 'Quantity', remove: 'Remove', empty: 'Your cart is empty.',
    free: 'Free', shipping: 'Shipping within Germany', previewShipping: 'Shipping within Germany · preview',
    total: 'Total', subtotal: 'Products', checkout: 'Preview checkout', testCheckout: 'Continue to Stripe test checkout',
    loading: 'Calculating…', error: 'We could not calculate your cart. Please try again.', retry: 'Try again',
    added: 'Added to cart.', tax: 'No VAT charged (§19 UStG).', count: 'items',
    simulated: 'Preview only. No payment was made. Stripe test access has not been connected yet.',
    pending: 'Your payment is being verified. This return page is not proof of payment.',
    paid: 'Payment received and verified. We will review your order and send a separate acceptance.', failed: 'Payment was not completed. Your cart has been kept.',
    priceChanged: 'Prices have changed. Please review your cart again.', sample: 'Example photo · wood grain varies',
    shippingNote: 'Preview: parcel selection still requires packed dimensions and weights to be verified. EU orders by enquiry only.',
    standard: 'Standard version · optional engraving', included: 'Care instructions included', engraving: 'Engraving', each: 'per item',
    engravingNote: 'Text, motif and position agreed personally after ordering. Pilot limit: five per configuration; this is not a stock count.',
    from: 'From ', unavailable: 'Unavailable', soldOut: 'Sold out', accent: 'Inlay', noAccent: 'None (one wood)',
    customNote: 'Made to order. Inlay included at no extra cost. Final dimensions and production time agreed individually. Other dimensions require an individual quote.',
    woodNames: { Eiche: 'Oak', Nussbaum: 'Walnut', Esche: 'Ash', Buche: 'Beech', Rotbuche: 'Beech', Zwetschge: 'Plum', Kastanie: 'Chestnut', Ahorn: 'Maple', Kirsche: 'Cherry', Wildkirsche: 'Wild cherry', Kambala: 'Kambala', Wenge: 'Wenge' }
  } : {
    add: 'In den Warenkorb', wood: 'Holzart', quantity: 'Menge', remove: 'Entfernen', empty: 'Dein Warenkorb ist leer.',
    free: 'Kostenlos', shipping: 'Versand Deutschland', previewShipping: 'Versand Deutschland · Vorschau',
    total: 'Gesamtsumme', subtotal: 'Warenwert', checkout: 'Bezahlablauf ansehen', testCheckout: 'Zum Stripe-Testcheckout',
    loading: 'Wird berechnet…', error: 'Dein Warenkorb konnte nicht berechnet werden. Bitte versuche es erneut.', retry: 'Erneut versuchen',
    added: 'Im Warenkorb.', tax: 'Kein Umsatzsteuerausweis (§19 UStG).', count: 'Artikel',
    simulated: 'Nur eine Vorschau. Es wurde keine Zahlung ausgeführt. Der Stripe-Testzugang ist noch nicht verbunden.',
    pending: 'Die Zahlung wird geprüft. Diese Rückkehrseite ist noch keine Zahlungsbestätigung.',
    paid: 'Zahlung eingegangen und geprüft. Wir sehen deine Bestellung durch und senden dir eine gesonderte Annahmebestätigung.', failed: 'Zahlung nicht abgeschlossen. Dein Warenkorb bleibt erhalten.',
    priceChanged: 'Die Preise haben sich geändert. Bitte prüfe den Warenkorb erneut.', sample: 'Beispielfoto · Holzbild variiert',
    shippingNote: 'Vorschau: Paketwahl nach verpackten Maßen und Gewichten noch zu prüfen. EU-Bestellungen nur auf Anfrage.',
    standard: 'Standardausführung · Gravur optional', included: 'Pflegeanleitung inklusive', engraving: 'Gravur', each: 'pro Stück',
    engravingNote: 'Text, Motiv und Position stimmen wir nach der Bestellung persönlich ab. Pilotlimit: fünf je Ausführung, keine Bestandsangabe.',
    from: 'Ab ', unavailable: 'Nicht verfügbar', soldOut: 'Ausverkauft', accent: 'Intarsie', noAccent: 'Keine (ein Holz)',
    customNote: 'Fertigung auf Bestellung. Intarsien sind ohne Aufpreis enthalten. Finale Maße und Fertigungszeit nach Abstimmung. Abweichende Maße werden individuell angeboten.', woodNames: {}
  };
  var catalog, cart = [], currentQuote = null, pending = false, checkoutPending = false, requestId = null, sequence = 0, shippingChoice = 'standard', editingLine = null;
  var formDrafts=new Map();
  var storageKey = 'edle-shop-pilot-cart-v1';
  try {if (sessionStorage.getItem('edle-shop-shipping') === 'insured') shippingChoice='insured';} catch (_) {}
  var configuredApi = document.querySelector('meta[name="shop-api"]')?.content || '';
  var apiBase = '/api/shop/';
  if (configuredApi) {
    var endpoint = new URL(configuredApi);
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('Invalid checkout API configuration');
    apiBase = endpoint.href.replace(/\/?$/, '/');
  }
  var root = document.querySelector('[data-shop-products]');
  var cartRoot = document.querySelector('[data-shop-cart]');
  var status = document.querySelector('[data-shop-status]');
  var button = document.querySelector('[data-shop-checkout]');
  var money = value => new Intl.NumberFormat(en ? 'en-IE' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(value / 100);
  var esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  var icon = name => '<img src="/assets/icons/lucide/' + name + '.svg" alt="" width="18" height="18">';
  var name = offer => en ? offer.nameEn : offer.name;
  var woodName = wood => t.woodNames[wood] || wood;
  var unitPrice = (offer, wood) => offer.woodPrices ? offer.woodPrices[wood] : offer.unitCents;
  var available = (offer, wood, variant,edge) => offer && !offer.sold && offer.checkoutReady !== false && !offer.unavailableWoods?.includes(wood) && (!offer.edgeStock || (edge ? offer.edgeStock[wood]?.[edge]>0 : Object.values(offer.edgeStock[wood] || {}).some(stock=>stock>0))) && (offer.variants ? offer.variants.some(v=>v.id === variant && !v.sold) : Number.isSafeInteger(unitPrice(offer, wood)) && unitPrice(offer, wood) > 0);
  var grooveIdentity=item=>item.juiceGroove ? item.grooveType || 'perimeter' : '';
  var sameVariant = (a, b) => a.sku === b.sku && a.wood === b.wood && (a.edge || '')===(b.edge || '') && (a.accent || '') === (b.accent || '') && (a.variant || '') === (b.variant || '') && !!a.engraving === !!b.engraving && !!a.juiceGroove === !!b.juiceGroove && grooveIdentity(a)===grooveIdentity(b) && !!a.careBalm === !!b.careBalm && JSON.stringify(a.personalisation || null)===JSON.stringify(b.personalisation || null) && (a.note || '')===(b.note || '');
  var optionName = option => ({engraving:t.engraving,juiceGroove:en?'Juice groove':'Saftrille',careBalm:en?'Add care balm':'Pflegebalsam ergänzen'})[option];
  var formItem = form => {
    var data = new FormData(form), item = {sku:form.dataset.add,wood:data.get('wood') || '',quantity:Number(data.get('quantity'))};
    for (var key of ['variant','accent','edge']) if (data.has(key)) item[key] = data.get(key);
    for (var key of ['engraving','juiceGroove','careBalm']) if (data.has(key)) item[key] = true;
    if(item.juiceGroove)item.grooveType=data.get('grooveType') || 'perimeter';
    if(item.engraving) {
      var offer=catalog.offers.find(o=>o.sku===item.sku),kind=data.get('engravingKind') || 'text';
      item.personalisation={kind,position:offer.category==='board' ? data.get('engravingPosition') : 'by-arrangement'};
      if(kind==='text') {item.personalisation.text=(data.get('engravingText') || '').trim();item.personalisation.font=data.get('engravingFont');}
      else item.personalisation.uploadId=form.dataset.uploadId || '';
    }
    if(data.has('orderNote') && data.get('orderNote').trim()) item.note=data.get('orderNote').trim();
    return item;
  };
  var itemPrice = (offer,item) => {
    var amount = offer.variants?.find(v=>v.id === item.variant)?.unitCents ?? unitPrice(offer,item.wood);
    for (var key of ['engraving','juiceGroove','careBalm']) if (item[key]) amount += offer[key+'Cents'];
    return amount;
  };
  var previewImage = src => String(src).replace(/^(https:\/\/i\.etsystatic\.com\/.+\/)il_fullxfull\./,'$1il_794xN.');
  var itemImage = (offer,item) => previewImage(offer.variants?.find(v=>v.id === item.variant)?.image || offer.image);
  var isLimited = (offer,item) => offer.singlePiece && offer.variants?.find(v=>v.id === item.variant)?.availabilityStatus !== 'made_to_order';
  var maxFor = (offer,item) => offer.edgeStock ? (item.edge ? offer.edgeStock[item.wood]?.[item.edge] || 0 : Math.max(0,...Object.values(offer.edgeStock[item.wood] || {}))) : isLimited(offer,item) ? 1 : Math.min(catalog.maxQuantity,offer.stockLimit || catalog.maxQuantity);
  function capacity(offer,item,exclude) {
    var max=maxFor(offer,item);
    if(offer.edgeStock)max-=cart.filter(x=>x!==exclude && x.sku===item.sku && x.wood===item.wood && (x.edge || '')===(item.edge || '')).reduce((n,x)=>n+x.quantity,0);
    else if(isLimited(offer,item) || offer.stockLimit) max-=cart.filter(x=>x!==exclude && x.sku===item.sku && (offer.sharedVariantStock || !offer.variants || x.variant===item.variant)).reduce((n,x)=>n+x.quantity,0);
    else max-=cart.filter(x=>x!==exclude && x.sku===item.sku && x.wood===item.wood && (x.variant || '')===(item.variant || '')).reduce((n,x)=>n+x.quantity,0);
    return Math.max(0,max);
  }
  function dispatchText(offer,item) {
    if(offer.materialInStock===false)return en?offer.availabilityNoteEn:offer.availabilityNote;
    if (offer.dispatch === 'custom') return en?'3–4 weeks production after final approval and payment · German shipping included · No express':'3–4 Wochen Fertigung ab Maßfreigabe und Zahlung · Deutschlandversand inklusive · Kein Express';
    if(offer.requiresAgreement && !offer.madeToOrder && offer.variants?.find(v=>v.id===item.variant)?.availabilityStatus!=='made_to_order')return en?'Dimensions and dispatch timing agreed before a binding order.':'Maße und Versandtermin stimmen wir vor der verbindlichen Bestellung ab.';
    if (offer.requiresAgreement || offer.variants?.find(v=>v.id === item.variant)?.availabilityStatus === 'made_to_order') return en?'Made to order. Dimensions and timing agreed before a binding order.':'Fertigung auf Bestellung. Maße und Termin vor verbindlicher Bestellung abstimmen.';
    return (en?'Ready to dispatch in ':'Versandbereit in ')+(item.juiceGroove || (offer.sharedVariantStock && item.variant === 'groove') ?'3–5':'1–3')+(en?' working days. Transit time additional.':' Werktagen. Zuzüglich Transportzeit.');
  }
  function save() {
    try{localStorage.setItem(storageKey, JSON.stringify(cart.map(({personalisation,note,...item})=>item)));}catch(_){}
    try{sessionStorage.setItem('edle-shop-private-draft',JSON.stringify({expires:Date.now()+7200000,cart}));sessionStorage.setItem('edle-shop-shipping',shippingChoice);}catch(_){}
  }
  async function api(path, body) {
    var response = await fetch(apiBase + path, { method: body ? 'POST' : 'GET', credentials: 'omit', headers: body ? { 'Content-Type': 'application/json' } : {}, ...(body ? { body: JSON.stringify(body) } : {}) });
    var value = await response.json();
    if (!response.ok) throw new Error(value.error || 'SERVICE_UNAVAILABLE');
    return value;
  }
  function setStatus(text,quiet=false) { status.textContent = text; status.classList.toggle('sr-only',quiet); document.querySelector('[data-shop-retry]').hidden = text !== t.error; }
  var positionOrder=['face-top-left','face-top-right','face-bottom-left','face-bottom-right','edge-front-left','edge-front-right'];
  function positionDiagram() {
    var marker=id=>{var position=catalog.customisation.boardPositions.find(p=>p.id===id),label=en?position.nameEn:position.name;return '<button type="button" data-position-choice="'+id+'" title="'+esc(label)+'" aria-label="'+esc(label)+'" aria-pressed="false">'+(positionOrder.indexOf(id)+1)+'</button>';};
    return '<div class="pilotPositionDiagram" role="group" aria-label="'+(en?'Choose engraving position':'Gravurposition wählen')+'"><p>'+(en?'Cutting face · top view':'Schneidefläche · Draufsicht')+'</p><div class="pilotPositionFace">'+positionOrder.slice(0,4).map(marker).join('')+'</div><p class="pilotPositionFront">'+(en?'Front · facing you':'Vorne · dir zugewandt')+'</p><div class="pilotPositionEdge" data-position-edge>'+positionOrder.slice(4).map(marker).join('')+'</div><p data-position-edge-label>'+(en?'Front narrow edge':'Vordere schmale Kante')+'</p><p class="pilotFine" data-position-rule></p></div>';
  }
  function syncPositions(form) {
    var select=form.elements.engravingPosition;if(!select)return;
    var offer=catalog.offers.find(o=>o.sku===form.dataset.add),variant=offer.variants?.find(v=>v.id===form.elements.variant?.value);
    var thickness=variant ? variant.minimumThicknessCm : offer.minimumThicknessCm;
    var edges=Number.isFinite(thickness) && thickness>=2;
    var allowed=catalog.customisation.boardPositions.filter(p=>edges || p.id.startsWith('face-'));
    var before=select.value;
    select.innerHTML='<option value="">'+(en?'Choose position':'Position wählen')+'</option>'+allowed.map(p=>'<option value="'+p.id+'">'+(positionOrder.indexOf(p.id)+1)+'. '+esc(en?p.nameEn:p.name)+'</option>').join('');
    select.value=allowed.some(p=>p.id===before)?before:'';
    form.querySelector('[data-position-edge]').hidden=!edges;
    form.querySelector('[data-position-edge-label]').hidden=!edges;
    form.querySelector('[data-position-rule]').textContent=edges ? (en?'A narrow-edge engraving preserves your design when the cutting face is resurfaced.':'Eine Gravur auf der schmalen Kante bleibt beim Aufarbeiten der Schneidefläche erhalten.') : Number.isFinite(thickness) ? (en?'Boards under 2 cm: engraving on the cutting face only.':'Bei Brettern unter 2 cm Stärke gravieren wir nur auf der Schneidefläche.') : (en?'Thickness not yet confirmed: cutting-face positions only.':'Stärke noch nicht bestätigt: vorerst nur Positionen auf der Schneidefläche.');
    form.querySelectorAll('[data-position-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.positionChoice===select.value)));
  }
  function personalisationFields(offer) {
    if(!offer.engravingCents)return '';
    return '<fieldset class="pilotPersonalisation" data-personalisation hidden disabled><legend>'+t.engraving+'</legend><label>'+(en?'Type':'Art')+'<select name="engravingKind"><option value="text">'+(en?'Text engraving':'Textgravur')+'</option><option value="logo">Logo</option></select></label>'+
      '<div data-text-fields><label>'+(en?'Engraving text':'Gravurtext')+'<textarea name="engravingText" rows="2" maxlength="'+catalog.customisation.textLimit+'" required></textarea></label><label>'+(en?'Font':'Schriftart')+'<select name="engravingFont">'+catalog.customisation.fonts.map(f=>'<option value="'+f.id+'">'+f.name+(f.popular ? (en?' · Most chosen':' · Häufig gewählt') : '')+'</option>').join('')+'</select></label><p class="pilotFine">'+(en?'Amatic SC and Allura are our most frequently chosen engraving fonts.':'Amatic SC und Allura werden für unsere Gravuren am häufigsten gewählt.')+'</p><p class="pilotFontSample font-allura" data-font-sample>'+(en?'Your engraving':'Deine Gravur')+'</p></div>'+
      '<div data-logo-fields hidden><label>'+(en?'Logo file · PNG/JPEG, up to 4 MB':'Logodatei · PNG/JPEG, bis 4 MB')+'<input type="file" name="logoFile" accept="image/png,image/jpeg"></label><button type="button" class="pilotUpload" data-logo-upload>'+(en?'Upload logo privately':'Logo geschützt übertragen')+'</button><p class="pilotFine" data-logo-status role="status"></p><p class="pilotFine">'+(en?'Private storage outside the website. Unordered uploads expire after 24 hours. No SVG or PDF uploads in this pilot.':'Private Speicherung außerhalb der Website. Ohne Bestellung wird der Upload nach 24 Stunden ungültig. Im Pilot keine SVG- oder PDF-Dateien.')+'</p></div>'+
      (offer.category==='board' ? '<label>'+(en?'Engraving position':'Gravurposition')+'<select name="engravingPosition" required></select></label>'+positionDiagram()+'<p class="pilotFine">'+(en?'The front edge faces you. Left and right are viewed from your position; our brand mark is usually on the opposite side.':'Die Vorderkante zeigt zu dir. Links und rechts gelten aus deiner Blickrichtung; unser Brandlogo liegt meist gegenüber.')+'</p>' : '<p class="pilotFine">'+(en?'Position agreed for your specific tool before production.':'Die Position stimmen wir passend zu deinem Küchenhelfer vor der Fertigung ab.')+'</p>')+
      '<p class="pilotMockup">'+(en?'Before engraving, we send you a mockup for approval. You can request changes; engraving starts only after your approval.':'Vor der Gravur schicken wir dir ein Mockup zur Freigabe. Du kannst noch Anpassungen wünschen; erst nach deiner Freigabe gravieren wir.')+'</p>'+
      '<p class="pilotFine">'+(en?'The same engraving applies to every item in this line. Add separate lines for different names. Font examples and size are subject to workshop approval.':'Die Angaben gelten für alle Exemplare dieser Position. Verschiedene Namen bitte getrennt hinzufügen. Schriftbeispiele und Größe vorbehaltlich Werkstattfreigabe.')+'</p></fieldset>';
  }
  function grooveFields(offer) {
    if(!offer.juiceGrooveCents)return '';
    return '<div class="pilotGroove" data-groove-fields hidden><label>'+(en?'Juice groove design':'Saftrillen-Ausführung')+'<select name="grooveType" disabled>'+catalog.customisation.grooveTypes.map(type=>'<option value="'+type.id+'">'+esc(en?type.nameEn:type.name)+'</option>').join('')+'</select></label></div>';
  }
  function syncGroove(form) {
    var fields=form.querySelector('[data-groove-fields]');if(!fields)return;
    var active=form.elements.juiceGroove.checked;
    fields.hidden=!active;form.elements.grooveType.disabled=!active;
  }
  function syncEdges(form) {
    var select=form.elements.edge;if(!select)return;
    var offer=catalog.offers.find(o=>o.sku===form.dataset.add),wood=form.elements.wood.value,before=select.value;
    select.innerHTML='<option value="">'+(en?'Choose edge':'Kante wählen')+'</option>'+offer.edgeChoices.filter(edge=>Object.hasOwn(offer.edgeStock[wood] || {},edge.id)).map(edge=>'<option value="'+edge.id+'"'+(offer.edgeStock[wood][edge.id]===0?' disabled':'')+'>'+esc(en?edge.nameEn:edge.name)+(offer.edgeStock[wood][edge.id]===0?' · '+t.soldOut:'')+'</option>').join('');
    select.value=Object.hasOwn(offer.edgeStock[wood] || {},before)?before:'';
    form.querySelector('[data-edge-stock]').textContent=select.value ? (en?'Available: ':'Verfügbar: ')+offer.edgeStock[wood][select.value] : '';
  }
  function syncPersonalisation(form) {
    var fieldset=form.querySelector('[data-personalisation]');
    if(!fieldset)return;
    var active=form.elements.engraving.checked,logo=form.elements.engravingKind.value==='logo';
    fieldset.hidden=!active;fieldset.disabled=!active;
    form.querySelector('[data-text-fields]').hidden=logo;
    form.querySelector('[data-logo-fields]').hidden=!logo;
    form.elements.engravingText.disabled=logo || !active;
    form.elements.engravingFont.disabled=logo || !active;
    form.elements.engravingFont.required=true;
    form.elements.logoFile.disabled=!logo || !active;
    var sample=form.querySelector('[data-font-sample]');
    sample.className='pilotFontSample font-'+form.elements.engravingFont.value;
    sample.textContent=form.elements.engravingText.value || (en?'Your engraving':'Deine Gravur');
    syncPositions(form);
  }
  function rememberForms() {
    root.querySelectorAll('[data-add]').forEach(form=>formDrafts.set(form.dataset.add,{fields:Array.from(form.elements).filter(el=>el.name && el.type!=='file').map(el=>[el.name,el.type==='checkbox'?el.checked:el.value]),uploadId:form.dataset.uploadId || ''}));
  }
  function renderProducts() {
    rememberForms();
    root.innerHTML = catalog.offers.filter(offer=>!root.dataset.productFocus || offer.sku===root.dataset.productFocus).map(offer => {
      var variant = offer.variants?.find(v=>!v.sold) || offer.variants?.[0];
      var contact = 'mailto:info@edlehoelzer.de?subject=' + encodeURIComponent((en?'Similar piece: ':'Ähnliches Stück: ')+name(offer));
      var start = '<article data-offer="' + esc(offer.sku) + '" class="pilotProduct' + (offer.woodPrices ? ' pilotProduct--custom' : '') + '"><div class="pilotProduct__photo"><img loading="lazy" decoding="async" src="' + esc(previewImage(variant?.image || offer.image)) + '" alt="' + esc(name(offer)) + '" width="700" height="700"></div>' +
      (offer.juiceGrooveCents && catalog.customisation.grooveGuide.image ? '<div class="pilotGalleryTabs" role="group" aria-label="'+(en?'Product images':'Produktbilder')+'"><button type="button" data-gallery-choice="product" aria-pressed="true">'+(en?'Product':'Produkt')+'</button><button type="button" data-gallery-choice="guide" aria-pressed="false">'+(en?'Juice groove designs':'Saftrillen-Ausführungen')+'</button></div>' : '')+
      '<div class="pilotProduct__heading"><h2>' + esc(name(offer)) + '</h2><strong data-offer-price="' + esc(offer.sku) + '">' + (offer.sold ? t.soldOut : money(variant?.unitCents ?? (offer.woodPrices ? unitPrice(offer,offer.woods[0]) : offer.unitCents))) + '</strong></div><p data-offer-details>' + esc(variant?.dimensions ? (en?variant.nameEn:variant.name)+' · '+variant.dimensions : en ? offer.detailEn : offer.detail) + '</p>';
      if (offer.sold) return start + '<p class="pilotSold">' + (en?'This one-off piece has found a home. For a similar board, please contact us.':'Dieses Einzelstück ist leider vergriffen. Für ein ähnliches Brett melde dich persönlich bei uns.') + '</p><a class="pilotAdd" href="' + esc(contact) + '">' + (en?'Request a similar piece':'Ähnliches Stück anfragen') + '</a></article>';
      return start +
      (offer.woodPrices ? '<p class="pilotProduct__contents">' + t.customNote + '</p>' : '') +
      '<p class="pilotDispatch" data-offer-dispatch>' + dispatchText(offer,{variant:variant?.id}) + '</p>' +
      (offer.singlePiece ? '<p class="pilotFine">'+(en?'One piece per available design.':'Ein Exemplar je verfügbarer Ausführung.')+'</p>' : '')+
      '<form data-add="' + esc(offer.sku) + '"><div class="pilotProduct__options">' + (offer.variants ? '<label>' + (en?'Design':'Ausführung') + '<select name="variant">' + offer.variants.map(v=>'<option value="'+esc(v.id)+'"'+(v.sold?' disabled':'')+(v.id===variant.id?' selected':'')+'>'+esc(en?v.nameEn:v.name)+' · '+money(v.unitCents)+(v.sold?' · '+t.soldOut:'')+'</option>').join('')+'</select></label>' : '') +
      (offer.woods.length ? '<label>' + t.wood + '<select name="wood">' + offer.woods.map(wood => '<option value="' + esc(wood) + '"' + (offer.unavailableWoods?.includes(wood) ? ' disabled' : '') + '>' + esc(woodName(wood)) + (offer.woodPrices ? ' · ' + money(unitPrice(offer, wood)) : '') + (offer.unavailableWoods?.includes(wood) ? ' · ' + t.soldOut : '') + '</option>').join('') + '</select></label>' : '') +
      (offer.edgeStock ? '<label>'+(en?'Edge':'Kantenform')+'<select name="edge" required></select><small data-edge-stock></small></label>' : '')+
      (offer.accents ? '<label class="pilotAccent">' + t.accent + ' · ' + (en ? 'included' : 'inklusive') + '<select name="accent">' + offer.accents.map(wood => '<option value="' + esc(wood) + '">' + esc(wood ? woodName(wood) : t.noAccent) + '</option>').join('') + '</select></label>' : '') +
      '<label>' + t.quantity + '<input name="quantity" type="number" min="1" max="' + offer.maxQuantity + '" value="1" required></label></div>' +
      ['engraving','juiceGroove','careBalm'].filter(key=>offer[key+'Cents']).map(key=>'<label class="pilotEngraving"><input type="checkbox" name="'+key+'">'+optionName(key)+' + '+money(offer[key+'Cents'])+' '+t.each+'</label>').join('') +
      grooveFields(offer) + personalisationFields(offer) +
      (offer.sku==='xxl-custom-board' ? '<label class="pilotOrderNote">'+(en?'Notes for our personal agreement (optional)':'Hinweise für die persönliche Abstimmung (optional)')+'<textarea name="orderNote" rows="3" maxlength="'+catalog.customisation.noteLimit+'" placeholder="'+(en?'Dimensions, special requirements or gift packaging':'Maße, Besonderheiten oder Geschenkverpackung')+'"></textarea></label>' : '') +
      (offer.grooveIncluded ? '<p class="pilotFine">'+(en?'Juice groove already included.':'Saftrille bereits enthalten.')+'</p>' : '') +
      (offer.sourceReviewRequired ? '<p class="pilotFine">'+(en?'Catalogue prices · final Etsy variation verification pending.':'Katalogpreise · finaler Etsy-Variantenabgleich noch offen.')+'</p>' : '') +
      '<button class="pilotAdd" type="submit">'+icon('plus')+t.add+'</button><button type="button" class="pilotEdit" data-cancel-edit hidden>'+(en?'Cancel editing':'Bearbeitung abbrechen')+'</button></form>' +
      (offer.packageContents.length ? '<details class="pilotContents"><summary>'+(en?'Included':'Lieferumfang')+'</summary><ul>'+offer.packageContents.map(p=>'<li>'+esc(en?p.labelEn:p.label)+'</li>').join('')+'</ul></details>' : '') + '</article>';
    }).join('');
    root.querySelectorAll('[data-add]').forEach(form=>{
      var draft=formDrafts.get(form.dataset.add);
      if(draft){for(var [key,value] of draft.fields){var field=form.elements[key];if(field){if(field.type==='checkbox')field.checked=value;else field.value=value;}}form.dataset.uploadId=draft.uploadId;}
      syncEdges(form);
      if(form.elements.edge && draft){var savedEdge=draft.fields.find(([key])=>key==='edge')?.[1];if(savedEdge)form.elements.edge.value=savedEdge;}
      syncPersonalisation(form);syncGroove(form);
    });
    filterProducts();
  }
  function filterProducts() {
    var search = document.querySelector('[data-shop-search]')?.value.toLowerCase() || '';
    var group = document.querySelector('[data-shop-group]')?.value || 'all';
    var visibility = document.querySelector('[data-shop-availability]')?.value || 'all';
    var count = 0;
    root.querySelectorAll('[data-offer]').forEach(element=>{
      var offer = catalog.offers.find(o=>o.sku===element.dataset.offer);
      element.hidden = ![offer.name,offer.nameEn,offer.detail,offer.detailEn].join(' ').toLowerCase().includes(search) || (group!=='all' && offer.category!==group) || (visibility==='sold' && !offer.sold) || (visibility==='available' && offer.sold);
      if (!element.hidden) count++;
    });
    var counter=document.querySelector('[data-shop-results]');
    if(counter) counter.textContent=count+' '+(en?'products':'Produkte');
  }
  document.querySelector('[data-shop-filters]')?.addEventListener('input',filterProducts);
  function updateForm(form) {
    var offer=catalog.offers.find(o=>o.sku===form.dataset.add);
    syncEdges(form);
    syncPersonalisation(form);
    syncGroove(form);
    var item = formItem(form), ready = available(offer,item.wood,item.variant,item.edge);
    var limit=capacity(offer,item,editingLine);
    form.elements.quantity.max=Math.max(1,limit);
    if (item.quantity>Math.max(1,limit)) form.elements.quantity.value=Math.max(1,limit);
    form.closest('article').querySelector('[data-offer-price]').textContent = ready ? money(itemPrice(offer,item)) : t.unavailable;
    form.closest('article').querySelector('[data-offer-dispatch]').textContent=dispatchText(offer,item);
    if (item.variant && form.closest('article').dataset.gallery!=='guide') {
      var image=form.closest('article').querySelector('.pilotProduct__photo img');
      image.src=itemImage(offer,item);
      var variant=offer.variants.find(v=>v.id === item.variant);
      image.alt=name(offer)+' · '+(en?variant.nameEn:variant.name);
      form.closest('article').querySelector('[data-offer-details]').textContent=variant.dimensions ? (en?variant.nameEn:variant.name)+' · '+variant.dimensions : (en?offer.detailEn:offer.detail);
    }
    var submit=form.querySelector('[type="submit"]');
    submit.disabled = checkoutPending || !ready || limit===0 || form.dataset.uploadPending==='true';
    var uploadButton=form.querySelector('[data-logo-upload]');
    if(uploadButton)uploadButton.disabled=checkoutPending || form.dataset.uploadPending==='true';
    submit.innerHTML=editingLine?.sku===offer.sku ? (en?'Apply changes':'Änderungen übernehmen') : icon('plus')+(limit===0 ? (en?'Already in cart':'Bereits im Warenkorb') : t.add);
    form.querySelector('[data-cancel-edit]').hidden=editingLine?.sku!==offer.sku;
  }
  root.addEventListener('input',event=>{
    var form=event.target.closest('[data-add]');
    if(!form)return;
    if(event.target.name==='quantity' && event.target.value!=='') {
      var item=formItem(form), offer=catalog.offers.find(o=>o.sku===item.sku);
      event.target.value=Math.max(1,Math.min(Math.max(1,capacity(offer,item,editingLine)),Math.floor(Number(event.target.value) || 1)));
    }
    updateForm(form);
  });
  root.addEventListener('click',event=>{
    var position=event.target.closest('[data-position-choice]');
    if(position){var form=position.closest('form');form.elements.engravingPosition.value=position.dataset.positionChoice;updateForm(form);return;}
    var gallery=event.target.closest('[data-gallery-choice]');
    if(gallery) {
      var article=gallery.closest('[data-offer]'),offer=catalog.offers.find(o=>o.sku===article.dataset.offer),img=article.querySelector('.pilotProduct__photo img'),guide=gallery.dataset.galleryChoice==='guide';
      article.dataset.gallery=guide?'guide':'product';article.querySelector('.pilotProduct__photo').classList.toggle('is-guide',guide);
      img.src=guide?catalog.customisation.grooveGuide.image:itemImage(offer,formItem(article.querySelector('form')));
      img.alt=guide?(en?catalog.customisation.grooveGuide.altEn:catalog.customisation.grooveGuide.alt):name(offer);
      article.querySelectorAll('[data-gallery-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button===gallery)));
      return;
    }
    if(!event.target.closest('[data-cancel-edit]'))return;
    editingLine=null;
    renderCart();
  });
  root.addEventListener('change',event=>{
    var form=event.target.closest('[data-add]');
    if(!form)return;
    if(event.target.name==='logoFile') {
      delete form.dataset.uploadId;
      form.querySelector('[data-logo-status]').textContent=en?'Please upload the selected file.':'Bitte übertrage die ausgewählte Datei.';
    }
    updateForm(form);
  });
  root.addEventListener('click',async event=>{
    var uploadButton=event.target.closest('[data-logo-upload]');
    if(!uploadButton)return;
    var form=uploadButton.closest('[data-add]'), file=form.elements.logoFile.files[0], output=form.querySelector('[data-logo-status]');
    if(!file || !['image/png','image/jpeg'].includes(file.type) || file.size>catalog.customisation.uploadMaxBytes) {
      output.textContent=en?'Choose a PNG or JPEG up to 4 MB.':'Bitte wähle PNG oder JPEG bis 4 MB.';return;
    }
    form.dataset.uploadPending='true';uploadButton.disabled=true;updateForm(form);
    output.textContent=en?'Uploading and checking…':'Wird übertragen und geprüft…';
    try {
      var response=await fetch(apiBase+'uploads',{method:'POST',credentials:'omit',headers:{'Content-Type':file.type},body:file});
      var result=await response.json();
      if(!response.ok)throw new Error('UPLOAD_FAILED');
      if(form.elements.logoFile.files[0]!==file)return;
      form.dataset.uploadId=result.id;
      output.textContent=en?'Logo stored privately. Final artwork approval before production.':'Logo geschützt hinterlegt. Motivfreigabe vor der Fertigung.';
    } catch(_) {output.textContent=en?'Upload failed. Please try again.':'Übertragung fehlgeschlagen. Bitte erneut versuchen.';}
    finally {delete form.dataset.uploadPending;uploadButton.disabled=false;updateForm(form);}
  });
  function personalisationSummary(item) {
    var p=item.personalisation;
    if(!p)return item.engraving ? (en?'Engraving details missing':'Gravurangaben fehlen') : '';
    var position=catalog.customisation.boardPositions.find(x=>x.id===p.position);
    return (p.kind==='logo' ? (en?'Logo uploaded':'Logo hinterlegt') : '“'+p.text+'” · '+(catalog.customisation.fonts.find(f=>f.id===p.font)?.name || ''))+(position ? ' · '+(en?position.nameEn:position.name) : '');
  }
  function renderMobileCart() {
    var subtotal=cart.reduce((sum,item)=>{
      var offer=catalog.offers.find(o=>o.sku===item.sku);
      return sum+(offer ? itemPrice(offer,item)*item.quantity : 0);
    },0);
    var total=currentQuote && Number.isSafeInteger(currentQuote.totalCents) ? currentQuote.totalCents : subtotal;
    document.querySelectorAll('[data-shop-mobile-total]').forEach(el=>{el.textContent=money(total);});
    var label=!cart.length ? t.total : currentQuote && !currentQuote.shippingPending ? t.total : t.subtotal;
    var detail=!cart.length || (currentQuote && !currentQuote.shippingPending) ? '' : currentQuote?.shippingPending ? (en?'Shipping pending':'Versand offen') : pending ? (en?'Calculating shipping':'Versand wird berechnet') : (en?'Calculation unavailable':'Berechnung nicht verfügbar');
    document.querySelector('[data-shop-mobile-label]').textContent=label+(detail ? ' · '+detail : '');
  }
  function renderCart() {
    renderMobileCart();
    if (!cart.length) cartRoot.innerHTML = '<p class="pilotEmpty">' + t.empty + '</p>';
    else cartRoot.innerHTML = cart.map((item, index) => {
      var offer = catalog.offers.find(o => o.sku === item.sku);
      var quoted = currentQuote?.items.find(q => sameVariant(q, item));
      var variant=offer.variants?.find(v=>v.id === item.variant);
      var unavailable=!available(offer,item.wood,item.variant,item.edge);
      return '<article class="pilotCartItem"><img class="pilotCartItem__photo" src="' + esc(itemImage(offer,item)) + '" alt="" width="64" height="64"><div><h3>' + esc(name(offer)) + '</h3><p>' + esc(variant ? (en?variant.nameEn:variant.name) : woodName(item.wood) || (offer.category==='care' ? (en?'One tin':'Eine Dose') : t.standard)) + (offer.accents ? '<br>' + t.accent + ': ' + esc(item.accent ? woodName(item.accent) : t.noAccent) : '') + ['engraving','juiceGroove','careBalm'].filter(key=>item[key]).map(key=>'<br>'+optionName(key)+' (+'+money(offer[key+'Cents'])+' '+t.each+')').join('') + (unavailable?'<br>'+t.soldOut:'') + '</p>'+
      (item.engraving ? '<p class="pilotPersonalisationSummary">'+esc(personalisationSummary(item))+'</p>' : '')+
      (offer.edgeStock ? '<p>'+esc(item.edge ? (edge=>en?edge?.nameEn:edge?.name)(offer.edgeChoices.find(edge=>edge.id===item.edge)) : (en?'Choose edge using Edit':'Kantenform über „Ändern“ wählen'))+'</p>' : '')+
      (item.juiceGroove ? '<p>'+esc((type=>en?type?.nameEn:type?.name)(catalog.customisation.grooveTypes.find(type=>type.id===grooveIdentity(item))))+'</p>' : '')+
      (item.note ? '<p class="pilotPersonalisationSummary">'+esc(item.note)+'</p>' : '')+
      '<button type="button" class="pilotEdit" data-edit="'+index+'">'+(en?'Edit':'Ändern')+'</button>'+
      '<div class="pilotStepper">' +
        '<button type="button" data-step="-1" data-index="' + index + '" title="' + t.quantity + ' −" aria-label="' + esc(t.quantity + ' − ' + name(offer)) + '"' + (item.quantity === 1 ? ' disabled' : '') + '>' + icon('minus') + '</button>' +
        '<input aria-label="' + esc(t.quantity + ' · ' + name(offer) + ' · ' + woodName(item.wood)) + '" data-quantity="' + index + '" type="number" min="1" max="' + capacity(offer,item,item) + '" value="' + item.quantity + '">' +
        '<button type="button" data-step="1" data-index="' + index + '" title="' + t.quantity + ' +" aria-label="' + esc(t.quantity + ' + ' + name(offer)) + '"' + (item.quantity >= capacity(offer,item,item) ? ' disabled' : '') + '>' + icon('plus') + '</button></div></div><div class="pilotCartItem__right"><strong>' + money((quoted ? quoted.unitCents : itemPrice(offer,item)) * item.quantity) + '</strong><button class="pilotIcon" data-remove="' + index + '" title="' + t.remove + '" aria-label="' + esc(t.remove + ' · ' + name(offer)) + '">' + icon('x') + '</button></div></article>';
    }).join('');
    var count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-shop-count]').forEach(el => { el.textContent = count; });
    var summary = document.querySelector('[data-shop-summary]');
    summary.classList.toggle('is-shipping-pending',currentQuote?.shippingPending===true);
    if (currentQuote) summary.innerHTML = '<div><dt>' + t.subtotal + '</dt><dd>' + money(currentQuote.subtotalCents) + '</dd></div><div><dt>' + (currentQuote.shippingConfirmed ? t.shipping : t.previewShipping) + '</dt><dd>' + (currentQuote.shippingPending ? (en?'Being verified':'Wird geprüft') : currentQuote.shippingCents ? money(currentQuote.shippingCents) : t.free) + '</dd></div><div class="pilotTotal"><dt>' + t.total + '</dt><dd>' + (currentQuote.shippingPending ? (en?'After shipping review':'Nach Versandprüfung') : money(currentQuote.totalCents)) + '</dd></div>';
    else summary.innerHTML = '<div class="pilotTotal"><dt>' + t.total + '</dt><dd>' + (cart.length ? '—' : money(0)) + '</dd></div>';
    button.disabled = !cart.length || pending || checkoutPending || !currentQuote || currentQuote.shippingPending || currentQuote.configurationPending;
    document.querySelectorAll('[data-add]').forEach(form => {
      var offer = catalog.offers.find(o => o.sku === form.dataset.add);
      form.querySelectorAll('input,select,textarea,button').forEach(el => { el.disabled = checkoutPending; });
      if(!checkoutPending)updateForm(form);
    });
    if (checkoutPending) cartRoot.querySelectorAll('button,input').forEach(el => { el.disabled = true; });
    button.textContent = pending ? t.loading : (catalog.mode === 'test' ? t.testCheckout : t.checkout);
    document.querySelector('[data-shop-shipping-note]').textContent = currentQuote ? (currentQuote.shippingPending ? (en?'Shipping cost needs confirmation before checkout.':'Versandkosten werden vor dem Checkout bestätigt.') : currentQuote.freeShippingRemainingCents ? (en?'Free German shipping from €150. Another ':'Deutschlandversand kostenlos ab 150 €. Noch ')+money(currentQuote.freeShippingRemainingCents)+'.' : (en?'German standard shipping included.':'Standardversand innerhalb Deutschlands inklusive.')) : '';
    var upgrade = document.querySelector('[data-shop-insured-row]');
    if (upgrade) { upgrade.hidden = !currentQuote?.balmOnly || !currentQuote.freeShippingRemainingCents; upgrade.querySelector('input').disabled=checkoutPending; upgrade.querySelector('input').checked=shippingChoice==='insured'; }
    if(currentQuote?.configurationPending)setStatus(en?'Please complete your options using Edit.':'Bitte ergänze deine Auswahl über „Ändern“.');
    document.dispatchEvent(new CustomEvent('shop:cart-updated',{detail:{count:cart.reduce((n,item)=>n+item.quantity,0)}}));
  }
  async function refresh() {
    var id = ++sequence;
    currentQuote = null; pending = cart.length > 0; requestId = null;
    save(); renderCart();
    if (!cart.length) return;
    try {
      var result = await api('quote', { items: cart, country: 'DE', shippingChoice });
      if (id !== sequence) return;
      if (result.version !== catalog.version) {
        catalog = await api('catalog');
        if (id !== sequence) return;
        renderProducts();
      }
      currentQuote = result; pending = false; renderCart();
    } catch (error) { if (id === sequence) {
      pending = false;
      if (['PRODUCT_UNAVAILABLE','VARIANT_UNAVAILABLE'].includes(error.message)) {
        try { catalog=await api('catalog'); renderProducts(); } catch (_) {}
        setStatus(en?'An item is no longer available. Please remove it from your cart.':'Ein Artikel ist inzwischen vergriffen. Bitte entferne ihn aus dem Warenkorb.');
      } else if(error.message==='INVALID_PERSONALISATION')setStatus(en?'Please review the font and engraving position using Edit.':'Bitte prüfe Schrift und Gravurposition über „Ändern“.');
      else setStatus(t.error);
      renderCart();
    } }
  }
  root.addEventListener('submit', event => {
    var form = event.target.closest('[data-add]');
    if (!form) return;
    event.preventDefault();
    var item = formItem(form), offer=catalog.offers.find(o=>o.sku===item.sku);
    if (!available(offer, item.wood,item.variant,item.edge)) return;
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > capacity(offer,item,editingLine)) return;
    if(item.engraving && item.personalisation.kind==='logo' && !item.personalisation.uploadId) {form.querySelector('[data-logo-status]').textContent=en?'Please upload your logo first.':'Bitte übertrage zuerst dein Logo.';return;}
    var editIndex=editingLine?.sku===item.sku ? cart.indexOf(editingLine) : -1;
    if(editIndex>=0) {
      cart[editIndex]=item;editingLine=null;
      setStatus(en?'Changes saved.':'Änderungen übernommen.',true);refresh();return;
    }
    var old = cart.find(x => sameVariant(x, item));
    if (old && old.quantity + item.quantity > maxFor(offer,item)) { setStatus(en ? 'Quantity limit reached.' : 'Mengenlimit erreicht.'); return; }
    if (old) old.quantity += item.quantity; else cart.push(item);
    setStatus(t.added,true); refresh();
  });
  cartRoot.addEventListener('click', event => {
    var remove = event.target.closest('[data-remove]'), step = event.target.closest('[data-step]'),edit=event.target.closest('[data-edit]');
    if(edit) {
      editingLine=cart[Number(edit.dataset.edit)];
      var form=Array.from(root.querySelectorAll('[data-add]')).find(f=>f.dataset.add===editingLine.sku);
      if(!form){location.assign((en?'/en/shop-preview/':'/shop-vorschau/')+'?product='+encodeURIComponent(editingLine.sku)+'&edit='+Number(edit.dataset.edit));return;}
      var item=editingLine,p=item.personalisation;
      form.reset();
      for(var key of ['wood','variant','accent','quantity'])if(form.elements[key])form.elements[key].value=item[key] ?? '';
      syncEdges(form);if(form.elements.edge)form.elements.edge.value=item.edge || '';
      for(var key of ['engraving','juiceGroove','careBalm'])if(form.elements[key])form.elements[key].checked=!!item[key];
      if(form.elements.grooveType)form.elements.grooveType.value=grooveIdentity(item) || 'perimeter';
      delete form.dataset.uploadId;
      if(p) {
        form.elements.engravingKind.value=p.kind;
        if(p.kind==='text'){form.elements.engravingText.value=p.text;form.elements.engravingFont.value=p.font;}
        if(p.kind==='logo'){form.dataset.uploadId=p.uploadId;form.querySelector('[data-logo-status]').textContent=en?'Logo already uploaded.':'Logo bereits hinterlegt.';}
        if(form.elements.engravingPosition)form.elements.engravingPosition.value=p.position;
      }
      if(form.elements.orderNote)form.elements.orderNote.value=item.note || '';
      document.querySelector('[data-shop-search]').value='';document.querySelector('[data-shop-group]').value='all';document.querySelector('[data-shop-availability]').value='all';filterProducts();
      renderCart();form.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      return;
    }
    if (remove) {var removed=cart.splice(Number(remove.dataset.remove), 1)[0];if(removed===editingLine)editingLine=null;}
    else if (step) {
      var item=cart[Number(step.dataset.index)], max=capacity(catalog.offers.find(o=>o.sku===item.sku),item,item);
      item.quantity=Math.max(1,Math.min(max,item.quantity+Number(step.dataset.step)));
    }
    else return;
    setStatus(''); refresh();
  });
  cartRoot.addEventListener('input',event=>{
    if(!event.target.matches('[data-quantity]') || event.target.value==='')return;
    var item=cart[Number(event.target.dataset.quantity)],max=capacity(catalog.offers.find(o=>o.sku===item.sku),item,item);
    event.target.value=Math.max(1,Math.min(max,Math.floor(Number(event.target.value)||1)));
  });
  cartRoot.addEventListener('change', event => {
    if (!event.target.matches('[data-quantity]')) return;
    var value = Number(event.target.value);
    var item=cart[Number(event.target.dataset.quantity)], max=capacity(catalog.offers.find(o=>o.sku===item.sku),item,item);
    if (Number.isInteger(value) && value >= 1 && value <= max) item.quantity = value;
    refresh();
  });
  document.querySelector('[data-shop-retry]').addEventListener('click', () => { setStatus(''); refresh(); });
  document.querySelector('[data-shop-insured]')?.addEventListener('change',event=>{ shippingChoice=event.target.checked?'insured':'standard';refresh(); });
  var dialog = document.querySelector('[data-shop-dialog]');
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  button.addEventListener('click', async () => {
    if (!currentQuote || pending || checkoutPending || currentQuote.configurationPending || currentQuote.shippingPending) return;
    checkoutPending = true; renderCart(); setStatus('');
    try {
      var attemptKey = JSON.stringify({items:cart,version:currentQuote.version,shippingChoice});
      try {
        var attempt = JSON.parse(sessionStorage.getItem('edle-shop-checkout-attempt') || 'null');
        requestId = attempt?.key === attemptKey ? attempt.id : null;
      } catch (_) {}
      requestId = requestId || crypto.randomUUID();
      try { sessionStorage.setItem('edle-shop-checkout-attempt', JSON.stringify({key:attemptKey,id:requestId})); } catch (_) {}
      var result = await api('checkout', { items: cart, country: 'DE', shippingChoice, version: currentQuote.version, requestId, english: en });
      if (result.mode === 'demo') {
        dialog.querySelector('[data-demo-total]').textContent = money(result.quote.totalCents);
        dialog.querySelector('[data-demo-status]').textContent = t.simulated;
        dialog.showModal();
      } else {
        var target = new URL(result.url);
        if (target.protocol !== 'https:' || target.hostname !== 'checkout.stripe.com') throw new Error('INVALID_REDIRECT');
        window.location.assign(target.href);
      }
    } catch (error) {
      if (error.message === 'PRICE_CHANGED') {
        try { catalog = await api('catalog'); renderProducts(); await refresh(); setStatus(t.priceChanged); }
        catch (_) { setStatus(t.error); }
      } else if(error.message==='STOCK_RESERVED')setStatus(en?'This version is temporarily reserved in another checkout. Please try again later or contact us.':'Diese Ausführung ist gerade in einem anderen Bestellvorgang reserviert. Bitte versuche es später erneut oder melde dich bei uns.');
      else if(error.message==='PRODUCT_NOT_APPROVED')setStatus(en?'This product can be configured in the preview, but payment is not enabled yet. Please contact us.':'Dieses Produkt kannst du in der Vorschau zusammenstellen; die Zahlung ist dafür noch nicht freigegeben. Bitte melde dich bei uns.');
      else if(error.message==='CHECKOUT_RECOVERY_REVIEW_REQUIRED')setStatus(en?'We need to check the status of your earlier checkout before continuing. Please contact us; do not submit another payment.':'Wir müssen den Status deines früheren Bestellvorgangs prüfen. Bitte melde dich bei uns und veranlasse keine weitere Zahlung.');
      else if(['CHECKOUT_EXPIRED','ORDER_ALREADY_SUBMITTED'].includes(error.message)){
        try{sessionStorage.removeItem('edle-shop-checkout-attempt');}catch(_){}
        setStatus(en?'This checkout has ended. Please review your cart before starting again.':'Dieser Bestellvorgang ist beendet. Bitte prüfe deinen Warenkorb, bevor du neu startest.');
      } else setStatus(t.error);
    }
    finally { checkoutPending = false; renderCart(); }
  });
  async function paymentReturn() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'cancelled') setStatus(t.failed);
    if (params.get('payment') !== 'return') return;
    setStatus(t.pending);
    for (var tries = 0; tries < 10; tries++) {
      try {
        var value = await api('status?session_id=' + encodeURIComponent(params.get('session_id') || ''));
        if (value.status === 'paid') {
          try {
            var attempt = JSON.parse(sessionStorage.getItem('edle-shop-checkout-attempt') || 'null');
            if (attempt?.key === JSON.stringify({items:cart,version:currentQuote?.version,shippingChoice})) { cart = []; await refresh(); }
            sessionStorage.removeItem('edle-shop-checkout-attempt');
          } catch (_) {}
          history.replaceState(null, '', window.location.pathname);
          setStatus(value.orderStatus==='accepted'?(en?'Your order has been reviewed and accepted.':'Deine Bestellung wurde geprüft und angenommen.'):value.orderStatus==='rejected'?(en?'Your payment was received, but the order was not accepted. Please contact us to arrange the next steps.':'Deine Zahlung ist eingegangen, die Bestellung wurde jedoch nicht angenommen. Bitte melde dich bei uns, damit wir die Rückabwicklung klären.'):t.paid); return;
        }
        if (['failed','expired'].includes(value.status)) {
          try { sessionStorage.removeItem('edle-shop-checkout-attempt'); } catch (_) {}
          requestId = null; setStatus(t.failed); return;
        }
      } catch (_) { setStatus(t.pending); }
      if (tries < 9) await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  api('catalog').then(async value => {
    catalog = value;
    try {
      var stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      var privateDraft=JSON.parse(sessionStorage.getItem('edle-shop-private-draft') || 'null');
      if(privateDraft?.expires>Date.now() && Array.isArray(privateDraft.cart))stored=privateDraft.cart;
      else sessionStorage.removeItem('edle-shop-private-draft');
      if(Array.isArray(stored))stored=stored.map(item=>{
        var offer=catalog.offers.find(o=>o.sku===item.sku);
        return offer && Number.isInteger(item.quantity) && item.quantity>0 ? {...item,quantity:Math.min(item.quantity,maxFor(offer,item))} : item;
      });
      if (Array.isArray(stored)) cart = stored.filter(item => {
        var offer = catalog.offers.find(o => o.sku === item.sku);
        return offer && available(offer, item.wood,item.variant,item.edge) && ['engraving','juiceGroove','careBalm'].every(key=>(item[key] === undefined || typeof item[key] === 'boolean') && (!item[key] || offer[key+'Cents'])) && (offer.accents ? offer.accents.includes(item.accent ?? '') : !item.accent) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= maxFor(offer,item) && (offer.woods.length ? offer.woods.includes(item.wood) : item.wood === '');
      }).map(({sku,wood,edge,accent,variant,engraving,personalisation,note,juiceGroove,grooveType,careBalm,quantity}) => ({sku,wood,...(edge ? {edge} : {}),...(accent !== undefined ? {accent} : {}),...(variant ? {variant} : {}),...(engraving ? {engraving:true,...(personalisation && ['text','logo'].includes(personalisation.kind) ? {personalisation} : {})} : {}),...(sku==='xxl-custom-board' && typeof note==='string' ? {note} : {}),...(juiceGroove ? {juiceGroove:true,grooveType:grooveType || 'perimeter'} : {}),...(careBalm ? {careBalm:true} : {}),quantity}));
    } catch (_) {}
    var requestedProduct=new URLSearchParams(location.search).get('product');
    if(!root.dataset.productFocus && requestedProduct && catalog.offers.some(offer=>offer.sku===requestedProduct)){
      root.dataset.productFocus=requestedProduct;
      var allProducts=document.createElement('a');allProducts.href=location.pathname;allProducts.className='pilotFocusBack';allProducts.dataset.shopAll='';allProducts.textContent=en?'Back to all products':'Zurück zu allen Produkten';
      document.querySelector('[data-shop-filters]').before(allProducts);
    }
    renderProducts(); await refresh(); await paymentReturn();
    var requestedEdit=new URLSearchParams(location.search).get('edit');
    if(/^\d+$/.test(requestedEdit || '') && cart[Number(requestedEdit)]?.sku===requestedProduct)cartRoot.querySelector('[data-edit="'+Number(requestedEdit)+'"]')?.click();
  }).catch(() => { root.innerHTML = '<p>' + t.error + '</p>'; setStatus(t.error); });
  async function checkAvailability() {
    if (!catalog || document.hidden || checkoutPending) return;
    try {
      var next=await api('catalog');
      var signature=c=>JSON.stringify(c.offers.map(o=>[o.sku,o.sold,o.edgeStock,o.variants?.map(v=>[v.id,v.sold])]));
      if (signature(next)!==signature(catalog) || next.version!==catalog.version) {
        catalog=next;renderProducts();await refresh();
      }
    } catch (_) {}
  }
  document.addEventListener('visibilitychange',checkAvailability);
  document.querySelector('a[href="#sortiment"]')?.addEventListener('click',()=>{
    if(!new URLSearchParams(location.search).has('product'))return;
    delete root.dataset.productFocus;
    var url=new URL(location.href);url.searchParams.delete('product');history.replaceState(null,'',url.pathname+url.search+url.hash);
    renderProducts();renderCart();
  });
  setInterval(checkAvailability,60000);
}());
