# Stripe pilot: kitchen tools and care

CURRENT SECURITY/OPERATIONS: `checkout-security-release-2026-10-29.md` and
`website-abschluss-2026-10-29.md`. The implementation now includes atomic stock
holds, provider reconciliation, manual acceptance and a disabled delivery worker.
Contradicting older implementation limits below are historical, not current.

LATEST STATUS: expanded to the complete 46-product canonical catalogue preview.
Read `shop-portfolio-preview-2026-10-28.md` for current implemented behaviour,
shipping changes and remaining gaps. Earlier narrow-scope/4.90 shipping notes
below are historical context, NOT the current rules or an approval to launch.

## Status

Isolated DE/EN cart preview, not a launched shop. No live Stripe key or active
Stripe test key was configured. No Checkout Session or real payment was created
against Stripe. The demo is deliberately marked and has no card/address form.
The repository currently hosts a static website; GitHub Pages cannot run the
checkout backend. The existing Etsy checkout links and production product pages
are unchanged. The new preview pages are noindex and absent from the sitemap.

## Product review

Owner approved these replenishable families for the pilot. Read-only Etsy API
snapshot: 2026-10-28T06:31:26Z, 40 active listings. No Etsy stock or offer changed.

| Family | Etsy listing | Listing quantity | Current starting price |
| --- | --- | ---: | ---: |
| Dough scraper | 4471048251 | 28 | EUR 25.99 |
| Care balm | 1881802291 | 10 | EUR 9.99 |
| Butter knife | 4549962555 | 23 | EUR 22.99 |
| Wooden spatula | 4470469056 | 37 | EUR 29.99 |

These are listing-level quantities, not verified stock for each wood. The Etsy
inventory endpoint returned 401 for all four listings with the available
credentials. Consequently wood-specific prices/stock remain unverified. Preview
uses current base prices for the displayed wood choices, explicitly not approved
for charging. No claim of guaranteed delivery capacity for a batch is made.
Wood choices come from current descriptions; special designs, sold
scraper sets, other boards, coasters and board stands are deliberately excluded.

Owner correction on 28 October: engraving on scraper, spatula and butter knife
costs EUR 5.99 per item, consistent with Etsy. Corrected the central website
accessory option price and added an optional pilot checkbox. Server-owned
`engravingCents=599` is charged per quantity; plain/engraved variants have distinct
cart identities. The boolean survives quotes, Stripe line names and seller tasks.
The expanded preview now collects engraving text/font/position or a private
logo upload; see `shop-personalisation-preview-2026-10-28.md` for data handling.
The existing product-page Etsy links
have deliberately not been replaced by untested direct-checkout buttons.

Scraper choices now also include Kambala, wild cherry and chestnut from the
description, plus maple confirmed available by the owner on 28 October: eight
woods in total. Base prices are still preview
prices, not verified per-wood pricing. Five per configuration is a pilot input
limit, NOT stock or the number of products actually available. Do not present
listing stock as per-wood stock or infer availability from listing descriptions.

### XXL reference and owner-confirmed variants

Listing `4484195050`: made-to-order end grain, reference size 75 x 60 cm. The owner
provided Etsy variation screenshots and additional cherry/inlay instructions on
28 October. These are the source for the pilot's now enabled demo-cart variants:

| Main wood | Price EUR | Availability |
| --- | ---: | --- |
| Oak | 1,399 | Made to order |
| Beech | 1,299 | Made to order |
| Walnut | 1,699 | Made to order |
| Maple | 1,199 | Made to order |
| Ash | 1,199 | Made to order |
| Chestnut | 1,199 | Made to order |
| Cherry | 1,699 | Made to order, confirmed in owner's message |
| Wenge | 1,999 | Sold out, server-blocked |

Inlay choices: none (one wood), oak, beech, walnut, ash, maple, chestnut.
All are included with no surcharge. Inlay is validated separately, preserved
in cart identity, quotes, Stripe line descriptions, private orders and seller
tasks. It must not be conflated with the optional stop edge. No new stop-edge
pricing or engraving option has been inferred.

The Etsy inventory API remains inaccessible (HTTP 401). This is a manual,
owner-confirmed snapshot, not live synchronisation. Main-wood prices are integer
cents on the server, with no fallback for missing prices. The global payment
gates remain OFF: enabling this product in the demo does not activate Stripe.
Final dimensions and lead times require agreement; other sizes must not silently
inherit the reference price. Shipping and production scope still require the
overall launch checks below.

Existing website rules list free domestic shipping for the three tool listings.
Balm shipping and mixed-order combination rules are not confirmed. A EUR 4.90
shipping assumption applies to preview carts containing balm, even when combined
with tools. This is clearly labelled, and `shippingConfirmed` is false. Confirm
all domestic rates and realistic dispatch/delivery times before payments.

## Architecture

- Static frontend: `shop-vorschau/`, `en/shop-preview/`, `assets/js/shop-pilot.js`,
  `assets/css/shop-pilot.css`. Same catalog/pricing in both languages.
- Server-owned offer allowlist: `data/shop-pilot.json`. It is not secret; price
  authority is the backend's deployed copy, not the browser's request.
- Isolated Node 24 server and pinned official Stripe SDK under `tools/shop-server/`.
- Browser sends only known SKU, wood and integer quantity. Quotes and Checkout
  totals are rebuilt on the server in integer cents. Client item prices rejected.
- Persistent SQLite ledger outside the checkout: order ID, request ID, selected
  product/wood/quantity, expected amount, Stripe session ID and payment status.
- Signed Stripe webhook, paid-state/currency/amount/session verification and
  idempotent processing. Pending/failed payments never generate a paid task.
- A paid sandbox order creates exactly one private pending Etsy adjustment task.
  This is a durable outbox, not yet a WhatsApp/email/push delivery integration.
- Etsy remains manual as explicitly agreed by the owner. No automatic API writes,
  stock reservation or claim of real-time cross-channel synchronisation.

## GitHub hosting and private deployment

The frontend can remain on GitHub Pages. Deploy the Node backend separately on
an EU-region host with HTTPS and a durable private volume. Build frontend pages
with `SHOP_API_BASE=https://YOUR-API-DOMAIN/api/shop/ node scripts/build-shop-preview.mjs`.
Set `SHOP_PUBLIC_ORIGIN=https://edlehoelzer.de` on that backend. Test-mode CORS
permits exactly that origin, only the public catalog/quote/checkout/status
routes, and no cookies. Never use wildcard CORS or ship a backend secret in HTML.

For the current demonstration a loopback backend serves only explicitly listed
preview assets and the API. Private repository paths, config directories, logs,
SQLite files, env files and source files are not served. Source may be public;
credentials, orders and runtime records must never be public.

There is no `live` mode in this implementation. Both live keys and live webhook
events are rejected. Sandbox session creation additionally requires all three:
`config.approved=true`, `config.shippingConfirmed=true`, and
`SHOP_TEST_APPROVED=yes`. These gates are still off. Approval requires the
business and legal checks below, not just filling in a key.

## Local preview and tests

```sh
npm ci --prefix tools/shop-server --ignore-scripts
node scripts/build-shop-preview.mjs
npm run preview:shop
```

Preview: `http://127.0.0.1:8170/shop-vorschau/` and `/en/shop-preview/`.
Same-origin demo mode is default; no Stripe credentials are required.
Temporary external preview is provided separately and has no uptime guarantee.
Demo mode writes no orders and accepts no payment data. Engraving text and XXL
notes stay in session storage; uploaded logos are private server-side files.
These fields can contain personal data: see the personalisation preview notes.

```sh
npm run test:shop
node --test tests/*.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
node scripts/check-indexability.mjs
npm audit --prefix tools/shop-server --omit=dev --audit-level=high
```

CI installs the pinned SDK without lifecycle scripts and runs the isolated shop
tests on Node 24. Test fixtures do not use real credentials or contact Stripe.
Webhook signatures are exercised with the actual SDK locally.

Browser verification on 28 October: DE/EN at 375, 430, 768, 1024 and 1440px;
four original real product photos loaded, no horizontal page overflow, wood/multiple
quantities, EUR 66.87 combined example, shipping removal, reload persistence,
demo dialog/Escape, empty cart disabled, failed quote/retry. Screenshots are
outside the repository under `/tmp/edle-shop-preview/`. No real iOS/Android
device test and no real Stripe sandbox checkout have been completed.

## Payment methods

Hosted Checkout deliberately does not hard-code `payment_method_types` or show
fake enabled method buttons. Eligible methods depend on the merchant's Stripe
Dashboard configuration, currency, location and device. Card/wallet/local-method
availability must be verified in the actual sandbox account. No PayPal, Klarna,
Apple Pay or Google Pay activation has been promised or performed.

## Security and personal data

- No `sk_*`/webhook secret in static files. Provider secrets belong in the
  backend host's secret store. `.env` and runtime databases are gitignored.
- The raw webhook body is signature-checked before business logic. Only
  authenticated paid events matching the private order are fulfilled.
- SQLite transactions, unique keys and Stripe idempotency keys prevent duplicate
  order tasks. Browser retry identifiers are session-scoped, cart/version-bound.
- Request bodies/quantities/countries/woods are bounded; only Germany is offered.
- Origin checks, restricted CORS, a basic memory rate limit, request timeouts,
  CSP, no-store, no-referrer, no framing and nosniff headers are included.
- No raw request/provider error/customer payload logging. Stripe-hosted forms
  collect payment and delivery details directly; no custom card input exists.
- Stripe customer names, emails and addresses are not copied into the local ledger.
  Engraving text and XXL notes can contain names or other personal data and are
  stored with orders in test mode; private logos have separate expiry rules.
  Order/session identifiers are nevertheless sensitive/potentially personal:
  use encrypted disks/backups, restricted operator access and retention rules.
- The seller-task route requires a separate >=32-character bearer secret, never
  embedded in the frontend. No public seller dashboard or notifications added.
- This is not a penetration test, PCI/DSGVO certification or claim of complete
  security. Host/reverse-proxy logs can still expose IPs and session URLs unless
  configured correctly. Review and minimise them before deployment.
- The demo rate limit sees the tunnel/reverse-proxy address; production needs an
  edge rate limit and an explicitly trusted proxy policy. Do not blindly trust
  arbitrary `X-Forwarded-For`. Monitor webhook failures and reconcile missed tasks.

## Required before a sandbox buying flow, then before launch

1. Confirm per-wood prices/availability, exact package contents, balm shipping,
   combined-order rules and dispatch/delivery commitments. No board balm discount
   is applied to these standalone care items.
2. Configure the merchant Stripe sandbox account and a restricted test secret,
   webhook secret, business identity and merchant terms/privacy URLs.
3. Review terms, withdrawal information, §19 UStG treatment, statutory warranty
   notice placement, order confirmation and the actual point of contract formation.
   The preview's links to existing production imprint/privacy pages are not a
   legal update for taking direct payments. Do not activate based on these links.
4. Add a real buyer confirmation/invoice workflow and seller notification channel,
   with retries, monitoring and an operator acknowledgement/reconciliation process.
5. Deploy backend HTTPS/durable storage/secrets, minimal access logs, backups,
   host authentication/updates, retention policy and provider agreements. Review
   GitHub Pages frontend CSP/headers via an edge proxy if required.
6. Exercise real Stripe sandbox success, cancellation, 3DS/failure, delayed
   methods, duplicate/retried webhooks, expired sessions and account-enabled
   payment methods. Complete an independent security and legal review.
7. A separate reviewed change is needed for LIVE operation. Current live-mode
   rejection is intentional and must not be casually bypassed.

## Primary references

- https://docs.stripe.com/checkout/quickstart
- https://docs.stripe.com/checkout/fulfillment.md?ui=full-page
- https://docs.stripe.com/events/manage-webhook-endpoints
- https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods
- https://docs.stripe.com/keys-best-practices

No live key, personal buyer record, local Etsy snapshot or compiled dependency
directory should enter a commit or the GitHub Pages artifact.
