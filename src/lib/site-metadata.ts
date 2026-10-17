import type { Metadata } from "next";
import { localizedPath, PAGE_PATHS } from "./navigation";
import type { Lang } from "./translations";

export type PagePath = typeof PAGE_PATHS[number];
export const SITE_URL = "https://atd.lt";
export const PAGE_META = {
  "/": {
    title: { lt: "ATD — Aplinkos tvarkymas Vilniuje | Veja, apželdinimas, trinkelės", en: "ATD — Landscaping in Vilnius | Lawns, Planting & Paving" },
    description: { lt: "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas nuo 8 €/m². Apželdinimas, trinkelių klojimas, laistymo sistemos. Nemokama apžiūra.", en: "Landscaping in Vilnius and Vilnius district. Roll-on lawn from €8/m², planting, paving, irrigation and pond services. Free site visit." },
  },
  "/paslaugos/veja": {
    title: { lt: "Vejos įrengimas Vilniuje — Ruloninė nuo 8 €/m²", en: "Lawn Installation in Vilnius — Roll-on Lawn from €8/m² | ATD" },
    description: { lt: "Profesionalus vejos įrengimas Vilniuje. Ruloninė veja nuo 8 €/m², sėjama veja nuo 4 €/m². Grunto paruošimas įskaičiuotas. Nemokama apžiūra. 170+ atliktų projektų.", en: "Roll-on lawn from €8/m² and seeded lawn from €4/m² in Vilnius. Ground preparation included. Free site visit. 170+ completed projects." },
  },
  "/paslaugos/apzeldinimas": {
    title: { lt: "Teritorijos apželdinimas Vilniuje — Augalų sodinimas", en: "Landscape Planting in Vilnius — Plants & Garden Projects | ATD" },
    description: { lt: "Augalų parinkimas ir sodinimas Vilniuje. Dirbame su architektų želdynų projektais. Sodinimas su 1 metų garantija. Nemokama apžiūra.", en: "Plant selection and landscape planting in Vilnius. We work from architects’ planting plans. One-year planting guarantee. Free site visit." },
  },
  "/paslaugos/trinkeles": {
    title: { lt: "Trinkelių klojimas Vilniuje — Betoninės nuo 40 €/m²", en: "Paving Installation in Vilnius — Concrete from €40/m² | ATD" },
    description: { lt: "Trinkelių klojimas Vilniuje. Betoninės nuo 40 €/m², granito ir klinkerinės nuo 55 €/m², natūralus akmuo nuo 65 €/m². Pagrindo paruošimas įskaičiuotas.", en: "Paving in Vilnius: concrete from €40/m², granite and clinker from €55/m², natural stone from €65/m². Base preparation included." },
  },
  "/paslaugos/laistymas": {
    title: { lt: "Laistymo sistemų įrengimas Vilniuje — Hunter & Rain Bird", en: "Irrigation Systems in Vilnius — Hunter & Rain Bird | ATD" },
    description: { lt: "Automatinių laistymo sistemų įrengimas Vilniuje. Hunter ir Rain Bird įranga. Pop-up purškikliai, lašelinis ir mikrolaistymas. Nemokamas projektas ir matavimas.", en: "Automatic irrigation in Vilnius with Hunter and Rain Bird equipment. Pop-up sprinklers, drip and micro-irrigation. Free design and measurement." },
  },
  "/paslaugos/tvenkiniai": {
    title: { lt: "Tvenkinių kasimas ir priežiūra Vilniuje — ATD", en: "Pond Construction & Maintenance in Vilnius | ATD" },
    description: { lt: "Profesionalus tvenkinių kasimas, valymas ir įžuvinimas Vilniuje ir Vilniaus rajone. Nemokama apžiūra. Kainų pasiūlymas per 24–48 val.", en: "Pond construction, cleaning and fish stocking in Vilnius and Vilnius district. Free site visit. Price proposal within 24–48 hours." },
  },
  "/kontaktai": {
    title: { lt: "Kontaktai | ATD Aplinkos tvarkymas Vilniuje", en: "Contact ATD — Landscaping in Vilnius" },
    description: { lt: "Susisiekite su ATD — nemokama apžiūra ir konsultacija. Tel. +370 657 85096. Dirbame Vilniuje ir rajone. Kainų pasiūlymas per 24–48 val.", en: "Contact ATD for a free landscaping site visit in Vilnius and Vilnius district. Call +370 657 85096. Price proposal within 24–48 hours." },
  },
  "/darbai": {
    title: { lt: "Atlikti darbai | ATD Aplinkos tvarkymas Vilniuje", en: "Our Work — ATD Landscaping Projects in Vilnius" },
    description: { lt: "Realūs ATD projektai Vilniuje. Veja, apželdinimas, trinkelės ir laistymo sistemos. Peržiūrėkite mūsų atliktus darbus.", en: "Real ATD projects in Vilnius: lawns, landscape planting, paving and irrigation systems. Explore our completed work." },
  },
} as const;

export function pageMetadata(path: PagePath, lang: Lang): Metadata {
  const title = PAGE_META[path].title[lang];
  const description = PAGE_META[path].description[lang];
  const url = SITE_URL + localizedPath(path, lang);
  return {
    metadataBase: new URL(SITE_URL), title, description,
    alternates: { canonical: url, languages: { lt: SITE_URL + localizedPath(path, "lt"), en: SITE_URL + localizedPath(path, "en"), "x-default": SITE_URL + localizedPath(path, "lt") } },
    openGraph: { title, description, url, locale: lang === "lt" ? "lt_LT" : "en_GB", alternateLocale: lang === "lt" ? "en_GB" : "lt_LT", type: "website", images: [{ url: "/images/og-atd.jpg", width: 1200, height: 630, alt: "ATD" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/og-atd.jpg"] },
  };
}
