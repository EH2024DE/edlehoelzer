(function(root){
  function inventoryText(product,en,now){
    if(!product.active||product.availabilityStatus==='sold'||product.availabilityStatus==='unavailable')return en?'Currently unavailable':'Aktuell nicht verfügbar';
    if(product.availabilityStatus==='made_to_order')return en?'Made to order for you':'Für dich auf Bestellung gefertigt';
    var checked=Date.parse(product.inventoryCheckedAt||''),age=(now===undefined?Date.now():now)-checked;
    if(!Number.isFinite(checked)||age<0||age>7*86400000||!Number.isInteger(product.stock))return en?'Check availability in the shop':'Verfügbarkeit im Shop ansehen';
    if(product.stock<=0)return en?'Currently unavailable':'Aktuell nicht verfügbar';
    return en?'Available in the shop':'Im Shop verfügbar';
  }
  var api={inventoryText:inventoryText};
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.EdleCatalogDisplay=api;
})(typeof window==='object'?window:globalThis);
