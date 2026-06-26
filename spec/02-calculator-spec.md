# ATD.lt — Kalkuliatoriaus Spec
*Claude Code kūrimo instrukcija — /kaina puslapis + inline komponentai*

---

## Apžvalga

Du kalkuliatorių režimai:

| Režimas | Naudotojas | Failas | Kur rodomas |
|---------|-----------|--------|-------------|
| A — Paprastas | Namų savininkas, žino plotą | `CalculatorSection.tsx` | Homepage + /kaina |
| B — AI (projektas) | NT vystytojas, turi PDF/Excel | `ProjectCalculator.tsx` | Tik /kaina |

---

## Režimas A — Paprastas kalkuliatorius

### Flow

```
1. Pasirinkti paslaugą: [Veja] [Trinkelės]
2. Įvesti plotą (slider 10–2000 m²)
3. → Momentinis kainų intervalas atsiranda
4. Jei nori tikslesnės kainos → mini forma (Vardas + Tel.)
5. Submit → /api/lead → Airtable + Zapier
```

### Kainų logika

```typescript
// src/lib/pricing.ts
export const PRICING = {
  veja: {
    ruloninė: { min: 8, max: 12 },   // €/m²
    sėjama: { min: 4, max: 6 },
  },
  trinkelės: {
    betoninės: { min: 25, max: 35 },
    akmeninės: { min: 35, max: 45 },
  },
} as const;

export function calculateRange(
  service: keyof typeof PRICING,
  subtype: string,
  area: number
): { min: number; max: number } {
  const rate = PRICING[service][subtype];
  return {
    min: Math.round(rate.min * area),
    max: Math.round(rate.max * area),
  };
}
```

Robertas atnaujina kainas čia. Komponentas šias kainas skaito automatiškai.

### Komponentas: `CalculatorSection.tsx`

```typescript
"use client"; // būtina, nes naudoja useState

// Elementai:
// - ServiceTab (Veja / Trinkelės)
// - AreaSlider (10–2000 m², žingsnis 10)
// - SubtypeSelector (ruloninė / sėjama arba betoninės / akmeninės)
// - PriceDisplay (animuotas, atsiranda kai keičiasi plotas)
// - LeadForm (Vardas, Tel. — atsiranda po kainų intervalo)
```

### PriceDisplay animacija

Kaina keičiasi sklandžiai (CSS `transition` arba `framer-motion` spring).
Formatavimas: `640 – 960 €` (ne `640€-960€`).

### LeadForm submit

```typescript
// POST /api/lead
{
  service: "veja",
  subtype: "ruloninė",
  area: 80,
  estimateMin: 640,
  estimateMax: 960,
  name: "...",
  phone: "...",
  source: "calculator-a"
}
```

---

## Režimas B — AI kalkuliatorius (PDF + Excel upload)

### Flow

```
1. Klientas įkelia PDF (želdynų planas) ir/arba Excel (kiekiai)
2. Rodoma: "Jūsų projektas analizuojamas... ~30–60 sek."
3. Next.js API route → Claude Sonnet analizuoja dokumentus
4. Grąžinama JSON struktūra su augalų sąrašu + kiekiais
5. Sistema priskiria kainas pagal augalų tipų logiką
6. Rodoma lentelė: pozicija | kiekis | vnt. kaina | suma
7. Bendra preliminari suma
8. Forma: Klientas įveda el. paštą → siunčiama Robertui review
```

### API Route: `/api/calculate/route.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pdfFile = formData.get("pdf") as File | null;
  const excelFile = formData.get("excel") as File | null;

  // 1. Konvertuoti failus į base64
  // 2. Siųsti Claude Sonnet su system prompt
  // 3. Gauti struktūruotą JSON atsakymą
  // 4. Grąžinti klientui

  const systemPrompt = `Esi kraštovaizdžio sąmatos specialistas. 
Iš pateikto želdynų projekto dokumento ištraukk:
- Augalų sąrašą su lotynų pavadinimais, kiekiais ir konteinerių tipais
- Dirvožemio medžiagų kiekius
- Paviršių plotus (veja, trinkelės, skalda, mulčas)
- Bortų ilgius

Grąžink TIKTAI JSON be jokio paaiškinimo:
{
  "augalai": [
    { "lot_pavadinimas": "...", "lt_pavadinimas": "...", "konteineris": "C5", "kiekis": 12 }
  ],
  "medžiagos": [
    { "tipas": "gruntas", "kiekis": 15, "vienetas": "m3" }
  ],
  "paviršiai": [
    { "tipas": "veja", "plotas": 120, "vienetas": "m2" }
  ],
  "bortai": { "ilgis": 45, "vienetas": "m" }
}`;

  // ...implementacija
}
```

### Kainų priskyrimas (augalų tipai)

```typescript
// src/lib/plantPricing.ts

export const PLANT_PRICING = {
  // Medžiai
  "SG 18+": 150,   // didelis medis (sodinimas)
  "SG <18": 110,   // vidutinis medis
  // Krūmai
  "C20": 13, "BG": 13,
  "C5": 8, "C3": 8,
  // Daugiamečiai
  "C2": 4,
  "P9": 2,
  // Svogūniniai
  "svogūniniai": 0.25,
};

export const MATERIAL_PRICING = {
  gruntas_tiekimas: 18,   // €/m³
  gruntas_klojimas: 3,    // €/m³
  mulčas: 6.5,            // €/m²
  vejos_rulonas: 8,       // €/m²
  skalda: 25,             // €/m²
  geokorys: 13,           // €/m²
  pvc_bortai: 4,          // €/m
};

// Konteinerio tipo nustatymas iš pavadinimo
export function detectContainerType(name: string): keyof typeof PLANT_PRICING {
  if (name.includes("SG")) {
    // SG 18-20 → didelis, SG 12-14 → vidutinis
    const sizeMatch = name.match(/SG\s*(\d+)/);
    return sizeMatch && parseInt(sizeMatch[1]) >= 18 ? "SG 18+" : "SG <18";
  }
  if (name.includes("C20") || name.includes("BG")) return "C20";
  if (name.includes("C5") || name.includes("C3")) return "C5";
  if (name.includes("C2")) return "C2";
  if (name.includes("P9")) return "P9";
  return "P9"; // default
}
```

### Komponentas: `ProjectCalculator.tsx`

```typescript
"use client";

// States:
// - "idle" → file upload zona
// - "uploading" → progress bar
// - "analyzing" → "Analizuojamas projektas..." su spinner
// - "results" → lentelė su rezultatais
// - "submitted" → "Pasiūlymas išsiųstas Robertui"

// Lentelė (results state):
// | Pavadinimas | Kiekis | Vienetas | Vnt. kaina | Suma |
// --------------------------------------------------
// | Betula pendula (C5) | 12 | vnt. | 8 € | 96 € |
// | Gruntas tiekimas | 15 | m³ | 18 € | 270 € |
// --------------------------------------------------
// | VISO (sodinimo darbai): | | | | 1,840 € |
//
// Pastaba: augalų pirkimo kaina atskirai (prašoma iš tiekėjo)
```

### Udenhout el. laiško generavimas

Po sąmatos — Claude arba statiškas template sugeneruoja el. laišką Udenhout:

```
Tema: Augalų užklausa — Projektas [data]

Laba diena,

Prašome kainų šiems augalams:

| Lot. pavadinimas | Konteineris | Kiekis |
...

Laukiame jūsų kainų pasiūlymo.
ATD — Aplinkos Tvarkymas
```

Šis laiškas rodomas UI kaip "Copy" arba "Siųsti per el. paštą".

---

## /kaina puslapis

```typescript
// src/app/kaina/page.tsx

export const metadata = {
  title: "Kainų kalkuliatorius | ATD — Aplinkos Tvarkymas Vilnius",
  description: "Apskaičiuokite vejos įrengimo, trinkelių ar apželdinimo pagal projektą kainą.",
};

// Struktūra:
// <PageHero title="Kainų kalkuliatorius" />
// <Tabs>
//   <Tab label="Veja ir trinkelės"><CalculatorSection /></Tab>
//   <Tab label="Projektas (PDF/Excel)"><ProjectCalculator /></Tab>
// </Tabs>
```

---

## API routes (sukurti)

```
src/app/api/
├── calculate/route.ts    ← Režimas B (Claude Sonnet + failo analizė)
├── lead/route.ts         ← Režimas A submit → Airtable → Zapier
└── chat/route.ts         ← Chatbot (ateičiai)
```

### /api/lead/route.ts

```typescript
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // 1. Airtable — išsaugoti lead
  await saveLead(data);
  
  // 2. Zapier — trigger el. laiškas Robertui
  await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  return NextResponse.json({ success: true });
}
```

---

*Susijęs spec: 01-homepage-spec.md · 03-seo-spec.md*
