# Page summaries

The 43 routes and approved summary texts are listed in `page-summaries.json`.
The summaries are rendered directly in each HTML page, never injected by JavaScript.

- German heading: Auf einen Blick. English heading: At a glance.
- Replaces the long hero introduction; existing product sections follow the early CTA.
- Three columns where the content area is wide enough, stacked on narrow layouts.
- Homepage, product selector, legal, redirect and functional pages are excluded.
- Custom work can start at a few hundred euros. The 75 x 60 cm XXL board from
  EUR 1,199 is explicitly a high-end example, not the minimum custom-work price.
- The matching Etsy description was corrected from 75 x 65 to 75 x 60 cm on
  2026-09-10, after confirmation by the owner. Catalog and visualizer were already correct.
- URLs and canonicals are unchanged. Sitemap modification dates cover changed pages only.
- `summary_cta_click` uses the existing consent-gated EdleAnalytics API.
  It records a static destination/label, never an email body or personal inquiry data.
  A click indicates intent, not a completed purchase or submitted inquiry.

Validation: `node scripts/check-page-summaries.mjs`,
`node scripts/check-indexability.mjs`, `node scripts/audit-assets.js`.
Desktop and mobile browser checks additionally cover all 43 pages at 1440, 390
and 320 pixels, summary visibility and CTA/anchor placement.
