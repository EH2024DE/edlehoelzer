# GSC Phase 1: URL consolidation

Stand: 2026-07-19

## Owner URLs

| Retired URL | Owner URL |
|---|---|
| `/index.html` | `/` |
| `/en/index.html` | `/en/` |
| `/schneidebrett-oel-vergleich/` | `/welches-oel-schneidebrett/` |

The sitemap, canonical tags, hreflang tags and internal links use only the owner
URLs. The retired oil page is a minimal `noindex` redirect fallback and no longer
publishes a duplicate article.

## Important hosting constraint

The site is served as static files by GitHub Pages. HTML, JavaScript and
`<meta http-equiv="refresh">` cannot return an HTTP `301` status. In addition,
`/index.html` and `/` resolve to the same physical file, as do `/en/index.html`
and `/en/`.

The repository therefore provides safe browser fallbacks, but permanent server
redirects must be configured at the CDN or edge layer in front of GitHub Pages.

## Required edge redirects

Configure these rules in this order and preserve the query string:

| Incoming path | Status | Destination |
|---|---:|---|
| `/index.html` | 301 | `https://edlehoelzer.de/` |
| `/en/index.html` | 301 | `https://edlehoelzer.de/en/` |
| `/schneidebrett-oel-vergleich/` | 301 | `https://edlehoelzer.de/welches-oel-schneidebrett/` |
| `/schneidebrett-oel-vergleich/index.html` | 301 | `https://edlehoelzer.de/welches-oel-schneidebrett/` |

Do not deploy `_redirects`, Netlify or Vercel configuration files while GitHub
Pages remains the origin: GitHub Pages does not execute them.

## Verification after edge deployment

```bash
curl -I https://edlehoelzer.de/index.html
curl -I https://edlehoelzer.de/en/index.html
curl -I https://edlehoelzer.de/schneidebrett-oel-vergleich/
curl -I https://edlehoelzer.de/schneidebrett-oel-vergleich/index.html
```

Each response must return `301` and a `Location` header pointing directly to the
owner URL. There must be no redirect chain.

After verification:

1. Resubmit `https://edlehoelzer.de/sitemap.xml` in Google Search Console.
2. Inspect each retired URL and request validation.
3. Monitor canonical selection and clicks for at least four weeks.

## Content consolidation

The owner page `/welches-oel-schneidebrett/` already contains the useful topics
from the retired comparison page:

- nuanced comparison of suitable care oil, linseed oil varnish, balm, mineral
  oil and unsuitable cooking oils
- differentiated guidance on food-contact suitability
- beeswax, tung oil and coconut oil
- step-by-step oiling instructions
- warning for oily cloths
- decision path between self-care and professional refurbishment

Absolute legacy claims such as a universal “best oil”, blanket food-safety
statements and “mineral oil for emergencies” were intentionally not retained.
