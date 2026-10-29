const commonHeaders={
  'X-Robots-Tag':'noindex, nofollow, noarchive',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'no-referrer',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  'Cache-Control':'no-store'
};

const stagingGuard=String.raw`(() => {
  'use strict';
  window.EdleConsent={get:()=>({necessary:true,analytics:false,marketing:false}),openSettings:()=>{},apply:()=>{}};
  window.EdleAnalytics={track:()=>{}};
  window.gtag=()=>{};window.umami={track:()=>{}};window.goatcounter={count:()=>{}};
  function notice(){
    let node=document.querySelector('[data-staging-notice]');
    if(!node){node=document.createElement('p');node.dataset.stagingNotice='';node.setAttribute('role','status');document.body.prepend(node);}
    node.textContent=document.documentElement.lang==='en'?'Staging preview: no orders, payments or enquiries are submitted.':'Staging-Vorschau: Keine Bestellungen, Zahlungen oder Anfragen werden versendet.';
  }
  document.addEventListener('DOMContentLoaded',notice,{once:true});
  document.addEventListener('submit',event=>{
    if(event.target.matches('#site-search,#header-search'))return;
    event.preventDefault();event.stopImmediatePropagation();notice();
  },true);
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link)return;
    let target;try{target=new URL(link.href,location.href);}catch{return;}
    if(/(^|\.)etsy\.com$/.test(target.hostname)||target.hostname==='checkout.stripe.com'){
      event.preventDefault();event.stopImmediatePropagation();notice();
    }
  },true);
})();`;

const privatePath=pathname=>/^\/(?:\.|tools(?:\/|$)|docs(?:\/|$)|logs(?:\/|$)|atelier-vorschau(?:\/|$)|shop-vorschau(?:\/|$)|en\/(?:atelier-preview|shop-preview)(?:\/|$))/.test(pathname)||['/CNAME','/release-manifest.json'].includes(pathname)||pathname.startsWith('/data/')&&!['/data/reviews.json','/data/reviews-en.json','/data/reviews-meta.json'].includes(pathname);

function response(value,status=200,type='application/json; charset=utf-8'){
  return new Response(type.startsWith('application/json')?JSON.stringify(value):value,{status,headers:{...commonHeaders,'Content-Type':type,'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"}});
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(env.SHOP_ENV!=='staging'||url.hostname==='edlehoelzer.de'||url.hostname.endsWith('.edlehoelzer.de'))return response({error:'PRODUCTION_NOT_APPROVED'},503);
    if(!['GET','HEAD'].includes(request.method))return response({error:'STAGING_WRITES_DISABLED'},503);
    if(url.pathname==='/api/shop/health')return response({environment:'staging',status:'NOT READY',stage:'static-preview',checkoutEnabled:false});
    if(url.pathname.startsWith('/api/'))return response({error:'SHOP_BACKEND_NOT_MIGRATED',checkoutEnabled:false},503);
    if(url.pathname==='/robots.txt')return response('User-agent: *\nDisallow: /\n',200,'text/plain; charset=utf-8');
    if(url.pathname==='/__staging/guard.js')return response(stagingGuard,200,'application/javascript; charset=utf-8');
    if(privatePath(url.pathname))return response({error:'NOT_FOUND'},404);
    try{
      const asset=await env.ASSETS.fetch(request);
      const headers=new Headers(asset.headers);
      for(const [key,value]of Object.entries(commonHeaders))headers.set(key,value);
      if((headers.get('Content-Type')||'').includes('text/html')){
        const nonce=crypto.randomUUID().replace(/-/g,'');
        const scriptPolicy="script-src 'self' 'nonce-"+nonce+"'"+(url.pathname.startsWith('/brettvorschau/')?" 'unsafe-eval'":'');
        headers.set('Content-Security-Policy',"default-src 'none'; "+scriptPolicy+"; style-src 'self' 'unsafe-inline'; img-src 'self' https://i.etsystatic.com data: blob:; media-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'");
        const transformed=new HTMLRewriter().on('head',{element(element){element.prepend('<script src="/__staging/guard.js"></script>',{html:true});}}).on('script',{element(element){
          const src=element.getAttribute('src');
          if(src&&(/consent-manager/.test(src)||/^https?:\/\//i.test(src)))element.remove();
          else if(!src)element.setAttribute('nonce',nonce);
        }}).transform(asset);
        // The rewritten body and nonce are request-specific, not the original asset entity.
        for(const name of ['ETag','Last-Modified','Content-Length'])headers.delete(name);
        return new Response(request.method==='HEAD'?null:transformed.body,{status:asset.status,headers});
      }
      return new Response(request.method==='HEAD'?null:asset.body,{status:asset.status,headers});
    }catch{return response({error:'ASSET_UNAVAILABLE'},503);}
  }
};
