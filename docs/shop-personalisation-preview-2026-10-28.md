# Personalisation, quantities and gift sets

Status: isolated DE/EN noindex preview, not deployed, no real payment enabled.
This supersedes earlier demo notes saying that no engraving text is collected.

## Confirmed behaviour

- One-off quantities are limited across plain/engraved lines and shared variants.
  Finite multi-piece board stock uses the existing product stock value; tool
  choices retain a five-unit technical preview cap, not an invented stock count.
- Text engraving requires text (120 characters maximum), a font and, for boards,
  a position. Tools use individual position agreement. Different engraving text
  creates separate lines. Both cart editing and cancelling edits are available.
- Board positions include four cutting-face corners and narrow front/side edges.
  Copy recommends narrow edges for preserving engraving during resurfacing and
  confirms orientation relative to the brand mark before production.
- Noto Sans, Noto Serif and Allura are self-hosted preview fonts under their
  included OFL licenses, sourced from the official google/fonts repository.
  Final engraving size and font feasibility require workshop approval.
- Logo engraving requires an uploaded PNG/JPEG (maximum 4 MiB). SVG/PDF are not
  accepted. A logo also marks the order as requiring agreement before payment.
- Only XXL custom boards get an optional 500-character agreement/order note.
- Joint gift packaging is free, confirmed by the owner. Eligible tools can be
  grouped into a gift set, minimum two units. Kitchen-set and spatula-duo presets
  use normal prices without an invented bundle discount. Grouping is reversible.

## Data handling and remaining release work

- Persistent localStorage omits engraving details and XXL notes. Full cart draft
  remains session-scoped with a two-hour restore expiry, not durable storage.
- PNG/JPEG magic bytes, format, 16-million-pixel decoder limit and dimensions
  are checked locally with pinned Sharp. Files are re-encoded to PNG, resized to
  at most 2000 x 2000 and metadata is stripped. No external image service is used.
- Logo files are outside the repository, private directory mode 0700, files 0600.
  Random identifiers are not public download URLs. Downloads require the separate
  admin bearer secret. Same-origin writes, five uploads/minute, 25-file and 64 MiB
  storage caps protect the preview; production edge abuse controls are still needed.
- Unordered uploads expire after 24 hours and are pruned hourly/startup. Verified
  paid test orders retain referenced logos for 90 days. These provisional retention
  periods and customer privacy disclosure need approval before production.
- Personalisation and notes are retained in the private order/seller task, not
  placed in Stripe public product names/descriptions. They may contain personal data.
- The preview is not a security certification. Do not use sensitive real customer
  logos for tests. Production privacy notices, encrypted hosting/backups, retention,
  reservation concurrency, actual Stripe sandbox transaction, and remaining Etsy
  variant/packed shipping facts remain release gates. Existing Etsy links stay intact.

## Verification

Follow-up: the fixed mobile cart now displays the goods subtotal immediately,
labels shipping calculation/pending/error states explicitly, and replaces it with
the server total on success. Three dedicated regression tests and DE/EN browser
checks with delayed quotes verify updates without scrolling. The preview server
runs as a detached process; the temporary tunnel is a user-session launchctl job
(`de.edlehoelzer.shop-preview-tunnel`). It still depends on this Mac staying awake
and connected and is not production hosting.

29 shop tests, 108 existing JavaScript tests and 32 Python tests passed. Browser
checks cover DE/EN at 375, 430, 768, 1024 and 1440 px; additional checks exercise
required engraving, font choice, cart edit/cancel, private upload, stock limits,
free gift grouping and localStorage exclusion. No real mobile device test or real
Stripe account transaction has been completed. Dependency audit: zero reported
vulnerabilities at verification time. Production indexability remains unchanged.
