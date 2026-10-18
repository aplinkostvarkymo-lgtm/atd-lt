import type { Metadata } from "next";
import projects from "./gallery-projects.json";
import type { Lang } from "./translations";
import { localizedPath } from "./navigation";
import { SITE_URL, SITE_ROBOTS, SOCIAL_MEDIA_URL } from "./site-metadata";

export { projects };
export type GalleryProject = (typeof projects)[number];
export const projectPath = (id: string) => `/darbai/${id}`;
export function projectMetadata(project: GalleryProject, lang: Lang): Metadata {
  const title = `${project.title[lang]} | ATD`;
  const text = project.description[lang];
  const description = text.length > 165 ? text.slice(0, 162).replace(/\s+\S*$/, "") + "…" : text;
  const path = projectPath(project.id);
  const url = SITE_URL + localizedPath(path, lang);
  const image = project.photos[project.cover].variants.at(-1)!;
  return {
    metadataBase: new URL(SITE_URL), title, description,
    alternates: { canonical: url, languages: { lt: SITE_URL + localizedPath(path, "lt"), en: SITE_URL + localizedPath(path, "en"), "x-default": SITE_URL + path } },
    openGraph: { title, description, url, type: "article", locale: lang === "lt" ? "lt_LT" : "en_GB", alternateLocale: lang === "lt" ? "en_GB" : "lt_LT", images: [{ url: SOCIAL_MEDIA_URL + image.src, width: image.width, height: image.height, alt: project.photos[project.cover].alt[lang] }] },
    twitter: { card: "summary_large_image", title, description, images: [SOCIAL_MEDIA_URL + image.src] },
    robots: SITE_ROBOTS,
  };
}

export function gallerySchema(lang: Lang) {
  const url = SITE_URL + localizedPath("/darbai", lang);
  return { "@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#gallery", url, name: lang === "lt" ? "ATD atlikti darbai" : "ATD projects", inLanguage: lang,
    publisher: { "@id": SITE_URL }, mainEntity: { "@type": "ItemList", numberOfItems: projects.length, itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.title[lang], url: SITE_URL + localizedPath(projectPath(p.id), lang) })) } };
}

export function projectSchemas(project: GalleryProject, lang: Lang) {
  const url = SITE_URL + localizedPath(projectPath(project.id), lang);
  const images = project.photos.map(photo => { const v = photo.variants.at(-1)!; return { "@type": "ImageObject", contentUrl: SITE_URL + v.src, caption: photo.alt[lang], width: v.width, height: v.height }; });
  return [
    { "@context": "https://schema.org", "@type": "Article", "@id": url + "#story", url, mainEntityOfPage: url, headline: project.title[lang], description: project.description[lang], articleBody: [project.description[lang], project.scope?.[lang]].filter(Boolean).join(" "), inLanguage: lang, author: { "@type": "Organization", "@id": SITE_URL, name: "ATD — MB ATD.LT" }, publisher: { "@id": SITE_URL }, image: images[project.cover], hasPart: { "@type": "ImageGallery", "@id": url + "#photos", name: project.title[lang], associatedMedia: images } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "lt" ? "Pagrindinis" : "Home", item: SITE_URL + localizedPath("/", lang) },
      { "@type": "ListItem", position: 2, name: lang === "lt" ? "Atlikti darbai" : "Our work", item: SITE_URL + localizedPath("/darbai", lang) },
      { "@type": "ListItem", position: 3, name: project.title[lang], item: url },
    ] },
  ];
}
