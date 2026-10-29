import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ShopError, quote as calculateQuote } from './catalog.mjs';

export function openStore(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const resolved = fs.realpathSync(directory);
  if (resolved === ROOT || resolved.startsWith(ROOT + path.sep)) throw new Error('SHOP_DATA_DIR must be outside the repository');
  if((fs.statSync(resolved).mode & 0o077)!==0)throw new Error('SHOP_DATA_DIR must be a private directory (mode 0700)');
  const file = path.join(resolved, 'orders.sqlite');
  const db = new DatabaseSync(file);
  fs.chmodSync(file, 0o600);
  db.exec(`PRAGMA journal_mode=WAL;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, request_id TEXT UNIQUE NOT NULL, fingerprint TEXT NOT NULL, quote TEXT NOT NULL, session_id TEXT UNIQUE, status TEXT NOT NULL DEFAULT 'pending');
    CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY);
    CREATE TABLE IF NOT EXISTS seller_tasks (order_id TEXT PRIMARY KEY, items TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending');
    CREATE TABLE IF NOT EXISTS sold_units (stock_key TEXT PRIMARY KEY, quantity INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS order_reviews (order_id TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'pending', reviewed_at TEXT);
    CREATE TABLE IF NOT EXISTS notification_jobs (order_id TEXT NOT NULL, kind TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', PRIMARY KEY(order_id,kind));
    CREATE TABLE IF NOT EXISTS checkout_attempts (order_id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'active');
    CREATE TABLE IF NOT EXISTS stock_holds (order_id TEXT NOT NULL, stock_key TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity>0), PRIMARY KEY(order_id,stock_key));
    CREATE TABLE IF NOT EXISTS checkout_requests (order_id TEXT PRIMARY KEY, parameters TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS checkout_checks (order_id TEXT PRIMARY KEY, checked_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS checkout_alerts (order_id TEXT PRIMARY KEY, reason TEXT NOT NULL, first_seen INTEGER NOT NULL, last_seen INTEGER NOT NULL, resolved_at INTEGER);
    CREATE TABLE IF NOT EXISTS notification_attempts (order_id TEXT NOT NULL, kind TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, retry_at INTEGER NOT NULL DEFAULT 0, lease_until INTEGER NOT NULL DEFAULT 0, lease_token TEXT, first_attempt_at INTEGER, provider_id TEXT, PRIMARY KEY(order_id,kind));`);
  return {
    db, directory:resolved,
    prepare(requestId, fingerprint, quote) {
      let row = db.prepare('SELECT * FROM orders WHERE request_id=?').get(requestId);
      if (row && row.fingerprint !== fingerprint) throw new ShopError('IDEMPOTENCY_CONFLICT', 409);
      if (!row) {
        db.prepare('INSERT INTO orders(id,request_id,fingerprint,quote) VALUES(?,?,?,?)').run(randomUUID(), requestId, fingerprint, JSON.stringify(quote));
        row = db.prepare('SELECT * FROM orders WHERE request_id=?').get(requestId);
      }
      return { ...row, quote: JSON.parse(row.quote) };
    },
    prepareCheckout(requestId,fingerprint,input,resolveUpload,now=Date.now()) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const existing=db.prepare('SELECT * FROM orders WHERE request_id=?').get(requestId);
        if(existing && existing.fingerprint!==fingerprint)throw new ShopError('IDEMPOTENCY_CONFLICT',409);
        if(existing && existing.status!=='pending')throw new ShopError('ORDER_ALREADY_SUBMITTED',409);
        const attempt=existing && db.prepare('SELECT * FROM checkout_attempts WHERE order_id=?').get(existing.id);
        if(attempt && attempt.status!=='active')throw new ShopError('CHECKOUT_EXPIRED',409);
        const sold=this.soldUnits(),occupied={...sold};
        const holds=db.prepare("SELECT stock_key,SUM(quantity) AS quantity FROM stock_holds JOIN checkout_attempts USING(order_id) WHERE checkout_attempts.status='active' AND stock_holds.order_id!=? GROUP BY stock_key").all(existing?.id || '');
        for(const hold of holds)occupied[hold.stock_key]=(occupied[hold.stock_key] || 0)+Number(hold.quantity);
        let currentQuote;
        try{currentQuote=calculateQuote(input,occupied,resolveUpload);}
        catch(error){
          if(holds.length && ['PRODUCT_UNAVAILABLE','VARIANT_UNAVAILABLE','QUANTITY_LIMIT'].includes(error.code)){
            calculateQuote(input,sold,resolveUpload);
            throw new ShopError('STOCK_RESERVED',409);
          }
          throw error;
        }
        const order=this.prepare(requestId,fingerprint,currentQuote);
        if(JSON.stringify(order.quote)!==JSON.stringify(currentQuote))throw new ShopError('PRICE_CHANGED',409);
        const expiresAt=attempt?.expires_at || Math.floor(now/1000)+35*60;
        db.prepare('INSERT OR IGNORE INTO checkout_attempts(order_id,expires_at) VALUES(?,?)').run(order.id,expiresAt);
        const quantities=new Map();
        for(const item of currentQuote.items)if(item.stockKey)quantities.set(item.stockKey,(quantities.get(item.stockKey)||0)+item.quantity);
        for(const [key,quantity]of quantities)db.prepare('INSERT OR IGNORE INTO stock_holds(order_id,stock_key,quantity) VALUES(?,?,?)').run(order.id,key,quantity);
        // Wall-clock expiry alone cannot prove that Stripe did not receive payment.
        db.exec('COMMIT');return {...order,checkoutExpiresAt:expiresAt};
      }catch(error){db.exec('ROLLBACK');throw error;}
    },
    attach(id, sessionId) {
      const result=db.prepare('UPDATE orders SET session_id=? WHERE id=? AND (session_id IS NULL OR session_id=?)').run(sessionId, id, sessionId);
      if(result.changes!==1)throw new ShopError('IDEMPOTENCY_CONFLICT',409);
    },
    stageCheckout(orderId,parameters,now=Date.now()) {
      const order=db.prepare("SELECT id FROM orders WHERE id=? AND status='pending'").get(orderId);
      if(!order || parameters.client_reference_id!==orderId)throw new ShopError('ORDER_NOT_READY',409);
      const attempt=db.prepare('SELECT expires_at FROM checkout_attempts WHERE order_id=?').get(orderId);
      // Stay well inside Stripe's minimum 24-hour idempotency retention window.
      if(attempt && now>=(attempt.expires_at+22*60*60)*1000)throw new ShopError('CHECKOUT_RECOVERY_REVIEW_REQUIRED',409);
      db.prepare('INSERT OR IGNORE INTO checkout_requests(order_id,parameters) VALUES(?,?)').run(orderId,JSON.stringify(parameters));
      return JSON.parse(db.prepare('SELECT parameters FROM checkout_requests WHERE order_id=?').get(orderId).parameters);
    },
    pendingCheckouts() {
      return db.prepare("SELECT orders.id,orders.session_id,orders.quote,checkout_attempts.expires_at,checkout_requests.parameters FROM orders JOIN checkout_attempts ON orders.id=checkout_attempts.order_id LEFT JOIN checkout_requests ON orders.id=checkout_requests.order_id LEFT JOIN checkout_checks ON orders.id=checkout_checks.order_id WHERE orders.status IN ('pending','awaiting_payment') AND checkout_attempts.status='active' ORDER BY COALESCE(checkout_checks.checked_at,0),checkout_attempts.expires_at LIMIT 10").all().map(({quote,...row})=>({...row,totalCents:JSON.parse(quote).totalCents,parameters:row.parameters?JSON.parse(row.parameters):null}));
    },
    checkedCheckout(orderId) { db.prepare('INSERT INTO checkout_checks(order_id,checked_at) VALUES(?,?) ON CONFLICT(order_id) DO UPDATE SET checked_at=excluded.checked_at').run(orderId,Date.now()); },
    flagCheckout(orderId,reason,now=Date.now()) {
      if(!['missing_parameters','recovery_window_elapsed','provider_unresolved'].includes(reason))throw new ShopError('INVALID_CHECKOUT_ALERT');
      db.prepare('INSERT INTO checkout_alerts(order_id,reason,first_seen,last_seen) VALUES(?,?,?,?) ON CONFLICT(order_id) DO UPDATE SET reason=excluded.reason,last_seen=excluded.last_seen,resolved_at=NULL').run(orderId,reason,now,now);
    },
    clearCheckoutAlert(orderId,now=Date.now()) { db.prepare('UPDATE checkout_alerts SET resolved_at=? WHERE order_id=? AND resolved_at IS NULL').run(now,orderId); },
    checkoutAlerts() { return db.prepare('SELECT order_id AS orderId,reason,first_seen AS firstSeen,last_seen AS lastSeen FROM checkout_alerts WHERE resolved_at IS NULL ORDER BY first_seen,order_id').all(); },
    process(event) {
      if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed','checkout.session.expired'].includes(event.type)) return 'ignored';
      if (event.livemode !== false) throw new ShopError('LIVE_EVENT_REJECTED');
      const session = event.data.object;
      if (session.livemode !== false) throw new ShopError('LIVE_EVENT_REJECTED');
      const row = db.prepare('SELECT * FROM orders WHERE id=? AND session_id=?').get(session.client_reference_id, session.id);
      if (!row) throw new ShopError('ORDER_NOT_FOUND', 409);
      const orderQuote = JSON.parse(row.quote);
      if (session.currency !== 'eur' || session.amount_total !== orderQuote.totalCents) throw new ShopError('AMOUNT_MISMATCH');
      const terminalFailure=['checkout.session.async_payment_failed','checkout.session.expired'].includes(event.type);
      const awaitingPayment=!terminalFailure && session.payment_status!=='paid';
      if(awaitingPayment && event.type!=='checkout.session.completed')return 'awaiting_payment';
      const email=session.customer_details?.email;
      const recipient=typeof email==='string' && email.length<=254 && /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(email) ? email : null;
      const receipt={orderId:row.id,totalCents:orderQuote.totalCents,shippingCents:orderQuote.shippingCents,currency:'eur',recipient,paymentStatus:awaitingPayment?'pending':'paid',orderStatus:'pending_review',english:session.locale==='en',items:orderQuote.items.map(({name,nameEn,quantity,unitCents,wood,variantName,variantNameEn,edge,engraving,juiceGroove,grooveType,careBalm})=>({name,nameEn,quantity,unitCents,wood,variantName,variantNameEn,edge,engraving,juiceGroove,grooveType,careBalm}))};
      const enqueue=(kind,payload)=>db.prepare('INSERT OR IGNORE INTO notification_jobs(order_id,kind,payload) VALUES(?,?,?)').run(row.id,kind,JSON.stringify(payload));
      db.exec('BEGIN IMMEDIATE');
      try {
        if (!db.prepare('SELECT id FROM events WHERE id=?').get(event.id)) {
          db.prepare('INSERT INTO events(id) VALUES(?)').run(event.id);
          if(awaitingPayment){
            const current=db.prepare('SELECT status FROM orders WHERE id=?').get(row.id);
            if(['pending','awaiting_payment'].includes(current.status)){
              db.prepare("UPDATE orders SET status='awaiting_payment' WHERE id=?").run(row.id);
              db.prepare('INSERT OR IGNORE INTO order_reviews(order_id) VALUES(?)').run(row.id);
              enqueue('receipt',receipt);enqueue('seller_received',receipt);
            }
          }else if (terminalFailure) {
            const status=event.type==='checkout.session.expired'?'expired':'failed';
            const changed=db.prepare("UPDATE orders SET status=? WHERE id=? AND status!='paid'").run(status,row.id);
            if(changed.changes){
              db.prepare("UPDATE checkout_attempts SET status='released' WHERE order_id=?").run(row.id);
              const prior=db.prepare("SELECT payload FROM notification_jobs WHERE order_id=? AND kind='receipt'").get(row.id);
              if(prior)enqueue('payment_failed',{...JSON.parse(prior.payload),paymentStatus:'failed'});
            }
          } else {
            const current = db.prepare('SELECT status FROM orders WHERE id=?').get(row.id);
            if (current.status !== 'paid') for (const item of orderQuote.items) if (item.stockKey) {
              db.prepare('INSERT INTO sold_units(stock_key,quantity) VALUES(?,?) ON CONFLICT(stock_key) DO UPDATE SET quantity=quantity+excluded.quantity').run(item.stockKey,item.quantity);
            }
            db.prepare("UPDATE orders SET status='paid' WHERE id=?").run(row.id);
            db.prepare("UPDATE checkout_attempts SET status='committed' WHERE order_id=?").run(row.id);
            db.prepare('INSERT OR IGNORE INTO order_reviews(order_id) VALUES(?)').run(row.id);
            const prior=db.prepare("SELECT payload FROM notification_jobs WHERE order_id=? AND kind='receipt'").get(row.id);
            if(prior && JSON.parse(prior.payload).paymentStatus==='pending')enqueue('payment_received',{...receipt,recipient:recipient || JSON.parse(prior.payload).recipient});
            for(const kind of ['receipt','seller_review'])enqueue(kind,receipt);
            db.prepare('INSERT OR IGNORE INTO seller_tasks(order_id,items) VALUES(?,?)').run(row.id, JSON.stringify(orderQuote.items.map(({ listingId, wood, edge, accent, engraving, personalisation, note, bundleId, variant, juiceGroove, grooveType, careBalm, quantity }) => ({ listingId, wood, ...(edge ? {edge} : {}), ...(accent !== undefined ? {accent} : {}), ...(engraving ? {engraving:true,mockupApprovalRequired:true,...(personalisation ? {personalisation} : {})} : {}), ...(note ? {note} : {}), ...(bundleId ? {bundleId} : {}), ...(variant ? {variant} : {}), ...(juiceGroove ? {juiceGroove:true,grooveType:grooveType || 'perimeter'} : {}), ...(careBalm ? {careBalm:true} : {}), quantity }))));
          }
        }
        this.clearCheckoutAlert(row.id);
        db.exec('COMMIT');
        return awaitingPayment?'awaiting_payment':'processed';
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    tasks() { return db.prepare("SELECT seller_tasks.order_id,seller_tasks.items,seller_tasks.status,orders.status AS paymentStatus,COALESCE(order_reviews.status,'pending') AS orderStatus FROM seller_tasks JOIN orders ON orders.id=seller_tasks.order_id LEFT JOIN order_reviews ON order_reviews.order_id=orders.id WHERE seller_tasks.status='pending'").all().map(row => ({ ...row, taskType:'etsy_inventory_adjustment',items: JSON.parse(row.items) })); },
    review(orderId,decision) {
      if(!['accepted','rejected'].includes(decision))throw new ShopError('INVALID_REVIEW');
      db.exec('BEGIN IMMEDIATE');
      try {
        const order=db.prepare('SELECT status FROM orders WHERE id=?').get(orderId);
        const review=db.prepare('SELECT status FROM order_reviews WHERE order_id=?').get(orderId);
        if(!order || order.status!=='paid' || !review)throw new ShopError('ORDER_NOT_READY',409);
        if(review.status!=='pending' && review.status!==decision)throw new ShopError('REVIEW_CONFLICT',409);
        if(review.status==='pending'){
          db.prepare('UPDATE order_reviews SET status=?,reviewed_at=? WHERE order_id=?').run(decision,new Date().toISOString(),orderId);
          // A rejection needs a separate refund workflow; never silently refund or send acceptance.
          if(decision==='accepted'){
            const receipt=db.prepare("SELECT payload FROM notification_jobs WHERE order_id=? AND kind='receipt'").get(orderId);
            db.prepare("INSERT OR IGNORE INTO notification_jobs(order_id,kind,payload) VALUES(?,'acceptance',?)").run(orderId,JSON.stringify({...JSON.parse(receipt.payload),paymentStatus:'paid',orderStatus:'accepted'}));
          }
        }
        db.exec('COMMIT');return decision;
      }catch(error){db.exec('ROLLBACK');throw error;}
    },
    notifications() { return db.prepare("SELECT order_id,kind,payload,status FROM notification_jobs WHERE status='pending'").all().map(row=>({...row,payload:JSON.parse(row.payload)})); },
    notificationSummary() { return db.prepare('SELECT kind,status,COUNT(*) AS count FROM notification_jobs GROUP BY kind,status ORDER BY kind,status').all(); },
    claimNotification(now=Date.now()) {
      db.exec('BEGIN IMMEDIATE');
      try{
        db.prepare("UPDATE notification_jobs SET status='needs_review' WHERE status='pending' AND EXISTS(SELECT 1 FROM notification_attempts a WHERE a.order_id=notification_jobs.order_id AND a.kind=notification_jobs.kind AND (a.attempts>=5 OR a.first_attempt_at<?) AND a.lease_until<=?)").run(now-23*3600000,now);
        const row=db.prepare("SELECT j.order_id,j.kind,j.payload,COALESCE(a.attempts,0) AS attempts FROM notification_jobs j LEFT JOIN notification_attempts a ON j.order_id=a.order_id AND j.kind=a.kind WHERE j.status='pending' AND COALESCE(a.retry_at,0)<=? AND COALESCE(a.lease_until,0)<=? AND (j.kind NOT IN ('acceptance','payment_received','payment_failed') OR EXISTS(SELECT 1 FROM notification_jobs receipt WHERE receipt.order_id=j.order_id AND receipt.kind='receipt' AND receipt.status='sent')) ORDER BY j.rowid LIMIT 1").get(now,now);
        if(!row){db.exec('COMMIT');return null;}
        const token=randomUUID();
        db.prepare('INSERT INTO notification_attempts(order_id,kind,attempts,lease_until,lease_token,first_attempt_at) VALUES(?,?,1,?,?,?) ON CONFLICT(order_id,kind) DO UPDATE SET attempts=attempts+1,lease_until=excluded.lease_until,lease_token=excluded.lease_token,first_attempt_at=COALESCE(first_attempt_at,excluded.first_attempt_at)').run(row.order_id,row.kind,now+30000,token,now);
        db.exec('COMMIT');return {...row,payload:JSON.parse(row.payload),attempts:Number(row.attempts)+1,token,idempotencyKey:'order-'+row.order_id+'-'+row.kind};
      }catch(error){db.exec('ROLLBACK');throw error;}
    },
    finishNotification(job,providerId) {
      if(typeof providerId!=='string'||!/^[A-Za-z0-9_-]{1,200}$/.test(providerId))throw new ShopError('INVALID_DELIVERY_RESPONSE');
      db.exec('BEGIN IMMEDIATE');
      try{
        const result=db.prepare('UPDATE notification_attempts SET provider_id=?,lease_until=0,lease_token=NULL WHERE order_id=? AND kind=? AND lease_token=?').run(providerId,job.order_id,job.kind,job.token);
        if(result.changes!==1)throw new ShopError('DELIVERY_LEASE_LOST',409);
        db.prepare("UPDATE notification_jobs SET status='sent' WHERE order_id=? AND kind=?").run(job.order_id,job.kind);
        db.exec('COMMIT');
      }catch(error){db.exec('ROLLBACK');throw error;}
    },
    retryNotification(job,permanent=false,now=Date.now()) {
      db.exec('BEGIN IMMEDIATE');
      try{
        const delay=[60000,300000,900000,3600000,3600000][Math.min(job.attempts-1,4)];
        const result=db.prepare('UPDATE notification_attempts SET retry_at=?,lease_until=0,lease_token=NULL WHERE order_id=? AND kind=? AND lease_token=?').run(now+delay,job.order_id,job.kind,job.token);
        if(result.changes && (permanent||job.attempts>=5))db.prepare("UPDATE notification_jobs SET status='needs_review' WHERE order_id=? AND kind=?").run(job.order_id,job.kind);
        db.exec('COMMIT');
      }catch(error){db.exec('ROLLBACK');throw error;}
    },
    soldUnits() { return Object.fromEntries(db.prepare('SELECT stock_key,quantity FROM sold_units').all().map(row=>[row.stock_key,row.quantity])); },
    close() { db.close(); }
  };
}
