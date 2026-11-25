const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const file of [path.resolve(root, '../listing-generator/.env'), path.resolve(root, '../.env'), path.join(root, '.env')]) {
  if (fs.existsSync(file)) process.loadEnvFile(file);
}
const key = process.env.ETSY_API_KEY_HEADER || (process.env.ETSY_API_KEY && process.env.ETSY_SHARED_SECRET
  ? process.env.ETSY_API_KEY + ':' + process.env.ETSY_SHARED_SECRET : process.env.ETSY_API_KEY);
const ids = [...new Set(process.argv.slice(2).filter(value => /^\d+$/.test(value)))];
(async () => {
  if (!key || !ids.length) throw new Error('API key and listing IDs are required');
  const results = [];
  for (const listingId of ids) {
    const response = await fetch('https://api.etsy.com/v3/application/listings/' + listingId, {
      headers: { 'x-api-key': key, Accept: 'application/json' }, signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) { results.push({ listingId, status: response.status }); continue; }
    const listing = await response.json();
    results.push({ listingId, status: response.status, state: listing.state, quantity: listing.quantity, title: listing.title });
  }
  const snapshot = { checkedAt: new Date().toISOString(), results };
  fs.mkdirSync(path.join(root, 'logs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'logs/etsy-listing-status.json'), JSON.stringify(snapshot, null, 2) + '\n');
  console.log(JSON.stringify(snapshot, null, 2));
})().catch(() => { console.error('Listing status read failed; no catalogue changes made'); process.exitCode = 1; });
