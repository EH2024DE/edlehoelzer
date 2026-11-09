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

- Static design: 148 pages, 145 indexable routes. Internal destinations/fragments and typography audits pass.
- 58 focused regression tests pass; the two new homepage build checks run in the regular design test suite and GitHub validation.
- Existing SEO, main content and form-contract tests remain in place; intentional review replacement is separately checked against all six stored original texts.
- Browser checks at 375, 430, 768 and 1440px in both languages: portrait ratios, loaded local images, first-screen trust, no horizontal page overflow, disclosures and native review scrolling. Additional tests cover no JavaScript and failed catalogue fetches with working direct product links.
- Screenshots and measured page heights: /tmp/edle-homepage-portraits. These are Chromium checks, not physical iPhone/Safari checks.
- Asset audit: 271 media, zero critical errors, 25 pre-existing warnings. No new team-photo warning.

## Still open

The English homepage retains more legacy content than German, although secondary topics now collapse. This is not a claim that every content or B2B revision is finished. Live inventory, a fresh Etsy data sync, B2B scope/fee decisions, deeper service-page changes and real-device validation remain separate work. External Etsy photograph delivery is not guaranteed by these local-photo checks.
