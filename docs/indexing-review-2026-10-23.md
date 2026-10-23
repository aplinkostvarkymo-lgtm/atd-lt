# Search Console indexing follow-up — 2026-10-23

The owner asked to investigate the October22 Google Search Console email and fix
unintended indexing exclusions. The report viewed on October23 shows Last update
October16, before the new website launch. It lists41excluded and41indexed URLs;
this is historical data, not an inventory of86current sitemap pages.

## Report inventory and decisions

| Reason | Count | What the examples contain | Action |
| --- | ---: | --- | --- |
| Alternate page with proper canonical tag | 11 | news shop/login/signup/password and sort variants | Retire obsolete test host; these duplicates should not become indexable. |
| Soft404 | 9 | news shop, cart, wishlist and sort variants | Replace obsolete test host with real410 responses. |
| Page with redirect | 6 | HTTP/apex and news language-prefixed account pages | Primary HTTPS homepage is now200; HTTP/www redirects are intentional. Retire news. |
| Duplicate without user-selected canonical | 4 | Old /lt/ home and old topics1945/1933 | Existing permanent redirects reach the self-canonical current homepage/portfolio. |
| Not found404 | 3 | news contact/social URLs | Retire news; do not fabricate replacement content. |
| Excluded by noindex | 2 | news homepage in LT/EN | Intentional for an unused test site; retain exclusion. |
| Server error5xx | 1 | Old www topic2131, biofuel/brush cutting | Now redirects to apex then real404; no verified replacement exists. Do not revive or send to an unrelated homepage. |
| Crawled, currently not indexed | 5 | news wishlist plus four legacy CSS/image resources | Retire news; obsolete CSS/PHP resources correctly return404 and are not content pages. |

All41examples were collected.29belong to news.atd.lt,12to the primary/www
domain. The owner explicitly confirmed news is an old, publicly unnecessary test.
Its old HTTPS endpoint presents a certificate for a different hostname; certificate
validation was not bypassed. Raw examples and HTTP results remain in the private
`atd-lt-audit/indexing-2026-10-23` directory.

## Current primary site

All86sitemap URLs passed a live ordinary-TLS HTTP audit: one200response each,
correct canonical, and no noindex directive. The homepage is200with a root
canonical, not the old report's redirect. Old /lt variants redirect to the current
homepage, and1945to /darbai. The www and trailing-slash hops remain valid permanent
redirects. Primary content, metadata and sitemap do not need speculative rewrites
to address these historical exclusions.

## Retired news host implementation

The proxy responds410with noindex/nofollow and a short LT/EN closure notice only
when Host is exactly news.atd.lt. A host-specific matcher also intercepts static
and API paths, preventing exposure of the active site's public API or sitemap on
the retired host. robots.txt deliberately returns200and allows crawling so Google
can observe410. There is no redirect to unrelated content and no sitemap on news.
Existing primary/preview routing, robots and private moderation rules are retained.

Prepared Vercel Production alias news.atd.lt. Its required DNS record is CNAME
news →9a9d04e63ca3ef4e.vercel-dns-017.com. DNS cutover and live410verification are
pending publication of the tested code. The full existing IV zone was backed up
privately; apex, wildcard, new, www, MX and TXT must remain unchanged.

Validation:11meaningful proxy/migration/metadata tests, targeted ESLint, TypeScript
and standard production build99routes passed. The initial sandbox build could
not fetch Google Fonts; the next build hit the known stale Turbopack CSS worker
cache issue. Only this worktree's cache was moved to a verified backup path, then
the unchanged standard build passed. Twelve actual compiled-server HTTP checks
confirmed news410/API/static isolation, crawlable robots and unchanged LT/EN,
sitemap, legacy308and missing-page404. Node fetch replaced the custom Host in an
initial test, so final routing checks used Node's HTTP client with an explicit Host.
