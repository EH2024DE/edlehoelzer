const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = process.argv[2];
const ffmpeg = process.argv[3];
if (!source || !ffmpeg) throw new Error('Usage: node scripts/import-card-videos.cjs SOURCE_DIR FFMPEG_PATH');
const manifest = require('./import-card-videos.json');
const catalogPath = path.join(root, 'products.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
for (const item of manifest) {
  const product = catalog.products.find(p => item.productName ? p.displayName === item.productName : String(p.listingId) === item.listingId);
  if (!product) throw new Error('Unknown listing: ' + item.listingId);
  const input = path.join(item.download ? path.join(require('node:os').homedir(), 'Downloads') : source, item.source);
  const output = path.join(root, 'assets/product-videos', item.slug + '.mp4');
  const poster = path.join(root, 'assets/product-videos/posters', item.slug + '.jpg');
  const run = args => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args], { cwd: path.dirname(ffmpeg), stdio: 'inherit' });
  if (!fs.existsSync(output)) run(['-i', input, '-an', '-vf', "scale='min(" + (item.width || 1280) + ",iw)':-2", '-c:v', 'libx264', '-crf', String(item.crf || 25), '-preset', 'fast', '-movflags', '+faststart', output]);
  if (!fs.existsSync(poster)) run(['-ss', '1', '-i', input, '-frames:v', '1', '-vf', 'scale=800:-2', poster]);
  const src = '/assets/product-videos/' + item.slug + '.mp4';
  if (item.replaceSrc) product.videos = (product.videos || []).filter(v => v.src !== item.replaceSrc);
  if (!(product.videos || []).some(v => v.src === src)) {
    const video = { src, poster: '/assets/product-videos/posters/' + item.slug + '.jpg', alt: item.label + ' im Produktvideo' };
    product.videos = item.first ? [video].concat(product.videos || []) : (product.videos || []).concat(video);
  }
  console.log(item.listingId, item.source, Math.round(fs.statSync(output).size / 1024) + ' KB');
}
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
