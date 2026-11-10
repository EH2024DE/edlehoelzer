# Release, language and mobile audit

Date: 10 November 2026. New work is based on main 7171426, on a separate branch.
No shop, payment, price, shipping or DNS configuration was changed.

## 1. Public release verification

- All 149 URLs in the published sitemap returned HTTP 200, with matching
  self-canonicals and no unexpected noindex.
- All 72 previous product URLs have an accessible HTML redirect and canonical
  pointing to the new product address. The redirect script preserves queries
  and fragments. These are not HTTP 301 responses; the hosting limitation remains.
- Both published homepages contain Sandra's review and the current square
  3D-board link. The English homepage no longer uses the German greeting.
- Evidence: `live-release-audit-2026-11-10.json`. Re-run with
  `node scripts/audit-live-release.mjs`; it only reads public pages.
- No new, unpublished English URL has been submitted to Search Console.

## 2. English destinations

Eight previously missing editorial/service destinations have been added:

- `/en/custom-cutting-board/`
- `/en/wooden-spatula/`
- `/en/engraved-cutting-board/`
- `/en/wooden-kitchen-accessories/`
- `/en/walnut-cutting-board/`
- `/en/barbecue-gifts/`
- `/en/wooden-gifts/`
- `/en/press/`

These are concise English editorial equivalents, not word-for-word translations
or identical section trees. The German long-form content is retained. Existing
English pages also retain their editorial structures; matching class names is
not presented as proof of translated content parity.

The new pages share typography, containers, buttons, FAQ enhancement, native
disclosures and workshop photography with the rest of the built site. They have
reciprocal language metadata, self-canonicals, sitemap entries and incoming
links from the English navigation/topic overview. Product cards only use
available or made-to-order entries from the existing public catalogue.

The English custom enquiry uses the existing Formspree endpoint and the shared
submission handler. Testing intercepts the POST locally: no test enquiry is
sent to the actual business inbox. No live ordering function is introduced.

Germany-only services are not expanded internationally. The existing English
hospitality page only receives links to new English destinations, not new offers.
The donation page remains German only.

Generation: `node scripts/build-english-editorial-pages.mjs`, then
`node scripts/link-english-editorial-pages.mjs`. Data and copy live in
`data/english-editorial-pages.json`. This does not translate arbitrary new German
copy automatically. Review editorial changes before regenerating.

## 3. Density and navigation

- Service/B2B spacing uses 80 px desktop and 48 px mobile, with adjacent sections
  sharing space rather than accumulating two full paddings.
- The first section after an editorial hero keeps breathing room at the divider.
- Gastro's secondary project summary and the corporate-gift benefits are
  progressively disclosed. All original text remains in HTML.
- Prices, concept-fee terms, required budget/budget basis/quantity fields and
  contact fields are not hidden by this refinement.
- The desktop hamburger is restored alongside the direct navigation. The menu
  can be opened and closed; header controls are tested for overlap.
- The long service pages remain long in absolute terms. This is not a claim
  that all content can now be read within a few mobile screens.

## 4. Mobile and consent

- Chromium and WebKit: 19 routes at 320, 390 and 1440 px, 57 renderings each.
- An additional 19 Chromium renderings check the desktop navigation at its
  exact 1200 px breakpoint: 133 browser renderings in total.
- Tested: first-visit banner, settings and close control, necessary-only choice,
  hero CTA clearance, keyboard disclosure toggling, header/menu, page overflow,
  English hero images, mandatory business budget fields and mocked enquiry.
- Highest measured banner: 149.2 px mobile, 70 px desktop. Banner buttons and
  settings-close control retain at least 44 px targets.
- Reduced-motion mode is included. Existing non-JavaScript product and review
  fallbacks remain covered by the homepage tests; editorial details are native
  HTML and their full content is present without JavaScript.
- This does not replace a real iPhone/Safari, Android or mobile-network check.
  No physical-device access or real network-performance result is claimed.

## Verification

- `npm run test:design-system`: 57 passing.
- `npm run test:audit-release`: 6 passing.
- Finder/gastronomy tests: 30 passing.
- Generated design: 160 pages, 157 indexable, no typography findings.
- Internal destination/fragment audit: no missing targets or fragments.
- Indexability: 242 source HTML files, 157 self-canonical sitemap pages.
- Page-summary regression: 45 passing.
- Local screenshots: `/tmp/edle-release-language-chromium/` and
  `/tmp/edle-release-language-webkit/`.

## Remaining release gates

1. Review/merge this branch and verify the eight new English URLs after deployment.
2. Re-submit the published XML sitemap after deployment, not this local preview.
3. Activate genuine server-side redirects only with an appropriate hosting change
   and approval. Do not remove the working HTML fallbacks first.
4. Final real-device and mobile-network acceptance by the owner.
5. A future editorial parity pass may expand English articles; no claim is made
   that every German paragraph has been translated one-to-one in this round.

## Full sitemap follow-up

The initial selected-page check did not establish whole-site language coverage.
The follow-up checks all 84 indexable German sitemap pages: 82 have reciprocal
English destinations. The only exclusions are the German donation programme and
the Germany-only hospitality offering. An existing English hospitality page is
retained, without expanding that offering.

The custom-board page already existed in this branch, but its German source
lacked a reliable visible English switch. Header and menu switches now point to
the corresponding page rather than an English homepage. English body links and
footer links use their English destination where available.

There are now 18 generated English editorial destinations: the previous eight,
seven further editorial pages, legal notice, privacy notice and a topic index.
The legal notices translate the existing German source; this is not a legal
adequacy review. Editorial equivalents are concise, not paragraph-for-paragraph
translations of the longer German articles.

Follow-up verification:

- Full coverage: `docs/language-coverage-2026-11-10.json`, no issues.
- Design regression: 57 passing; release checks: seven passing.
- Build: 170 pages, 167 indexable; no typography findings.
- Internal links: no missing destinations or fragments.
- Indexability: 252 HTML files, 167 self-canonical sitemap pages.
- Browser checks cover 46 routes at 320, 390 and 1440 pixels, including the
  German-to-English custom-board switch and its return link.
- Chromium and WebKit each passed all 138 renders (276 total).

These changes belong to PR 211 and the temporary preview. They are not claimed
to be published to the production domain before merge and deployment.
