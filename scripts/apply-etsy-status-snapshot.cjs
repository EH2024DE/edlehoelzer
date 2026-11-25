const fs = require('node:fs');
const path = require('node:path');

function applyStatus(product, listing, checkedAt) {
  if (listing?.status !== 200 || !Number.isInteger(listing.quantity) || listing.quantity < 0) return;
  if (listing.state === 'sold_out') {
    Object.assign(product, { active: false, stock: 0, availabilityStatus: 'sold',
      directListingUrlVerified: false, inventoryCheckedAt: checkedAt,
      soldReason: `Etsy listing confirmed sold_out on ${checkedAt.slice(0, 10)}` });
    if (product.category === 'board' && !product.canonicalProductId) {
      Object.assign(product, { visibility: 'inspiration', inspirationOnly: true,
        replacementStrategy: 'request_similar', requestUrl: '/schneidebrett-nach-mass/' });
    }
  } else if (listing.state === 'active' && product.active === true) {
    // Reactivation, especially of individual variants, requires a separate review.
    Object.assign(product, { stock: listing.quantity, inventoryCheckedAt: checkedAt });
  }
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const snapshot = JSON.parse(fs.readFileSync(process.argv[2] || path.join(root, 'logs/etsy-listing-status.json'), 'utf8'));
  if (!Number.isFinite(Date.parse(snapshot.checkedAt)) || !Array.isArray(snapshot.results) || !snapshot.results.length) {
    throw new Error('A dated, nonempty listing-status snapshot is required');
  }
  const catalogPath = path.join(root, 'products.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const byId = new Map(snapshot.results.map(row => [row.listingId, row]));
  for (const product of catalog.products) applyStatus(product, byId.get(product.listingId), snapshot.checkedAt);
  catalog.updatedAt = snapshot.checkedAt.slice(0, 10);
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
  const quantities = Object.fromEntries(snapshot.results.filter(row => row.status === 200 &&
    ['active', 'sold_out'].includes(row.state) && Number.isInteger(row.quantity) && row.quantity >= 0)
    .map(row => [row.listingId, row.quantity]));
  fs.writeFileSync(path.join(root, 'data/inventory-public-snapshot.json'), JSON.stringify({
    checkedAt: snapshot.checkedAt, source: 'Etsy Open API individual listing status', quantities
  }, null, 2) + '\n');
  console.log('Updated confirmed stock and sold listings; preserved prices, URLs and manually disabled variants.');
}

module.exports = { applyStatus };
