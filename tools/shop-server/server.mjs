import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import Stripe from 'stripe';
import { ROOT, config, customisation, catalogVersion, publicCatalog, quote, checkoutParams, ShopError } from './catalog.mjs';
import { openStore } from './store.mjs';
import { openUploads } from './uploads.mjs';
import {siteAssets,renderSitePreview,approvedHome} from './site-preview.mjs';
import {reconcileCheckouts} from './reconcile.mjs';

const securityHeaders = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' https://i.etsystatic.com; media-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action https://checkout.stripe.com",
  'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

export function createShopServer(options = {}) {
  const mode = options.mode || process.env.SHOP_MODE || 'demo';
  if (!['demo', 'test'].includes(mode)) throw new Error('Only demo and Stripe test mode are supported');
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (key && !key.startsWith('sk_test_')) throw new Error('Only Stripe test keys are accepted');
  const stripe = options.stripe || (key ? new Stripe(key, { maxNetworkRetries: 2, timeout: 15000 }) : null);
  const origin = options.publicOrigin || process.env.SHOP_PUBLIC_ORIGIN || 'http://127.0.0.1:8170';
  if (mode === 'test' && (!origin.startsWith('https://') || !stripe)) throw new Error('Stripe test mode needs a configured HTTPS origin and a test key');
  if (mode === 'test' && !options.store && !process.env.SHOP_DATA_DIR) throw new Error('Stripe test mode needs an explicit private durable SHOP_DATA_DIR');
  const webhookSecret = options.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  const store = options.store || openStore(process.env.SHOP_DATA_DIR || path.join(os.tmpdir(), 'edle-shop-pilot-demo'));
  const uploads=openUploads(store);
  uploads.prune();
  const cleanup=setInterval(()=>{try{uploads.prune();}catch(_){}},3600000);
  cleanup.unref();
  const limits = new Map();
  const reconciliation={running:false,result:null};
  const respond = (res, status, value) => {
    res.writeHead(status, { ...securityHeaders, 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(value));
  };
  const sameOrigin = req => {
    const supplied = req.headers.origin;
    if (!supplied) return false;
    if (mode === 'test') return supplied === origin;
    try { return new URL(supplied).host === req.headers.host && ['http:', 'https:'].includes(new URL(supplied).protocol); } catch { return false; }
  };
  const authorize=req=>{
    const token=process.env.SHOP_ADMIN_TOKEN || '', supplied=req.headers.authorization || '',expected='Bearer '+token;
    if(token.length<32 || Buffer.byteLength(supplied)!==Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) throw new ShopError('UNAUTHORIZED',401);
  };
  async function body(req, raw = false, maximum = raw ? 262144 : 16384) {
    if (Number(req.headers['content-length']) > maximum) throw new ShopError('BODY_TOO_LARGE', 413);
    let length = 0;
    const chunks = [];
    for await (const chunk of req) {
      length += chunk.length;
      if (length > maximum) throw new ShopError('BODY_TOO_LARGE', 413);
      chunks.push(chunk);
    }
    const value = Buffer.concat(chunks);
    if (raw) return value;
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw new ShopError('JSON_REQUIRED', 415);
    try { return JSON.parse(value.toString('utf8')); } catch { throw new ShopError('INVALID_JSON'); }
  }
  function rateLimit(req,group='api',maximum=100) {
    const now = Date.now();
    for (const [id, entry] of limits) if (entry.until < now) limits.delete(id);
    // Do not trust arbitrary forwarded IP headers. An edge rate limit is also required at deployment.
    const id = group+':'+req.socket.remoteAddress;
    const entry = limits.get(id) || { count: 0, until: now + 60000 };
    if (++entry.count > maximum) throw new ShopError('RATE_LIMITED', 429);
    limits.set(id, entry);
  }
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/shop/')) {
        if (mode === 'test' && req.headers.origin === origin && ['catalog', 'quote', 'checkout', 'status','uploads'].includes(url.pathname.split('/').pop())) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Vary', 'Origin');
          if (req.method === 'OPTIONS') {
            res.writeHead(204, { ...securityHeaders, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
            return res.end();
          }
        }
        rateLimit(req);
        if (req.method==='POST' && url.pathname==='/api/shop/uploads') {
          rateLimit(req,'uploads',5);
          if(!sameOrigin(req)) throw new ShopError('ORIGIN_REJECTED',403);
          const mime=(req.headers['content-type'] || '').split(';')[0];
          if(!['image/png','image/jpeg'].includes(mime)) throw new ShopError('INVALID_IMAGE',415);
          return respond(res,201,await uploads.save(await body(req,true,customisation.uploadMaxBytes),mime));
        }
        if(req.method==='GET' && url.pathname.startsWith('/api/shop/uploads/')) {
          authorize(req);
          const data=uploads.read(url.pathname.slice('/api/shop/uploads/'.length));
          res.writeHead(200,{...securityHeaders,'Content-Type':'image/png','Content-Disposition':'attachment; filename="engraving-logo.png"'});
          return res.end(data);
        }
        if (req.method === 'GET' && url.pathname === '/api/shop/catalog') return respond(res, 200, publicCatalog(mode,store.soldUnits()));
        if (req.method === 'GET' && url.pathname === '/api/shop/status') {
          const session = url.searchParams.get('session_id') || '';
          if (!/^cs_test_[A-Za-z0-9_]{8,200}$/.test(session)) throw new ShopError('INVALID_SESSION');
          const order = store.db.prepare('SELECT orders.status,order_reviews.status AS review FROM orders LEFT JOIN order_reviews ON orders.id=order_reviews.order_id WHERE session_id=?').get(session);
          if (!order) throw new ShopError('ORDER_NOT_FOUND', 404);
          return respond(res, 200, { status: order.status, orderStatus:order.review || 'not_submitted' });
        }
        if (req.method === 'GET' && url.pathname === '/api/shop/seller-tasks') {
          authorize(req);
          return respond(res, 200, { tasks: store.tasks() });
        }
        if(req.method==='GET'&&url.pathname==='/api/shop/notifications'){
          authorize(req);
          return respond(res,200,{deliveryEnabled:false,summary:store.notificationSummary()});
        }
        if(req.method==='GET'&&url.pathname==='/api/shop/checkout-alerts'){
          authorize(req);
          return respond(res,200,{alerts:store.checkoutAlerts()});
        }
        if(['GET','POST'].includes(req.method)&&url.pathname==='/api/shop/reconcile'){
          authorize(req);
          if(mode!=='test'||!stripe)throw new ShopError('RECONCILIATION_NOT_CONFIGURED',503);
          if(req.method==='POST'&&!reconciliation.running){
            reconciliation.running=true;reconciliation.result=null;
            reconcileCheckouts(store,stripe).then(result=>{reconciliation.result=result;}).catch(()=>{reconciliation.result={error:'RECONCILIATION_FAILED'};}).finally(()=>{reconciliation.running=false;});
          }
          return respond(res,reconciliation.running?202:200,{...reconciliation});
        }
        if(req.method==='POST' && /^\/api\/shop\/orders\/[0-9a-f-]{36}\/review$/i.test(url.pathname)){
          authorize(req);
          const input=await body(req);
          if(!input || Object.keys(input).some(key=>key!=='decision'))throw new ShopError('INVALID_REVIEW');
          return respond(res,200,{orderStatus:store.review(url.pathname.split('/')[4],input.decision)});
        }
        if (req.method === 'POST' && url.pathname === '/api/shop/webhook') {
          if (mode !== 'test' || !stripe || !webhookSecret) throw new ShopError('WEBHOOK_NOT_CONFIGURED', 503);
          let event;
          const raw = await body(req, true);
          try { event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], webhookSecret); }
          catch { throw new ShopError('INVALID_SIGNATURE'); }
          const result=store.process(event);
          if(result==='processed' && event.data?.object?.client_reference_id) {
            const order=store.db.prepare("SELECT quote FROM orders WHERE id=? AND status='paid'").get(event.data.object.client_reference_id);
            if(order)uploads.retainPaid(JSON.parse(order.quote));
          }
          return respond(res, 200, { received: true, result });
        }
        if (req.method !== 'POST') throw new ShopError('NOT_FOUND', 404);
        if (!sameOrigin(req)) throw new ShopError('ORIGIN_REJECTED', 403);
        const input = await body(req);
        if (url.pathname === '/api/shop/quote') return respond(res, 200, quote(input,store.soldUnits(),id=>uploads.has(id)));
        if (url.pathname !== '/api/shop/checkout') throw new ShopError('NOT_FOUND', 404);
        const calculated = quote(input,store.soldUnits(),id=>uploads.has(id));
        if(calculated.configurationPending) throw new ShopError('PERSONALISATION_REQUIRED',409);
        if (calculated.shippingPending) throw new ShopError('SHIPPING_REVIEW_REQUIRED',409);
        if (input.version !== catalogVersion) throw new ShopError('PRICE_CHANGED', 409);
        if (!/^[0-9a-f-]{36}$/i.test(input.requestId || '')) throw new ShopError('INVALID_REQUEST_ID');
        if (mode === 'demo') return respond(res, 200, { mode: 'demo', quote: calculated });
        // Fail closed until business, legal and shipping review is explicitly complete.
        if (!config.approved || !config.shippingConfirmed || process.env.SHOP_TEST_APPROVED !== 'yes') throw new ShopError('CHECKOUT_NOT_APPROVED', 503);
        if(calculated.items.some(item=>!(config.checkoutListingIds||[]).includes(String(item.listingId))))throw new ShopError('PRODUCT_NOT_APPROVED',409);
        if (calculated.shippingPending || calculated.items.some(item=>item.requiresAgreement)) throw new ShopError('PERSONAL_AGREEMENT_REQUIRED',409);
        const fingerprint = createHash('sha256').update(JSON.stringify({ quote: calculated, english: input.english === true })).digest('hex');
        const order = store.prepareCheckout(input.requestId, fingerprint, input,id=>uploads.has(id));
        try{
          const parameters=store.stageCheckout(order.id,checkoutParams(order, origin, input.english === true));
          const session = order.session_id ? await stripe.checkout.sessions.retrieve(order.session_id) : await stripe.checkout.sessions.create(parameters, { idempotencyKey: order.id });
          if (session.livemode !== false || !/^cs_test_[A-Za-z0-9_]{8,200}$/.test(session.id||'') || session.client_reference_id!==order.id || session.currency!=='eur' || session.amount_total!==order.quote.totalCents || !session.url || new URL(session.url).hostname !== 'checkout.stripe.com' || new URL(session.url).protocol !== 'https:') throw new ShopError('INVALID_CHECKOUT_RESPONSE', 502);
          store.attach(order.id, session.id);
          store.clearCheckoutAlert(order.id);
          return respond(res, 200, { mode: 'test', url: session.url });
        }catch(error){
          store.flagCheckout(order.id,error.code==='CHECKOUT_RECOVERY_REVIEW_REQUIRED'?'recovery_window_elapsed':'provider_unresolved');
          throw error;
        }
      }
      if (!['GET', 'HEAD'].includes(req.method)) throw new ShopError('NOT_FOUND', 404);
      const sitePreview=renderSitePreview(url.pathname);
      if(sitePreview){res.writeHead(200,{...securityHeaders,'Content-Security-Policy':sitePreview.csp,'Content-Type':'text/html; charset=utf-8'});return res.end(req.method==='HEAD'?undefined:sitePreview.html);}
      if(['/','/en/','/atelier-vorschau/start/','/en/atelier-preview/start/'].includes(url.pathname)){res.writeHead(200,{...securityHeaders,'Content-Type':'text/html; charset=utf-8'});return res.end(req.method==='HEAD'?undefined:approvedHome(url.pathname.startsWith('/en/')));}
      const files = new Map([
        ['/', 'shop-vorschau/index.html'], ['/shop-vorschau/', 'shop-vorschau/index.html'], ['/en/shop-preview/', 'en/shop-preview/index.html'],
        ['/atelier-vorschau/','atelier-vorschau/index.html'],['/atelier-vorschau/erbstueck/','atelier-vorschau/erbstueck/index.html'],
        ['/en/atelier-preview/','en/atelier-preview/index.html'],['/en/atelier-preview/erbstueck/','en/atelier-preview/erbstueck/index.html'],
        ['/schneidebrett-fachwerk-eiche/','atelier-vorschau/erbstueck/index.html'],['/erbstueck/','atelier-vorschau/erbstueck/index.html'],['/en/erbstueck/','en/atelier-preview/erbstueck/index.html'],
        ['/atelier-vorschau/start/','atelier-vorschau/start/index.html'],['/en/atelier-preview/start/','en/atelier-preview/start/index.html'],
        ['/assets/css/atelier-preview.css','assets/css/atelier-preview.css'],['/assets/js/atelier-preview.js','assets/js/atelier-preview.js'],
        ['/assets/historische-fachwerkbalken.jpg','assets/historische-fachwerkbalken.jpg'],['/assets/erbstueck-entstehung/verleimen-zwingen.jpg','assets/erbstueck-entstehung/verleimen-zwingen.jpg'],
        ['/assets/js/shop-pilot.js', 'assets/js/shop-pilot.js'], ['/assets/css/shop-pilot.css', 'assets/css/shop-pilot.css'], ['/assets/logo.png', 'assets/logo.png'],
        ['/assets/legal/eu-legal-guarantee-de.svg', 'assets/legal/eu-legal-guarantee-de.svg'], ['/assets/legal/eu-legal-guarantee-en.svg', 'assets/legal/eu-legal-guarantee-en.svg']
      ]);
      for(const [url,file]of siteAssets)if(!files.has(url))files.set(url,file);
      if (/^\/assets\/icons\/lucide\/(shopping-bag|plus|minus|lock|x|play|pause|chevron-left|chevron-right|menu)\.svg$/.test(url.pathname)) files.set(url.pathname, url.pathname.slice(1));
      for(const asset of ['Erbstueck.jpg','Erbstueck2.webp','Erbstueck4.webp','schneidebrett-nach-mass-1200.jpg','schneidebrett-schleifen-exzenterschleifer-werkstatt.jpg'])files.set('/assets/'+asset,'assets/'+asset);
      for(const asset of ['giftbox_b2b-1200.jpg','schneidebrett-nussbaum-1200.jpg'])files.set('/assets/'+asset,'assets/'+asset);
      for(const asset of ['geschenkset-erster-entwurf-1200.jpg','custom-projects/eiche-xxl-dark.jpg'])files.set('/assets/'+asset,'assets/'+asset);
      for(const asset of ['kitchen-preview-example.jpg','hero-fallback.webp','hero_intro_video_edle_hoelzer_poster.webp','hero_intro_video_edle_hoelzer.mp4'])files.set('/assets/'+asset,'assets/'+asset);
      if(/^\/assets\/erbstueck-entstehung\/cropped\/(0[2-9]|1[0-6]|verleimen-zusammenfuegen|verleimen-zwingen)\.webp$/.test(url.pathname))files.set(url.pathname,url.pathname.slice(1));
      if(/^\/assets\/fonts\/shop\/(noto-sans|noto-serif|allura|montserrat|playfair-display|amatic-sc|caveat|marcellus)(?:\.ttf|-OFL\.txt)$/.test(url.pathname)) files.set(url.pathname,url.pathname.slice(1));
      const guideImage=customisation.grooveGuide.image;
      if(typeof guideImage==='string' && /^\/assets\/[a-zA-Z0-9_/-]+\.(?:jpg|jpeg|png|webp)$/.test(guideImage)) files.set(guideImage,guideImage.slice(1));
      for (const offer of publicCatalog(mode).offers) for (const image of [offer.image,...offer.gallery,...(offer.variants || []).map(v=>v.image)]) {
        if (typeof image === 'string' && /^\/(?:assets|brettvorschau\/assets)\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp)$/.test(image) && !image.includes('..')) files.set(image,image.slice(1));
      }
      const file = files.get(url.pathname);
      if (!file) throw new ShopError('NOT_FOUND', 404);
      if(path.extname(file)==='.mp4'){
        const videoPath=path.join(ROOT,file),size=fs.statSync(videoPath).size,range=req.headers.range;
        let start=0,end=size-1;
        if(range){const parts=/^bytes=(\d+)-(\d*)$/.exec(range);if(!parts){res.writeHead(416,{...securityHeaders,'Content-Range':'bytes */'+size});return res.end();}start=Number(parts[1]);end=parts[2]?Math.min(Number(parts[2]),size-1):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=size){res.writeHead(416,{...securityHeaders,'Content-Range':'bytes */'+size});return res.end();}}
        res.writeHead(range?206:200,{...securityHeaders,'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1,...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
        if(req.method==='HEAD')return res.end();
        fs.createReadStream(videoPath,{start,end}).on('error',()=>res.destroy()).pipe(res);return;
      }
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json':'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.woff':'font/woff','.woff2':'font/woff2', '.ttf':'font/ttf','.txt':'text/plain; charset=utf-8' };
      const sourceValue=fs.readFileSync(path.join(ROOT,file));
      const value=file==='styles.css'?Buffer.from(sourceValue.toString('utf8').replace(/^@import url\("https:\/\/fonts\.googleapis\.com\/[^\"]+"\);\s*/,'')):sourceValue;
      res.writeHead(200, { ...securityHeaders, 'Content-Type': types[path.extname(file)] });
      res.end(req.method === 'HEAD' ? undefined : value);
    } catch (error) {
      // Never return provider errors, request bodies, credentials or customer data.
      respond(res, error instanceof ShopError ? error.status : 503, { error: error instanceof ShopError ? error.code : 'SERVICE_UNAVAILABLE' });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.on('close', () => {clearInterval(cleanup); if (!options.store) store.close(); });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.umask(0o077);
  const server = createShopServer();
  server.listen(Number(process.env.PORT || 8170), process.env.SHOP_BIND_HOST || '127.0.0.1', () => console.log('Shop pilot: http://127.0.0.1:' + (process.env.PORT || 8170) + '/shop-vorschau/ (demo/test only)'));
}
