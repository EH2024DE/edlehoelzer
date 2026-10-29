import {notificationMessage} from './notifications.mjs';

export async function deliverNotifications(store,transport,{approved=false,sellerEmail,now=Date.now,limit=10}={}){
  if(!approved)return {disabled:true,sent:0,retry:0,needsReview:0};
  if(transport?.supportsIdempotency!==true||!(transport.idempotencyWindowMs>=24*3600000)||typeof transport.send!=='function')throw Error('An idempotent transactional transport with at least 24 hours retention is required');
  const result={disabled:false,sent:0,retry:0,needsReview:0};
  for(let n=0;n<Math.min(10,Math.max(0,limit));n++){
    const job=store.claimNotification(now());if(!job)break;
    let message;
    const to=job.kind.startsWith('seller_')?sellerEmail:job.payload.recipient;
    if(typeof to!=='string'||to.length>254||!/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(to)){
      store.retryNotification(job,true,now());result.needsReview++;continue;
    }
    try{message=notificationMessage(job.kind,job.payload);}
    catch{store.retryNotification(job,true,now());result.needsReview++;continue;}
    try{
      const response=await transport.send({to,...message,idempotencyKey:job.idempotencyKey});
      store.finishNotification(job,response?.id);result.sent++;
    }catch(error){
      const permanent=error?.retryable===false;
      store.retryNotification(job,permanent,now());
      if(permanent||job.attempts>=5)result.needsReview++;else result.retry++;
    }
  }
  return result;
}
