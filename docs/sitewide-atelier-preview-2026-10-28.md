# Website-wide Atelier design preview

## Scope

The external preview now covers the 145 canonical routes in the existing sitemap,
the approved homepage and Erbstueck story, and the existing DE/EN shop pilot.
Public website files, canonical URLs, structured data, prices, stock and live
payments are not changed by this design pass. Publication still needs approval.

The preview server applies a reusable stylesheet to the original documents at
request time using parse5 8.0.0. No duplicate project checkout or 145 generated
content copies were created. Install server dependencies with
`npm ci --prefix tools/shop-server`.

## Design

- White/off-white foundation, local Montserrat, graphite text, mocha primary
  actions and restrained moss accents, matching the approved Atelier study.
- Shared header and modal mobile menu, including legal pages that had no header.
- Unframed sections, thin separators, quieter summaries, no decorative gradients
  or floating section cards. Original body content remains intact.
- Product detail pages retain existing gallery/video/options/package/comparison
  logic; images fill square frames and forms use larger mobile input text.
- Care, custom work, gifts, B2B, hospitality, guides, legal pages and existing
  translations receive the common design without rewriting their content.
- Shop pilot uses the same typography/palette and focused product layout while
  preserving shared-cart edit, finite stock and demo/test-only checkout.

## Safety

- Preview-only noindex response headers and meta tags. Production sitemap unchanged.
- Original titles, descriptions, canonicals, JSON-LD and form field contracts kept.
- Original enquiry submission is intercepted before any network transmission.
  Analytics and marketing scripts are not loaded in the preview. The demo shop is
  deliberately excluded from the enquiry guard, preserving its existing test flow.
- CSP uses hashes for existing inline scripts, not unrestricted inline execution.
  Static files are limited to tracked public assets and explicit public JSON files.
  Private uploads, order storage, repository files, logs and configuration stay denied.
- External embeds remain blocked in this design preview. Existing local videos work.
- Worktop preview links continue to the existing public tool rather than an
  incomplete locally hosted copy.

## Verification

- All 145 sitemap routes checked at 375px: HTTP 200, no JavaScript exceptions,
  no horizontal document overflow.
- 16 representative DE/EN route families checked at 375, 768 and 1440px with
  screenshots, header/menu, product rendering and internal asset checks.
- Custom-work/B2B/hospitality forms checked at 430 and 1024px: no real submission
  and no analytics requests.
- Content/title/canonical/form-contract equality checked automatically for every
  transformed sitemap document. Three new tests cover transformation, allowlist,
  approved homepage and preserved English B2B content.
- Shared mixed cart and cross-product edits passed in DE/EN after shop restyling.
- Indexability audit remains 145 indexed canonicals and 145 sitemap URLs.

## Main preview paths

`/`, `/produkte.html`, `/pflege.html`, `/schneidebrett-nach-mass/`,
`/handgefertigte-holzprodukte-fuer-unternehmen/`,
`/schneidebretter-aus-holz-gastronomie/`, `/hochwertige-geschenke-holz/`,
`/schneidebrett-saftrille/`, `/brotzeitbrett/`, `/schneidebrett-aufbereiten/`.

The original `/atelier-vorschau/` study and `/shop-vorschau/` routes stay available.
The external tunnel depends on the local Mac remaining awake and online.
