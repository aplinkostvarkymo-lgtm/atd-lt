# Search discovery

The owner authorized Bing Webmaster Tools, IndexNow, Google Business Profile,
Bing Places / Apple Maps checks, and priority Google URL submissions on2026-10-20.

## Bing ownership

`public/BingSiteAuth.xml` is the ownership file downloaded from the signed-in
owner's Bing Webmaster Tools account for `https://atd.lt/`. It is a public domain
verification file, not an account password. Ownership verification succeeded on
2026-10-20. `https://atd.lt/sitemap.xml` was submitted; Bing showed Processing,
zero errors and zero warnings. This does not establish indexing.

## IndexNow

`npm run indexnow -- --dry-run` checks the public primary domain, indexable
homepage metadata, live verification key and sitemap without submitting anything.
`npm run indexnow` then sends the sitemap's public URLs to Bing's IndexNow endpoint,
which shares submissions with other participating search engines. Receipt200 or202
does not establish indexing;202 means key validation is still pending.

The verification key is intentionally hosted as a public text file. Its filename
is stored in `scripts/indexnow.json`. This grants no account/API access to the app.
The script accepts only canonical HTTPS `atd.lt` URLs, rejects private/API URLs,
refuses noindex/redirect/error responses, and never submits review aliases.

`.github/workflows/indexnow.yml` runs after Vercel's successful **production**
`repository_dispatch` event. Preview deployments are skipped. It can also be run
manually from GitHub Actions. No Vercel token, Google credential, runtime endpoint,
scheduled job, extra package or website form submission is needed. The workflow
notifies about the small public sitemap after production releases; it does not
claim that Google or AI providers consume IndexNow.

Sources: [IndexNow protocol](https://www.indexnow.org/documentation),
[Vercel repository dispatch](https://vercel.com/docs/git/vercel-for-github#repository-dispatch-events).

## Verified production notification

Live dry-run passed for all 86 public sitemap URLs. The actual Vercel production
dispatch for commit `e6f30edc` triggered GitHub Actions run
[39367806758](https://github.com/aplinkostvarkymo-lgtm/atd-lt/actions/runs/39367806758),
which completed successfully, including its notification job. The script accepts
only HTTP200/202, so this establishes accepted submission, not indexed pages.
The preceding run failed safely on an overly strict trailing-slash comparison;
the fixed script normalizes equivalent root canonical URLs before comparing.

## Business profiles: 2026-10-20

The owner confirmed MB ATD.LT, on-site services only, Vilnius and Vilnius district,
and Monday–Friday08:00–18:00, weekends closed. No customer-facing office was added.

Google Business Profile accepted the name, HTTPS website, hidden address and
hours. Service area replacement (remove Lithuania, retain Vilnius, add Vilnius
District Municipality) remains under review, with a stated possible seven-day
review. Added services are sod installation, irrigation installation/blowout,
and pond excavation/maintenance; these are pending review. Irrigation description
limits blowout to ATD-installed systems and states that project/pricing terms are
agreed individually. Two genuine project photos, Trakų Vokė and Gilužio rivjera,
uploaded successfully and remain pending. Existing photos/reviews were retained.

Bing Places: claimed the existing listing, rather than creating a duplicate.
Saved MB ATD.LT, HTTPS website, service areas Vilnius/Vilniaus rajonas and the
option to hide the street address. An initial screen said verified/pending
publication, but after saving the corrected details Bing required verification
again and offered only postal mail, so SMS resend was no longer available.
With the owner's specific approval, requested the postal PIN to the existing
account address. The resulting screen says PIN via mail / Verification in
progress; the earlier estimate was5–6business days. Hours editing is disabled
until verification, so Bing still has08:00–17:00 and needs updating afterwards.
Do not mistake saved changes or the earlier transient status for publication.
The private mailing address is not reproduced in this repository.

Apple: owner has no Apple Account. No account was created or terms accepted.
Apple's location guidelines require an address customers visit for services,
which this service-area business does not have. Do not invent a storefront or
publish a home address. Brand-only Apple Business features are separate from a
Maps place card. See [Apple location attributes](https://support.apple.com/en-ca/guide/business/abcbdc543423/web)
and [Apple business overview](https://business.apple.com/partners/assets/overview.pdf).

## Priority Google submissions

Search Console accepted indexing requests for the homepage, `/darbai`,
`/paslaugos/apzeldinimas`, `/paslaugos/veja` and `/darbai/traku-vokes-dvaras`.
Each finished with Indexing requested / priority crawl queue. Existing inspection
history still showed legacy-server5xx from before launch; the new live submission
tests passed. Do not equate these requests with completed indexing. The sitemap
already has Success and86discovered pages in Search Console.
