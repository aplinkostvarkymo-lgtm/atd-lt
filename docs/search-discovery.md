# Search discovery

The owner authorized Bing Webmaster Tools, IndexNow, Google Business Profile,
Bing Places / Apple Maps checks, and priority Google URL submissions on2026-10-20.

## Bing ownership

`public/BingSiteAuth.xml` is the ownership file downloaded from the signed-in
owner's Bing Webmaster Tools account for `https://atd.lt/`. It is a public domain
verification file, not an account password. Deploy it before clicking Verify.
Submit `https://atd.lt/sitemap.xml` after successful ownership verification.

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
