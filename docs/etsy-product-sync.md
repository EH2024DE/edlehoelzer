# Etsy product sync

The website repository is public, so Etsy credentials must never be committed or exposed in browser JavaScript.

## Local setup

1. Copy `.env.example` to `.env`.
2. Add the real values locally:

```bash
ETSY_API_KEY=...
ETSY_API_KEY_HEADER=...
ETSY_SHARED_SECRET=...
ETSY_SHOP_ID=...
ETSY_ACCESS_TOKEN=...
ETSY_OAUTH_TOKEN=...
```

`ETSY_API_KEY_HEADER` is optional. Use it only if the value Etsy expects in the `x-api-key` header differs from the local `ETSY_API_KEY` value. As a fallback, the scripts also accept `ETSY_SHARED_SECRET`. `ETSY_ACCESS_TOKEN` is optional unless Etsy requires OAuth for the requested shop endpoint. `ETSY_OAUTH_TOKEN` is also accepted as a local alias. The `.env` file is ignored by Git via `.gitignore`.

The scripts read `.env` from this branch directory first and also support a parent-project `.env` one level above the branch. If the local `listing-generator/.env` exists, it is supported as a fallback as well. This keeps local secrets usable across parallel worktrees without committing them.

Do not paste the API key into ChatGPT, GitHub issues, PR comments, HTML, JavaScript, or documentation.

## Product availability check

Run a dry-run first:

```bash
npm run sync:etsy-products
```

This compares `products.json` with the active Etsy listings and prints:

- products still active on Etsy
- products no longer active on Etsy
- active Etsy listings that are missing from `products.json`
- archived website products that are active again on Etsy

To update unavailable products in `products.json`:

```bash
npm run sync:etsy-products -- --write
```

The write mode is intentionally conservative:

- listings no longer active on Etsy are archived locally
- direct Etsy checkout is disabled for those products
- the replacement path is set to a custom-board request
- products that are active on Etsy but manually archived locally stay archived

To also restore active Etsy listings into the visible grid:

```bash
npm run sync:etsy-products -- --write --restore-active
```

Use `--restore-active` only after checking that the product text, images, price, and preview copy are still suitable for the website.

## Security model

- API key stays in `.env`.
- Sync runs locally or during a private build step only.
- The public website only receives the resulting `products.json`.
- The browser never calls the Etsy API directly.
- No API key is printed by the script.

If the key is ever pasted publicly or committed, rotate it in Etsy immediately.
