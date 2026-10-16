# Product-card media and analytics

## Import, 2026-10-16

`scripts/import-card-videos.json` is the explicit mapping manifest for 18 newly
imported clips. `scripts/import-card-videos.cjs` converts originals from the
owner's camera inbox, creates a local poster, and adds media to the catalog.
Run it with the inbox directory and an installed ffmpeg binary as arguments.
No camera folder watcher or automatic guessed matching is installed.

| Source | Listing |
| --- | --- |
| Buche_mit_Griff.mp4 | 4417507555, additional beech clip |
| 3D_Rechteck_5wood.mp4 | 1803930088 |
| Thermomabus_Fruehstuecksbrett.mp4 | 1827805914 |
| Eiche_Buche_Esche.mp4 | 4297451235 |
| Eiche_Wenge_Schachbrett.mp4 | 4299097497 |
| Stockbuche_Stirnholz_Schachbrett.MOV | 1783359006 |
| Nussbaum_Eicherahmen.mp4 | 4297472161 |
| Tapas_Eiche_gebuerstet_Doppelgriff.mp4 | 4398179153 |
| Eiche_Rechteck_klein_hamornisch.mp4 | 4358136560, owner confirmed |
| Eiche_Padouk_Schachbrett.mp4 | sold large Padouk/Eiche reference, owner confirmed |
| XXL_Brett_nach_Maß.mp4 | 4484195050 |
| Eiche_Kambala_Quadrat.mov | 4380304814 |
| Nussbaum_Wenge_Ahorn_Buche.mp4 | 1894223313, owner confirmed despite naming difference |
| Buttermesser_Turnaround.mov | 4549962555, replaces initially downloaded Etsy turnaround |
| Teigschaber_Turnaround.mov | 4471048251, replaces initially downloaded Etsy turnaround |
| hdkpeaijcmtirsgoqjyp.mp4, verified Etsy video | 4440690649 |
| file_ywncbf.mp4, verified Etsy video | 1783351692 |
| file_qr2zt8.mp4, verified Etsy video | 1848021568 |

The eight initial mappings were visually checked in a poster contact sheet.
The two ambiguous size variants were not imported until the owner confirmed them.
Sold references remain sold: no availability, pricing or finder fields changed.

H.264, silent, faststart MP4: normally 1280px width, CRF 25. The longer XXL clip
uses 960px and CRF 28. Originals remain untouched. Sizes are substantially reduced;
most clips are approximately 3-6 MB. Preview posters are 800px wide.

The three Etsy downloads are read from the user's Downloads folder. Their exact
public source URLs are recorded in the manifest; download through the visible
listing before reproducing an import when the original is not present locally.

## Remaining gaps, owner confirmed no video found

Do not guess files for these two boards:
- 1824089235: Eiche XXL mit Saftrille
- 4370769708: Erbstück No. 004

Other old or generically numbered camera files were not bulk-imported.

## Mobile gallery

At max-width 768px or on no-hover devices, a card's clickable image is replaced
by an in-card scroll-snap gallery. The separate primary CTA still opens details.
Up to five distinct images and three videos are shown: primary photo, videos,
remaining photos. Etsy full-size URLs use the existing 794px card-image format.
Videos have native controls, inline playback and preload=none. No autoplay.
The final owner-approved presentation is a full-bleed square crop (object-fit:
cover), consistently for photos and videos, including desktop hover media.
Aspect ratios are preserved: media is cropped, not stretched. Individual crops
may need later owner review; no per-photo focal-point adjustments are claimed.
Scrolling away, changing slides, hiding the page or starting another gallery
video pauses playback. Photos use lazy loading. No new libraries are needed.

Only small position dots appear below the media, with the active dot emphasized.
There are no visible arrows or numeric counters. An offscreen aria-live status
retains position information for screen readers. Arrow keys work on the scroll
area, and reduced motion disables animated keyboard navigation. Desktop layout is restored at breakpoint
changes, with the existing desktop hover behavior retained.

## Analytics

Existing `product_preview_open` remains one event per successful product opening.
It now includes `entry_point=card_cta` or `product_image_or_other`.
New `product_card_cta_click` identifies the actual primary card button action.
Both use the existing consent-gated EdleAnalytics integration, not another SDK.
Payload: product_id, listing_id, product_name, product_category, wood, source;
preview openings additionally include entry_point. The consent sanitizer allows
the three new attribution fields; arbitrary fields remain blocked.

Do not add counts from the two events: a CTA opening intentionally produces one
CTA event and one preview-open event. For button interest use only
`product_card_cta_click`; for all product openings use `product_preview_open`.
Consent rejection/ad blockers mean counts are not all visitors and are not unique
people. Click interest alone is not proof of purchase intent or wood preference.

GA4 custom dimensions for product_name/listing_id/wood/entry_point, if not already
configured, must be registered in the property to use them in explorations.
No GA4 administration or historical data backfill was performed here.

## Validation

32 Node tests: matching, prices, hover lifecycle, gallery media construction,
local media paths, catalog invariants and analytics sanitization.
Browser: DE/EN mobile gallery navigation without opening details; manual inline
video start; desktop hover after returning from mobile; no console errors.
No page overflow around 375/430/768/1024/1440 CSS px (browser zoom introduced
fractional viewport rounding). Physical iPhone Safari touch testing remains an
owner check. This is a local preview, not a deployment.
