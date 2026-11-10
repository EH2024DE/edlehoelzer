# Hosting redirects

## Verified live status, 10 November 2026

`node scripts/audit-http-redirects.mjs` checked all 74 configured rules both
without and with a query string (148 requests, automatic redirects disabled).
Every source returned HTTP 200 with an HTML fallback; none returned the required
HTTP 301 and Location header. The public response identifies GitHub.com as the
server. No hosting, DNS, proxy or redirect rule was changed by this check.

Evidence: `docs/http-redirect-audit-2026-11-10.json`. The script exits with a
nonzero status while the planned server-side redirects are not active. It is an
explicit deployment acceptance check, not a claim that the HTML fallbacks fail.

The existing fallback pages must remain in place. Enabling server-side redirects
requires a separately approved hosting/edge configuration; adding the CSV to the
repository alone cannot make GitHub Pages emit these 301 responses.

## Product URL migration, 9 November 2026

36 reviewed product pages now use short descriptive addresses without Etsy IDs.
The exact DE/EN names, old addresses and new addresses are recorded in
`data/product-url-migration.json`. Both language variants are migrated, with
72 one-hop source-to-target entries in `config/cloudflare-bulk-redirects.csv`.
New pages are self-canonical; hreflang, generated directories, catalogue links
and the sitemap point to the final addresses. Etsy listing IDs, product IDs,
prices and inventory remain unchanged. Existing editorial pages such as
`/teigschaber-holz/` are distinct from `/produkte/teigschaber-holz/` and are not
redirected or repurposed.

The old HTML pages immediately redirect and include a visible fallback link.
JavaScript additionally preserves query strings (including chosen variants)
and fragments. No old address is removed. These are HTTP-200 HTML fallbacks,
not deployed HTTP 301s. Cloudflare rules are prepared only: no DNS, proxy or
account change has been made. Activating real 301s remains a release check.

Reference: https://developers.google.com/search/docs/crawling-indexing/301-redirects

To regenerate the reviewed migration deterministically:
`node scripts/apply-product-naming.cjs`. Do not run the old generic slug generator
as a migration: product URLs are now explicitly assigned and must remain stable.

## Corporate gifts URL migration

- Source: `https://edlehoelzer.de/b2b.html`
- Target: `https://edlehoelzer.de/handgefertigte-holzprodukte-fuer-unternehmen/`
- Desired status: `301`, preserving query strings.

The current GitHub Pages origin has no per-path HTTP redirect support. The old HTML therefore provides an immediate meta refresh, a visible fallback link and `location.replace` preserving query strings and fragments. This is a client-side redirect returning HTTP 200, **not a deployed HTTP 301**. The target is self-canonical and the old URL is excluded from the sitemap. The source remains available for existing inbound links.

The CSV includes the desired future edge redirect. Importing it alone does not activate it; a matching Cloudflare rule and proxied DNS are required. No DNS or proxy changes are made by this PR. After activation verify `curl -sI https://edlehoelzer.de/b2b.html` returns 301 and the correct Location. JavaScript preserves the legacy `#produkte`, `#preise`, `#anfrage`, `#vorteile` and `#ablauf` fragments as those IDs remain on the target.

## Teigschaber migration

The old URL must permanently redirect to the new owner page:

- Source: `https://edlehoelzer.de/teigschaber-sauerteig/`
- Target: `https://edlehoelzer.de/teigschaber-holz/`
- Status: `301`
- Preserve query string: yes
- Match subpaths: yes

The current GitHub Pages origin cannot emit a path-specific HTTP redirect. The HTML at the old URL therefore remains a `noindex,follow` meta-refresh and JavaScript fallback until the domain is proxied through Cloudflare.

To activate the real redirect in Cloudflare, import `config/cloudflare-bulk-redirects.csv` under **Bulk Redirects**, create a Bulk Redirect Rule for that list, and make sure the DNS records serving `edlehoelzer.de` are proxied. Do not remove the fallback page before the response below is verified.

```sh
curl -sI https://edlehoelzer.de/teigschaber-sauerteig/
```

Expected result:

```text
HTTP/2 301
location: https://edlehoelzer.de/teigschaber-holz/
```
