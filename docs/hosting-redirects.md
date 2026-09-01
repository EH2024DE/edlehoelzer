# Hosting redirects

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
