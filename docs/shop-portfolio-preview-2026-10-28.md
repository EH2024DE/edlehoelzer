# Full portfolio preview: implementation status

This document supersedes the earlier five-family pilot scope, not the live
checkout approval gates. No production deployment, Etsy inventory write, Stripe
sandbox transaction or real payment has been performed.

## Implemented in the isolated DE/EN preview

- All 46 canonical catalogue products: 40 available/made-to-order configurations
  and six sold archive pieces. The separate tropical handled-board listing is
  represented once, as the tropical variant of the three-wood handled board.
- Central `products.json` remains the product-fact source; the existing five
  owner-confirmed pilot offers provide explicit overrides. Source data is not
  rewritten or globally reclassified by this preview.
- Known structured variant matrices: handled board (beech/tropical/oak), small
  boards (five wood designs), historic-oak board (plain/groove). Exact selected
  variant price, photo and documented dimensions update together.
- XXL: eight owner-confirmed main woods/prices, sold-out Wenge, seven free inlay
  choices. German regular freight included, no express, 3-4 weeks fabrication
  after final approval AND payment. Real XXL payment stays blocked pending a
  personal agreement workflow. Reference prices do not price arbitrary sizes.
- Kitchen tools: scraper's eight woods; engraving EUR 5.99 each. Main catalogue
  board engraving price EUR 10 is mirrored where existing rules permit it.
- Juice groove add-on EUR 15 only on products in the existing allowlist that
  do not already have a confirmed included groove. Plain/groove variants use
  their own variant prices, not a duplicated add-on.
- Existing balm add-on rules/discount are mirrored where applicable. Existing
  package contents remain visible in a disclosure; nothing new is claimed.
- Search, category and availability filters, result count, square photos and
  cart controls. Unknown wood variants are NOT inferred from mixed-wood material
  descriptions. Review-pending source configurations are explicitly labelled.
- Single-piece boards limited to one across option combinations. Independent
  piece variants have individual stock keys; plain/groove choices for the same
  piece share a key. Made-to-order variants are not permanently sold out after
  a single payment.
- Only a verified PAID Stripe sandbox event can mark a one-off sold in the
  private ledger. Amount/currency/order/session/signature checks remain. Repeat
  events do not create extra sold units. Public catalogue applies these sold
  keys, quote/checkout rejects sold pieces, UI refreshes availability on return
  to tab and every minute while visible. Sold pieces show a contact link for a
  similar piece, never an add-to-cart form.

## Shipping preview

- Germany-only direct checkout, EU enquiry only.
- Standard German shipping free from EUR 150 goods value (currently includes
  configured paid options; confirm threshold wording/discount treatment before
  live launch). Heavy/XXL freight cost is internal, not a customer surcharge.
- Eligible single-tin balm-only basket: EUR 2.70 uninsured, explicit optional
  +EUR 3.49 upgrade = EUR 6.19 TOTAL, remembered within the browser session.
- Mixed kitchen tools use the provisional EUR 6.19 DHL 2 kg tier; packing,
  insurance coverage and weights are not approved just by displaying this tier.
- Below EUR 150, baskets containing other catalogue products or multiple balm
  tins have `shippingPending=true`, no invented shipping price and no payable
  total. They can be explored in the cart but checkout stays disabled until
  packing/tariff rules are validated. Free shipping does not prove a suitable
  carrier/coverage exists; large/high-value boards still need review.
- Preparation messages: 1-3 working days, additional groove 3-5 working days,
  plus transit. Carrier express remains unimplemented/unpriced and unavailable.

## Important gaps before all-product live checkout

1. Etsy inventory/variation API returned HTTP 401 with available access. We have
   not verified every current Etsy combination, per-wood price, option/stock or
   package. Particularly unstructured wood-choice listings such as board stands
   need their real matrix; no fabricated choice/price was added. The visible
   catalogue configs are not a claim of exhaustive Etsy equivalence.
2. Data stock fields contain older values; explicit active/sold/made-to-order
   flags govern catalogue display. Maximum quantity is a UI/order cap, not a
   live Etsy stock count. Etsy sales must be manually reflected in the source
   catalogue/status and deployed/restarted by the owner/operator. This preview
   has no seller stock-management GUI and no Etsy write synchronisation.
3. Paid-state stock closure is implemented and tested locally, but an atomic
   reservation/expiry workflow for simultaneous WEBSITE checkouts is not yet
   implemented. The owner's Etsy oversell acceptance does not eliminate this
   remaining website launch requirement. Keep test/live approval gates OFF.
4. Complete packing weights/dimensions, shipping tiers, carrier cover, separate
   high-value/oversize freight, delivery commitments, cancellation/refunds and
   operator reopening of returned one-offs.
5. Existing public product cards/pages are unchanged. Connect them to this cart
   only after the full integration review. The preview is an isolated noindex
   route and not in the sitemap; no launch/SEO-indexing action is appropriate.
6. Configure Stripe sandbox securely and verify a real sandbox session, signed
   paid event, ledger, buyer confirmation and seller notification. Still no
   actual Stripe test API transaction has been made. Add operational monitoring,
   private hosting/backups, privacy/legal review and fulfilment procedures.
7. Live mode is still deliberately unsupported. Do not enable by simply changing
   booleans or exposing credentials. Use the existing PR/deployment review flow.

## Verification

24 Node shop tests cover full catalogue coverage, precise variants/options,
sold/one-off controls, paid-state persistence/deduplication, shipping boundaries,
private files, signatures, origin checks and idempotency. The 108 existing CJS
tests, 32 Python tests and indexability audit pass. Browser checks cover DE/EN
at 375, 430, 768, 1024 and 1440px with filters, sold archive, selected tropical
variant/groove, balm upgrade/reload, unresolved package disabling checkout and
page overflow checks. Screenshots are outside the repository.

Run `npm run test:shop`, `node --test tests/*.test.cjs`,
`python3 -m unittest discover -s tests -p 'test_*.py'` and
`node scripts/check-indexability.mjs` after further changes. Preview:
`node tools/shop-server/server.mjs`; temporary tunnel URLs must be reverified.
