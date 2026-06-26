# ATD.lt — Statuso Auditas
*Sugeneruota: 2026-06-26. Tik faktai iš kodo, be interpretacijų.*

---

## 0. Build rezultatas (`npm run build`)

| Patikra | Statusas | Detalė |
|---|---|---|
| TypeScript compile | ✅ | "Finished TypeScript in 2.2s" — be klaidų |
| Production build | ❌ | **Build FAILS.** Klaida: `Error [InvalidCharacterError]: Invalid character` prerendering `/paslaugos/trinkelės` puslapį. Build procesas nutrūksta su `exit code 1` ("exiting the build") |
| Kitų 7 puslapių build statusas | ⚠️ | Nepatvirtinta — build nutrūko ties `/paslaugos/trinkelės` prieš sugeneruojant likusius statinius puslapius |

**Root cause (faktas):** egzistuoja du beveik identiški route failai — `src/app/paslaugos/trinkelės/page.tsx` (su diakritiku `ė` aplanko pavadinime) ir `src/app/paslaugos/trinkeles/page.tsx` (ASCII). Diakritiko versija lūžta static export/prerender metu.

---

## 1. PUSLAPIAI / ROUTES

### 1.1 Faktiškai egzistuojantys `src/app/` failai

| Route failas | URL | Egzistuoja | Build statusas |
|---|---|---|---|
| `src/app/page.tsx` | `/` | ✅ | ⚠️ nepatvirtinta (build nutrūko anksčiau) |
| `src/app/layout.tsx` | (root layout) | ✅ | ✅ compiluojasi |
| `src/app/paslaugos/veja/page.tsx` | `/paslaugos/veja` | ✅ | ⚠️ nepatvirtinta |
| `src/app/paslaugos/apzeldinimas/page.tsx` | `/paslaugos/apzeldinimas` | ✅ | ⚠️ nepatvirtinta |
| `src/app/paslaugos/laistymas/page.tsx` | `/paslaugos/laistymas` | ✅ | ⚠️ nepatvirtinta |
| `src/app/paslaugos/trinkeles/page.tsx` | `/paslaugos/trinkeles` (ASCII) | ✅ | ⚠️ nepatvirtinta |
| `src/app/paslaugos/trinkelės/page.tsx` | `/paslaugos/trinkelės` (su ė) | ✅ | ❌ **build crash** |

Nėra `src/app/api/`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx` — šie failai neegzistuoja.

### 1.2 Duplikatas: `/paslaugos/trinkelės` vs `/paslaugos/trinkeles`

| Faktas | Reikšmė |
|---|---|
| Abu failai | 39 eilučių, identiški, skiriasi tik `url`/`canonical` meta lauke |
| Kas linkina į `/paslaugos/trinkeles` (ASCII) | `Header.tsx:14`, `GardenSceneHero.tsx:52` |
| Kas linkina į `/paslaugos/trinkelės` (su ė) | Niekas — orphan route, nepasiekiamas iš UI |
| `/paslaugos/trinkelės` poveikis | Laužia visą production build |

### 1.3 Sitemap palyginimas (užklausoje nurodyti keliai vs realybė)

| Kelias iš užklausos | Egzistuoja? |
|---|---|
| `/` | ✅ |
| `/paslaugos/veja` | ✅ |
| `/apzeldinimas` (root) | ❌ — realus kelias yra `/paslaugos/apzeldinimas`, ne root |
| `/trinkeles` (root) | ❌ — realus kelias yra `/paslaugos/trinkeles`, ne root |
| `/laistymas` (root) | ❌ — realus kelias yra `/paslaugos/laistymas`, ne root |
| `/darbai` | ❌ — neegzistuoja (tik linkai į jį iš Header/GardenSceneHero/services-content) |
| `/kaina` | ❌ — neegzistuoja (linkas į `#kalkuliatorius` anchor naudojamas vietoj to) |
| `/apie` | ❌ — neegzistuoja |
| `/kontaktai` | ❌ — neegzistuoja (linkai į jį yra, puslapio nėra) |
| `/paslaugos/prekyba-augalais` | ❌ — neegzistuoja (linkai yra Header ir HOTSPOT_CONFIG) |
| `/patarimai` | ❌ — neegzistuoja (linkai yra Header ir GardenSceneHero) |

**Iš viso realiai egzistuojančių page route'ų: 6** (`/`, `/paslaugos/veja`, `/paslaugos/apzeldinimas`, `/paslaugos/laistymas`, `/paslaugos/trinkeles`, `/paslaugos/trinkelės`-orphan). **7 nuorodose naudojami keliai (`/darbai`, `/kontaktai`, `/patarimai`, `/paslaugos/prekyba-augalais`, `/kaina`, `/apie`) neturi atitinkamo page failo → 404.**

---

## 2. KOMPONENTAI

| Failas | Kas tai | Pilnai baigtas | TODO/FIXME viduje |
|---|---|---|---|
| `src/components/sections/GardenSceneHero.tsx` | Homepage hero: video intro → background image reveal → hotspot'ai | ✅ funkcionalus | ❌ nerasta |
| `src/components/sections/StatsBar.tsx` | Count-up statistikos juosta (170+, 12+) | ✅ funkcionalus | ❌ nerasta |
| `src/components/ui/HotspotMarker.tsx` | Pulsuojantis hotspot marker su 8 SVG ikonomis | ✅ funkcionalus | ❌ nerasta |
| `src/components/ui/ServicePopup.tsx` | Modal su paslaugos info (comparison/steps/list/materials/mini-stats/note/contact-info blokais) | ✅ funkcionalus | ❌ nerasta |
| `src/components/ui/LanguageToggle.tsx` | LT/EN jungiklis | ✅ funkcionalus | ❌ nerasta |
| `src/components/ui/button.tsx` | shadcn/ui base button | ✅ funkcionalus | ❌ nerasta |
| `src/components/layout/Header.tsx` | Fixed header, desktop dropdown + mobile drawer nav | ✅ funkcionalus | ❌ nerasta — **bet linkina į 3 neegzistuojančius puslapius** (`/darbai`, `/patarimai`, `/kontaktai`) ir 1 neegzistuojantį (`/paslaugos/prekyba-augalais`) |
| `src/components/pages/VejaPage.tsx` | `/paslaugos/veja` turinio puslapis (365 eil.) | ✅ pilnas | ❌ nerasta |
| `src/components/pages/TrinkelesPas.tsx` | `/paslaugos/trinkeles` turinio puslapis (233 eil.) | ✅ pilnas | ❌ nerasta |
| `src/components/pages/ApzeldinimoPas.tsx` | `/paslaugos/apzeldinimas` turinio puslapis (272 eil.) | ✅ pilnas | ❌ nerasta |
| `src/components/pages/LaistymasPas.tsx` | `/paslaugos/laistymas` turinio puslapis (278 eil.) | ✅ pilnas | ❌ nerasta |
| `src/components/SchemaOrg.tsx` | JSON-LD `<script>` wrapper (8 eil.) | ✅ pilnas | ❌ nerasta |

**Visa kodų bazė (`src/`)**: 0 TODO/FIXME/placeholder/"coming soon"/XXX žymų rasta grep paieška.

### 2.1 GardenSceneHero — tikslus statusas

| Klausimas | Atsakymas |
|---|---|
| Ar yra "door animation" (durų atidarymo efektas)? | ❌ **NE.** `spec/05-garden-hero-component.md` ir `spec/01-homepage-spec.md` aprašo `GlassDoor.tsx` komponentą su `doors-opening` animacijos stadija (scaleX durys į šonus). **Šis komponentas neegzistuoja kode.** Realus `GardenSceneHero.tsx` naudoja kitokį mechanizmą: `<video>` intro elementas, kuris `onEnded`/`onError` callback'u perjungia į statinį background image (`revealImage()`), be jokios durų animacijos. |
| Ar hotspot kortelės (popup) veikia mobile? | ✅ **Taip, bet kitu mechanizmu nei desktop.** Desktop: `<div className="hidden md:block">` su pozicionuotais `HotspotMarker` (pulsuojantys apskritimai), `onClick` atidaro `ServicePopup`. Mobile (`md:hidden`): horizontalaus scroll mygtukų juosta apačioje, kurios `onClick` taip pat atidaro tą pačią `ServicePopup` modalą (`setActiveService`). Pati `ServicePopup` turi atskirą mobile layout (`max-md:` bottom-sheet klasės). |

---

## 3. TURINYS

| Sritis | Statusas | Detalė |
|---|---|---|
| `src/lib/translations.ts` | ✅ realus turinys | LT + EN, abi kalbos pilnai išverstos kiekvienai paslaugai (veja/trinkelės/apželdinimas/laistymas), su konkrečiomis kainomis, FAQ, žingsniais. Nėra lorem ipsum. |
| `src/lib/services-content.ts` | ✅ realus turinys | 8 paslaugų popup blokai (veja, apzeldinimas, laistymas, darbai, trinkelės, prekyba, patarimai, kontaktai), abi kalbos, realios kainos ir FAQ. |
| `src/lib/schemas.ts` | ✅ realus turinys | JSON-LD schemos su realiu tel. numeriu (+37065785096), email (Robertas@atd.lt), koordinatėmis, kainomis. |
| Homepage hero tekstas (`GardenSceneHero`) | ✅ realus | Iš `translations.ts`, ne hardcoded. |
| Visi 4 paslaugų puslapiai (Veja/Trinkelės/Apželdinimas/Laistymas) | ✅ realus | Visi tekstai per `translations[lang]`, jokių hardcoded LT/EN stringų komponentuose (atitinka CLAUDE.md dvikalbystės reikalavimą). |
| Placeholder paveikslai | ⚠️ | `public/images/hero-placeholder.jpg` ir `hero-placeholder.png` egzistuoja faile, bet **nenaudojami kode** (kodas naudoja `main_one.png`) — nepanaudoti likučiai. |

---

## 4. API / INTEGRACIJOS

| Route / failas | Egzistuoja kaip failas | Pastaba |
|---|---|---|
| `/api/calculate` | ❌ | Neegzistuoja. `src/app/api/` katalogo nėra. |
| `/api/lead` | ❌ | Neegzistuoja. |
| `/api/chat` | ❌ | Neegzistuoja. |
| Anthropic SDK / API kvietimai kode | ❌ | `grep -ri anthropic src/` → 0 atitikmenų. Paketas `@anthropic-ai/sdk` neįtrauktas į `package.json`. |
| Airtable kodas | ❌ | `grep -ri airtable src/` → 0 atitikmenų. Nėra `airtable` paketo `package.json`. |
| Zapier webhook kodas | ❌ | `grep -ri zapier src/` → 0 atitikmenų. |

### 4.1 `.env.local`

| Raktas | Yra failas? |
|---|---|
| `.env.local` (root) | ❌ Failo nėra projekto šaknyje |
| `.env.local` (nested `atd-lt/`) | ❌ Failo nėra |

Kadangi `.env.local` neegzistuoja — `ANTHROPIC_API_KEY`, `AIRTABLE_API_KEY`, `ZAPIER_WEBHOOK_URL` patikrinti negalima, nes jų nėra kur laikyti. `.gitignore` turi `.env*` taisyklę (paruošta ateičiai).

**Išvada:** Airtable/Zapier/Anthropic — tai šiuo metu **tik paminėti CLAUDE.md/spec dokumentuose kaip planas**, realaus kodo, kuris juos kviestų, projekte nėra.

---

## 5. SEO/AEO

| Failas | Egzistuoja | Statusas |
|---|---|---|
| `public/llms.txt` | ❌ | Neegzistuoja (yra tik aprašytas `seo-plan.md` kaip planas) |
| `public/robots.txt` | ❌ | Neegzistuoja |
| `src/app/sitemap.ts` | ❌ | Neegzistuoja |
| `src/app/robots.ts` | ❌ | Neegzistuoja |
| `src/app/favicon.ico` | ❌ | Buvo, bet **ištrintas** (`git status`: `deleted: src/app/favicon.ico`), naujo nėra |

### 5.1 JSON-LD schemos — kur realiai įterptos į `<head>`/render

| Puslapis | `<SchemaOrg>` naudojamas? | Kokia schema |
|---|---|---|
| `/` (homepage) | ❌ NE | `localBusinessSchema` egzistuoja `src/lib/schemas.ts`, bet **niekur neimportuojamas ir nenaudojamas** (grep parodo tik apibrėžimą, 0 panaudojimų) |
| `src/app/layout.tsx` (root, paveiktų visus puslapius) | ❌ NE | Layout neturi `<SchemaOrg>` |
| `/paslaugos/veja` | ✅ TAIP | `vejaServiceSchema` + `vejaFaqSchema` |
| `/paslaugos/apzeldinimas` | ✅ TAIP | `apzeldinimosServiceSchema` + `apzeldinimsFaqSchema` |
| `/paslaugos/laistymas` | ✅ TAIP | `laistymasServiceSchema` + `laistymasFaqSchema` |
| `/paslaugos/trinkeles` | ✅ TAIP | `trinkelesServiceSchema` + `trinkelesFaqSchema` |
| `/paslaugos/trinkelės` (orphan) | ✅ TAIP | tos pačios schemos kaip aukščiau (dubliuotos) |

`generateMetadata`/`metadata` export — visuose 4 paslaugų puslapiuose yra (title/description/keywords/OG/canonical). Homepage `page.tsx` neturi savo `metadata` exporto — naudoja tik root layout metadata.

---

## 6. GIT / DEPLOY

### 6.1 `git log --oneline -10`
```
d5a3bce first commit
5d5504a Initial commit from Create Next App
```
Tik 2 commit'ai iš viso repo istorijoje.

### 6.2 `git status` — neperkeltos (uncommitted) žinios

| Tipas | Failai |
|---|---|
| Modified | `CLAUDE.md`, `README.md`, `next.config.ts`, `package-lock.json`, `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx` |
| Deleted | `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `src/app/favicon.ico` |
| Untracked (negit'inta) | `.claude/`, `.impeccable/`, `PRODUCT.md`, `atd-lt/`, `components.json`, `public/images/`, `public/videos/`, `seo-plan.md`, `spec/`, `src/app/paslaugos/`, `src/components/`, `src/contexts/`, `src/lib/` |

⚠️ **Kritinis faktas:** visi realūs produkto failai — visi `src/components/`, `src/contexts/`, `src/lib/`, `src/app/paslaugos/`, `spec/` — yra **untracked**, t.y. niekada nebuvo commit'inti. Git istorijoje (`d5a3bce`, `5d5504a`) jų nėra. Jei repo būtų klonuojamas iš `origin`, šių failų nebūtų.

### 6.3 Papildomas radinys — nested `atd-lt/` katalogas

Projekto šaknyje (`C:\CURSOR\ATD_Remake\atd-lt\atd-lt\`) yra **antras, savarankiškas git repo** (savo `.git/`, `node_modules/`, `public/`, `src/`) su tuo pačiu `origin` remote (`github.com/aplinkostvarkymo-lgtm/atd-lt.git`) ir tais pačiais 2 commit'ais. Jame **nėra** `package.json` nei realaus `src/app` turinio — tik tuščias scaffold likutis. Tai paliktas/pamestas katalogas, rodomas `git status` kaip `?? atd-lt/`.

### 6.4 Vercel deploy statusas

| Patikra | Rezultatas |
|---|---|
| `.vercel/project.json` lokaliai | ❌ Neegzistuoja — projektas nesusietas su Vercel CLI lokaliai |
| Vercel MCP `list_teams` | Grąžino tuščią sąrašą (`teams: []`) |
| Vercel MCP `list_projects` | Klaida — negalima gauti projektų sąrašo |
| **Išvada** | **Negalima patvirtinti**, ar `new.atd.lt` deploy'as atitinka paskutinį commit'ą — nėra prieigos prie Vercel projekto duomenų iš šios aplinkos. |

---

## Santrauka skaičiais (faktai, ne vertinimas)

- Page route'ų faile: **7** (1 jų laužia build)
- Realiai pasiekiami iš navigacijos page route'ai: **5** (`/`, veja, apzeldinimas, laistymas, trinkeles)
- Nuorodų į neegzistuojančius puslapius: **6** unikalūs keliai (`/darbai`, `/kontaktai`, `/patarimai`, `/paslaugos/prekyba-augalais`, `/kaina`(anchor, ne route), `/apie`)
- API route failų: **0** iš 3 paminėtų (`/api/calculate`, `/api/lead`, `/api/chat`)
- TODO/FIXME/placeholder žymų kode: **0**
- Commit'ų repo istorijoje: **2**, dauguma realaus kodo — untracked
- `npm run build` rezultatas: **FAIL** (exit code 1)
