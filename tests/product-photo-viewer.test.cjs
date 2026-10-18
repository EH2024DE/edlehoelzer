const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fit, constrain, zoom, originalUrl } = require('../assets/js/product-photo-viewer.js');

test('fullscreen entry is restricted to product details, not card galleries', () => {
  const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert.doesNotMatch(read('assets/js/product-hover-video.js'), /data-photo-viewer|productCard__photoExpand/);
  assert.match(read('assets/js/product-photo-viewer.js'), /if \(!trigger \|\| !trigger\.closest\("\.productPreview"\)\) return/);
  assert.match(read('main.js'), /productPreview__photoButton.*data-photo-viewer/);
});

test('portrait and landscape photos fit fully in the viewport without distortion', () => {
  for (const [w, h] of [[4000, 2000], [2000, 4000], [3000, 3000]]) {
    const size = fit(w, h, 375, 650);
    assert.ok(size.width <= 351 && size.height <= 626);
    assert.ok(Math.abs(size.width / size.height - w / h) < 0.0001);
  }
});
test('small source photos are not enlarged by the initial fit', () => {
  assert.deepEqual(fit(100, 80, 1000, 800), { width: 100, height: 80 });
});
test('zoom limits and pan boundaries prevent losing the photo', () => {
  assert.deepEqual(constrain({ scale: 9, x: 9999, y: -9999 }, { width: 300, height: 200 }, { width: 400, height: 400 }), { scale: 6, x: 700, y: -400 });
  const reset = constrain({ scale: .5, x: 100, y: -100 }, { width: 300, height: 200 }, { width: 400, height: 400 });
  assert.equal(reset.scale, 1); assert.equal(Math.abs(reset.x), 0); assert.equal(Math.abs(reset.y), 0);
});
test('pointer-centered zoom keeps the inspected detail in place', () => {
  assert.deepEqual(zoom({ scale: 1, x: 0, y: 0 }, 2, { x: 50, y: 20 }, { width: 500, height: 500 }, { width: 500, height: 500 }), { scale: 2, x: -50, y: -20 });
});
test('Etsy full-resolution photos are loaded only by the viewer', () => {
  assert.equal(originalUrl('https://i.etsystatic.com/542/r/il/a/123/il_794xN.123_a.jpg'), 'https://i.etsystatic.com/542/r/il/a/123/il_fullxfull.123_a.jpg');
  assert.equal(originalUrl('/assets/photo.jpg'), '/assets/photo.jpg');
  assert.equal(originalUrl('https://example.org/il_794xN.photo.jpg'), 'https://example.org/il_794xN.photo.jpg');
});
