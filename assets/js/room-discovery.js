(() => {
 function enhance(){
  document.querySelectorAll('.productPreview__roomPrompt:not([data-enhanced])').forEach(el=>{
   el.dataset.enhanced='true';
   const button=el.querySelector('button');
   if(!button)return;
   const english=document.documentElement.lang.startsWith('en');
   const eyebrow=document.createElement('span');eyebrow.className='roomEyebrow';eyebrow.textContent=english?'Before you decide':'Noch unsicher?';
   const heading=document.createElement('h3');heading.textContent=english?'Your board. Your kitchen.':'Dein Brett. Dein Tresen.';
   const copy=document.createElement('p');copy.className='roomPromptCopy';copy.textContent=english?'See how this board fits into your kitchen. All you need is a photo and a sheet of A4 paper.':'Sieh, wie dieses Brett in deiner Küche wirkt. Du brauchst nur ein Foto und ein A4-Blatt auf deinem Tresen.';
   button.classList.remove('btn--secondary');button.classList.add('roomDiscovery__cta');
   const note=document.createElement('small');note.className='roomDisclosure';note.textContent=english?'A visual guide to size and appearance.':'Ein Gefühl für Größe und Optik, vor deiner Entscheidung.';
   el.replaceChildren(eyebrow,heading,copy,button,note);
  });
 }
 enhance();new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
})();
