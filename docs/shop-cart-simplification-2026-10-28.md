# Cart simplification

Scope: isolated DE/EN preview only. No production checkout or prices changed.

- Kept item photos, configuration, quantities, edit/remove actions and explicit
  cost breakdown. Made the total and next action visually dominant.
- Gift grouping is a collapsed contextual option, only for two or more eligible
  tools. Selection checkboxes appear only while grouping is being edited.
- Removed repeated product lists inside gift groups and duplicate packaging copy.
  Item group numbers still connect each line to the correct gift set.
- Successful updates remain screen-reader announcements instead of permanent
  additional paragraphs. Errors, unavailable items and retry controls stay visible.
- Replaced internal Stripe integration text with honest preview/no-payment copy.
- Shortened shipping threshold and upgrade copy without hiding the uninsured
  balm exception, shipping costs or unresolved-cost gate. Technical preview caveats
  remain outside the purchase summary. Statutory-rights information is retained.
- No invented conversion uplift, trust seals, reviews, urgency or payment methods.

Reference principles: Shopify's checkout guidance and Baymard cart/checkout
research favour clear costs, editable order summaries and reduced distractions.
These principles inform this implementation, not a measured performance claim.

https://www.shopify.com/blog/ecommerce-checkout
https://baymard.com/blog/audit-checkout-flow-hidden-friction

Verification: DE/EN browser checks at 375, 430, 768, 1024 and 1440 px, including
gift disclosure, quantity/cost preservation and horizontal overflow. Delayed quote
checks confirm fixed mobile totals still update without scrolling. All 111 CJS
tests passed. This visual change does not replace the pending real Stripe sandbox
transaction, shipping confirmation and production privacy/security release gates.
