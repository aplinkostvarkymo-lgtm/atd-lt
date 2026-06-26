# ATD.lt — Homepage Spec
*Claude Code kūrimo instrukcija — pagrindinis puslapis*

---

## Tikslas

Sukurti `src/app/page.tsx` — ATD.lt pagrindinis puslapis.

Puslapis turi atrodyti kaip premium aplinkos tvarkymo brand'as, ne generinė statybų svetainė. 
Dizaino referentai: huntergreen.nyc (premium whitespace), highlandslandscaping.com (sales engine struktūra).

---

## Techninis Stack

- Next.js 14 App Router
- TypeScript — viskas tipizuota
- Tailwind CSS — stiliai
- Framer Motion — animacijos
- shadcn/ui + 21st.dev komponentai (žr. žemiau)

---

## Sekcijų tvarka (top → bottom)

```
1. GardenSceneHero       ← interaktyvus pirmas ekranas
2. StatsBar              ← 170+ projektų · 12+ metų · Vilnius
3. ServicesAccordion     ← interaktyvus paslaugų accordion
4. HowItWorks            ← 3 žingsniai (Apžiūra → Sąmata → Įrengimas)
5. BeforeAfterSlider     ← prieš/po projektai
6. CalculatorSection     ← Režimas A kalkuliatorius (veja, trinkelės)
7. Testimonials          ← Google Reviews / atsiliepimų blokas
8. FAQ                   ← DUK accordion + chatbot CTA
9. FinalCTA              ← "Paruošta pradėti?" bloko pabaiga
10. Footer
```

---

## 1. GardenSceneHero — Detalus aprašymas

### Konceptas
Pirmas ekranas = pilnas viewport. Fone — Roberto reali nuotrauka (aukštos kokybės sutvarkyta terasa / sklypo vaizdas). 
Ant nuotraukos — glassmorphism overlay (labai subtilus, tamsus), tekstas ir hotspot'ai.

**Placeholder nuotrauka kūrimo metu:** `/public/images/hero-placeholder.jpg` (sukurti laikraštinį placeholder).
**Reali nuotrauka:** bus įdėta vėliau kaip `hero-garden.jpg`.

### Animacijos seka (page load)

```
1. 0ms     → ekranas juodas
2. 0–600ms → fade in: du vertikalūs stiklo durų rėmai (CSS pseudo-elements)
3. 600–1400ms → durys "atsiveria" (transform: scaleX) į šonus
4. 1400ms  → fade in: foninis sodas / terasa
5. 1800ms  → slide up: H1 tekstas
6. 2000ms  → fade in: hotspot'ai
7. 2200ms  → fade in: CTA mygtukai
```

**prefers-reduced-motion:** jei aktyvus — praleisti visą animaciją, rodyti viską iš karto.
**Skip animacijos mygtukas:** `position: fixed, top-right`, matomas pirmas 2 sekundes.

### Hotspot'ai (desktop: hover + click / mobile: tap)

| ID | Pozicija (% nuo kairės/viršaus) | Paslauga | Nuoroda |
|----|----------------------------------|----------|---------|
| gėlynai | 30%, 55% | Apželdinimas | /paslaugos/apzeldinimas |
| veja | 55%, 70% | Vejos įrengimas | /paslaugos/veja |
| laistymas | 42%, 45% | Laistymo sistemos | /paslaugos/laistymas |
| sandėliukas | 78%, 50% | Atlikti projektai | /darbai |
| karutis | 15%, 65% | Kontaktai | /kontaktai |

**Hotspot vizualas:**
- Maža pulsuojanti žalia točka (animation: pulse, #2D5016)
- Hover → glassmorphism kortelė: paslauga (bold), 1 sakinys aprašymo, "→ Sužinoti daugiau"
- Glassmorphism: `backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.15)`, `border: 1px solid rgba(255,255,255,0.2)`

**Mobile hotspot fallback:**
- Hotspot točkos matomos (bet mažesnės)
- Tap → bottom sheet su paslauga
- Po hero sekcija: horizontali scroll'inama paslaugų kortelių juosta

### Tekstas ant hero

```
H1: Aplinkos tvarkymas Vilniuje
H2 (subheadline): Veja, apželdinimas, trinkelės.
                  Dirbame su projektine dokumentacija.

CTA1: [Gauti preliminarią kainą]  → /kaina
CTA2: [Žiūrėti darbus]            → /darbai
```

**Pozicija:** tekstas kairėje apačioje (bottom-left), 5% nuo krašto.
**Tipografija:** H1 = Playfair Display, 56px desktop / 36px mobile. Subheadline = DM Sans, 20px / 16px.
**Spalva:** balta ant tamsaus overlay. Teksto šešėlis: `text-shadow: 0 2px 8px rgba(0,0,0,0.5)`.

---

## 2. StatsBar

Thin juosta po hero. Cream fonas (#F5F0E8). Trys statistikos:

```
170+         |  12+           |  Nemokama
Atliktų      |  Metų          |  Apžiūra
projektų     |  patirtis      |
```

Animacija: `CountUp` efektas kai sekcija įeina į viewport (Intersection Observer).

---

## 3. ServicesAccordion

**21st.dev komponentas:**
```bash
npx shadcn@latest add https://21st.dev/r/minhxthanh/interactive-image-accordion
```

Paslaugos (5):
1. Vejos įrengimas — `Ruloninė veja nuo 8 €/m². Sėjama nuo 4 €/m².`
2. Apželdinimas pagal projektą — `Dirbame su architektų želdynų dokumentais.`
3. Trinkelių ir takų įrengimas — `Nuo 25 €/m². Betoninės, akmeninės, klinkerinės.`
4. Tvenkiniai ir vandens elementai — `Dekoratyviniai tvenkiniai, prūdai.`
5. Laistymo sistemos — `Automatinės laistymo sistemos įrengimas.`

Kiekviena paslauga turi savo nuotrauką (placeholder → reali).

---

## 4. HowItWorks

Trys žingsniai. Ne numeruotos kortelės — timeline stiliaus su jungiamąja linija.

```
[1] Apžiūra          [2] Pasiūlymas         [3] Įrengimas
Atvykstame į         Per 24–48 val.          Dirbame pagal
objektą nemokamai.   pateikiame kainų        suderintą planą
                     pasiūlymą.              ir terminus.
```

Animacija: scroll-triggered, kiekvienas žingsnis atsiranda nuosekliai (staggered).

---

## 5. BeforeAfterSlider

**21st.dev komponentai (abu įdiegti, naudojamas vienas):**
```bash
npx shadcn@latest add https://21st.dev/r/minhxthanh/image-comparison-slider
npx shadcn@latest add https://21st.dev/r/ravikatiyar162/image-comparison-slider-horizontal
```

3–4 prieš/po poros. Placeholder → realios nuotraukos.
Kiekviena pora: lokacija (pvz. "Antakalnis, Vilnius"), paslauga, plotas.

**Mobile:** horizontal slider, full-width.

---

## 6. CalculatorSection (Režimas A)

Inline kalkuliatorius — **ne atskiras puslapis**, o sekcija homepage'e.

Flow:
1. Du tab'ai: `Veja` ir `Trinkelės`
2. Slider arba input: plotas m²
3. Momentinis intervalas atsiranda: `~640–960 € (80m²)`
4. Po intervalo: mini forma — Vardas + Telefonas
5. Submit → `/api/lead` → Airtable + Zapier

**Kainų logika (JSON objektas `src/lib/pricing.ts`):**
```typescript
export const PRICING = {
  veja_ruloninė: { min: 8, max: 12 }, // €/m²
  veja_sėjama: { min: 4, max: 6 },
  trinkelės: { min: 25, max: 45 },
}
```

Robertas pats atnaujina šias kainas — ne hardcoded komponente.

**Pilnas kalkuliatorius (Režimas B — PDF/Excel upload):** `/kaina` puslapyje.

---

## 7. Testimonials

Paprasta sekcija — 3 atsiliepimai su vardais (be nuotraukų jei nėra).
Google Reviews screenshotai kaip fallback jei nėra dinaminio embed.

---

## 8. FAQ

Accordion — 6–8 klausimai. Schema.org FAQPage žymėjimas (žr. `03-seo-spec.md`).

DUK klausimai:
- Kiek kainuoja vejos įrengimas?
- Ar dirbate su architektų projektais?
- Kokia aptarnavimo zona?
- Kiek laiko trunka vejos įrengimas?
- Ar reikia gauti leidimą?
- Kaip vyksta mokėjimas?
- Ar suteikiate garantiją?
- Ar galite patys parengti želdynų projektą?

---

## 9. FinalCTA

Visas plotis, tamsiai žalia (#2D5016) arba ryški nuotrauka fone:

```
Paruošta pradėti?
[Gauti preliminarią kainą]    [Skambinti: +370 657 85096]
```

**21st.dev magnetinis mygtukas:**
```bash
npx shadcn@latest add https://21st.dev/r/bundui/magnetic-button
```

---

## 10. Footer

Kontaktai · darbo laikas · paslaugos (nuorodos) · socialiniai tinklai · copyright.

---

## Failų struktūra (sukurti)

```
src/
├── app/
│   ├── page.tsx                    ← homepage (šis spec)
│   └── layout.tsx                  ← metadata, fonts, schema.org
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
│   └── ui/
│       ├── HotspotMarker.tsx       ← pulsuojanti točka + glassmorphism card
│       └── GlassDoor.tsx           ← durų animacijos komponentas
├── lib/
│   └── pricing.ts                  ← kainų konstantos
public/
├── images/
│   └── hero-placeholder.jpg
```

---

## Kūrimo tvarka (Claude Code sesijoje)

```
1. layout.tsx — fonts (Playfair Display + DM Sans, latin-ext), metadata
2. GlassDoor.tsx + HotspotMarker.tsx — UI primityvai
3. GardenSceneHero.tsx — pagrindinis komponentas
4. StatsBar.tsx
5. page.tsx — surinkti visas sekcijas
6. Likusios sekcijos iš viršaus į apačią
```

---

*Susijęs spec: 02-calculator-spec.md · 03-seo-spec.md · 04-design-tokens.md*
