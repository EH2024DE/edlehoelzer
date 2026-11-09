const key='worktop';
let queue=Promise.resolve();
function database(){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('edle-worktop-preview',1);
 request.onupgradeneeded=()=>request.result.createObjectStore('photos');
 request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
});}
async function transact(mode,value){
 const db=await database();
 try{return await new Promise((resolve,reject)=>{
  const transaction=db.transaction('photos',mode),store=transaction.objectStore('photos');
  const request=mode==='readonly'?store.get(key):value?store.put(value,key):store.delete(key);
  transaction.oncomplete=()=>resolve(request.result);transaction.onerror=()=>reject(transaction.error);
  transaction.onabort=()=>reject(transaction.error);
 });}finally{db.close();}
}
export function savePhoto(value){
 const snapshot=value?{...value,savedAt:Date.now()}:null;
 try{window.parent.__edleWorktopPhoto=snapshot;}catch{}
 // Store bytes rather than a File handle: WebKit can lose persisted File data
 // across document navigation even though the IndexedDB record still exists.
 queue=queue.then(async()=>{
  if(!snapshot?.file)return transact('readwrite',snapshot);
  const {file,...metadata}=snapshot;
  return transact('readwrite',{...metadata,photoBytes:await file.arrayBuffer(),photoType:file.type,photoName:file.name||'worktop.jpg'});
 }).catch(()=>{});
 return queue;
}
export async function loadPhoto(){
 let value;try{value=window.parent.__edleWorktopPhoto;}catch{}
 if(!value)try{value=await transact('readonly');}catch{}
 if(value&&Date.now()-value.savedAt>24*60*60*1000){await savePhoto(null);return null;}
 if(value?.photoBytes&&!value.file){
  const {photoBytes,photoType,photoName,...metadata}=value;
  value={...metadata,file:new File([photoBytes],photoName||'worktop.jpg',{type:photoType||'image/jpeg'})};
 }
 return value;
}
