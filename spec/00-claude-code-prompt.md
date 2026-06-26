# ATD.lt — Claude Code Master Prompt
*Šis failas = pirmoji Cursor sesijos instrukcija. Kopijuok ir įkišk į Claude Code.*

---

## Kaip naudoti

1. Cursor atidaryti ATD.lt Next.js projekto aplanke
2. Atidaryti Claude Code chat
3. Nukopijuoti visos sekcijos turinį ir siųsti kaip pirmą žinutę
4. Laukti kol Claude Code sukurs struktūrą
5. Tada pradėti su `GardenSceneHero.tsx`

---

## PROMPT (kopijuoti viską nuo čia)

```
Tu kurti ATD.lt — premium aplinkos tvarkymo svetainę Vilniuje.
Savininkas: Robertas Česynas, +370 657 85096, Robertas@atd.lt

Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui.

Prieš pradedant — perskaityti VISUS spec failus šiame projekte:
- spec/01-homepage-spec.md
- spec/02-calculator-spec.md
- spec/03-seo-spec.md
- spec/04-design-tokens.md

PIRMASIS ŽINGSNIS — sukurti šią failų struktūrą:

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── kaina/page.tsx
│   ├── darbai/page.tsx
│   └── api/
│       ├── calculate/route.ts
│       └── lead/route.ts
├── components/
│   ├── sections/
│   │   ├── GardenSceneHero.tsx
│   │   ├── StatsBar.tsx
│   │   ├── ServicesAccordion.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BeforeAfterSlider.tsx
│   │   ├── CalculatorSection.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   ├── ui/
│   │   ├── HotspotMarker.tsx
│   │   └── GlassDoor.tsx
│   └── SchemaOrg.tsx
├── lib/
│   ├── pricing.ts
│   ├── plantPricing.ts
│   ├── schemas.ts
│   ├── airtable.ts
│   └── utils.ts
public/
├── llms.txt
├── robots.txt
└── images/
    └── hero-placeholder.jpg (sukurti tamsų placeholder)

DIZAINO PRINCIPAI:
- Spalvos: atd-green #2D5016, cream #F5F0E8, juoda #1A1A1A
- Fontai: Playfair Display (H1-H3) + DM Sans (body), ABU su latin-ext subset
- Border-radius: rounded-none (kvadratiniai elementai)
- Animacijos: subtilios, scroll-triggered, Framer Motion

PAGRINDINIS KOMPONENTAS — GardenSceneHero.tsx:
- Pilno ekrano hero su nuotraukos fonu (/public/images/hero-placeholder.jpg)
- Durų animacija: du stiklo durų rėmai atsiveria per 800ms page load metu
- 5 interaktyvūs hotspot'ai (pozicijos: žr. 01-homepage-spec.md)
- Kiekvienas hotspot: pulsuojanti žalia točka → hover glassmorphism kortelė
- Mobile: tap hotspot'ai + paslaugų kortelių juosta apačioje
- Tekstas (bottom-left): H1 "Aplinkos tvarkymas Vilniuje" + subheadline + 2 CTA
- prefers-reduced-motion: praleisti animacijas

SVARBU:
- Visi Anthropic API kvietimai tik per /app/api/ routes, NIEKADA iš browser
- Server Components pagal nutylėjimą, "use client" tik kur būtina
- TypeScript strict mode
- Visi lietuviški simboliai ą č ę ė į š ų ū ž turi veikti (latin-ext subset)

Pradėk nuo: layout.tsx → GlassDoor.tsx → HotspotMarker.tsx → GardenSceneHero.tsx
```

---

## Antros sesijos prompt (kai hero paruoštas)

```
Hero sekcija paruošta. Dabar sukurti likusias sekcijas tokia tvarka:

1. StatsBar.tsx — 170+ projektų, 12+ metų, Nemokama apžiūra. CountUp animacija.
2. Instaliuoti 21st.dev komponentą:
   npx shadcn@latest add https://21st.dev/r/minhxthanh/interactive-image-accordion
   Tada sukurti ServicesAccordion.tsx su 5 paslaugomis (žr. 01-homepage-spec.md)
3. HowItWorks.tsx — 3 žingsniai, timeline stilius, staggered animacija
4. Instaliuoti before/after slider:
   npx shadcn@latest add https://21st.dev/r/minhxthanh/image-comparison-slider
   Tada sukurti BeforeAfterSlider.tsx
5. CalculatorSection.tsx — Režimas A (žr. 02-calculator-spec.md), inline kalkuliatorius
6. FAQ.tsx — accordion + Schema.org FAQPage (žr. 03-seo-spec.md)
7. FinalCTA.tsx su magnetic button:
   npx shadcn@latest add https://21st.dev/r/bundui/magnetic-button
8. Footer.tsx

Pabaigoje: surinkti page.tsx naudojant visas sekcijas.
```

---

## Trečios sesijos prompt (SEO + API)

```
Komponentai paruošti. Dabar:

1. Sukurti public/llms.txt — žr. 03-seo-spec.md
2. Sukurti public/robots.txt — žr. 03-seo-spec.md
3. Sukurti src/app/sitemap.ts
4. Pridėti Schema.org JSON-LD į layout.tsx (LocalBusiness) ir page.tsx (FAQPage)
5. Implementuoti /api/lead/route.ts — Airtable + Zapier webhook
6. Implementuoti /api/calculate/route.ts — Claude Sonnet + file upload
7. Sukurti /kaina puslapį su Tabs: Režimas A + Režimas B (ProjectCalculator)

Env variables (jau Vercel dashboarde):
- ANTHROPIC_API_KEY
- AIRTABLE_API_KEY
- AIRTABLE_BASE_ID
- ZAPIER_WEBHOOK_URL
```

---

*Spec failai: 01-homepage-spec.md · 02-calculator-spec.md · 03-seo-spec.md · 04-design-tokens.md*
