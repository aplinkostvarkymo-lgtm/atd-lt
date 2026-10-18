import type { Metadata } from "next";
import { localizedPath, PAGE_PATHS } from "./navigation";
import type { Lang } from "./translations";
import { planningArticle, pondArticle } from "./tips-content";

export type PagePath = typeof PAGE_PATHS[number];
export const SITE_URL = "https://atd.lt";
// Social crawlers must fetch media from the working review host until domain launch.
export const SOCIAL_MEDIA_URL = process.env.ATD_INDEXING_ENABLED === "true" && process.env.VERCEL_ENV !== "preview" ? SITE_URL : "https://new.atd.lt";
// The Vercel site is a review copy until the owner migrates atd.lt.
// Enable only for the primary-domain launch; branch previews stay noindex.
export const SITE_INDEXABLE = process.env.ATD_INDEXING_ENABLED === "true" && process.env.VERCEL_ENV !== "preview";
export const SITE_ROBOTS: Metadata["robots"] = { index: SITE_INDEXABLE, follow: true };
export const PAGE_META = {
  "/patarimai": {
    title: { lt: "Naudinga informacija ir aplinkos tvarkymo patarimai | ATD", en: "Landscaping guides and advice | ATD" },
    description: { lt: "Praktiniai ATD patarimai: kaip suplanuoti aplinkos tvarkymo darbus, pasiruošti tvenkinio kasimui ir palyginti rangovų pasiūlymus.", en: "Practical ATD landscaping guides: plan your garden work, prepare for pond excavation and compare contractor quotes with a clear scope." },
  },
  "/patarimai/aplinkos-tvarkymo-darbu-planas": { title: planningArticle.title, description: planningArticle.description },
  "/patarimai/tvenkinio-kasimo-planavimas": { title: pondArticle.title, description: pondArticle.description },
  "/": {
    title: { lt: "ATD | Aplinkos tvarkymas Vilniuje | Veja, apželdinimas, trinkelės", en: "ATD | Landscaping in Vilnius | Lawns, Planting & Paving" },
    description: { lt: "Įrengiame vejas, sodiname augalus, klojame trinkeles ir montuojame laistymą Vilniuje bei rajone. Ruloninė veja nuo 8 €/m². Pirminė konsultacija nemokama.", en: "We lay lawns, plant gardens, build paths and install irrigation in Vilnius and the district. Turf from €8/m². Free initial consultation." },
  },
  "/paslaugos/veja": {
    title: { lt: "Vejos įrengimas Vilniuje | Ruloninė nuo 8 €/m²", en: "Lawn Installation in Vilnius | Turf from €8/m² | ATD" },
    description: { lt: "Vejos įrengimas Vilniuje: ruloninė nuo 8 €/m², sėjama nuo 4 €/m². Įvertiname gruntą ir pateikiame darbų pasiūlymą. Pirminė konsultacija nemokama.", en: "Lawn installation in Vilnius: turf from €8/m² or seed from €4/m². We assess the ground and quote for the work needed. Free initial consultation." },
  },
  "/paslaugos/apzeldinimas": {
    title: { lt: "Teritorijos apželdinimas Vilniuje | Augalų sodinimas", en: "Landscape Planting in Vilnius | Plants & Garden Projects | ATD" },
    description: { lt: "Parenkame ir sodiname augalus Vilniuje. Dirbame pagal architektų želdynų planus, mulčiuojame ir prižiūrime želdinius. Pirminė konsultacija nemokama.", en: "Planting in Vilnius, from choosing plants to mulching and maintenance. We work from architects’ planting plans. Free initial consultation." },
  },
  "/paslaugos/trinkeles": {
    title: { lt: "Trinkelių klojimas Vilniuje | Betoninės nuo 40 €/m²", en: "Paving Installation in Vilnius | Concrete from €40/m² | ATD" },
    description: { lt: "Klojame trinkeles Vilniuje: betoninės nuo 40 €/m², granito ir klinkerinės nuo 55 €/m², akmuo nuo 65 €/m². Pagrindo darbus išvardijame pasiūlyme.", en: "Paving in Vilnius: concrete from €40/m², granite and clay from €55/m², natural stone from €65/m². Your quote lists the base preparation needed." },
  },
  "/paslaugos/laistymas": {
    title: { lt: "Laistymo sistemų įrengimas Vilniuje | Hunter & Rain Bird", en: "Irrigation Systems in Vilnius | Hunter & Rain Bird | ATD" },
    description: { lt: "Įrengiame laistymą Vilniuje su Hunter ir Rain Bird įranga: purkštuvus, lašelinį laistymą ir mikrolaistymą. Matavimo ir projekto kainą aptariame iš anksto.", en: "We install Hunter and Rain Bird irrigation in Vilnius: sprinklers, drip lines and micro-irrigation. Survey and design fees agreed in advance." },
  },
  "/paslaugos/tvenkiniai": {
    title: { lt: "Tvenkinių kasimas ir priežiūra Vilniuje | ATD", en: "Pond Construction & Maintenance in Vilnius | ATD" },
    description: { lt: "Kasame, valome ir įžuviname tvenkinius Vilniuje bei rajone. Darbus parenkame apžiūrėję telkinį ir sklypą. Pirminė konsultacija nemokama.", en: "Pond excavation, cleaning and fish stocking in Vilnius and the district. We assess your site before quoting. Free initial consultation." },
  },
  "/kontaktai": {
    title: { lt: "Kontaktai | ATD Aplinkos tvarkymas Vilniuje", en: "Contact ATD | Landscaping in Vilnius" },
    description: { lt: "Planuojate aplinkos tvarkymo darbus Vilniuje ar rajone? Skambinkite Robertui +370 657 85096 arba rašykite. Pirminė konsultacija nemokama.", en: "Planning landscaping work in Vilnius or the district? Call Robertas on +370 657 85096 or send us a message. The initial consultation is free." },
  },
  "/darbai": {
    title: { lt: "Atlikti darbai | ATD Aplinkos tvarkymas Vilniuje", en: "Our Work | ATD Landscaping Projects in Vilnius" },
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
    openGraph: { title, description, url, locale: lang === "lt" ? "lt_LT" : "en_GB", alternateLocale: lang === "lt" ? "en_GB" : "lt_LT", type: path.startsWith("/patarimai/") ? "article" : "website", images: [{ url: SOCIAL_MEDIA_URL + "/images/og-atd.jpg", width: 1200, height: 630, alt: "ATD" }] },
    twitter: { card: "summary_large_image", title, description, images: [SOCIAL_MEDIA_URL + "/images/og-atd.jpg"] },
  };
}
