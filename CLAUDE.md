@AGENTS.md

# ATD Project Context
Spec failai šiame projekte: spec/01-homepage-spec.md, spec/02-calculator-spec.md, 
spec/03-seo-spec.md, spec/04-design-tokens.md, spec/05-garden-hero-component.md

Prieš kuriant bet kokį komponentą — perskaityti atitinkamą spec failą.

Stack: Next.js 16 App Router, TypeScript, Tailwind v4 (CSS-first, nėra tailwind.config.ts), Framer Motion v12, shadcn/ui
CORS taisyklė: Anthropic API tik per /app/api/ routes, niekada iš browser.

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
