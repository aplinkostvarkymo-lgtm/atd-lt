import type { MetadataRoute } from "next";
import { PAGE_PATHS, localizedPath } from "@/lib/navigation";
import { SITE_URL } from "@/lib/site-metadata";
import { projects, projectPath } from "@/lib/gallery-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGE_PATHS, ...projects.map(p => projectPath(p.id))].flatMap(path => {
    const project = projects.find(p => projectPath(p.id) === path);
    return (["lt", "en"] as const).map(lang => ({
      url: SITE_URL + localizedPath(path, lang),
      ...(project ? { images: [SITE_URL + project.photos[project.cover].variants.at(-1)!.src] } : {}),
      alternates: { languages: { lt: SITE_URL + localizedPath(path, "lt"), en: SITE_URL + localizedPath(path, "en") } },
    }));
  });
}
