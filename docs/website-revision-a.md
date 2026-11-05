# Website revision A

## Scope

Base: main at cf95715. This package corrects verified availability and purchase communication, the restaurant hero, compact consent UI and floating controls. It does not change Stripe, checkout, payment methods, prices, shipping charges or DNS. No production publication is part of this branch.

## Changes

- Larch compact board: made to order, no timber currently in stock, sourcing and production timing agreed individually. German and English fallback pages expose PreOrder rather than InStock.
- Available products with an explicit stock of zero are excluded from available-product selection. Confirmed made-to-order products remain eligible and are labelled accordingly.
- Product purchase information: one price, then options, then Etsy action. Removed the design observer's duplicated price and premature action placement. The price still updates when options change.
- Etsy handoff explicitly states that local selections are a price preview, not transferred to Etsy. Final options are selected in the Etsy listing.
- Restaurant hero: text on a light surface, separate product photograph, stacked on mobile. No overlay contrast dependency.
- Compact consent banner with equally accessible accept/reject actions. Full settings remain accessible; no fixed height or clipped content. At narrow widths settings use a separate row.
- Back-to-top is an opaque 44-pixel icon, appears after 1.5 viewport heights, avoids overlapping purchase controls, respects reduced motion and hides during consent, configuration and service comparison.
- Search and menu-close touch targets are at least 44 pixels.

## Verification

- Built design: 148 HTML pages, 145 indexable sitemap routes.
- Typography audit: no findings. Internal link audit: no missing targets or fragments.
- Indexability and page-summary checks pass.
- Asset audit: no critical errors; 25 existing non-blocking warnings (metadata, unused references, review-image size and preview-image attributes). Not silently counted as resolved.
- Browser regression: German and English consent and restaurant hero at 320, 390 and 1440 pixels; single-price ordering and option price updates on a board; larch availability message on its product page; no captured JavaScript errors.
- Banner heights: 320 px: 176.8 px; 390 px: German 144.4 px, English 136.8 px; 1440 px: 70 px. Hero headline and action remain visible on the 390 x 844 first visit.
- Screenshots and metrics: /tmp/edle-revision-a-screenshots. Reproduce using tests/revision-a-browser.cjs with DESIGN_BUILD, PLAYWRIGHT_MODULE and CHROMIUM_PATH.

## Not claimed as complete

This is not a whole-site conversion redesign. The next package should handle homepage trust, static product fallback, English homepage structure, section rhythm and careful palette decisions. Real-time inventory counts require a reliable inventory source; stale catalogue counts must not become artificial scarcity. Portraits are awaiting the planned photo session. B2B copy and business-scope changes require owner decisions. External Etsy photograph delivery is not certified by these UI tests. No real iPhone/Safari measurement, legal certification or production performance guarantee is claimed here.
