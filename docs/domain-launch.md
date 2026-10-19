# Primary domain launch

The owner authorized the primary-domain launch on 2026-10-19 after reviewing the
legacy URL audit. The 2026-10-18 review-only decision is superseded. The steps
below describe the cutover; confirm the recorded live outcome before treating it
as complete. Legacy URL decisions are in [legacy-url-migration.md](legacy-url-migration.md).

The default build emits `noindex, follow` on all LT/EN pages. Leave `ATD_INDEXING_ENABLED` unset while the site is under review. `robots.txt` allows crawling so search engines can read the noindex directive. Page canonical URLs, language alternates, Open Graph URLs and sharing images use the working review host https://new.atd.lt. This prevents social crawlers from following a shared review link to the old atd.lt server. JSON-LD entity identifiers and the future sitemap remain prepared for https://atd.lt. Enabling the launch flag switches page identities and media back to the primary domain automatically.

For the separately authorized domain migration:

1. Connect atd.lt to the new deployment and confirm HTTPS and one canonical host.
2. Verify all sitemap URLs, LT/EN routes, images, social image, legacy redirects, form persistence and email delivery on the new primary domain. The previous server returned 500 for /darbai and /sitemap.xml.
3. Set `ATD_INDEXING_ENABLED=true` for the Vercel **Production** environment and redeploy. Branch previews remain noindex even if the flag is present.
4. Confirm production page HTML contains `index, follow`, correct atd.lt canonical and reciprocal language links. Confirm previews still contain `noindex`.
5. Submit the sitemap and inspect representative URLs in the owner's Search Console account.

The temporary contact and form notification recipient is aplinkostvarkymo@gmail.com. The owner-authorized test on 2026-10-18 confirmed successful storage and actual Gmail inbox delivery. That internal notification currently arrives from the configured Resend test sender, onboarding@resend.dev; configure a verified branded sender when preparing the primary-domain launch. Do not substitute an arbitrary Gmail From address without provider verification.

Do not mark domain launch or search indexing complete merely because a Vercel build succeeded. Only run additional real lead tests with explicit authorization; local interface regression checks can use mocked responses.

References: [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Schema.org unit pricing](https://schema.org/UnitPriceSpecification).

## Sharing previews

The default social image is a 1200 × 630 JPEG derived from the existing homepage garden image: `/images/og-atd-home-20261019.jpg`. The previous `/images/og-atd.jpg` path also serves that garden for consumers retaining the old image URL. The homepage and reviews page use this default; project stories retain their own cover image. `#parasyti` scrolls to the review form and is not sent in the HTTP request; it cannot select a different server route or image.

After changing sharing metadata, verify the raw HTML with a Facebook crawler User-Agent, not just the hydrated browser DOM. Check HTTP200 for the page and image, working-host canonical and og:url, image dimensions/MIME, LT/EN titles and the review anchor. Previously shared Messenger attachments may retain Meta's cached metadata. Use the [official Sharing Debugger](https://developers.facebook.com/tools/debug/) to request a fresh scrape of the exact URL; verify its actual returned preview rather than claiming completion from a local HTTP test alone. The image and object URL fields follow the [Open Graph protocol](https://ogp.me/).

Verified live on 2026-10-19 after deployment 8441b185: Meta Sharing Debugger fetched the exact homepage and /atsiliepimai#parasyti links and displayed the homepage garden, the new image URL and new.atd.lt canonical identity. The plain /atsiliepimai debugger result also displayed the garden. Meta reported partial-content status206; direct page/image requests returned200. No Messenger message was sent, and existing message attachments may retain their earlier preview. The generic missing fb:app_id warning did not prevent image rendering; no arbitrary app ID was added.
