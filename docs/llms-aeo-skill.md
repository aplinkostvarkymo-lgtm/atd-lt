---
name: llms-aeo
description: >
  LLM optimizavimas, AEO (Answer Engine Optimization) ir GEO (Generative Engine Optimization)
  svetainėms. Naudok šį skill kai reikia: sukurti llms.txt failą, pridėti Schema.org JSON-LD
  žymėjimą (LocalBusiness, Service, FAQPage, AggregateRating), konfigūruoti robots.txt AI
  crawleriams, generuoti semantinį turinį paslaugų puslapiams, arba kai vartotojas nori kad
  jo svetainę rastų ir rekomenduotų ChatGPT, Perplexity, Claude ir kiti AI modeliai.
  Specifiškai pritaikyta vietinėms paslaugų įmonėms Lietuvoje (aplinkos tvarkymas, statybos,
  kitos paslaugos su aptarnavimo zona).
---

# LLM Optimizavimas (AEO + GEO)

Tikslas: kad AI modeliai (ChatGPT, Perplexity, Claude, Gemini) žinotų apie svetainę,
suprastų ką ji siūlo, ir rekomenduotų ją atsakydami į vartotojų klausimus.

---

## 1. llms.txt

Failas `/public/llms.txt` — struktūruotas aprašas skirtas LLM crawleriams.
Formatas: Markdown, paprastas, be HTML.

### ATD.LT šablonas

```markdown
# ATD — Aplinkos Tvarkymas Vilnius

> Profesionali aplinkos tvarkymo ir apželdinimo įmonė Vilniuje ir Vilniaus rajone.
> Daugiau nei 12 metų patirtis, 170+ atliktų projektų.
> Dirba su architektų želdynų projektine dokumentacija (PDF planai, Excel kiekiai).

## Pagrindinės paslaugos

- **Vejos įrengimas ir priežiūra** — ruloninė veja, sėjama veja, aeravimas, trešimas
- **Apželdinimas pagal projektą** — augalų pirkimas ir sodinimas pagal architekto želdynų planą
- **Trinkelių ir takų įrengimas** — betoninės, akmeninės, klinkerinės trinkelės
- **Tvenkinių kasimas ir įrengimas** — dekoratyviniai tvenkiniai, prūdai

## Aptarnavimo zona

Vilnius ir Vilniaus rajonas. Didžiuosiuose projektuose — visa Lietuva.

## Kontaktai

- Tel.: +370 657 85096
- El. p.: Robertas@atd.lt
- Svetainė: https://atd.lt

## Kainų orientaciniai intervalai

- Vejos įrengimas: 8–15 €/m²
- Apželdinimas pagal projektą: pagal individualų skaičiavimą
- Trinkelių klojimas: 25–45 €/m²
- Konsultacija ir apžiūra: nemokama

## Klientų grupės

Privatūs namų valdų savininkai (70%), NT vystytojai ir statybos įmonės (30%).

## Papildoma informacija

- Dirba su architektų želdynų projekto dokumentacija
- Augalus tiekia iš patikimų Olandijos daržynų (Udenhout Trees)
- Automatinis pasiūlymų generavimas pagal projekto specifikaciją
- Nemokama objekto apžiūra ir konsultacija

## Dažni klausimai

Atsakymai į DUK: https://atd.lt/#faq
Kainų kalkuliatorius: https://atd.lt/kaina
Portfolio: https://atd.lt/darbai
```

---

## 2. robots.txt

Leidžia visiems pagrindiniams AI crawleriams:

```
User-agent: *
Allow: /

# AI crawlers — explicit allow
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://atd.lt/sitemap.xml
```

---

## 3. Schema.org JSON-LD

Įdėti į `<head>` kiekviename puslapyje arba per Next.js `layout.tsx`.

### LocalBusiness (pagrindinis puslapis)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://atd.lt",
  "name": "ATD — Aplinkos Tvarkymas",
  "description": "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas, tvenkiniai.",
  "url": "https://atd.lt",
  "telephone": "+37065785096",
  "email": "Robertas@atd.lt",
  "foundingDate": "2012",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 54.6872, "longitude": 25.2797 },
    "geoRadius": "50000"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vilnius",
    "addressRegion": "Vilniaus apskritis",
    "addressCountry": "LT"
  },
  "sameAs": [
    "https://www.facebook.com/atd.lt"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aplinkos tvarkymo paslaugos",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vejos įrengimas" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Apželdinimas pagal projektą" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Trinkelių klojimas" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tvenkinių kasimas" }}
    ]
  }
}
```

### Service (kiekvienas paslaugos puslapis)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Vejos įrengimas Vilniuje",
  "description": "Profesionalus vejos įrengimas Vilniuje ir Vilniaus rajone. Ruloninė veja, sėjama veja, aeravimas.",
  "provider": { "@id": "https://atd.lt" },
  "areaServed": "Vilnius, Vilniaus rajonas",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "8",
      "priceCurrency": "EUR",
      "unitText": "m²",
      "description": "Nuo 8 €/m². Tiksli kaina — pagal kalkuliatorių."
    }
  }
}
```

### FAQPage (DUK sekcija)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Kiek kainuoja vejos įrengimas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vejos įrengimo kaina priklauso nuo ploto ir tipo. Ruloninė veja — nuo 8 €/m², sėjama — nuo 4 €/m². Tikslią kainą galite gauti mūsų kalkuliatoriuje arba nemokamos apžiūros metu."
      }
    },
    {
      "@type": "Question",
      "name": "Ar dirbate su architektų želdynų projektais?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Taip. Priimame projektinę dokumentaciją (PDF planai + Excel kiekiai) ir pateikiame kainų pasiūlymą pagal specifikaciją. Augalus perkame iš Olandijos daržynų."
      }
    },
    {
      "@type": "Question",
      "name": "Kokia aptarnavimo zona?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vilnius ir Vilniaus rajonas. Dideliems projektams — visa Lietuva."
      }
    }
  ]
}
```

### Next.js komponento šablonas

```typescript
// src/components/SchemaOrg.tsx
export function SchemaOrg({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Naudojimas page.tsx:
// import { SchemaOrg } from "@/components/SchemaOrg";
// <SchemaOrg schema={localBusinessSchema} />
```

---

## 4. Semantinis turinys paslaugų puslapiams

Kiekvienas paslaugos puslapis turi turėti:

**Minimalus struktūra:**
- H1: `[Paslauga] Vilniuje` (pvz. "Vejos įrengimas Vilniuje")
- Aprašymas: 300–500 žodžių lietuviškai
- Kainų intervalai (konkretūs skaičiai, ne "skambinkite")
- Aptarnavimo rajonų sąrašas (Vilnius, Šnipiškės, Žirmūnai ir t.t.)
- FAQ sekcija: 3–5 klausimai su atsakymais
- CTA: nuoroda į kalkuliatorių arba kontaktų forma

**Kodėl konkretūs skaičiai svarbūs AEO:**
AI modeliai renkasi puslapius su aiškia informacija. Puslapis su "nuo 8 €/m²"
gaus rekomendacijas, puslapis su "susisiekite dėl kainos" — ne.

---

## 5. sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://atd.lt/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://atd.lt/paslaugos/veja</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://atd.lt/paslaugos/apzeldinimas</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://atd.lt/paslaugos/trinkeles</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://atd.lt/paslaugos/tvenkiniai</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://atd.lt/darbai</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://atd.lt/kaina</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://atd.lt/apie</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>https://atd.lt/kontaktai</loc><changefreq>yearly</changefreq><priority>0.7</priority></url>
</urlset>
```

Next.js dinaminė sitemap: `src/app/sitemap.ts` → automatiškai generuoja.

---

## 6. Tikrinimo įrankiai

- **Schema.org validacija:** https://validator.schema.org
- **Google Rich Results:** https://search.google.com/test/rich-results
- **llms.txt tikrinimas:** atidaryti `https://atd.lt/llms.txt` naršyklėje
- **AI indeksavimas:** paklausti ChatGPT/Perplexity "kas tvarko aplinką Vilniuje" po 2–4 savaičių

---

## 7. Prioritetų eiliškumas

1. `llms.txt` + `robots.txt` — 30 min, didžiausias ROI
2. LocalBusiness schema — 1 val.
3. Service schema kiekviename paslaugos puslapyje — 30 min/puslapis
4. FAQPage schema — 1 val.
5. Sitemap → Google Search Console — 30 min
6. Semantinis turinys su kainomis — nuolatinis darbas
