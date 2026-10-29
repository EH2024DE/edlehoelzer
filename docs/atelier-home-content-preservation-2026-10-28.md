# Homepage: preserve content, modernise presentation

This revision supersedes the four-slide hero experiment. It affects only the
isolated DE/EN previews; public pages, payments and sitemap stay unchanged.

## Design approach

The established homepage remains the content source. Keep its product discovery,
kitchen preview, material/craft/lasting-value proof, Erbstueck story, reviews,
workshop people and board finder. Avoid inventing a new brand biography or replacing
the existing story with generic luxury copy. Apply this principle to later pages.

One primary video hero uses the original workshop film, original category-led H1
and one short supporting sentence. Video loads only on explicit play; there is no
autoplay, audio or competing full-height carousel. Four square topic links follow:
Erbstueck, collection, made to measure, corporate gifts. Mobile uses native swipe
scrolling with a visible hint of the following item. The historical photograph is
a series image, not an offer; sold inventory remains marked in the catalogue.

Kitchen visualization uses the original kitchen/A4 example, displayed at a
restrained size without square cropping or enlargement that hides the reference.

## Reviews

Use existing DE/EN review files, not invented testimonials. The stored aggregate
is 5.0/5 from 39 Etsy reviews, dated 2026-10-08, explicitly shown as a snapshot.
No live freshness is claimed. EN excerpts from German reviews are labelled translated.
The section is titled customer voices, with a discreet Etsy source/link. A nearby
disclosure states manual reproduction and no additional independent purchase/use
verification. Section 5b(3) UWG requires information about whether/how authenticity
is checked, not the word Etsy in every heading:
https://www.gesetze-im-internet.de/uwg_2004/__5b.html

## Verification

Actual play/pause, no initial media download, four topic links, mobile menu,
two review excerpts, disclosure, kitchen image and no horizontal document overflow
checked in Chromium in DE/EN at 375, 430, 768, 1024 and 1440px. Screenshots inspected.
Video route supports bounded single byte ranges and keeps the explicit allowlist.

## Owner refinement: imagery and price selection

- Corporate-gift topic uses the already approved, proportion-adjusted illustrative
  set image `geschenkset-erster-entwurf-1200.jpg`, not the old giftbox photo.
- Homepage-only selection, in order: oak double-handle serving board 99.99 EUR,
  oak 3D board 459.99 EUR, oak end-grain XXL with groove 210.99 EUR, custom XXL
  from 1199 EUR. No catalogue prices or availability were changed.
- Custom XXL uses `custom-projects/eiche-xxl-dark.jpg`. The caption distinguishes
  the family starting price from the shown oak version at 1399 EUR, sourced from
  the existing wood-price rules. The separate made-to-measure topic retains its
  different photograph for variety.
- Native mobile carousels gain a 10px text inset and more space below images.
- Static selection tests and DE/EN browser checks at five widths passed, including
  all four images, prices, ordering, gift image, native scroll, text inset and no
  document overflow. Existing video/menu/review/kitchen checks also passed.

## Latest selection and review rail

Supersedes the preceding price selection: oak long-grain compact board 65.99 EUR,
walnut end-grain with juice groove 279.99 EUR, oak 3D board 459.99 EUR, custom XXL
from 1199 EUR (pictured oak 1399 EUR). Walnut includes stand, care balm and guide
according to existing package data. Those inclusions are also visible on its card.
No artificial price adjustment to fit the earlier 200-250 EUR target was made.

Oak long-grain uses gallery view 4; 3D uses gallery view 1, both visually inspected
against the actual listing photos. The 3D image is the standing studio board, not
the person/branding photograph. Walnut uses its existing standing studio view.

The review area now presents all approved featured records in a compact native
horizontal rail. Continuous slow movement is opt-out, pauses on mouse hover or
keyboard focus, and stops until explicitly restarted after touch, wheel or arrows.
Reduced motion disables automatic movement. Background/offscreen animation stops.
No duplicate review records are generated for looping: offscreen nodes rotate.
Every excerpt opens its complete text in a modal; Escape closes and restores focus.
Existing Etsy source, snapshot date, aggregate and verification disclosure remain.
