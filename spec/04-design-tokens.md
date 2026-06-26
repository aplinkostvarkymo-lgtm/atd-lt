# ATD.lt — Dizaino Sistema (Design Tokens)
*Claude Code kūrimo instrukcija — spalvos, tipografija, spacing*

---

## Spalvų sistema

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      atd: {
        green:      "#2D5016",  // primary — tamsiai žalia
        "green-light": "#3D6B20",  // hover state
        "green-dark":  "#1E3610",  // pressed state
        cream:      "#F5F0E8",  // backgrounds, sekcijų fonas
        "cream-dark": "#EDE8DC",  // kortelių fonas, hover
        black:      "#1A1A1A",  // tekstas
        "gray-soft": "#6B6B6B",  // antriniai tekstai
        white:      "#FFFFFF",
      }
    }
  }
}
```

**Spalvų naudojimas:**
- `atd-green` — CTA mygtukai, akcento elementai, hotspot točkos
- `atd-cream` — sekcijų fonas (kas antra sekcija: cream / white)
- `atd-black` — pagrindiniai tekstai
- Jokia violetinė, jokia ryški mėlyna

---

## Tipografija

```typescript
// src/app/layout.tsx
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],  // BŪTINA: ą č ę ė į š ų ū ž
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});
```

**Tipo skalė:**

| Klasė | Dydis Desktop | Dydis Mobile | Font | Svoris |
|-------|--------------|--------------|------|--------|
| H1 (hero) | 56px / 3.5rem | 36px / 2.25rem | Playfair Display | 700 |
| H2 (sekcijų) | 40px / 2.5rem | 28px / 1.75rem | Playfair Display | 600 |
| H3 (kortelės) | 24px / 1.5rem | 20px / 1.25rem | Playfair Display | 600 |
| Body large | 18px / 1.125rem | 16px / 1rem | DM Sans | 400 |
| Body | 16px / 1rem | 15px / 0.9375rem | DM Sans | 400 |
| Caption | 13px / 0.8125rem | 12px / 0.75rem | DM Sans | 400 |
| Button | 15px / 0.9375rem | 14px / 0.875rem | DM Sans | 500 |

**Tailwind CSS konfigūracija:**
```typescript
fontFamily: {
  display: ["var(--font-display)", "Georgia", "serif"],
  body: ["var(--font-body)", "system-ui", "sans-serif"],
}
```

---

## Spacing

```
Sekcijų vertical padding:    80px desktop / 48px mobile
Konteinerio max-width:       1280px
Konteinerio padding:         24px (px-6) abipus
Kortelių gap:                24px
```

---

## Mygtukų stiliai

**Primary (atd-green):**
```
bg-atd-green text-white
hover: bg-atd-green-light
px-8 py-4 rounded-none (kvadratiniai, ne pill)
font-body font-medium text-sm tracking-wider uppercase
transition: background-color 200ms ease
```

**Secondary (outline):**
```
border border-atd-green text-atd-green bg-transparent
hover: bg-atd-green text-white
Toks pat sizing
```

**Magnetic button** (naudoti iš 21st.dev FinalCTA sekcijai):
```bash
npx shadcn@latest add https://21st.dev/r/bundui/magnetic-button
```

---

## Animacijos principai

**Filosofija:** subtilios, netrukdo, kalba su moterišku segmentu (ramumas).

```typescript
// Framer Motion defaults
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};
```

**Scroll-triggered:** naudoti `useInView` iš Framer Motion.
**Reduction:** visada `useReducedMotion()` hook.

**Hero durų animacija specifika:**
- Durų "stiklas" efektas: CSS `backdrop-filter: blur(4px)` ant overlay
- Atsidarymas: `transform: scaleX(0) → scaleX(1)` kairė ir dešinė dalis atskirai, `transform-origin: left` ir `transform-origin: right`
- Duration: 800ms, `ease: [0.76, 0, 0.24, 1]` (custom cubic bezier — lėtas pradžioje, greitas viduryje)

---

## Sekcijų ritmas (fonas)

```
Hero:              tamsus overlay ant nuotraukos
StatsBar:          atd-cream (#F5F0E8)
ServicesAccordion: white (#FFFFFF)
HowItWorks:        atd-cream
BeforeAfterSlider: white
CalculatorSection: atd-green (tamsiai, inversinis — baltas tekstas)
Testimonials:      white
FAQ:               atd-cream
FinalCTA:          atd-green inversinis
Footer:            #1A1A1A (juodas)
```

---

## Nuotraukų tvarkymas

```typescript
// Visada naudoti Next.js Image komponentą
import Image from "next/image";

<Image
  src="/images/hero-garden.jpg"
  alt="Aplinkos tvarkymas Vilniuje — ATD"
  fill
  priority
  className="object-cover"
  sizes="100vw"
/>
```

**Optimizavimo nustatymai (next.config.ts):**
```typescript
images: {
  formats: ["image/webp"],
  deviceSizes: [375, 768, 1280, 1920],
  imageSizes: [300, 600],
}
```

---

## Border-radius strategija

**Filosofija:** premium + organiškas = minimalūs kampai.

- Kortelės: `rounded-none` arba `rounded-sm` (2px)
- Mygtukų: `rounded-none` (kvadratiniai)
- Avatarų: `rounded-full`
- Formų laukai: `rounded-none` su `border-b` only (minimalistinė forma)

---

## 21st.dev komponentų sąrašas (visi reikalingi)

```bash
# Visi komandai — paleisti Next.js projekto root'e
npx shadcn@latest add https://21st.dev/r/minhxthanh/interactive-image-accordion
npx shadcn@latest add https://21st.dev/r/minhxthanh/image-comparison-slider
npx shadcn@latest add https://21st.dev/r/ravikatiyar162/image-comparison-slider-horizontal
npx shadcn@latest add https://21st.dev/r/bundui/magnetic-button
npx shadcn@latest add https://21st.dev/r/0xUrvish/feature-carousel
```

**Pastaba:** hover-preview komponentas nenaudojamas — hotspot glassmorphism kortelės daromos custom (jos turi specifinį pozicionavimą ant nuotraukos).

---

## globals.css (esminiai custom stiliai)

```css
@layer base {
  :root {
    --font-display: "Playfair Display", Georgia, serif;
    --font-body: "DM Sans", system-ui, sans-serif;
    --color-green: #2D5016;
    --color-cream: #F5F0E8;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Lithuanian quotes */
  q {
    quotes: "\201E" "\201C";
  }
}

/* Glassmorphism utility */
.glass {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hotspot pulse animacija */
@keyframes hotspot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(45, 80, 22, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(45, 80, 22, 0); }
}
.hotspot-pulse {
  animation: hotspot-pulse 2s ease-in-out infinite;
}
```

---

*Susijęs spec: 01-homepage-spec.md*
