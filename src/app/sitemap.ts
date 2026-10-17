import type { MetadataRoute } from "next";
import { PAGE_PATHS, localizedPath } from "@/lib/navigation";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_PATHS.flatMap(path => (["lt", "en"] as const).map(lang => ({
    url: SITE_URL + localizedPath(path, lang),
    alternates: { languages: { lt: SITE_URL + localizedPath(path, "lt"), en: SITE_URL + localizedPath(path, "en") } },
  })));
}
