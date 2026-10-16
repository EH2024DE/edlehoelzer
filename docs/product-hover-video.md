# Product-card hover videos

Desktop mouse hover starts the first existing product video after 300 ms.
The shared delegated controller covers main.js cards and landing-page grids,
including cards rendered later. Products without videos keep their photos.

Videos are muted, looping, inline and decorative. No video element or media
request is created before a deliberate hover. Only one hover video can exist.
Leaving the image, scrolling, clicking, hiding the tab or losing window focus
stops playback, removes the source and restores the photo. Playback/load errors
also restore the photo. Product links, detail overlays and analytics are unchanged.

Touch pointers, coarse-pointer devices, reduced-motion preferences and the
browser's Save-Data signal disable hover playback. Viewport width alone does not
determine pointer support. No new videos or libraries are added.

Validation:
- 25 Node regression tests pass (Finder, prices and four hover lifecycle tests).
- Actual muted playback and photo restoration verified in the desktop browser.
- Main product cards and homepage landing cards both verified playing.
- Product detail opening and EN product cards checked; no console errors observed.
- No horizontal overflow at 375, 430, 768, 1024 or 1440 CSS pixels.
- Touch/reduced-motion/Save-Data paths verified with controller unit tests;
  physical iPhone Safari testing remains an owner check.
- JavaScript syntax and git diff --check pass.

Existing videos can be several MB. Lazy hover loading avoids a bulk initial
download, but a deliberately played video still uses bandwidth. Save-Data is
respected where the browser exposes it.

## Additional Etsy videos, 2026-10-16

The new wood-change turnaround clips were initially first in the video arrays for listings
4549962555 (butter knife) and 4471048251 (dough scraper). The previous videos
remain available as second clips in product details. Existing product posters
are reused. Prices and other product fields are unchanged.

Verified public Etsy media sources:
- Butter knife: https://v.etsystatic.com/c/video/upload/ac_none,du_15,q_auto:good/gkq84cx3jd9kbdamzrv8.mp4
- Dough scraper: https://v.etsystatic.com/c/video/upload/ac_none,du_15,q_auto:good/kelrd4kjstmnwheeowt9.mp4

The owner subsequently requested the local originals instead. Their optimized
versions now replace the Etsy turnaround downloads as the first clips; the old
application videos remain second. New posters were generated from the originals.

Local source originals confirmed in the owner's content inbox:
`/Users/serkankoc/Documents/edle-hoelzer-internal-content/ingest/camera/`
(`Buttermesser_Turnaround.mov`, `Teigschaber_Turnaround.mov`). The website uses
optimized local encodes (about 2.3 MB / 5.5 MB), not the 42 MB / 69 MB originals.
Further originals can be placed in that inbox with a product name or listing ID;
catalog integration remains an explicit follow-up, not an automatic folder watch.

## Handled boards

Owner originals `Tropenholz_mit_Griff.mp4` and
`Eiche_Hackblock_mit_Griff.mov` were encoded as silent H.264 MP4 at 1280px width,
CRF 25, with faststart (about 4.3 MB and 4.9 MB instead of 92/93 MB).
Local posters were extracted at one second. The tropical listing uses its own
clip. The combined three-wood listing offers both clips, oak first to match the
existing oak card photo. Videos are product gallery media, not a wood selector:
selecting another purchase wood does not automatically switch the video.
