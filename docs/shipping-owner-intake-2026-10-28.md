# Shipping rules: owner voice intake, 28 October 2026

IMPLEMENTATION UPDATE AFTER THE VOICE INTAKE: the portfolio preview has now been
expanded. See `shop-portfolio-preview-2026-10-28.md` for implemented rules versus
remaining gaps. The original handoff below records the earlier point in time;
its statement that all voice rules remain unimplemented is no longer current.

## Implementation handoff: read this first

LATEST SCOPE EXTENSION: owner requested the preview cover ALL catalogue products,
including one-offs and their actual wood/engraving/groove options. He accepts
manual Etsy inventory maintenance and the cross-channel oversell risk; that does
not authorise invented variants/prices or duplicate website fulfilment. Sold
one-offs remain visible, cannot be bought, and offer contact for a similar board.
Do not duplicate the standalone tropical listing already mapped to a combined
three-wood product. Missing Etsy variation matrices remain review gaps.

LATEST XXL SHIPPING CONFIRMATION: regular German shipping is fully INCLUDED
in the XXL fabrication price, with no express option. Owner says internal freight
can cost up to approximately EUR 50 depending on size/weight; this is not a buyer
surcharge or a verified universal freight quote. Select suitable transport and
coverage beforehand, do not treat EUR 50 as an automatic shipping fee or claim
all dimensions fit a standard DHL parcel. EU remains enquiry-only.

Repository checkout: `erbstueck-storytelling`, branch `codex/product-detail-pages`.
Reuse this checkout and preserve existing uncommitted work. No new parallel copy
is needed. Recording these decisions did NOT implement them in the preview.

Already implemented before voice intake:

- Isolated DE/EN shop preview under `shop-vorschau/` and `en/shop-preview/`.
- Cart with wood/quantity, XXL main-wood prices and free inlays, Wenge blocked.
- Eight scraper woods, including owner-confirmed maple.
- Optional engraving on scraper/spatula/knife: EUR 5.99 PER ITEM; also corrected
  `products.json` central accessory engraving price.
- Server pricing, private ledger, signed webhook and idempotency safeguards;
  no actual Stripe test transaction yet and no real-payment support enabled.
- Existing public product cards/detail pages still use Etsy, not this cart.
- Main files: `data/shop-pilot.json`, `assets/js/shop-pilot.js`,
  `assets/css/shop-pilot.css`, `tools/shop-server/{catalog,server,store}.mjs`,
  `scripts/build-shop-preview.mjs`, `tests/shop-pilot.test.mjs`.
- Last verification before voice intake: 16 shop tests and 108 existing CJS
  tests passed; DE/EN engraving/cart browser checks at 375 and 1440 px passed.

NEXT IMPLEMENTATION, in this order:

1. Replace provisional shipping in the preview, server-first. Germany-only
   direct checkout; other EU destinations have an enquiry path, not a payable
   shipping option. Do not alter Etsy shipping prices or offers.
2. Germany: insured DHL parcel by default, cheapest eligible regular online
   tier determined by VERIFIED packed dimensions/weight and coverage. Free to
   buyer from EUR 150 goods value inclusive, even for heavy boards. Show the
   correct remaining amount below threshold. No product price increases.
3. Exception: eligible BALM-ONLY orders default to EUR 2.70 uninsured postal
   service, optional explicit upgrade +EUR 3.49 = EUR 6.19 total shipping when
   the DHL 2 kg limits fit. Mixed orders use insured parcel rules. No buyer
   liability checkbox. Validate multiple tins/packing limits; don't extrapolate.
4. Show dispatch readiness separately from carrier transit: available products
   and engraved kitchen tools 1-3 Werktage; additional juice-groove machining
   3-5 Werktage; stocked packed balm can be ready earlier, without an invented
   unconditional same-day cutoff/promise.
5. Website XXL: personal agreement on dimensions and timing BEFORE binding
   payment. About 3-4 weeks production starting only after BOTH final approval
   and receipt of payment, plus transit. No extra priority-processing fee.
   The current generic instant demo-cart flow is not a completed agreement/
   custom-offer workflow. Do not present it as live-ready XXL checkout.
6. Express: carrier express only, not paid priority production. Keep disabled
   until eligible services, price delta, cutoff and transit commitments are
   verified. Respect production/oil-curing time; no standalone express product
   purchasable without eligible goods. Determine relation to free standard
   shipping before implementation; no free-express promise was approved.
7. Check listing facts and actual packaging. Missing packed dimensions/weights
   must block unsupported combinations instead of falling back to a cheap
   tariff. XXL needs special attention to >EUR 500 coverage and >60 cm packed
   width. EU rates deferred. Still clarify threshold treatment of engraving/
   discounts and define 'Werktage' customer wording consistently.
8. Add exact-cent/quantity/packing/coverage boundary tests, DE/EN browser QA,
   shipping-option persistence and Stripe/order total consistency. Then connect
   eligible existing product cards/detail pages to the SAME shared cart; retain
   a clearly distinct Etsy fallback without duplicate-order ambiguity.
9. Connect Stripe SANDBOX via server-side secrets, not pasted in chat/public
   files. Test success/cancellation/failure/retry/webhooks, confirm actual test
   payment in merchant Stripe and private ledger, and test buyer confirmation
   and seller notification/reconciliation. Secrets/DB/customer data stay out of
   GitHub and static hosting. Demo dialogs are NOT Stripe transaction evidence.
10. Only after operational, shipping, privacy/legal and security checks and the
    existing publication review process: prepare a separate reviewed live-mode
    change and deployment. Current implementation deliberately rejects live
    mode. Do not simply flip the existing approval booleans or publish secrets.

Preview startup: `node tools/shop-server/server.mjs` (loopback port 8170).
Tests: `npm run test:shop`; `node --test tests/*.test.cjs`; `git diff --check`.
An external quick tunnel is temporary and must be rechecked/recreated, not
assumed durable. Do not call the latest shipping preview implemented until the
code, server response and browser actually match these rules.

## Status and handoff

FINAL LAUNCH SCOPE confirmed by the owner: launch direct website checkout for
GERMANY ONLY first, to observe adoption versus Etsy. Other EU destinations are
ENQUIRY ONLY, with no direct checkout or blanket EUR 6.99 tariff. Existing Etsy
sales remain available; do not change Etsy account/listings. The owner wants a
real German launch, but this scope approval does not mean the implementation
already accepts payments or that unfinished sandbox, shipping, operational,
privacy/legal and security prerequisites may be skipped. Do not switch live
keys or remove fail-closed gates before those checks are genuinely complete.
EU tariff work is deferred, not a blocker for a Germany-only launch. Existing
shop documentation and DE/EN messaging must reflect the same territory rule.

Captured from the owner's voice conversation in the website task. This is an
implementation specification, not a statement that the checkout already uses
these rules. The shop preview still has provisional shipping logic, including
the old EUR 4.90 balm assumption. Replace that logic only with validated rules;
do not activate real payments as part of this intake.

## Confirmed owner decisions

### Final website decision: supersedes earlier small-goods rules below

LATEST AMENDMENT: the owner subsequently exempted care balm from the universal
insured-parcel default because EUR 6.19 shipping on EUR 9.99 balm is unattractive.
Germany care-balm shipping should be EUR 2.70 (postal Warensendung as discussed).
The owner then explicitly confirmed this exception applies ONLY to balm-only
baskets. Mixed baskets with kitchen tools use the insured DHL parcel rule.
For eligible balm-only German orders, offer an optional insured DHL upgrade:
EUR 2.70 default uninsured postal shipping, plus EUR 3.49 to reach EUR 6.19
TOTAL shipping (not EUR 6.19 added on top). Show the selected full shipping
price and order total before checkout. Describe the default as uninsured,
without transferring statutory transport risk to the buyer. An unchecked,
explicit upgrade option is required; no hidden fee or preselected paid extra.
The EUR 6.19 option is only valid when packed weight/dimensions and value fit
the DHL 2 kg service and coverage. Multiple-tin limits still need validation.
Do not extend this tariff to all quantities without validation. This
amendment overrides the 'all orders insured' statement for the confirmed balm
exception only; other products keep the approved parcel rule.

Dispatch readiness amendment from the same owner message:

- Current product preparation/dispatch window: 1-3 WERKTAGE, explicitly confirmed
  by the owner in the next voice answer. This is readiness, not delivery time.
- Wood products needing final sanding/oiling require at least one day of
  preparation/oil absorption. This is not carrier transit time or a promise
  that arbitrary made-to-order XXL production completes in three days.
- Care balm is stocked and fully packed, can ship once the label is prepared;
  next-day dispatch readiness was described as feasible. Do not promise same-day
  dispatch unconditionally or infer a purchase cut-off time.
- Owner subsequently confirmed engraving does NOT extend the preparation
  window: available engraved kitchen tools remain ready in 1-3 Werktage.
- Adding an optional juice groove (Saftrille) takes 3-5 WERKTAGE instead,
  explicitly confirmed by the owner, not calendar days.
  Apply this to additional groove machining, not automatically every board with
  an already-present groove.
- XXL made-to-order: owner prefers personal scheduling and stated Etsy's
  current handling estimate is approximately 5-6 weeks. His preferred wording
  was agreement after ordering, motivated by concern about deterring buyers.
  Retain the actual estimate; do NOT conceal known lead times or imply rapid
  dispatch. Delivery arrangements must be clear before a binding paid order.
  Proposed copy, not yet owner-approved: 'Individuelle Fertigung. Den Termin
  stimmen wir vor deiner verbindlichen Bestellung gemeinsam ab; aktuell bitte
  etwa 5-6 Wochen Fertigungszeit einplanen.' No immediate XXL paid checkout
  without a workable prior scheduling/delivery commitment. Keep production
  time distinct from carrier transit time.

LATEST XXL CONFIRMATION: the owner accepted the workflow 'agree dimensions and
timing first, then binding payment', and explicitly committed to faster website
production: approximately 3-4 weeks, versus the current Etsy 5-6 weeks. This is
an owner-approved operational distinction, not an arbitrary cosmetic reduction.
Prioritisation is included for direct website XXL orders, with no extra priority
processing fee. Do not change Etsy lead times or generalise the faster window
to every product. Confirm feasible timing during personal agreement before
payment; do not present an unconditional guaranteed arrival date. The trigger
for the 3-4 week production period is now explicitly confirmed: BOTH final
dimensions/specification approval AND receipt of payment must have occurred;
the later event starts the period. Carrier transit time is additional and
must be disclosed.
Proposed updated copy: 'Fuer dich gefertigt. Masse und Termin stimmen wir vor
deiner verbindlichen Bestellung persoenlich ab. Fertigungszeit fuer Website-
Auftraege: etwa 3-4 Wochen, zuzueglich Versandlaufzeit.'

The owner also requested an explicit express-shipping option/listing in the
cart and clarified: implement CARRIER EXPRESS DELIVERY only at this stage.
Do NOT add a paid priority-processing service; current order volume does not
warrant it. Priority production may be considered later as a separate service,
not included in current scope. Carrier eligibility, cut-off times, additional
cost and delivery commitments are not yet agreed.
Do not implement a separately purchasable express item that can be bought
without eligible goods or imply express bypasses oil-curing/production times.

The owner explicitly approved a different website shipping policy from Etsy:

- All website orders ship insured; choose the cheapest suitable regular DHL
  online PARCEL tariff based on packed dimensions, total packed weight and
  required coverage. Do not substitute an uninsured Paeckchen or postal letter.
- Germany: below EUR 150 goods value, charge the applicable suitable parcel
  tariff. From EUR 150 inclusive, charge the buyer zero shipping.
- The free-shipping threshold also applies to heavy boards, including the
  owner's 10 kg example. No heavy-board exception was approved. Shipping cost
  remains an internal business cost. The owner may account for it in product
  pricing; DO NOT automatically increase product prices.
- The earlier EUR 50 insurance threshold, free individual tool shipping and
  EUR 2.70/3.55 postal small-goods rules are superseded for the WEBSITE. They
  remain historical context / Etsy practices and must not drive website logic.
- EU insured rates and any EU free-shipping policy remain unconfirmed. The
  German free-shipping promise must not silently extend to other EU countries.
- No additional live checkout approval is implied; current code remains demo.

Official national DHL online tariffs checked on 28 October:
https://www.dhl.de/de/privatkunden/pakete-versenden/deutschlandweit-versenden/preise-national.html

| Weight incl. packaging | Maximum external dimensions | Base postage EUR |
| --- | --- | ---: |
| 2 kg | 60 x 30 x 15 cm | 6.19 |
| 5 kg | 120 x 60 x 60 cm | 7.69 |
| 10 kg | 120 x 60 x 60 cm | 10.49 |
| 20 kg | 120 x 60 x 60 cm | 18.99 |
| 31.5 kg | 120 x 60 x 60 cm | 23.99 |

Larger tiers also have maximum girth 300 cm (length + 2*width + 2*height).
Standard carrier liability is up to EUR 500, subject to terms, not unlimited
insurance. Higher values (especially XXL) require appropriate additional
coverage and possible oversize service, including checking eligibility, fees
and packaging. The reference board is 60 cm wide BEFORE packaging and cannot
automatically be treated as a standard 60 cm-wide parcel.

Remaining costs work: validate packed weights/dimensions and tariff/coverage
selection for each allowed combination; define EU insured tariffs and goods-value
treatment of engraving/discounts. The earlier exact EUR 50 question and the
choice of uninsured postal tiers are no longer open website decisions.

### Earlier discussion (historical, superseded where noted above)

- Shipping destinations: Germany and other EU countries. The current pilot is
  Germany-only; EU checkout expansion has NOT been implemented or approved for
  charging merely by recording this destination policy.
- Germany: dough scraper, spatula and butter knife individually ship free.
- Germany: care balm shipping costs EUR 2.70 by Deutsche Post Warensendung.
- Combined small goods (scraper, butter knife, balm): Germany shipping capped
  at EUR 2.70 when eligible for the corresponding postal format/weight.
- Including a spatula follows the same combined rule only if the fully packed
  shipment meets postal dimensions and weight. This is conditional, not a
  blanket flat price for unlimited quantities or arbitrary baskets.
- Shipping format depends on packed dimensions, tariff tier on total packed
  weight. Use actual listing facts; do not invent missing weights or packaging
  allowances. The owner described a carton approximately 35 x 20-25 x 5 cm;
  these are estimates, not verified external packed dimensions.
- Higher-value baskets should automatically use insured shipping, not merely
  recommend it. The owner discussed both 'over EUR 50' and 'from EUR 50'; exact
  treatment of EUR 50.00 needs confirmation. Above EUR 50 is definitely insured.
- From EUR 150 goods value, shipping within Germany is free to the buyer,
  including insured shipping. Free to buyer does not remove carrier cost or
  parcel insurance/size/weight constraints.
- Display a factual remaining-value hint for free German shipping, e.g.
  'Noch X Euro bis zum kostenlosen Versand ab 150 Euro'. Do not show it as an
  EU free-shipping promise.
- Parcels: DHL. Letters/Warensendung/Maxibrief: Deutsche Post.
- No negotiated business tariffs. Use regular public DHL online tariffs,
  current and validated for the relevant size/weight and insured service.
- Other EU countries: owner mentioned at least EUR 6.99. This is NOT a verified
  flat rate, insured tariff or all-country price table.
- Etsy stock updates remain manual as already agreed for the pilot.

## Postal facts checked during intake

Official Deutsche Post national tariff page:
https://www.deutschepost.de/de/b/briefe-in-deutschland.html

- Warensendung maximum external dimensions: 35.3 x 25 x 5 cm.
- Up to 1,000 g including packaging: EUR 2.70.
- Up to 2,000 g with weight surcharge: an additional EUR 0.85 (EUR 3.55 total).
- The owner did not approve automatically charging EUR 3.55 for every heavier
  small-goods basket. He requested product/format/weight-based treatment.
- Maximum dimensions do not prove a particular group of products fits. Verify
  actual cartons, protective padding and packing combinations.

Recheck carrier terms and prices at implementation/deployment. Do not use old
PDFs or assume international letters permit commercial goods.

## Consumer transport risk

The owner proposed a checkbox accepting personal liability for uninsured loss.
This was NOT adopted. In ordinary B2C shipping arranged by the seller, do not
claim that selecting uninsured shipping transfers transport risk to the buyer.
Official basis checked during intake: section 475(2) BGB:
https://www.gesetze-im-internet.de/bgb/__475.html

Service labels may accurately describe tracking/carrier coverage, but must not
misrepresent statutory buyer rights. Obtain legal review before live checkout.

## Still open before implementation/launch

The final website decision above supersedes items 1 and 3 below regarding the
EUR 50 threshold and uninsured shipping choices. Retain these notes for audit
history; do not ask the owner to decide those superseded questions again.

1. Exactly EUR 50.00: insured threshold inclusive or exclusive; whether the
   automatic rule is intended for all small-goods baskets or only combinations.
2. Applicable DHL insured online price tiers, coverage limits, packing sizes,
   packaging weights and validated product shipping weights. Large/high-value
   XXL boards may exceed standard parcel or coverage limits; check separately.
3. Policy for small goods exceeding 1 kg, oversized combinations, multiple
   packages, and optional insured shipping below the threshold.
4. Final EU tariff table, permitted destinations, carrier coverage, transit times
   and shipping restrictions. EUR 6.99 minimum alone is not sufficient.
5. Standard and engraved-tool readiness are now confirmed as 1-3 Werktage;
   additional juice-groove machining is confirmed as 3-5 Werktage,
   and website XXL production is now owner-confirmed at approximately 3-4 weeks
   (Etsy remains 5-6), with personal agreement before binding payment. Confirm
   the final delivery commitment workflow; the period starts after BOTH final
   specification approval and receipt of payment, as explicitly confirmed.
   Do not substitute carrier transit time for production/handling time or
   invent a delivery promise.
6. Whether engraving contributes to the free-shipping/insurance threshold,
   treatment of discounts, and precise wording of goods-value calculation.
7. Implement server-authoritative shipping selection, matching DE/EN messages,
   exact-cent boundary tests and order records; retain checkout approval gates
   until sandbox, operational and legal checks are complete.

No new shipping rule was applied to production by this document. No Stripe
transaction, customer-risk waiver, carrier purchase or Etsy write was performed.
