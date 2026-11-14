# Regular public Etsy refresh

## Scope

`Refresh public Etsy data` runs daily at 05:23 UTC (06:23 German winter time,
07:23 summer time), and can be started manually. GitHub schedules can be delayed
and only run after the workflow has been merged into the default branch.

It reads the public shop, all active-listing pages and all review pages using
Etsy Open API v3. It does not change Etsy, access orders, download buyer photos,
retrieve customer accounts or require transaction/inventory OAuth permissions.
API reference: https://developers.etsy.com/documentation/reference
Authentication: https://developer.etsy.com/documentation/essentials/authentication/

## What changes automatically

- Overall review rating, review count and sales count.
- Complete original review text, dates and ratings, including negative ratings.
- The newest Etsy review is eligible for the first homepage quote, alongside
  the existing Google review selection. Google reviews are not fetched here.
- Public listing-level quantities and checked-at timestamp, never quantities
  invented for individual woods or summed across engraving variations.
- Available catalogue products that disappear become unavailable, not "sold".
  Their product markup is regenerated in both languages.
- The two complete review archives are regenerated. Both homepages obtain their
  quotes and counters from the same data in the existing design build.

Original author names already verified in `data/review-author-names.json` are
preserved. Etsy's review endpoint does not provide an author name in the response
used here. New reviews without an approved name use a neutral Etsy attribution
and are listed under `authorNamesNeeded` for manual follow-up. No names are guessed.

## What remains manual

Prices, variant pricing, wood mappings, curated product names/URLs, images and
new product pages are not automatically replaced. Differences and new listing
IDs appear in `docs/etsy-sync-report.json`. Explicitly sold/archived pieces stay
archived, and made-to-order products never become ready stock automatically.

If a selected homepage product becomes unavailable, the existing price-ladder
regression stops the update. Choose an appropriate replacement in the same tier,
keeping the XXL custom board fourth, then rerun. No arbitrary replacement is made.

## Publication and permissions

The job updates only `automation/etsy-public-sync`, maintains a single PR to main,
and dispatches the existing static validation workflow for that branch. It never
auto-merges, changes DNS, touches Stripe, or bypasses the Pages deployment gate.
The website changes after the data PR is reviewed, merged and deployed. This is
an automated fetch/update proposal, not unattended live publication.

Repository Actions secrets (never repository files or frontend JavaScript):

- `ETSY_API_KEY_HEADER`: keystring and shared secret separated by a colon;
  alternatively `ETSY_API_KEY` and `ETSY_SHARED_SECRET` separately.
- `ETSY_SHOP_ID`: numeric shop ID or exact public shop name.

The workflow explicitly requests `contents: write`, `pull-requests: write` and
`actions: write`. GitHub's repository setting allowing Actions to create PRs must
also be enabled. This repository setting may be restricted by an organization.
Do not grant a broad personal access token merely to bypass this setting.

GitHub does not trigger normal PR workflows for PRs opened with `GITHUB_TOKEN`;
the explicit dispatch of `pages.yml` supplies checks for the generated branch.
That branch cannot publish Pages because the deployment condition requires main.
The bot exclusively owns its dedicated branch; do not edit it manually. Updates
use a force-with-lease push and concurrency prevents overlapping refresh jobs.

## Fail-closed behavior

Missing credentials, authentication failure, invalid JSON, changing/truncated
pagination, duplicate IDs, empty listings, a large listing/review drop, invalid
ratings or quantities, and failed regression/build/link checks stop publication.
HTTP 429 and server errors retry at most twice with a bounded delay. Every request
has a timeout; API response bodies and credentials are never printed in errors.

The aggregate shop listing count can differ slightly from the fully paginated
active-listing endpoint (observed 38 versus 37 on 2026-11-10). This is flagged
explicitly; larger discrepancies stop the run. Absence is never proof of a sale.

No files are written until all remote reads and data validation pass. Any later
local write/build failure prevents commit/push of the proposed update. Last
deployed content remains in place. The Actions run is red and includes a summary;
owners should enable GitHub Actions failure notifications in their account.

## Local checks

`npm run test:etsy-sync` uses synthetic data and no credentials. It covers complete
pagination, retry limits, no-name fallback, edited originals, data minimization,
all rating levels, empty/drop guards, preserved prices/archives/made-to-order and
no writes on authorization failure.

`npm run sync:etsy-public` is read-only by default; `-- --write` applies a validated
snapshot locally. Credentials come only from the process environment. The older
manual sync scripts remain available, but the scheduled workflow deliberately
does not invoke their permissive fallback/archive behavior.

## Activation status

Implementation is prepared on a separate branch based on PR 211. Activation
requires merge into main, encrypted Actions secrets and the repository PR-create
permission. A successful read-only local API run is not a running schedule or
evidence of a published update.

## Verification on 2026-11-10

- Read-only real API run succeeded: 37 paginated active listings, 40 original
  text reviews, 82 sales; all existing review authors matched approved names.
- Etsy's aggregate listing counter reported 38; this discrepancy was flagged.
- One listing-level price/variant difference was reported for manual review;
  no prices or live website data were changed.
- Twelve synthetic synchronizer tests, 57 design regressions and eight release
  tests passed. Workflow YAML syntax was checked locally.
- Encrypted secret provisioning was blocked pending explicit owner approval.
  No secrets were uploaded and no repository permission setting was changed.
