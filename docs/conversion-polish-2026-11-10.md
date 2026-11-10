# Bounded conversion polish

No palette redesign, hero reviews, artificial scarcity, generic delivery promise
or hospitality/PE-500 changes. No shop, price, checkout or deployment activation.

Final owner decision, 2026-11-11: the experimental USP/trust strip below the hero
has been removed from both homepages, including its CSS. Existing customer
reviews and the product purchase note remain. The main hero title is 28px mobile / 44px desktop,
with its closing promise smaller at 20px / 28px, on a separate line and 12px gap;
the original H1 wording remains unchanged. No hero review counts
or ratings. The review section has 48px top padding after the dark Erbstueck
feature; it is exempt from the same-background section-spacing reduction.
Browser checks assert the trust strip is absent and retain title hierarchy,
overflow and review-clearance checks.

## Changes

1. Existing mobile purchase-bar behavior retained and explicitly tested: hidden
   initially and while the main buy link is visible, shown only after that link
   has scrolled above the viewport, hidden again on returning. Desktop unchanged.
   The worktop-preview action is outlined. A compact personal-service / eligible
   Etsy Purchase Protection note sits directly below the main purchase area.
   Policy link: https://www.etsy.com/legal/buyers/ (checked 2026-11-10).
   This is not a guarantee that every order or dispute is covered.
2. Closing-section primary buttons use white with dark mocha text on the dark
   background. Existing secondary buttons remain outlined.
3. The repeated review eyebrow is hidden in the generated homepage (source text
   retained for the content-preservation contract). Review dates use German or
   British formatting; machine-readable time attributes retain ISO dates.
   Standalone navigation/action links have 44px minimum height, not inline prose
   links. Original review wording, author names and ratings are unchanged.
4. Homepage material/service proof rows have reduced padding and gaps in both
   languages. No arguments or copy were removed.
5. Defined one canonical purchase event for the new design, with placement rather
   than counting separate preview/sticky events as additional purchases. Product
   cards that JavaScript replaces after initial static rendering are covered too.

## Measurement

All manual events still pass through the existing consent-aware EdleAnalytics
adapter. No analytics service, tracking ID, consent default or cookie is changed.
Browser checks intercept events locally and do not send measurement data.

| Event | Meaning | Useful properties |
| --- | --- | --- |
| homepage_hero_click | One hero-action click | page, action: finder/collection |
| homepage_product_open | One homepage product-image/button click | page, product_id |
| etsy_checkout_click | One outbound Etsy purchase action | page, placement: main/sticky/other |

Do not sum legacy `product_preview_etsy_click` or `product_sticky_etsy_click` with
the new canonical purchase metric. Policy-information clicks are excluded.
The existing `product_finder_start` metric measures a separate funnel milestone,
not another hero click. No claim is made to measure completed Etsy purchases.

Observe at least 14 days after deployment. Compare by language and device, using
homepage visits as the denominator for hero/card click rates, product visits for
outbound purchase clicks. Separate main/sticky placements; do not interpret their
sum as paid orders. Consent exclusions mean these are not all visitors. Small
sample sizes, campaign changes and seasonality can prevent reliable conclusions.
There is no invented retrospective baseline or guaranteed conversion uplift.

## Checks

- 57 design regressions and ten release tests.
- Focused browser coverage: DE/EN homepage and current square 3D product, at
  320/375/430/1440px in Chromium and WebKit. Tests cover sticky transitions, outline
  appearance, closing-button fill, touch height, localized dates, no overflow,
  trust-note placement and exactly-once local purchase-event recording.
- Screenshots: `/tmp/edle-conversion-polish-chromium/` and
  `/tmp/edle-conversion-polish-webkit/`.
- Indexability: 252 HTML sources, 167 self-canonical sitemap pages.
- Built internal-link check: no missing destinations or fragments.
- No claim of physical iPhone testing or live Umami dashboard verification.
