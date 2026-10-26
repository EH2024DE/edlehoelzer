# Product pages

Each independent catalog record owns a stable `productPath`. Do not regenerate paths when changing Etsy titles. German pages live below `/produkte/`; English counterparts use the same stable path below `/en/`. Product data remains in `products.json`; regenerate the committed static HTML and sitemap with:

```sh
node scripts/build-product-pages.cjs
```

The generator shares the existing site header/footer and English copy dictionary. Static product information, a product photo, product links, availability and checkout/request links work before JavaScript. The interactive page reuses the existing detail renderer for gallery/video, pricing, engraving/groove options, WhatsApp and worktop preview, without opening a product modal. Image zoom and the comparison dialog remain overlays.

Gallery order is primary/selected-variant photo, product videos, then remaining photos. Video is always second when a video and a photo exist, including explicit media arrays and variant photos. Product-specific alt text replaces generic accessory labels; supplied image descriptions remain supported. Introductory copy distinguishes coasters, stands, care, kitchen tools, serving boards and cutting-board construction. End-grain mentions in accessory descriptions must not imply cutting-board use.

## Etsy Check, 2026-10-26

The read-only active-listing snapshot contained 40 listings, all mapped to the catalog. Twenty-four current titles differed and were adopted as German page titles. Short card labels and archived/sold baseline data were preserved. The combined handled board starts at EUR 254.99 (beech), EUR 274.99 (tropical hardwood), EUR 284.99 (oak); optional groove adds EUR 15. The visible Etsy selectors confirmed these prices. Coasters start at EUR 39.99. No Etsy listings were modified. The local API snapshot and credentials must not be committed.

Listing 4451487112 remains in the catalog only as a backwards-compatible alias of 4417507555, preselecting `tropical`. It has no duplicate website page/card/finder result. Old comparison IDs migrate to the combined product. Existing worktop model IDs remain unchanged.

Comparison retains two product families, persisted across pages through the existing localStorage key. A family with wood variants displays its range and starting price in comparison, not a fixed selected-option quote. It does not compare two wood variants of the same family as separate products. The independent 3D worktop comparison continues to distinguish model variants.

Variant URLs use `?variante=...`, with the family URL as canonical. Static structured data uses ProductGroup/hasVariant for selectable variants, and Product for standalone pieces. Sold pieces retain details but have no purchase offer or InStock markup. See Google's product-variant documentation: https://developers.google.com/search/docs/appearance/structured-data/product-variants

## Verification

- `node --test tests/*.test.cjs`
- `node scripts/check-indexability.mjs`
- `node tests/product-pages-browser.cjs` with the local preview and Playwright runtime configured
- `node tests/gastronomie-browser.cjs` for the landing-page regression

The browser test checks all static pages, DE/EN responsive layouts at 375/430/768/1024/1440 px, pricing, dimensions, worktop variant context, card navigation and persisted comparison. Real iOS Safari and Google rich-result eligibility are not certified by these checks. Publication is through PR review, not a direct main-branch push.
