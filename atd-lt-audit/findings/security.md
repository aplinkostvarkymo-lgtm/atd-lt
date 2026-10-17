# Priklausomybių saugumas ir patikrų rezultatai

2026-10-17. `npm audit --json` vykdytas tik skaitymui, nekeistas package.json ar lockfile. Žalias atsakymas: `../evidence/npm-audit.json`. Tikrintas šio worktree package-lock, 720 įrašų su root. Šiame worktree nėra atskiro node_modules, todėl build naudoja prieinamą tėvinio projekto paketų diegimą; tai pažymėtina atkuriamumui.

## S01 — P1: užfiksuotas Next.js 16.2.4 patenka į paskelbtų saugumo pranešimų intervalus

`package.json:17`; tikslus paketas taip pat package-lock. npm atsakymas: **27 pažeidžiami paketų įrašai: 2 critical, 18 high, 5 moderate, 2 low**. Tai nėra 27 įrodytos svetainės atakos ar 27 nepriklausomi runtime gedimai. Next.js kritinis agreguotas įvertinimas apima kelis skirtingų sąlygų pranešimus; pranešimų ir paketų skaičiai nėra tapatūs.

Patikrinti pirminiai Vercel pranešimai:

- [GHSA-8h8q-6873-q5fj](https://github.com/vercel/next.js/security/advisories/GHSA-8h8q-6873-q5fj): App Router Server Function endpointų DoS, 16.0.0–<16.2.5. Įdiegta 16.2.4 patenka į intervalą, tačiau šiame projekte nerasta savo Server Actions. Neatliktas išnaudojimo bandymas.
- [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36): kritinė RCE problema Windows failų sistemoje talpinamiems serveriams, taisyta 16.3.3. Vietinė audito aplinka Windows; aprašytas production hosting Vercel. Negalima šio pranešimo paversti teiginiu apie patvirtintą Vercel RCE. Lokalaus dev serverio nereikia skelbti viešai; nebuvo mėginama jo atakuoti.
- [GHSA-cjq9-62q9-8jv4](https://github.com/vercel/next.js/security/advisories/GHSA-cjq9-62q9-8jv4): Image Optimization SSRF reikalauja attacker-controlled allow-listed remote URL. Šis next.config.ts neturi remotePatterns, todėl pagal patį Vercel pranešimą ši konkreti sąlyga čia netenkinama.

npm pasiūlytas Next atnaujinimas audito metu: 16.4.2. Tai registro rekomendacija, ne šiame audite patikrinta migracija. Prieš atnaujinimą skaityti naujos versijos vietinius Next vadovus ir release pastabas, suderinti susijusius Next paketus, patikrinti build, lint, vaizdų optimizavimą ir visus route'us. **Nenaudoti aklo npm audit fix --force**, nes kai kurioms tooling grandinėms npm siūlo senesnes major versijas.

## S02 — P2: nemaža saugumo rezultatų dalis ateina iš gamybinių dependencies esančio CLI įrankio

`package.json` shadcn įtrauktas į dependencies. Lock grandinė `shadcn → @modelcontextprotocol/sdk → express → proxy-addr` paaiškina antrą critical paketą. Nerasta, kad svetainės komponentai importuotų shadcn CLI arba vykdytų šį Express serverį. Todėl proxy-addr kritinis registro įrašas nėra patvirtintas viešos ATD užklausos kelias.

**Veiksmas:** atnaujinti runtime ir kūrimo įrankių medį, CLI priklausomybes laikyti pagal tikrą jų paskirtį, po pakeitimų iš naujo paleisti audit. Atskirai įvertinti Next naudojamą sharp ir jo native priklausomybes. Šis auditas fiksuoja inventorių ir sąlygas; pentestas neatliktas.

## Kompiliavimo ir kokybės vartai

| Patikra | Rezultatas | Pastaba |
|---|---|---|
| `npx --no-install tsc --noEmit --incremental false` | PASS | 0 TypeScript klaidų |
| `npm run build` | PASS | Pakartojus su tinklo prieiga; pirmas bandymas negavo Google Fonts |
| `npm run lint` | FAIL | 5 react-hooks/set-state-in-effect klaidos |
| Impeccable detect | PASS / `[]` | Nerasta mechaninio detektoriaus šablonų; tai nėra UX / WCAG patvirtinimas |
| Production naršyklė | PASS baziniam atidarymui | 8 route'ai × desktop/mobile: 200, 0 pageerror |
| Tikra lead integracija | NETIKRINTA | Airtable / Resend nieko nesiųsta; naudojami mock įrodymai |

Lint vietos: `src/components/Analytics.tsx:13`, `src/components/CookieConsent.tsx:16`, `src/components/sections/GardenSceneHero.tsx:65`, `src/components/sections/StatsBar.tsx:52`, `src/contexts/LanguageContext.tsx:21`. Tai egzistuojančios kodo kokybės klaidos, o ne įrodymas, kad kiekvienas effect sukelia matomą vartotojo gedimą. Taisyti atsižvelgiant į SSR ir hydration; neperkelti localStorage skaitymo neapgalvotai į serverio renderį vien tam, kad nutiltų lint.

Build įspėja apie kelis lockfile ir numanomą tėvinį workspace root. Tai šio nested worktree aplinkos konfigūracijos pastaba, ne build nesėkmė.
