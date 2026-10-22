# B2B URL migration: GSC baseline and release checks

Date checked: 23 October 2026 (Europe/Berlin). Base: main after PR #193, merge `b5c3dae471f1ec984e960acc58258750a2e4b127`.

## First-party GSC evidence

Read directly in the owner's signed-in Safari Search Console session. Property: `sc-domain:edlehoelzer.de`; search type Web; page filter `URLs containing /b2b.html`; no country/device filter. These are observed report totals, not estimates.

| Selected range | Actual chart dates | Clicks | Impressions | CTR | Average position |
| --- | --- | ---: | ---: | ---: | ---: |
| Last 3 months | 21 July-20 October 2026 | 1 | 303 | 0.3% | 36.5 |
| Last 16 months | 28 March-20 October 2026 (available data) | 3 | 340 | 0.9% | 33.9 |

The 16-month selection does not imply that 16 months of data exist; the chart starts on 28 March. Last update shown: four hours ago.

Visible query rows for the longer range:

| Query | Clicks | Impressions |
| --- | ---: | ---: |
| firmengeschenke holz | 0 | 129 |
| personalisiertes geschenk firmenkunden holz | 0 | 49 |
| firmengeschenke holzset | 0 | 41 |
| kundengeschenk holz | 0 | 2 |
| edelfaktur | 0 | 1 |

GSC explicitly warns filtered report totals and table rows can differ; visible queries do not account for every click/impression. No hidden queries or query-level positions inferred.

Links report: one external link in total, pointing to the homepage (pinterest.com). No external B2B target was listed. The B2B page was listed with 31 internal links. This is the GSC report's limited coverage, not proof that no external link exists anywhere.

Performance report: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Aedlehoelzer.de&page=*%2Fb2b.html&num_of_months=16

## Decision

Use `/firmengeschenke-holz/`: clearer to visitors and consistent with the observed main query. Existing performance does not identify this page as a high-traffic ranking winner. A descriptive URL alone is not evidence of improved ranking. Retain the old address as a redirect, never a 404.

## Implemented scope

- Move the already approved page without rewriting its content or design.
- Root-relative asset, language and privacy URLs so the nested directory works.
- Update public internal links, generated search index, sitemap, one dynamic CTA URL and the llms reference. Event names and form endpoint stay unchanged; analytics page paths naturally change.
- Historical audit snapshots stay unchanged; they describe the URL at their observation time.
- The search-summary manifest explicitly records the approved B2B layout without a pageSummary. Its regression check validates the new canonical, single H1 and existing form rather than requiring a removed summary component.

## Redirect limitation

GitHub Pages has no per-path HTTP redirect configuration. The old URL returns an immediate HTML/JavaScript redirect (HTTP 200), not a real 301. JavaScript preserves query strings and fragments. Without JavaScript, the immediate meta refresh uses the canonical target; the static fallback cannot preserve arbitrary query strings/fragments. A visible link remains available.

A 301 edge rule is supplied in `config/cloudflare-bulk-redirects.csv` for later Cloudflare activation. No rule, DNS proxy change or account change is silently performed. Do not describe the configuration file as an active redirect service. See `hosting-redirects.md`.

## Publication checks

After merge/deployment: verify the new URL returns 200, self-canonical and all assets load; verify the old URL redirects to it; inspect the new URL in GSC and request indexing only once it is live. Submit/refresh the existing sitemap if needed. No production publication date, indexing request or ranking improvement is claimed in this PR.

The changes are isolated from pending refurbishment/care edits in another checkout. No competitor references are included.

## Completed validation

- 32 Python tests and 55 Node tests passed (including four new migration checks).
- Indexability: 62 HTML files, 51 self-canonical indexable pages and 51 sitemap URLs; passed.
- Page-summary regression checks: passed; generated local search index rebuilt (43 pages).
- Asset audit: no critical errors; 24 pre-existing non-blocking warnings, including image metadata and unrelated preview image attributes. No image changes in this PR.
- Browser: exact widths 375, 430, 768, 1024 and 1440 px, no horizontal page overflow, all four product images loaded, new canonical correct.
- Legacy URL tested in browser with `?utm_source=migration-test#anfrage`: navigates to the new path while retaining both query and fragment.
- Automated comparison: B2B content matches the approved main version after URL/path normalization. Other modified HTML pages differ only in B2B link destinations (plus normalized final newline in one file).
- Form submission was not triggered. No GSC indexing request or production deployment performed.
