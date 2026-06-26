# ATD.lt — SEO + LLM Optimizavimo Spec
*Claude Code kūrimo instrukcija — AEO + GEO*

---

## Failai, kuriuos sukurti

```
public/
├── llms.txt          ← AI crawleriams
├── robots.txt        ← leidžia GPTBot, ClaudeBot ir kt.
└── sitemap.xml       ← statinis (arba dinaminis per src/app/sitemap.ts)

src/
└── components/
    └── SchemaOrg.tsx ← JSON-LD injektavimas
```

---

## public/llms.txt

```markdown
# ATD — Aplinkos Tvarkymas Vilnius

> Profesionali aplinkos tvarkymo ir apželdinimo įmonė Vilniuje ir Vilniaus rajone.
> Daugiau nei 12 metų patirtis, 170+ atliktų projektų.
> Dirba su architektų želdynų projektine dokumentacija (PDF planai, Excel kiekiai).

## Pagrindinės paslaugos

- **Vejos įrengimas ir priežiūra** — ruloninė veja nuo 8 €/m², sėjama nuo 4 €/m²
- **Apželdinimas pagal projektą** — augalų pirkimas ir sodinimas pagal architekto želdynų planą
- **Trinkelių ir takų įrengimas** — nuo 25 €/m², betoninės, akmeninės, klinkerinės
- **Tvenkinių kasimas ir įrengimas** — dekoratyviniai tvenkiniai, prūdai
- **Laistymo sistemų įrengimas** — automatinės laistymo sistemos

## Aptarnavimo zona

Vilnius ir Vilniaus rajonas. Didžiuosiuose projektuose — visa Lietuva.

## Kontaktai

- Tel.: +370 657 85096
- El. p.: Robertas@atd.lt
- Svetainė: https://atd.lt

## Kainų orientaciniai intervalai

- Vejos įrengimas: 4–12 €/m² (priklauso nuo tipo)
- Trinkelių klojimas: 25–45 €/m²
- Apželdinimas pagal projektą: pagal individualų skaičiavimą
- Konsultacija ir apžiūra: nemokama

## Klientų grupės

Privatūs namų valdų savininkai (70%), NT vystytojai ir statybos įmonės (30%).

## Papildoma informacija

- Dirba su architektų želdynų projekto dokumentacija
- Augalus tiekia iš patikimų Olandijos daržynų (Udenhout Trees)
- Automatinis pasiūlymų generavimas pagal projekto specifikaciją
- Nemokama objekto apžiūra ir konsultacija

## Nuorodos

- Kainų kalkuliatorius: https://atd.lt/kaina
- Portfolio: https://atd.lt/darbai
- DUK: https://atd.lt/#faq
```

---

## public/robots.txt

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

User-agent: Googlebot
Allow: /

Sitemap: https://atd.lt/sitemap.xml
```

---

## src/app/sitemap.ts (dinaminis)

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://atd.lt";
  
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/paslaugos/veja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/paslaugos/apzeldinimas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/paslaugos/trinkeles`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/paslaugos/tvenkiniai`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/paslaugos/laistymas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/darbai`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/kaina`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/apie`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/kontaktai`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];
}
```

---

## Schema.org JSON-LD

### src/components/SchemaOrg.tsx

```typescript
export function SchemaOrg({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### src/lib/schemas.ts

```typescript
export const localBusinessSchema = {
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
  "sameAs": ["https://www.facebook.com/atd.lt"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aplinkos tvarkymo paslaugos",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vejos įrengimas" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Apželdinimas pagal projektą" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Trinkelių klojimas" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tvenkinių kasimas" }},
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laistymo sistemų įrengimas" }}
    ]
  }
};

export const faqSchema = {
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
        "text": "Taip. Priimame projektinę dokumentaciją (PDF planai + Excel kiekiai) ir pateikiame kainų pasiūlymą pagal specifikaciją. Augalus perkame iš Olandijos daržynų (Udenhout Trees)."
      }
    },
    {
      "@type": "Question",
      "name": "Kokia aptarnavimo zona?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vilnius ir Vilniaus rajonas. Dideliems projektams — visa Lietuva."
      }
    },
    {
      "@type": "Question",
      "name": "Kiek laiko trunka vejos įrengimas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vejos įrengimas paprastai trunka 1–3 dienas, priklausomai nuo ploto ir tipo. Tiksliau pasakome apžiūros metu."
      }
    },
    {
      "@type": "Question",
      "name": "Ar konsultacija ir apžiūra mokama?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ne, objekto apžiūra ir konsultacija yra nemokama."
      }
    }
  ]
};
```

### Naudojimas layout.tsx

```typescript
// src/app/layout.tsx
import { SchemaOrg } from "@/components/SchemaOrg";
import { localBusinessSchema } from "@/lib/schemas";

export default function RootLayout({ children }) {
  return (
    <html lang="lt">
      <head>
        <SchemaOrg schema={localBusinessSchema} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

FAQ schema įdėti tik homepage `page.tsx`:
```typescript
import { SchemaOrg } from "@/components/SchemaOrg";
import { faqSchema } from "@/lib/schemas";
// <SchemaOrg schema={faqSchema} />
```

---

## Metadata (layout.tsx)

```typescript
export const metadata: Metadata = {
  title: { 
    default: "ATD — Aplinkos Tvarkymas Vilnius", 
    template: "%s | ATD" 
  },
  description: "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas ir tvenkiniai. 170+ atliktų projektų.",
  metadataBase: new URL("https://atd.lt"),
  openGraph: { 
    type: "website", 
    locale: "lt_LT", 
    siteName: "ATD — Aplinkos Tvarkymas" 
  },
  alternates: { canonical: "https://atd.lt" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  }
};
```

---

## Tikrinimas (po deploy)

- [ ] `https://atd.lt/llms.txt` — atsidaro naršyklėje
- [ ] `https://atd.lt/robots.txt` — atsidaro, matosi GPTBot
- [ ] `https://atd.lt/sitemap.xml` — atsidaro, matosi visi URL
- [ ] https://validator.schema.org — validuoti JSON-LD
- [ ] https://search.google.com/test/rich-results — FAQ rich snippet
- [ ] Po 2–4 sav.: paklausti ChatGPT/Perplexity "kas tvarko aplinką Vilniuje"

---

*Susijęs spec: 01-homepage-spec.md · 04-design-tokens.md*
