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

export const trinkelesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Kiek kainuoja trinkelių klojimas?", acceptedAnswer: { "@type": "Answer", text: "Betoninės trinkelės — nuo 40 €/m², granito ir klinkerinės — nuo 55 €/m², natūralus akmuo — nuo 65 €/m². Į kainą įeina pagrindo paruošimas ir darbai." } },
    { "@type": "Question", name: "Ar trinkelės atlaikys Lietuvos žiemą?", acceptedAnswer: { "@type": "Answer", text: "Taip — tinkamai paklotų trinkelių pagrindas atlaiko šalčio ir atlydžio ciklus. Svarbiausia tinkamas drenažas ir pagrindo storis." } },
    { "@type": "Question", name: "Kiek laiko trunka trinkelių klojimo darbai?", acceptedAnswer: { "@type": "Answer", text: "Vidutinis kiemas (30–80 m²) — 2–4 darbo dienos. Tiksliau nurodome po apžiūros." } },
    { "@type": "Question", name: "Ar pagrindo paruošimas įskaičiuotas į kainą?", acceptedAnswer: { "@type": "Answer", text: "Taip — standartinis pagrindo paruošimas (iškasimas, skaldos ir smėlio sluoksniai, geotekstilė) įeina į kainą." } },
    { "@type": "Question", name: "Kokia aptarnavimo zona?", acceptedAnswer: { "@type": "Answer", text: "Vilnius ir Vilniaus rajonas be papildomo mokesčio. Dideliems projektams — visa Lietuva." } },
  ],
};

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

export const apzeldinimsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Kiek kainuoja apželdinimas?", acceptedAnswer: { "@type": "Answer", text: "Kaina priklauso nuo teritorijos dydžio, augalų kiekio ir tipo. Pateikiame kainų pasiūlymą po nemokamos apžiūros arba pagal pateiktą architektūrinę dokumentaciją." } },
    { "@type": "Question", name: "Ar dirbate su architektų želdynų projektais?", acceptedAnswer: { "@type": "Answer", text: "Taip. Priimame PDF želdynų planus ir Excel augalų specifikacijas. Pateikiame kainų pasiūlymą pagal dokumentaciją — be papildomų apžiūrų." } },
    { "@type": "Question", name: "Iš kur perkate augalus?", acceptedAnswer: { "@type": "Answer", text: "Iš patikimų Olandijos daržynų (Udenhout Trees) ir lietuviškų medelynų. Garantuojame augalų kokybę ir sveikatą." } },
    { "@type": "Question", name: "Ar suteikiama garantija augalams?", acceptedAnswer: { "@type": "Answer", text: "Taip — 1 metų garantija pasodintams augalams. Jei augalas žūva ne dėl netinkamos priežiūros — pakeitimas nemokamas." } },
    { "@type": "Question", name: "Koks geriausias sezonas sodinimui?", acceptedAnswer: { "@type": "Answer", text: "Pavasaris (balandis–gegužė) ir ruduo (rugsėjis–spalis) — optimaliausi. Vasarą taip pat sodiname, tačiau reikia dažnesnio laistymo." } },
  ],
};

export const vejaFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kiek kainuoja vejos įrengimas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ruloninė veja — nuo 8 €/m², sėjama — nuo 4 €/m². Kaina priklauso nuo ploto ir dirvos paruošimo sudėtingumo. Tikslų pasiūlymą pateikiame po nemokamos apžiūros.",
      },
    },
    {
      "@type": "Question",
      name: "Koks geriausias sezonas vejos įrengimui?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Optimalus sezonas — gegužė–rugsėjis. Ruloninę veją galima dėti nuo +10 °C, sėjamą — nuo balandžio pabaigos iki rugpjūčio.",
      },
    },
    {
      "@type": "Question",
      name: "Kiek laiko trunka vejos įrengimo darbai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paprastai 1–3 darbo dienos, priklausomai nuo ploto. Tiksliau nurodome po apžiūros.",
      },
    },
    {
      "@type": "Question",
      name: "Ar grunto paruošimas įskaičiuotas į vejos įrengimo kainą?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Taip — standartinis grunto paruošimas (šalinimas, lyginimas, kultivavimas, tręšimas) įeina į kainą. Papildomas žemės įvežimas ar drenažas — atskiras mokestis.",
      },
    },
    {
      "@type": "Question",
      name: "Ar suteikiama garantija vejos įrengimui?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ruloninei vejai — 30 dienų garantija. Jei veja neprigyja dėl mūsų kaltės, perklojame nemokamai.",
      },
    },
    {
      "@type": "Question",
      name: "Kokia vejos įrengimo aptarnavimo zona?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vilnius ir Vilniaus rajonas be papildomo mokesčio. Dideliems projektams (nuo 500 m²) — visa Lietuva.",
      },
    },
  ],
};

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

export const laistymasFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Kiek kainuoja laistymo sistemos įrengimas?", acceptedAnswer: { "@type": "Answer", text: "Kaina priklauso nuo teritorijos ploto, sistemos tipo ir sudėtingumo. Standartiniam namų kiemuil (200–400 m²) — paprastai 800–2000 €. Tikslų pasiūlymą pateikiame po nemokamo matavimo." } },
    { "@type": "Question", name: "Kokią įrangą naudojate?", acceptedAnswer: { "@type": "Answer", text: "Naudojame Hunter ir Rain Bird — profesionalios klasės įrangą su ilgalaikia garantija. Atsarginės dalys prieinamos Lietuvoje." } },
    { "@type": "Question", name: "Ar sistema veiks žiemą?", acceptedAnswer: { "@type": "Answer", text: "Ne — sistemą reikia žieminti prieš šalčius. Siūlome kasmetinę žieminimo paslaugą: sistema išpučiama suspaustu oru ir paruošiama kitam sezonui." } },
    { "@type": "Question", name: "Kiek laiko trunka montavimas?", acceptedAnswer: { "@type": "Answer", text: "Vidutinis namų valdos laistymas (200–400 m²) — 1–2 darbo dienos. Tiksliau nurodome po projekto." } },
    { "@type": "Question", name: "Ar galima įrengti esamame sode?", acceptedAnswer: { "@type": "Answer", text: "Taip — kasamos siauros tranšėjos su specialia technika, kuri minimaliai pažeidžia vejną ar gėlynus. Po darbų vieta atstatoma." } },
    { "@type": "Question", name: "Kokia aptarnavimo zona?", acceptedAnswer: { "@type": "Answer", text: "Vilnius ir Vilniaus rajonas. Žieminimo paslaugą teikiame tik įrengtoms mūsų sistemoms." } },
  ],
};
