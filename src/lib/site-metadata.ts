import type { Metadata } from "next";
import { localizedPath, PAGE_PATHS } from "./navigation";
import type { Lang } from "./translations";
import { planningArticle, pondArticle } from "./tips-content";

export type PagePath = typeof PAGE_PATHS[number];
export const SITE_URL = "https://atd.lt";
// The Vercel site is a review copy until the owner migrates atd.lt.
// Enable only for the primary-domain launch; branch previews stay noindex.
export const SITE_INDEXABLE = process.env.ATD_INDEXING_ENABLED === "true" && process.env.VERCEL_ENV !== "preview";
export const SITE_ROBOTS: Metadata["robots"] = { index: SITE_INDEXABLE, follow: true };
export const PAGE_META = {
  "/patarimai": {
    title: { lt: "Naudinga informacija ir aplinkos tvarkymo patarimai | ATD", en: "Landscaping Guides and Useful Information | ATD" },
    description: { lt: "Praktiniai ATD patarimai: kaip suplanuoti aplinkos tvarkymo darbus, pasiruošti tvenkinio kasimui ir palyginti rangovų pasiūlymus.", en: "Practical ATD landscaping guides: plan your garden work, prepare for pond excavation and compare contractor quotes with a clear scope." },
  },
  "/patarimai/aplinkos-tvarkymo-darbu-planas": { title: planningArticle.title, description: planningArticle.description },
  "/patarimai/tvenkinio-kasimo-planavimas": { title: pondArticle.title, description: pondArticle.description },
  "/": {
    title: { lt: "ATD — Aplinkos tvarkymas Vilniuje | Veja, apželdinimas, trinkelės", en: "ATD — Landscaping in Vilnius | Lawns, Planting & Paving" },
    description: { lt: "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas nuo 8 €/m². Apželdinimas, trinkelių klojimas, laistymo sistemos. Pirminė konsultacija nemokama.", en: "Landscaping in Vilnius and Vilnius district. Roll-on lawn from €8/m², planting, paving, irrigation and pond services. Free initial consultation." },
  },
  "/paslaugos/veja": {
    title: { lt: "Vejos įrengimas Vilniuje — Ruloninė nuo 8 €/m²", en: "Lawn Installation in Vilnius — Roll-on Lawn from €8/m² | ATD" },
    description: { lt: "Profesionalus vejos įrengimas Vilniuje. Ruloninė veja nuo 8 €/m², sėjama veja nuo 4 €/m². Darbų apimtis pagal pasiūlymą. Pirminė konsultacija nemokama. 170+ atliktų projektų.", en: "Roll-on lawn from €8/m² and seeded lawn from €4/m² in Vilnius. Scope as agreed in your quote. Free initial consultation. 170+ completed projects." },
  },
  "/paslaugos/apzeldinimas": {
    title: { lt: "Teritorijos apželdinimas Vilniuje — Augalų sodinimas", en: "Landscape Planting in Vilnius — Plants & Garden Projects | ATD" },
    description: { lt: "Augalų parinkimas ir sodinimas Vilniuje. Dirbame su architektų želdynų projektais. Garantijų sąlygos pagal sutartį. Pirminė konsultacija nemokama.", en: "Plant selection and landscape planting in Vilnius. We work from architects’ planting plans. Warranty terms agreed in the contract. Free initial consultation." },
  },
  "/paslaugos/trinkeles": {
    title: { lt: "Trinkelių klojimas Vilniuje — Betoninės nuo 40 €/m²", en: "Paving Installation in Vilnius — Concrete from €40/m² | ATD" },
    description: { lt: "Trinkelių klojimas Vilniuje. Betoninės nuo 40 €/m², granito ir klinkerinės nuo 55 €/m², natūralus akmuo nuo 65 €/m². Pagrindo darbai pagal pasiūlymą.", en: "Paving in Vilnius: concrete from €40/m², granite and clinker from €55/m², natural stone from €65/m². Base work as agreed in your quote." },
  },
  "/paslaugos/laistymas": {
    title: { lt: "Laistymo sistemų įrengimas Vilniuje — Hunter & Rain Bird", en: "Irrigation Systems in Vilnius — Hunter & Rain Bird | ATD" },
    description: { lt: "Automatinių laistymo sistemų įrengimas Vilniuje. Hunter ir Rain Bird įranga. Pop-up purškikliai, lašelinis ir mikrolaistymas. Projektavimas ir matavimas pagal susitarimą.", en: "Automatic irrigation in Vilnius with Hunter and Rain Bird equipment. Pop-up sprinklers, drip and micro-irrigation. Design and surveys by agreement." },
  },
  "/paslaugos/tvenkiniai": {
    title: { lt: "Tvenkinių kasimas ir priežiūra Vilniuje — ATD", en: "Pond Construction & Maintenance in Vilnius | ATD" },
    description: { lt: "Profesionalus tvenkinių kasimas, valymas ir įžuvinimas Vilniuje ir Vilniaus rajone. Pirminė konsultacija nemokama. Pasiūlymo terminas derinamas individualiai.", en: "Pond construction, cleaning and fish stocking in Vilnius and Vilnius district. Free initial consultation. Quotation timelines are agreed individually." },
  },
  "/kontaktai": {
    title: { lt: "Kontaktai | ATD Aplinkos tvarkymas Vilniuje", en: "Contact ATD — Landscaping in Vilnius" },
    description: { lt: "Susisiekite su ATD — nemokama pirminė konsultacija. Tel. +370 657 85096. Dirbame Vilniuje ir rajone. Pasiūlymo terminas derinamas individualiai.", en: "Contact ATD for a free initial landscaping consultation in Vilnius and Vilnius district. Call +370 657 85096. Quotation timelines are agreed individually." },
  },
  "/darbai": {
    title: { lt: "Atlikti darbai | ATD Aplinkos tvarkymas Vilniuje", en: "Our Work — ATD Landscaping Projects in Vilnius" },
    description: { lt: "ATD darbų istorijos: Trakų Vokės dvaras, Pilaitės gimnazija ir kiti objektai. Apželdinimo, vejos, dangų ir tvenkinių darbų eiga bei rezultatai.", en: "ATD project stories: Trakų Vokė Manor, Pilaitė Gymnasium and other sites. Explore planting, lawn, paving and pond work from preparation to results." },
  },
} as const;

export function pageMetadata(path: PagePath, lang: Lang): Metadata {
  const title = PAGE_META[path].title[lang];
  const description = PAGE_META[path].description[lang];
  const url = SITE_URL + localizedPath(path, lang);
  return {
    metadataBase: new URL(SITE_URL), title, description,
    alternates: { canonical: url, languages: { lt: SITE_URL + localizedPath(path, "lt"), en: SITE_URL + localizedPath(path, "en"), "x-default": SITE_URL + localizedPath(path, "lt") } },
    openGraph: { title, description, url, locale: lang === "lt" ? "lt_LT" : "en_GB", alternateLocale: lang === "lt" ? "en_GB" : "lt_LT", type: path.startsWith("/patarimai/") ? "article" : "website", images: [{ url: "/images/og-atd.jpg", width: 1200, height: 630, alt: "ATD" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/og-atd.jpg"] },
  };
}
