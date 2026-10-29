import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { ShopError } from './catalog.mjs';

sharp.concurrency(1);
export function openUploads(store) {
  const directory=path.join(store.directory,'logos');
  fs.mkdirSync(directory,{recursive:true,mode:0o700});
  store.db.exec('CREATE TABLE IF NOT EXISTS logo_uploads (id TEXT PRIMARY KEY, expires INTEGER NOT NULL, bytes INTEGER NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL)');
  let busy=false;
  const validId=id=>typeof id==='string' && /^[a-f0-9]{64}$/.test(id);
  const file=id=>path.join(directory,id+'.png');
  const prune=()=>{
    for (const row of store.db.prepare('SELECT id FROM logo_uploads WHERE expires<?').all(Date.now())) {
      fs.rmSync(file(row.id),{force:true});
      store.db.prepare('DELETE FROM logo_uploads WHERE id=?').run(row.id);
    }
  };
  return {
    prune,
    has(id) {return validId(id) && !!store.db.prepare('SELECT id FROM logo_uploads WHERE id=? AND expires>?').get(id,Date.now()) && fs.existsSync(file(id));},
    async save(buffer,mime) {
      if (busy) throw new ShopError('UPLOAD_BUSY',429);
      if (!['image/png','image/jpeg'].includes(mime) || !buffer.length || buffer.length>4194304) throw new ShopError('INVALID_IMAGE');
      busy=true;
      try {
        const signature=mime==='image/png' ? buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : buffer[0]===255 && buffer[1]===216 && buffer[2]===255;
        if(!signature)throw new ShopError('INVALID_IMAGE');
        prune();
        const capacity=store.db.prepare('SELECT COUNT(*) AS count,COALESCE(SUM(bytes),0) AS bytes FROM logo_uploads').get();
        if (capacity.count>=25 || capacity.bytes>=67108864) throw new ShopError('UPLOAD_CAPACITY',503);
        const image=sharp(buffer,{limitInputPixels:16000000,failOn:'warning'});
        const metadata=await image.metadata();
        if (!['png','jpeg'].includes(metadata.format) || mime!=='image/'+metadata.format || (metadata.pages || 1)!==1) throw new ShopError('INVALID_IMAGE');
        const {data,info}=await image.rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).png().toBuffer({resolveWithObject:true});
        if (data.length>8388608 || capacity.bytes+data.length>67108864) throw new ShopError('UPLOAD_CAPACITY',503);
        const id=randomBytes(32).toString('hex'), expires=Date.now()+86400000;
        fs.writeFileSync(file(id),data,{mode:0o600,flag:'wx'});
        try {store.db.prepare('INSERT INTO logo_uploads(id,expires,bytes,width,height) VALUES(?,?,?,?,?)').run(id,expires,data.length,info.width,info.height);}
        catch(error){fs.rmSync(file(id),{force:true});throw error;}
        return {id,width:info.width,height:info.height,expiresAt:new Date(expires).toISOString()};
      } catch(error) {if(error instanceof ShopError)throw error;throw new ShopError('INVALID_IMAGE');}
      finally {busy=false;}
    },
    read(id) {if(!this.has(id))throw new ShopError('UPLOAD_NOT_FOUND',404);return fs.readFileSync(file(id));},
    retainPaid(quote) {
      for(const item of quote.items) if(item.personalisation?.uploadId && this.has(item.personalisation.uploadId)) {
        store.db.prepare('UPDATE logo_uploads SET expires=? WHERE id=?').run(Date.now()+90*86400000,item.personalisation.uploadId);
      }
    }
  };
}
