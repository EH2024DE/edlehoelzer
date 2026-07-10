# English SEO Expansion Report

Stand: 2026-07-10

## Existing English Pages

| URL | Status | Notes |
|---|---|---|
| `/en/` | exists | Optimized as international brand and ritual entry in previous PR; now links to Batch 1 pages. |
| `/en/products.html` | exists | Product/Ritualfinder and product overview; now links to custom, engraving and end grain pages. |
| `/en/cutting-board-juice-groove/` | exists | Optimized in this batch for BBQ, carving and juice groove intent. |
| `/en/wooden-dough-scraper/` | exists | Kept for later batch; already usable. |
| `/en/care.html` | exists | Kept for later batch. |
| `/en/cutting-board-oil-comparison/` | exists | Kept for later batch. |
| `/en/erbstueck/` | exists | Kept for later batch. |

## Proposed English Pages

| Priority | DE URL | EN URL | Action | Reason |
|---|---|---|---|---|
| Batch 1 | `/schneidebrett-nach-mass/` | `/en/custom-cutting-board/` | created | High conversion value for international custom inquiries. |
| Batch 1 | `/schneidebrett-mit-gravur/` | `/en/engraved-cutting-board/` | created | Gift, wedding, corporate and personalization intent. |
| Batch 1 | `/stirnholz-schneidebrett/` | `/en/end-grain-cutting-board/` | created | Strong English search intent around end grain boards. |
| Batch 1 | `/schneidebrett-saftrille/` | `/en/cutting-board-juice-groove/` | optimized | Existing EN page; improved title, description and use-case copy. |

## Implemented in this PR

| DE URL | EN URL | hreflang | canonical | sitemap | internal links |
|---|---|---|---|---|---|
| `/schneidebrett-nach-mass/` | `/en/custom-cutting-board/` | bidirectional | self-referencing | added | EN homepage, EN products, new EN pages |
| `/schneidebrett-mit-gravur/` | `/en/engraved-cutting-board/` | bidirectional | self-referencing | added | EN homepage, EN products, new EN pages |
| `/stirnholz-schneidebrett/` | `/en/end-grain-cutting-board/` | bidirectional | self-referencing | added | EN homepage, EN products, new EN pages |
| `/schneidebrett-saftrille/` | `/en/cutting-board-juice-groove/` | existing pair kept | self-referencing | already present | CTA and copy improved |

## Not Translated Intentionally

| DE URL | Reason |
|---|---|
| `/baumspende.html` | Regional trust/sustainability context; not Batch 1. |
| `/b2b.html` | Not translated until European B2B scope is operationally confirmed. |
| `/geschenk-fuer-maenner-holz/` | Avoid gendered 1:1 translation; prefer broader future `/en/wooden-kitchen-gifts/`. |
| `/geschenk-fuer-frauen-holz/` | Avoid gendered 1:1 translation; prefer broader future `/en/wooden-kitchen-gifts/`. |
| `/schneidebrett-eiche/`, `/schneidebrett-nussbaum/`, `/schneidebretter-massivholz/` | Batch 2 material pages. |

## Checks

Completed:

- `git diff --check` passed
- `npm run audit:indexability` passed: 49 HTML files, 44 self-canonical indexable pages, 44 sitemap URLs
- `npm run audit:assets` passed with one existing non-blocking warning for the hero video size
- `npm run audit:products` passed with existing non-critical product-data warnings
- manual asset existence check passed for the images used by Batch 1 pages

## Open Questions

- Which countries should be explicitly mentioned for shipping beyond what Etsy checkout shows?
- Should B2B become `/en/corporate-wooden-gifts/` later?
- Should Erbstück become a stronger English SEO page in Batch 2 or stay more brand-led?
- Should future English pages use `x-default` to the English variant consistently or follow the existing German-default pattern?
