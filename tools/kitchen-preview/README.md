# Kitchen preview

This directory is the maintained source for `/brettvorschau/`.

Run `npm ci`, `npm test`, then `node build-website.mjs` here. The build writes
the production bundle and the eligible product manifest to `../../brettvorschau/`.
Only referenced public product images are copied. Customer kitchen photos stay
in the browser and must never be added to this directory or the public preview.

`preview-eligibility.json` defines the supported premium boards. The build fails
if an eligible listing has no model. Product dimensions are in
`additional-models.js` and `verified-dimensions.json`.

Before release, check product-detail entry, purchase URLs, photo calibration,
fullscreen Escape and close, and mobile touch controls. Test Android on a real
device; browser viewport emulation does not replace a device test.
