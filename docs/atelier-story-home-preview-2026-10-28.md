# Atelier: Erbstueck story and homepage preview

Isolated DE/EN design preview. Production homepage, production Erbstueck page,
sitemap and live checkout are unchanged.

## Routes

- `/atelier-vorschau/start/` and `/en/atelier-preview/start/`
- `/atelier-vorschau/erbstueck/` and `/en/atelier-preview/erbstueck/`

## Decisions

- Restore the established oak/tree/beam story, personal beech-line meaning,
  sold examples, matching holder, care kit, local provenance and passing on.
- Minimum one side 30 cm, thickness 4 cm, not an unconditional restoration promise.
- Restore 19 bilingual craft steps. Grip recess precedes edge chamfer, then belt,
  machine and final hand sanding after dampening and drying.
- Owner approved deterministic technical crops. Seventeen separate 591px-square
  WebP exports remove Blackmagic interface areas. Originals remain unchanged.
  Rebuild with `node scripts/crop-craft-images.mjs`.
- Play is opt-in, 3000ms per image. Swiping, tapping and manual navigation do not
  pause playback; navigation restarts the timer. Pause/play alone changes state.
  Background and offscreen playback is suspended.
- Product main images fill square frames; image enlargement remains uncropped.
- Worktop visualization has a clear benefit statement and prominent action.
  It is visual orientation, not an exact dimensional or colour guarantee.
- Homepage uses four manually selectable themes, with keyboard and swipe support.
  No automatic hero text changes. Historical hero board is labelled sold.
- Existing shared cart, prices, stock, options and demo checkout are retained.

Rebuild HTML with `node scripts/build-atelier-preview.mjs`.
The external preview depends on the local Mac and tunnel remaining online.

## Verification

- 157 JavaScript and 32 Python regression tests passed.
- DE/EN collection, detail and homepage checked at 375, 430, 768, 1024 and
  1440 pixels: no document overflow; gallery/cart interactions retained.
- All 19 craft images load. Three-second playback, tap without pause, swipe
  without pause, explicit pause and keyboard/theme controls checked in Chromium.
- Crop contact sheet inspected: no Blackmagic interface remains.
- Indexability audit: 166 HTML files, 145 indexed canonical pages and 145
  sitemap URLs. All six design-preview routes remain noindex.
- External homepage route returned HTTP 200 through the existing tunnel.

## Follow-up: simpler homepage navigation

- Four hero themes: Erbstueck, collection, made to measure, corporate gifts.
  Resurfacing and its workshop photograph removed from the homepage.
- Theme labels have quiet segment indicators; previous/next controls and swipe
  remain manual, with a brief fade respecting reduced-motion preferences.
- Mobile hamburger restored across the six design-preview pages. Native dialog
  supplies modal focus handling and Escape; closing returns focus to the toggle.
- Care and hospitality remain secondary menu destinations, not additional slides.
