import { buildFaqSchema } from "./buildFaqSchema";
import { translations } from "./translations";
import type { Lang } from "./translations";
import { SERVICE_LINKS, localizedPath } from "./navigation";
import { PAGE_META, SITE_URL, type PagePath } from "./site-metadata";
import { TIPS_ARTICLES, tipsCopy } from "./tips-content";
import { gallerySchema } from "./gallery-seo";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://atd.lt",
  name: "ATD — Aplinkos Tvarkymas",
  legalName: "MB ATD.LT",
  description:
    "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas, laistymo sistemos.",
  url: "https://atd.lt",
  telephone: "+37065785096",
  email: "Robertas@atd.lt",
  sameAs: ["https://www.facebook.com/RoberasATD.LT"],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 54.6872, longitude: 25.2797 },
    geoRadius: "50000",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vilnius",
    addressRegion: "Vilniaus apskritis",
    addressCountry: "LT",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Aplinkos tvarkymo paslaugos",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vejos įrengimas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Apželdinimas pagal projektą" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trinkelių klojimas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Laistymo sistemų įrengimas" } },
    ],
  },
};

export const vejaServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Vejos įrengimas Vilniuje",
  description:
    "Profesionalus vejos įrengimas Vilniuje. Ruloninė veja nuo 8 €/m², sėjama veja nuo 4 €/m². Nemokama apžiūra.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://atd.lt",
    name: "ATD — Aplinkos Tvarkymas",
  },
  areaServed: { "@type": "City", name: "Vilnius" },
  serviceType: "Lawn installation",
  offers: [
    {
      "@type": "Offer",
      name: "Ruloninė veja",
      description: "Ruloninė veja — paruošta iš karto. Grunto paruošimas įskaičiuotas.",
      price: "8",
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "8", priceCurrency: "EUR", unitCode: "MTK" },
    },
    {
      "@type": "Offer",
      name: "Sėjama veja",
      description: "Sėjama veja — ekonomiška dideliems plotams.",
      price: "4",
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "4", priceCurrency: "EUR", unitCode: "MTK" },
    },
  ],
};

export const trinkelesServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Trinkelių klojimas Vilniuje",
  description:
    "Profesionalus trinkelių klojimas ir takų įrengimas Vilniuje. Betoninės nuo 40 €/m², granito ir klinkerinės nuo 55 €/m², natūralus akmuo nuo 65 €/m².",
  provider: { "@type": "LocalBusiness", "@id": "https://atd.lt", name: "ATD — Aplinkos Tvarkymas" },
  areaServed: { "@type": "City", name: "Vilnius" },
  serviceType: "Paving and path installation",
  offers: [
    { "@type": "Offer", name: "Betoninės trinkelės", price: "40", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: "40", priceCurrency: "EUR", unitCode: "MTK" } },
    { "@type": "Offer", name: "Granito trinkelės",   price: "55", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: "55", priceCurrency: "EUR", unitCode: "MTK" } },
    { "@type": "Offer", name: "Natūralus akmuo",     price: "65", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: "65", priceCurrency: "EUR", unitCode: "MTK" } },
  ],
};

export const trinkelesFaqSchema = buildFaqSchema(translations.lt.trinkelesPas);

export const apzeldinimosServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Teritorijos apželdinimas Vilniuje",
  description:
    "Profesionalus teritorijų apželdinimas Vilniuje. Augalų parinkimas, sodinimas su 1 metų garantija, mulčiavimas. Dirbame su architektų želdynų projektais.",
  provider: { "@type": "LocalBusiness", "@id": "https://atd.lt", name: "ATD — Aplinkos Tvarkymas" },
  areaServed: { "@type": "City", name: "Vilnius" },
  serviceType: "Landscape planting",
};

export const apzeldinimsFaqSchema = buildFaqSchema(translations.lt.apzeldinimoPas);

export const vejaFaqSchema = buildFaqSchema(translations.lt.vejaPage);

export const laistymasServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://atd.lt/paslaugos/laistymas",
  name: "Laistymo sistemų įrengimas",
  url: "https://atd.lt/paslaugos/laistymas",
  description:
    "Automatinių laistymo sistemų įrengimas Vilniuje. Hunter ir Rain Bird įranga. Pop-up purškikliai, lašelinis ir mikrolaistymas. Nemokamas projektas ir matavimas.",
  provider: { "@type": "LocalBusiness", "@id": "https://atd.lt", name: "ATD — Aplinkos Tvarkymas" },
  areaServed: { "@type": "City", name: "Vilnius" },
  serviceType: "Irrigation system installation",
};

export const laistymasFaqSchema = buildFaqSchema(translations.lt.laistymasPas);

export const kontaktaiFaqSchema = buildFaqSchema(translations.lt.kontaktaiPage);

export function businessSchema(lang: Lang) {
  return {
    ...localBusinessSchema,
    description: PAGE_META["/"].description[lang],
    areaServed: [{ "@type": "City", name: "Vilnius" }, { "@type": "AdministrativeArea", name: lang === "lt" ? "Vilniaus rajonas" : "Vilnius district" }],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
    ],
    hasOfferCatalog: { "@type": "OfferCatalog", name: translations[lang].nav.services, itemListElement: SERVICE_LINKS.map(({ key, href }) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: translations[lang].nav.services_sub[key], url: SITE_URL + localizedPath(href, lang) } })) },
  };
}

export function pageSchemas(path: PagePath, lang: Lang): object[] {
  const t = translations[lang];
  const faq = {
    "/paslaugos/veja": t.vejaPage, "/paslaugos/apzeldinimas": t.apzeldinimoPas,
    "/paslaugos/trinkeles": t.trinkelesPas, "/paslaugos/laistymas": t.laistymasPas,
    "/paslaugos/tvenkiniai": t.tvenkiniaiPas, "/kontaktai": t.kontaktaiPage,
  };
  const schemas: object[] = [];
  if (path === "/darbai") schemas.push(gallerySchema(lang));
  const article = TIPS_ARTICLES.find(item => item.path === path);
  if (path === "/patarimai") schemas.push({ "@context": "https://schema.org", "@type": "CollectionPage", name: tipsCopy[lang].heading, url: SITE_URL + localizedPath(path, lang), inLanguage: lang, mainEntity: { "@type": "ItemList", itemListElement: TIPS_ARTICLES.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title[lang], url: SITE_URL + localizedPath(item.path, lang) })) } });
  if (article) schemas.push({ "@context": "https://schema.org", "@type": "Article", "@id": SITE_URL + localizedPath(path, lang) + "#article", headline: article.title[lang], description: article.description[lang], inLanguage: lang, mainEntityOfPage: SITE_URL + localizedPath(path, lang), author: { "@type": "Organization", "@id": SITE_URL, name: "ATD", url: SITE_URL }, publisher: { "@id": SITE_URL }, image: SITE_URL + "/images/og-atd.jpg" });
  if (path in faq) schemas.push(buildFaqSchema(faq[path as keyof typeof faq]));
  if (path.startsWith("/paslaugos/")) {
    const service = SERVICE_LINKS.find(item => item.href === path)!;
    const prices = path === "/paslaugos/veja" ? [
      { name: t.vejaPage.type1_name, price: "8" }, { name: t.vejaPage.type2_name, price: "4" },
    ] : path === "/paslaugos/trinkeles" ? [
      { name: lang === "lt" ? "Betoninės trinkelės" : "Concrete paving", price: "40" },
      { name: lang === "lt" ? "Granito trinkelės" : "Granite paving", price: "55" },
      { name: lang === "lt" ? "Klinkerinės trinkelės" : "Clinker paving", price: "55" },
      { name: lang === "lt" ? "Natūralus akmuo" : "Natural stone", price: "65" },
    ] : [];
    schemas.push({ "@context": "https://schema.org", "@type": "Service", "@id": SITE_URL + localizedPath(path, lang) + "#service", name: t.nav.services_sub[service.key], description: PAGE_META[path].description[lang], url: SITE_URL + localizedPath(path, lang), provider: { "@id": SITE_URL }, areaServed: { "@type": "City", name: "Vilnius" }, ...(prices.length ? { offers: prices.map(item => ({ "@type": "Offer", ...item, priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", price: item.price, priceCurrency: "EUR", unitCode: "MTK" } })) } : {}) });
  }
  if (path !== "/") schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: t.common.home, item: SITE_URL + localizedPath("/", lang) }, ...(article ? [{ "@type": "ListItem", position: 2, name: tipsCopy[lang].heading, item: SITE_URL + localizedPath("/patarimai", lang) }] : []), { "@type": "ListItem", position: article ? 3 : 2, name: PAGE_META[path].title[lang], item: SITE_URL + localizedPath(path, lang) }] });
  return schemas;
}
