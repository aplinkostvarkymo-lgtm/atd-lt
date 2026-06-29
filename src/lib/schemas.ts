import { buildFaqSchema } from "./buildFaqSchema";
import { translations } from "./translations";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://atd.lt",
  name: "ATD — Aplinkos Tvarkymas",
  description:
    "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas, laistymo sistemos.",
  url: "https://atd.lt",
  telephone: "+37065785096",
  email: "Robertas@atd.lt",
  sameAs: ["https://www.facebook.com/RoberasATD.LT"],
  foundingDate: "2012",
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
