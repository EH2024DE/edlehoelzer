# Handled board price synchronization

Verified in the visible Etsy storefront on 2026-10-16 (EUR, Germany; shipping extra):

| Listing / wood | No juice groove | With juice groove |
|---|---:|---:|
| 4451487112, standalone tropical hardwood | 274.99 | 289.99 |
| 4417507555, tropical hardwood | 274.99 | 289.99 |
| 4417507555, beech | 264.99 | 279.99 |
| 4417507555, oak | 284.99 | 299.99 |

Sources: https://www.etsy.com/de/listing/4451487112/ and https://www.etsy.com/de/listing/4417507555/ . Tropical selected in the combined listing to confirm its dependent groove options. No cart or checkout actions performed.

The combined catalog entry now represents all three woods. Its starting price belongs to beech, not oak. The product detail selector recalculates wood-specific prices and the existing 15 EUR groove option; oak retains made-to-order timing. The preview launcher passes the selected wood through and the preview picker displays the matching wood price rather than the parent listing minimum on every model.

The original sold oak specifications remain under referenceProduct for the existing factual Hackblock reference and its regression test. They are not the dimensions or weight of all three current variants. No SEO page or its published reference block changed. Catalog roles and Finder scoring code are unchanged; the newly available woods and real minimum price are updated product data.

This supersedes the catalog/pricing scope limitation in docs/handled-board-variants.md. No prices on Etsy were edited. No other products were synchronized.

## Regression notes

The original release check froze products.json against origin/main. That historical release constraint is removed from the protected SEO-file list because this follow-up explicitly authorizes catalog updates. The Hackblock test now checks the retained original reference data, not the current multi-wood listing. Canonicals, robots, sitemap, llms and protected page checks remain intact.

21 Node tests (17 Finder + 4 price tests) and 25 Python tests pass. Browser checks verify all six combined-listing base/groove totals, tropical preview handoff, both listing cards, English labels and mobile/desktop layout. Final prices and checkout options remain confirmed on Etsy; no checkout was performed.
