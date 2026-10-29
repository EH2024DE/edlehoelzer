# Navigation and interactive design follow-up

Preview only; no publication, payment activation or changes to production content.

- Checked 164 unique internal URL targets across the 145 sitemap pages. No HTTP
  failures remain in the preview. Worktop visualisation stays on the public tool.
- Checked static in-page anchors as well. English finder links now target the
  actual `product-finder` section; About links reach the preserved workshop block;
  the old `/#service` link from English care leads to `/en/refurbishment/`.
- Six sold English product-page enquiry links used the nonexistent
  `/en/custom-cutting-board/`. The preview routes these to the original English
  custom-work content at `/en/#customwork`, copied from the existing homepage.
  Both initial HTML and links inserted later by product JavaScript are covered.
- Full modal menu is also accessible on desktop. At intermediate widths the
  duplicate made-to-measure top-nav link hides; it remains in the menu.
- Added the preview link-localisation script to collection and Erbstueck studies
  as well, keeping cross-page navigation within the same preview origin.
- Refined comparison headings, removed nested decorative product frames and used
  square comparison images to align with the rest of the design.

## Verification

- 25 browser combinations: homepage, B2B, collection, focused demo product and
  English homepage at 375/430/768/1024/1440px. Menu opens/closes, Escape restores
  focus, and document width stays within viewport.
- Real click-through from a sold English board reaches the custom-work section
  and existing enquiry link.
- Two-product comparison opens and closes in DE/EN at 375 and 1440px. Screenshots
  inspected after the opening transition, not mid-animation.
- Added regression tests for archive enquiry and English anchor preservation.
- All corrections are in the preview adapter/generated preview, not a rewrite
  of the original published articles or product data.

Final checks: 163 Node regression tests passed; all 164 internal target URLs and
all static fragment targets passed after correction. The previous quick tunnel
expired during the external check. Its replacement runs via the same launchctl
job with HTTP/2 and IPv4 and returned HTTP 200 externally:
https://ideas-focusing-spelling-tumor.trycloudflare.com/
