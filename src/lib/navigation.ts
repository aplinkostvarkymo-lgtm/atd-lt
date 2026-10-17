import type { Lang } from "./translations";

export const PAGE_PATHS = ["/", "/paslaugos/veja", "/paslaugos/apzeldinimas", "/paslaugos/trinkeles", "/paslaugos/laistymas", "/paslaugos/tvenkiniai", "/kontaktai", "/darbai"] as const;
export const SERVICE_LINKS = [
  { href: "/paslaugos/apzeldinimas", key: "apzeldinimas" },
  { href: "/paslaugos/veja", key: "veja" },
  { href: "/paslaugos/laistymas", key: "laistymas" },
  { href: "/paslaugos/trinkeles", key: "trinkelės" },
  { href: "/paslaugos/tvenkiniai", key: "tvenkiniai" },
] as const;

export function unlocalizedPath(path: string) {
  return path.replace(/^\/(?:en|lt)(?=\/|$)/, "") || "/";
}

export function localizedPath(path: string, lang: Lang) {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/api/")) return path;
  const clean = unlocalizedPath(path);
  return lang === "en" ? `/en${clean === "/" ? "" : clean}` : clean;
}
