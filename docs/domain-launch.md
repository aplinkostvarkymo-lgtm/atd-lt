# Primary domain launch

The owner authorized launch on 2026-10-19. The new site is deployed on Vercel for
`atd.lt`; `www.atd.lt` permanently redirects to the apex domain. The earlier
review-only decision is superseded. Legacy path decisions are documented in
[legacy-url-migration.md](legacy-url-migration.md).

## Production configuration

- Vercel project: `robertas-projects-ca7a987d/atd-lt`, Production branch `main`.
- `ATD_INDEXING_ENABLED=true` is set only in Production. Canonicals, hreflang and
  sharing URLs use `https://atd.lt`; public pages allow indexing.
- Branch previews remain noindex. The usable review aliases `new.atd.lt` and
  `atd-lt.vercel.app` receive a host-specific `X-Robots-Tag: noindex, follow`.
  They retain their page URLs instead of forcing visitors through a redirect.
- Private moderation remains `noindex, nofollow`, `no-referrer`, `private, no-store`
  on every host; the public alias header must never override these stricter rules.

## DNS cutover

The owner logged into Interneto vizija. The old DNS zone was saved privately before
editing. Only the website A record and an explicit www record were changed:

| Name | Type | New value | TTL |
| --- | --- | --- | --- |
| @ | A | 216.198.79.1 | 900 seconds |
| www | CNAME | 9a9d04e63ca3ef4e.vercel-dns-017.com. | 900 seconds |

Vercel supplied these values in its project domain settings. Nameservers remain
`ns1.serveriai.lt` through `ns4.serveriai.lt`. The wildcard A record remains
`168.119.17.226`, preserving unrelated subdomains such as `news.atd.lt`. The
existing `new` CNAME, MX `10 kolab.digitek.lt.`, SPF TXT and Google verification TXT
were preserved. The previous root A record was `168.119.17.226`; the old TTL was
3600 seconds. Existing resolver caches can therefore temporarily serve the old
site even after the authoritative servers publish the new records.

The provider accepted the change around 23:37 Europe/Vilnius and published the
new A/CNAME by 23:51. Vercel generated HTTPS certificates afterwards. No certificate
warning was bypassed and TLS verification was not disabled.

At 00:07 Europe/Vilnius on 2026-10-20, direct DNS queries still found a partial
cutover: ns1/ns2 returned the new apex IP, while ns3/ns4 returned the old apex IP.
All four already returned the new www CNAME, and retained MX/SPF/verification TXT.
Google 8.8.8.8 and Cloudflare 1.1.1.1 returned the new apex IP. This is not yet a
fully converged authoritative zone; a browser using an old answer can still reach
the legacy server and its500 response for a new route. The identical correct
zone was republished around00:03 without changing record values. Provider UI
accepted it. Do not report universal availability until all four servers agree.
The provider's [zone documentation](https://pagalba.iv.lt/lt/articles/380773-zonos-redagavimas)
allows1–2hours for changes to take full effect. If disagreement persists beyond
that window, investigate with the provider rather than changing unrelated records.

## Verified launch outcome

Deployment `e9372b64302337104cba95e14fb87c03e37fbe23` passed the live launch audit:
86 sitemap pages returned200 with `atd.lt` canonicals and indexable metadata; the
corrected legacy routes, query/hash preservation and the 30 old site-tree topics
were checked. Current public reviews API returned200. The local resolver still
held the old A answer, so the primary-host HTTP audit used the authoritative new
IP in that test process only, with real hostname/SNI and normal TLS validation.
Google Public DNS independently returned the new record.

Follow-up deployment `ae06afd09d98e4154d3b53ff993a1a048bcdb475` reached Ready.
All18 targeted live host checks passed: primary public pages have no noindex
header, both review aliases have `noindex, follow`, private moderation retains
the stricter headers on every host, and www308 preserves paths and queries.
Primary/www checks used the same process-only authoritative-IP override with
normal TLS validation; they do not establish complete DNS propagation.

Search Console accepted `https://atd.lt/sitemap.xml` on 2026-10-19 with **Success**
and **86 discovered pages**. Its live homepage test at 23:55 reported **URL is
available to Google** and **Page can be indexed**. This is crawlability/indexability
verification, not a claim that all new pages have already been indexed. The old
2015 HTML site-tree submission remains historical and is not the active sitemap.

The official Meta Sharing Debugger was refreshed for `https://atd.lt/`. It returned
the new canonical, current title and the loaded homepage garden image. Meta's
partial-content fetch reported206; ordinary full-page requests returned200.
Previously sent message attachments may retain their old image until refreshed.
The official debugger also fetched `https://atd.lt/atsiliepimai#parasyti` and showed
the current review title, correct canonical and loaded homepage garden preview.

## Contact and form checks

The temporary contact and notification recipient remains
`aplinkostvarkymo@gmail.com`. Airtable and Resend settings were not changed. Earlier
owner-authorized real tests confirmed storage and Gmail delivery. No additional
real lead or review was submitted during launch; read-only API checks do not
establish a new mail-delivery result. The existing configured sender remains in
use. Configure a verified branded sender separately rather than substituting an
arbitrary Gmail From address.

## Sharing image and follow-up

The default social image is `/images/og-atd-home-20261019.jpg`, a1200×630 JPEG from
the existing homepage garden. `/images/og-atd.jpg` also serves that garden for old
consumers. Project stories keep their own covers. `#parasyti` is the review form
anchor and is not sent in the HTTP request.

Keep redirects for at least a year, preferably indefinitely. Monitor newly
reported404s and indexing after launch; do not invent a content replacement for a
service the owner has not confirmed. Only run additional real form submissions
with explicit authorization.

If a rollback is necessary, the private DNS backup and the previous Vercel
production deployment remain available. Do not alter MX, TXT or nameservers as a
side effect of a website rollback.

References: [Google site migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes),
[Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing),
[Open Graph protocol](https://ogp.me/).
