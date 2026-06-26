@AGENTS.md

# ATD Project Context
Spec failai šiame projekte: spec/01-homepage-spec.md, spec/02-calculator-spec.md, 
spec/03-seo-spec.md, spec/04-design-tokens.md, spec/05-garden-hero-component.md

Prieš kuriant bet kokį komponentą — perskaityti atitinkamą spec failą.

Stack: Next.js 16 App Router, TypeScript, Tailwind v4 (CSS-first, nėra tailwind.config.ts), Framer Motion v12, shadcn/ui
CORS taisyklė: Anthropic API tik per /app/api/ routes, niekada iš browser.

## Git workflow — PRIVALOMA

**Po KIEKVIENO `git commit`, iškart `git push origin main`.** Niekada nepalikti commit'ų tik lokaliai.

- Tai standartinė kiekvieno workflow'o pabaiga, ne atskiras veiksmas, kurio reikia paprašyti.
- Vercel deploy'ina tik tai, kas yra `origin/main` — lokalūs commit'ai be push'o niekada nepasiekia production'o (atd-lt.vercel.app), net jei `npm run build` lokaliai praėjo.
- Po push'o patvirtinti rezultatą: `git log origin/main..main --oneline` turi būti tuščia.
- Šis projektas turėjo bent du atvejus, kai commit'ai pasiliko tik lokaliai ir Vercel niekada jų nepamatė — nepakartoti.

## Dvikalbystė (LT/EN) — PRIVALOMA

**Kiekvienas komponentas su user-facing tekstu PRIVALO palaikyti abi kalbas.**

- Tekstai saugomi `src/lib/translations.ts` — abu vertimai (lt + en) viename faile
- Kalba pasiekiama per `useLanguage()` hook iš `@/contexts/LanguageContext`
- Aktyvios kalbos indikatorius: `LanguageToggle` komponentas (`src/components/ui/LanguageToggle.tsx`)
- `localStorage` saugo pasirinkimą per sesijas (`atd-lang`)
- `document.documentElement.lang` automatiškai atnaujinamas

**Kuriant naują komponentą su tekstu:**
1. Pridėti vertimus į `translations.ts` (lt + en) prieš rašant komponentą
2. Naudoti `const { lang } = useLanguage()` ir `const t = translations[lang]`
3. Jokių hardcoded lietuviškų ar angliškų tekstų komponente
