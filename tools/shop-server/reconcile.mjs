import {ShopError} from './catalog.mjs';

// Use only the authenticated server-side Stripe client, never browser-supplied session data.
export async function reconcileCheckouts(store,stripe,now=Date.now()){
  const results={checked:0,paid:0,released:0,pending:0,needsReview:0};
  for(const attempt of store.pendingCheckouts()){
    results.checked++;
    store.checkedCheckout(attempt.id);
    try{
      let session;
      if(attempt.session_id)session=await stripe.checkout.sessions.retrieve(attempt.session_id);
      else if(attempt.parameters){
        // Exact stored parameters and the original key recover an uncertain create outcome.
        const parameters=store.stageCheckout(attempt.id,attempt.parameters,now);
        session=await stripe.checkout.sessions.create(parameters,{idempotencyKey:attempt.id});
        if(session.livemode!==false||session.client_reference_id!==attempt.id||!/^cs_test_/.test(session.id||''))throw new ShopError('INVALID_CHECKOUT_RESPONSE');
        store.attach(attempt.id,session.id);
      }else{store.flagCheckout(attempt.id,'missing_parameters',now);results.needsReview++;continue;}
      if(session.livemode!==false||session.id!==(attempt.session_id||session.id)||session.client_reference_id!==attempt.id||session.currency!=='eur'||session.amount_total!==attempt.totalCents)throw new ShopError('INVALID_CHECKOUT_RESPONSE');
      if(session.status==='complete'&&session.payment_status==='paid'){
        store.process({id:'reconcile:'+session.id+':paid',livemode:false,type:'checkout.session.completed',data:{object:session}});results.paid++;
      }else if(session.status==='expired'&&session.payment_status==='unpaid'){
        store.process({id:'reconcile:'+session.id+':expired',livemode:false,type:'checkout.session.expired',data:{object:session}});results.released++;
      }else{
        if(session.status==='complete')store.process({id:'reconcile:'+session.id+':awaiting',livemode:false,type:'checkout.session.completed',data:{object:session}});
        results.pending++;
      }
      store.clearCheckoutAlert(attempt.id,now);
    }catch(error){
      // Unknown outcomes remain reserved. Provider payloads and personal data are not logged.
      store.flagCheckout(attempt.id,error.code==='CHECKOUT_RECOVERY_REVIEW_REQUIRED'?'recovery_window_elapsed':'provider_unresolved',now);
      results.needsReview++;
    }
  }
  return results;
}
