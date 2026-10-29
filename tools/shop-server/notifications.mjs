import {ShopError} from './catalog.mjs';

// Pure templates only. Delivery requires a separately configured transactional provider.
export function notificationMessage(kind,payload) {
  const en=payload.english===true;
  const reference=String(payload.orderId || '');
  if(!/^[0-9a-f-]{36}$/i.test(reference))throw new ShopError('INVALID_NOTIFICATION');
  if(!Number.isSafeInteger(payload.totalCents)||payload.totalCents<0)throw new ShopError('INVALID_NOTIFICATION');
  const money=cents=>new Intl.NumberFormat(en?'en-IE':'de-DE',{style:'currency',currency:'EUR'}).format(cents/100);
  const price=money(payload.totalCents);
  const lines=(payload.items || []).map(item=>`${item.quantity} × ${en?item.nameEn || item.name:item.name}${item.wood?' · '+item.wood:''}${item.variantName?' · '+(en?item.variantNameEn || item.variantName:item.variantName):''} · ${money(item.unitCents*item.quantity)}`).join('\n');
  const summary=lines?'\n\n'+lines+(Number.isSafeInteger(payload.shippingCents)?'\n'+(en?'Shipping: ':'Versand: ')+money(payload.shippingCents):''):'';
  const payment=payload.paymentStatus==='paid'?(en?'Payment status: received.':'Zahlungsstatus: eingegangen.'):(en?'Payment status: awaiting confirmation.':'Zahlungsstatus: Bestätigung steht noch aus.');
  if(kind==='receipt')return {
    subject:en?'We have received your order':'Deine Bestellung ist eingegangen',
    text:(en?`Thank you for your order with Edle Hölzer. Reference: ${reference}. Total: ${price}. This message acknowledges receipt only and is not acceptance of your order. We will review your selection and send a separate acceptance. ${payment}`:`Vielen Dank für deine Bestellung bei Edle Hölzer. Bestellnummer: ${reference}. Gesamtbetrag: ${price}. Diese Nachricht bestätigt nur den Eingang deiner Bestellung und ist noch keine Annahme. Wir prüfen deine Auswahl und senden dir anschließend eine gesonderte Annahmebestätigung. ${payment}`)+summary
  };
  if(kind==='acceptance' && payload.orderStatus==='accepted')return {
    subject:en?'Your order has been accepted':'Deine Bestellung ist bestätigt',
    text:en?`We have reviewed and accepted your order ${reference}. Thank you for choosing Edle Hölzer. Total: ${price}. The agreed preparation and delivery terms apply.`:`Wir haben deine Bestellung ${reference} geprüft und nehmen sie an. Vielen Dank für dein Vertrauen in Edle Hölzer. Gesamtbetrag: ${price}. Es gelten die vereinbarten Vorbereitungs- und Lieferzeiten.`
  };
  if(kind==='seller_review')return {subject:'Bestellung zur Prüfung',text:`Bestellung ${reference}, ${price}: Zahlung eingegangen. Bestellung und Varianten prüfen, Etsy-Bestand abgleichen und anschließend ausdrücklich annehmen oder eine Rückabwicklung klären. Noch keine automatische Annahme.`};
  if(kind==='seller_received')return {subject:'Bestelleingang, Zahlung noch offen',text:`Bestellung ${reference}, ${price}: Eingang erfasst. Zahlung noch nicht bestätigt; noch nicht versenden oder als angenommen behandeln.`};
  if(kind==='payment_received'&&payload.paymentStatus==='paid')return {subject:en?'Your payment has been received':'Deine Zahlung ist eingegangen',text:en?`Your payment for order ${reference}, ${price}, has been received. Acceptance of the order follows separately after our review.`:`Deine Zahlung zur Bestellung ${reference} über ${price} ist eingegangen. Die Annahme deiner Bestellung folgt gesondert nach unserer Prüfung.`};
  if(kind==='payment_failed')return {subject:en?'Your payment was not completed':'Deine Zahlung wurde nicht abgeschlossen',text:en?`The payment for order ${reference} was not completed. No order has been accepted. Please contact us if you would like to try again.`:`Die Zahlung zur Bestellung ${reference} wurde nicht abgeschlossen. Es wurde keine Bestellung angenommen. Bitte melde dich bei uns, wenn du einen neuen Versuch starten möchtest.`};
  throw new ShopError('INVALID_NOTIFICATION');
}
