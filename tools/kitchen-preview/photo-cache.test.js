import test from 'node:test';
import assert from 'node:assert/strict';

test('local photo cache persists bytes, restores files, expires and removes them',async()=>{
 const oldWindow=globalThis.window,oldDatabase=globalThis.indexedDB,records=new Map();
 globalThis.window={parent:{}};
 globalThis.indexedDB={open(){
  const request={};
  queueMicrotask(()=>{
   request.result={close(){},transaction(){
    const transaction={objectStore(){return {
     get(key){return operation(()=>records.get(key));},
     put(value,key){return operation(()=>{records.set(key,structuredClone(value));return key;});},
     delete(key){return operation(()=>records.delete(key));}
    };}};
    function operation(action){const operation={};queueMicrotask(()=>{operation.result=action();transaction.oncomplete?.();});return operation;}
    return transaction;
   }};
   request.onsuccess();
  });return request;
 }};
 try{
  const {savePhoto,loadPhoto}=await import('./photo-cache.js?test=byte-storage');
  const file=new File(['local photo bytes'],'kitchen.jpg',{type:'image/jpeg'});
  await savePhoto({file,confirmed:true,points:[[.2,.2],[.8,.2],[.8,.8],[.2,.8]],w:'29.7',d:'21'});
  const stored=records.get('worktop');assert.equal(stored.file,undefined);assert.ok(stored.photoBytes instanceof ArrayBuffer);
  window.parent.__edleWorktopPhoto=null;
  const restored=await loadPhoto();assert.equal(await restored.file.text(),'local photo bytes');
  assert.equal(restored.file.type,'image/jpeg');assert.equal(restored.file.name,'kitchen.jpg');assert.equal(restored.confirmed,true);
  stored.savedAt=Date.now()-25*60*60*1000;window.parent.__edleWorktopPhoto=null;
  assert.equal(await loadPhoto(),null);assert.equal(records.has('worktop'),false);
  records.set('worktop',{file,savedAt:Date.now(),confirmed:true});
  assert.equal((await loadPhoto()).file,file,'legacy File entries remain readable');
  await savePhoto(null);assert.equal(records.size,0);assert.equal(window.parent.__edleWorktopPhoto,null);
 }finally{
  if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;
  if(oldDatabase===undefined)delete globalThis.indexedDB;else globalThis.indexedDB=oldDatabase;
 }
});
