(function(root){
  function inventoryText(product,en,now){
    if(!product.active||product.availabilityStatus==='sold'||product.availabilityStatus==='unavailable')return en?'Currently unavailable':'Aktuell nicht verfügbar';
    if(product.availabilityStatus==='made_to_order')return en?'Made to order, not ready stock':'Auf Bestellung gefertigt, kein Lagerbestand';
    var checked=Date.parse(product.inventoryCheckedAt||''),age=(now===undefined?Date.now():now)-checked;
    if(!Number.isFinite(checked)||age<0||age>7*86400000||!Number.isInteger(product.stock))return en?'Check current stock on Etsy':'Aktuellen Bestand bei Etsy prüfen';
    var date=product.inventoryCheckedAt.slice(0,10),single=product.stock===1;
    return (en?'Etsy stock: ':'Etsy-Bestand: ')+product.stock+(en?(single?' piece':' pieces'):(single?' Exemplar':' Exemplare'))+' · '+(en?'as of ':'Stand ')+date;
  }
  var api={inventoryText:inventoryText};
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.EdleCatalogDisplay=api;
})(typeof window==='object'?window:globalThis);
