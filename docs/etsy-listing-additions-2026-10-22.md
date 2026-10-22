# Etsy listing additions, 22 October 2026

Source: current public Etsy listing API and the visible, signed-in Etsy listing pages. Existing products were not overwritten or globally repriced; the original walnut listing has one verified price correction described below.

| Listing | Website base price | Photos | Verified options |
| --- | --- | --- | --- |
| [4599650982](https://www.etsy.com/de/listing/4599650982/kleines-stirnholz-schneidebrett) | from EUR 39.99 | 13 | Oak/walnut/beech EUR 39.99; oak/walnut/maple EUR 49.99; oak/plum, walnut/spalted beech, oak/walnut/beech design 2 EUR 59.99 each |
| [4598989614](https://www.etsy.com/de/listing/4598989614/stirnholz-schneidebrett-eiche-erbstuck) | from EUR 284.99 | 16 | Without groove EUR 284.99; with groove EUR 299.99; stand and balm included |

Compact-board variant photo ranks, in the price-order above: 4, 13, 1, 7, 10. Etsy's visible variant/photo labels establish this mapping. Length and width are not specified per design, so none are invented. Approximate thickness is 2 cm according to the listing description. Finder classification is compact individual prep/breakfast, not a large hosting platter; no measured weight is claimed.

Erbstueck dimensions and weight from the listing: approx. 41.5 x 39.8 x 5 cm, 5.8 kg. These are listing data, not newly measured values.

Inventory API access was unavailable because the saved OAuth token was invalid. The public API still supplied current base prices, descriptions, stock and photos. Variant prices were independently read from the visible Etsy selection menus; no login refresh was necessary.

Additional personalisation and final checkout remain on Etsy. No unverified engraving surcharge is calculated for these new listings. Existing listing availability and matching rules remain unchanged; the two new boards enter the existing finder through their product profiles. The full photo gallery is available in product details while the lightweight card carousel remains bounded.

## Owner-requested duplicate correction

A repeated Etsy read on 22 October confirms listing `4598938055` now has `state: inactive`. It was a copy of the original walnut board, so it is removed completely from the website catalog, not shown as sold inspiration. The original listing `1850610674` remains `state: active`, with current Etsy price EUR 279.99. Its website price is corrected from EUR 259.99 to EUR 279.99; its existing product identity, photos, video and finder profile are retained.

The shop active-listings endpoint still returned the inactive item during this transition. Its explicit `state` field, not mere presence in that response, was used to confirm deactivation. No other availability changes were applied. Final additions: two listings, 29 photos; one existing price correction.
