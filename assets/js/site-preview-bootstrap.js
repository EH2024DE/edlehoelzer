/* Preview-only: never load analytics or send enquiries from the design study. */
window.EdleConsent={get:()=>({necessary:true,analytics:false,marketing:false}),openSettings:()=>{},apply:()=>{}};
window.EdleAnalytics={track:()=>{}};
window.gtag=()=>{};
window.umami={track:()=>{}};
window.goatcounter={count:()=>{}};
document.addEventListener('submit',event=>{
  if(!event.target.matches('form'))return;
  if(event.target.matches('#site-search,#header-search'))return;
  event.preventDefault();event.stopImmediatePropagation();
  let status=event.target.querySelector('[data-preview-form-status]');
  if(!status){status=document.createElement('p');status.dataset.previewFormStatus='';status.setAttribute('role','status');event.target.append(status);}
  status.textContent=document.documentElement.lang==='en'?'Preview: no enquiry was sent.':'Vorschau: Es wurde keine Anfrage versendet.';
},true);
