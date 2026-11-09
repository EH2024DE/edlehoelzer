# Homepage trust and portraits

Base: main at 6d3eacd. No Stripe, payment, shipping, catalogue price or DNS changes.

## People and photography

- Added the supplied Oezguer and Serkan portraits to the existing German and English about sections, with existing biographical facts and short role descriptions.
- Reused the existing closing area for the brighter workshop photo. No extra workshop section was added. On mobile the complete landscape photo sits above the closing copy; on desktop a directional overlay protects text contrast without darkening the face unnecessarily.
- Originals are untouched. Six resized WebP derivatives retain the original image proportions and omit metadata; each is below 100 KB. No generative edits or retouching were used.
- Source files: Edle_Hoelzer_Portrait_Oezguer.jpg, Edle_Hoelzer_Portrait_Serkan.jpg, Edle_Hoelzer_Ueber_Uns_Portraits_Oezguer_Workshop.jpg.

## Purchase resilience and trust

- The four curated homepage products are rendered during the design build using the existing card renderer and translation helper. Product links and prices work without JavaScript and remain present if the catalogue request fails. Browser enhancement still provides the existing comparison/gallery experience after successful loading.
- The fourth product remains the custom XXL price anchor. Unavailable curated products stop the build rather than silently advertising a sold piece.
- Hero review facts come from data/reviews-meta.json, not a second hardcoded count. The data date is identified. This is a stored Etsy snapshot, not a live inventory/review API integration.
- Six approved original-language Etsy reviews remain available in full. Long reviews provide an exact excerpt and expandable original text. Native horizontal scrolling does not start automatically; the region is keyboard-focusable. The English page identifies the original-language quotes.
- No new stock counts, customer-photo permissions, guarantees or shipping deadlines were invented.

## Page structure

- Homepage spacing uses 48px mobile / 80px desktop section rhythm and avoids doubled spacing between successive light sections.
- Existing secondary English homepage topics are grouped in native disclosures. All their text, forms, destinations and fragment IDs remain in the HTML. Hash navigation opens the relevant disclosure with JavaScript.
- Added the English kitchen preview entry with the same privacy/measurement limitations as German. English hero video now follows the same manual-play behaviour.
- Mobile homepage back-to-top is hidden to avoid covering the new person descriptions and closing copy.

## Verification

- Static design: 150 pages, 147 indexable routes including the new bilingual review archive. Internal destinations/fragments and typography audits pass.
- 61 focused regression tests pass; the homepage and review archive checks run in the regular design test suite and GitHub validation.
- Existing SEO, main content and form-contract tests remain in place; intentional review replacement is separately checked against all six stored original texts.
- Browser checks at 375, 430, 768 and 1440px in both languages: portrait ratios, loaded local images, first-screen trust, no horizontal page overflow, disclosures and native review scrolling. Additional tests cover no JavaScript and failed catalogue fetches with working direct product links.
- Screenshots and measured page heights: /tmp/edle-homepage-portraits. These are Chromium checks, not physical iPhone/Safari checks.
- Asset audit: 271 media, zero critical errors, 25 pre-existing warnings. No new team-photo warning.

## Still open

The English homepage retains more legacy content than German, although secondary topics now collapse. This is not a claim that every content or B2B revision is finished. Live inventory, B2B scope/fee decisions, deeper service-page changes and real-device validation remain separate work. External Etsy photograph delivery is not guaranteed by these local-photo checks.

## Full review archive

- Added /bewertungen/ and /en/reviews/, each with all 39 original texts fetched read-only from the Etsy shop API on 2026-11-09. The current shop snapshot reports 5.0 stars, 39 reviews and 81 sales.
- Kept the existing curated review datasets intact for product-specific selections. The full archive lives in data/reviews-all.json. No customer account IDs, transaction IDs, addresses or new buyer photographs were imported. Unknown names use a neutral attribution.
- Six recent reviews remain on the homepages; full-archive links are available there, in shared generated footers, the topic overview, the site search index and sitemap.xml.
- Both archive pages have self-canonicals, language alternates, complete static text and CollectionPage/BreadcrumbList metadata. There is no self-serving Organization AggregateRating markup.
- Google Search Console access was confirmed. Submission of the new URLs must follow successful publication and an HTTP 200 check on the production domain; a preview URL must not be submitted as the production page. Sitemap submission and a crawl request do not guarantee indexing.
- References: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl and https://developers.google.com/search/docs/appearance/structured-data/review-snippet .

## Review attribution and mobile follow-up

- Corrected the review viewport's legacy negative margins and scroll padding. The first card now snaps inside the page gutter instead of beyond the left edge; regression checks measure the actual left edge.
- Both personal introductions now start with Gude in German and English.
- Matched all 39 Etsy author names against the public shop review pages. Tördin was confirmed by the owner; Elyadesign remains the explicitly approved profile name. The verified mapping is stored by public review hash in data/review-author-names.json, without buyer account identifiers.
- Added all three public Google Maps reviews, with original text, first name and a separate Google Maps source link. Nidya's first name was confirmed by the owner. Google only displayed relative dates, so those remain relative and are qualified by the observation date rather than invented exact dates.
- The archive now contains 42 reviews: 39 from Etsy and three from Google Maps. Platform totals and ratings remain separate. The six homepage excerpts include both sources; no combined average is presented.
