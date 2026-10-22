# Hosting redirects

## Corporate gifts URL migration

- Source: `https://edlehoelzer.de/b2b.html`
- Target: `https://edlehoelzer.de/firmengeschenke-holz/`
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
