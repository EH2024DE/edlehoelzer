# Search/Citation Release Review

12.10.2026; branch `codex/search-citation-audit`; freshly fetched base `origin/main` at `38e74c335178b34ec8b0838c82357c535c7fb043`. No merge or publication performed.

## Scope

| Group | Files |
|---|---|
| Phase 1 production | `assets/search-pages.json`, DE/EN knife pages, DE old oil comparison, EN oil comparison |
| Phase 1 + 3 production | `schneidebrett-nach-mass/index.html` |
| Phase 3 production | `hackblock/index.html`, `stirnholz-vs-langholz/index.html`, `schneidebrett-aufbereiten/index.html` |
| Phase 1 docs / GSC | `chatgpt-search-query-audit.md`, `chatgpt-search-query-matrix.csv`, `search-content-inventory.csv`, `search-page-assessments.csv` in docs |
| Phase 2 docs | `chatgpt-citation-benchmark.md`, `chatgpt-citation-results.csv`, `chatgpt-competitor-gap.csv` in docs |
| Phase 3 / release docs | `chatgpt-citation-phase3.md`, this report |
| Scripts | `analyze-gsc-export.py`, `search-content-inventory.py`, `build-citation-benchmark.py` in scripts |
| Tests | `test_search_audit.py`, `test_citation_phase3.py`, `test_search_release.py`, `search-audit-browser.cjs` in tests |
| Evidence | dated benchmark, Phase-3 and release evidence directories in docs |

Complete production scope: eight HTML files and one search-index JSON file. No new landing page, price, checkout, Finder matching, analytics, robots or sitemap change. EN changes are narrow factual parity corrections, not a general rewrite.

## Findings Resolved

- Removed duplicated custom-page size introduction; kept real format examples and only one new size list.
- DE knife OG title now matches the existing corrected title. The Phase-1 title correction removes unsupported construction-superiority framing; H1 unchanged. No winner-title keyword rewrite.
- Mobile product pair includes product names despite hidden table headers; column order matches existing Stirnholz/Langholz labels. Historical pre-fix screenshot retained with explicit warning.
- Phase-3 report's original format gaps predate owner confirmation of 60 × 75 × 5 cm; dated addendum explains the change. Remembered/calculated masses remain unpublished.
- Phase-1 no-ChatGPT-tests/no-PR statements are marked historical; later benchmark is linked, not retroactively substituted.

## Claims and Source Checks

- Forbidden weights `14 kg`, `20 kg`, `13,3 kg`, `10,5 kg`, `15,8 kg`: absent from every changed production page; only uncertain audit calculations/recollections retained.
- Hackblock listing 4417507555 matches products.json: Eiche, Stirnholz, 59.5 × 38 cm, 4.9 cm, 7.9 kg, no groove, made-to-order. No new measurement implied.
- Pair 4370784882 / 1774262638 matches catalog dimensions/materials/construction; no inferred weight or measured knife effect.
- Both customer formats directly confirmed by owner on 12.10.2026. No invented location or material-decision reason.
- Existing refurbishment case: surface smoothing and oiling, not structural repair. No invented receipt, elapsed time or sanding depth.
- LEINOS 280 manufacturer sheet rechecked: 18–24 h recoating, about 7–10 days through-drying, specific conditions and oil-rag fire warning. No generic food-contact approval or EH finish specification inferred. [Manufacturer sheet](https://leinos.de/api/media/file/280-leinos-technical-datasheet-de.pdf).
- WÜSTHOF source rechecked: narrow advice against glass/metal/stone does not establish a universal end-/edge-grain ranking. [Manufacturer advice](https://www.wusthof.com/blog/how-to-choose-the-correct-cutting-board).
- No new certification, Messerexperiment, Hackbeil approval or lifetime guarantee. Visible changed claims have repository, manufacturer or explicit owner provenance.

## Protected Architecture

Byte comparison against origin/main: products.json, robots.txt, llms.txt, sitemap.xml, current DE oil destination, EN homepage, oak-vs-walnut and saftrille pages unchanged. All changed H1s/canonicals unchanged. Titles unchanged except justified Phase-1 DE knife correction. Old oil meta refresh and JS location.replace unchanged; browser redirects to `/welches-oel-schneidebrett/` at all five widths.

## Regression

- 17 existing Finder matching tests pass, including exhaustive answer combinations. Finder code unchanged.
- 25 Python tests pass: 6 Search-Audit, 8 Phase-3, 11 release-scope tests (including reused checks across all eight modified HTML pages).
- JSON-LD parses; visible FAQ questions/answers synchronized; local links/fragments resolve; IDs unique.
- Benchmark builder reproduces 37 observations / 15 prompts, first ten repeated three times, three partial captures, one grouped EH citation. Unknowns preserved.
- Browser: eight routes × 375/430/768/1024/1440 = 40 combinations. No overflow; one H1; visible images loaded; no observed console warnings/errors. Release results in `docs/release-evidence/2026-10-12/responsive-checks.json`.
- `git diff --check` clean. No external W3C certification, actual iPhone Safari, full screenreader or live bot/WAF validation claimed. Existing shell Playwright scripts retained for reproduction; release smoke executed through the app browser.

## Evidence

Benchmark evidence about 1.8 MB and Phase-3 about 3.9 MB before release shots: retain because text captures underpin citation observations and screenshots demonstrate layout. No valuable evidence deleted. `stirnholz-vs-langholz-375-product-pair.png` is explicitly historical pre-fix evidence, not acceptance proof. No debug/temp files staged. Original GSC ZIP exports remain local as documented; reproducing GSC calculations requires those owner exports. Retained benchmark text checked for credentials/private customer contact details; none found.

## Remaining Limits

Optional owner data missing: actually weighed XXL masses, measured comparable board pair, customer-specific selection reasons, repair depth/receipt/time, product-specific Hackbeil approval. Conservative content does not rely on them. Static catalog blocks must be revalidated if products change. Citation baseline is small/partially incomplete; improvement unproven. No full purchase/Finder UI regression, but matching tests pass and those workflows are unchanged. Technically ready for PR review; remote CI/mergeability remain GitHub checks.

## Publication-relative Follow-up

| Field | Status |
|---|---|
| Actual production publication date | PENDING: confirm deployed content, not local edit or PR creation |
| Merge commit / deployment reference | PENDING |
| Measurement 1 | actual publication date +14 days |
| Measurement 2 | actual publication date +28 days |
| Measurement 3 | actual publication date +56 days |

P01/P02/P03/P04/P06/P11/P12, three fresh sessions per prompt where possible. Separate Source/Citation Presence; retain exact URL, cited section, competitors, answer context, mode/date. No future results entered and no automation created. Baseline stays 12.10.2026; deadlines start only at confirmed publication.
