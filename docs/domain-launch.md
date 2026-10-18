# Primary domain launch

The owner confirmed on 2026-10-18 that Vercel is a review copy. The existing atd.lt server has not yet been migrated.

The default build emits `noindex, follow` on all LT/EN pages. Leave `ATD_INDEXING_ENABLED` unset while the site is under review. `robots.txt` allows crawling so search engines can read the noindex directive. Canonical URLs, language alternates, JSON-LD and sitemap remain prepared for https://atd.lt.

For the separately authorized domain migration:

1. Connect atd.lt to the new deployment and confirm HTTPS and one canonical host.
2. Verify all sitemap URLs, LT/EN routes, images, social image, legacy redirects, form persistence and email delivery on the new primary domain. The previous server returned 500 for /darbai and /sitemap.xml.
3. Set `ATD_INDEXING_ENABLED=true` for the Vercel **Production** environment and redeploy. Branch previews remain noindex even if the flag is present.
4. Confirm production page HTML contains `index, follow`, correct atd.lt canonical and reciprocal language links. Confirm previews still contain `noindex`.
5. Submit the sitemap and inspect representative URLs in the owner's Search Console account.

The temporary contact and form notification recipient is aplinkostvarkymo@gmail.com. The owner-authorized test on 2026-10-18 confirmed successful storage and actual Gmail inbox delivery. That internal notification currently arrives from the configured Resend test sender, onboarding@resend.dev; configure a verified branded sender when preparing the primary-domain launch. Do not substitute an arbitrary Gmail From address without provider verification.

Do not mark domain launch or search indexing complete merely because a Vercel build succeeded. Only run additional real lead tests with explicit authorization; local interface regression checks can use mocked responses.

References: [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Schema.org unit pricing](https://schema.org/UnitPriceSpecification).
