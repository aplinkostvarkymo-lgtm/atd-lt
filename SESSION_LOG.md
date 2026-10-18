# Sesijos žurnalas — 2026-06-26 / 2026-06-27

Šis failas aprašo, kas konkrečiai padaryta vienos ilgos darbo sesijos metu. Tikslas — kad kita sesija (ar kitas žmogus) per kelias minutes supratų, kas pasikeitė, kodėl, ir ko NEREIKĖTŲ kartoti iš naujo.

Visi commit'ai jau `origin/main` (pushinti). Galutinis commit pirmos dalies (žemiau, skyriai 1–11): `61121570`. Po šio žurnalo sukūrimo sesija buvo tęsiama — žr. skyrių 12, galutinis commit: `3959bdc3`.

---

## 1. Pradinis auditas → [STATUS.md](STATUS.md)

Padarytas pilnas projekto faktų auditas (puslapiai, komponentai, turinys, API, SEO, git/deploy). Rezultatas išsamiai užrašytas `STATUS.md` faile — jis liko projekto šaknyje kaip nuolatinis "kaip yra dabar" dokumentas (atnaujinti jį, jei darai panašų auditą vėliau).

Svarbiausi rasti faktai tame audite:
- **Production build buvo sulaužytas** — `src/app/paslaugos/trinkelės/` (su diakritiku `ė` kataloge) griovė `next build`.
- Daug nuorodų vedė į neegzistuojančius puslapius (`/darbai`, `/kontaktai`, `/patarimai`, `/paslaugos/prekyba-augalais`).
- Pagrindinis CTA "Gauti preliminarią kainą" vedė į `#kalkuliatorius` anchor'į, kurio niekur nebuvo — tylus, nepastebimas bug'as.
- Jokio API route'o, jokio SEO failo (robots.txt, llms.txt, sitemap.ts) nebuvo.
- Rastas ir paliktas nepaliestas: GitHub repo turi antrą, nesusijusią `master` šaką su kitokia istorija (kitas Next.js 14 projektas — "landing page + provider signup"). Nieko su ja nedaryta.

## 2. Build fix — orphan trinkelės route (`51f0413a`)

Ištrintas `src/app/paslaugos/trinkelės/` (diakritikas kataloge laužė static export). Paliktas tik ASCII `src/app/paslaugos/trinkeles/`. Patvirtinta grep'u, kad niekas nelinkina į ištrintą versiją.

**Pakeliui rastas ir pataisytas šalutinis incidentas:** checkpoint commit'as per klaidą įtraukė ~20 700 failų iš pamesto, nesusijusio `atd-lt/atd-lt/` (dubliuotas git repo, paliktas nuo ankstesnio setup'o). Atstatyta per `git reset --soft` + `.gitignore` įrašą, perdarytas commit švariai. **Pamoka:** `git add -A` su nested `.git` katalogu šalia gali nesuveikti kaip submodule — tikrinti `git status` PRIEŠ commit'inant, jei matai neįprastai didelį diff'ą.

## 3. SEO infrastruktūra (`1db7b887`, `35e00fce`)

- `public/robots.txt`, `public/llms.txt` (su AI crawlerių sąrašu: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, anthropic-ai).
- `src/app/sitemap.ts` — dinaminis, tik realiai egzistuojantys route'ai.
- `localBusinessSchema` (JSON-LD) pridėtas į `src/app/layout.tsx` (globalus, visiems puslapiams).
- **Pamoka:** `docs/llms-aeo-skill.md` šablono kainos buvo pasenusios (8–15 €/m² vs realūs 8/4 €/m²) — pažymėtos komentaru faile, kad ateityje šis diff'as nebūtų kartojamas. Tikras kainų šaltinis VISADA `src/lib/translations.ts`.

## 4. Dead links pašalinti (`183b66ac`)

`Header.tsx` ir `GardenSceneHero.tsx` linkino į `/darbai`, `/kontaktai`, `/patarimai`, `/paslaugos/prekyba-augalais` — puslapių nebuvo. Nuorodos pašalintos/pakomentuotos, kol puslapiai bus sukurti.

## 5. Naujas `/kontaktai` puslapis + Airtable lead capture (`183b66ac`, `e2654fc8`)

- `src/components/layout/Footer.tsx` — naujas, rodomas visuose puslapiuose per `layout.tsx`.
- `src/app/kontaktai/page.tsx` + `src/components/pages/KontaktaiPage.tsx` — kontaktų forma (vardas/telefonas/email/paslauga/plotas/žinutė).
- `src/lib/airtable.ts` — `saveLead()`, server-only, POST'ina į Airtable `Leads` lentelę su tiksliais LT laukų pavadinimais (`Vardas`, `Telefonas`, `Email`, `Paslauga`, `Plotas (m²)`, `Žinutė`, `Šaltinis`, `Statusas`, `Data`).
- `src/app/api/lead/route.ts` — POST handler, validuoja, kviečia `saveLead()`, niekada nerodo žalios Airtable klaidos klientui.
- Forma sujungta su `/api/lead` per `fetch`, loading/success/error būsenos lokalizuotos.
- **Raktai** (`AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`) yra `.env.local` — gitignored, niekada nepatenka į commit'us.
- Visi `#kalkuliatorius` (niekur nevedantys) CTA pakeisti į `/kontaktai`.
- `ServicePopup.tsx` hardcoded `aria-label="Uždaryti"` pakeistas į lokalizuotą `translations[lang].common.close`.

## 6. Turinio nuoseklumo pataisymai (`193a2ad8`, `82fc3711`)

- Visur suvienodintas atsakymo laiko pažadas: **"Kainų pasiūlymas per 24–48 val."** (anksčiau vienur "Atsakome per 2 val.", kitur 24-48 val. — neatitikimas).
- Pašalintas nepatvirtintas **"Trakai"** iš aptarnavimo zonos — dabar visur "Vilnius ir Vilniaus rajonas".
- `LaistymasPas.tsx` CTA trūko `: Robertas@atd.lt` po "El. paštas" (kiti 3 paslaugų puslapiai turėjo, šis ne).
- **"Olandijos daržynų" → "Olandijos medelynų"** — neteisinga terminija (daržynas = vegetable garden, medelynas = tree nursery; augalų tiekėjui tinka medelynas).

## 7. Realios nuotraukos (`7de0591d`)

Originalus `images/` katalogas turėjo 15 failų su pavadinimais, NEATITINKANČIAIS `images/index.md` aprašymų (pvz. failas pavadinimu "ruloninė veja 1.jpg" realiai vaizdavo apželdinimo NT projektą, ne veją). **Kiekviena nuotrauka peržiūrėta vizualiai**, ne spėta iš failo vardo — taip rasti 2 mis-labeled failai:
- vienas pažymėtas "veja" buvo realiai `apzeldinimas-nt-projektas-1.jpg` turinys,
- kitas ("rulinė veja plius upelis.jpg") buvo **needs-confirmation creek nuotrauka**, kurios naudoti buvo aiškiai uždrausta.

13 patvirtintų failų perkelti į `public/images/` su švariais ASCII pavadinimais (pvz. `veja-mowed-stripes-1.jpg`). Integruoti į `VejaPage.tsx`, `ApzeldinimoPas.tsx`, `TrinkelesPas.tsx`, `LaistymasPas.tsx` (hero, proceso žingsniai, "Atlikti darbai" galerijos).

**Sąmoningai NEpanaudota:**
- `apzeldinimas-traku-vokes-dvaras-1.jpg` (prestižinė dvaro nuotrauka) — vartotojas nusprendė palikti nepanaudotą šiame etape (homepage neturi tinkamos sekcijos).
- needs-confirmation creek nuotrauka ir `prekyba augalais.jpg` — likę pradiniame `images/` aplanke, neperkelti.

## 8. Hotspot pozicijos hero sekcijoje — du raundai (`13254a86`, `80ccd34b`)

**Pirmas radimas:** "Apželdinimas" hotspot homepage hero'uje persidengė su H1 antrašte. Šaknis — **Framer Motion bug**: `HotspotMarker.tsx` turėjo `style={{ transform: "translate(-50%,-50%)" }}`, bet kadangi `motion.div` turėjo `animate`/`initial` su `scale`, Framer Motion **tyliai ignoravo** žalią `transform` string'ą (`getComputedStyle` rodė `transform: none`). Visi 4 hotspot'ai buvo pozicionuoti pagal viršutinį-kairį kampą, ne centrą. **Pataisyta** naudojant Framer Motion'o pačio `x`/`y` style reikšmes (`x: "-50%", y: "-50%"`) — tai TEISINGA, lieka kode.

Pirmame raunde TAIP PAT pakeičiau visų 4 hotspot'ų koordinates, kad išvengtų teksto — **vartotojas tai pavadino neteisingu taisymo būdu** (pajudinti VISUS, kai problemiškas buvo vienas). Antrame raunde:
- **Atstatytos originalios 4 hotspot'ų koordinatės** (`{left:"30%",top:"52%"}` ir t.t.) — `GardenSceneHero.tsx` `HOTSPOT_CONFIG`.
- Framer Motion centravimo fix'as **paliktas** (jis nebuvo dalis problemos, jį reverse'inti būtų vėl sugadinę centravimą).
- Vietoj hotspot'ų — **paslinktas TEKSTO blokas** žemiau (`bottom-[8%] md:bottom-[2%]`), tik desktop'e (mobile `bottom-[8%]` nepaliestas, kad nesusikirstų su mobile service strip).
- Pakeistas hero H1/H2 tekstas: H1 "Aplinkos tvarkymas, apželdinimas." / H2 "Laistymas, veja, apželdinimas, trinkelės." (LT+EN, `src/lib/translations.ts`).

**Pamoka:** kai randi UI koliziją tarp dviejų elementų, klausk kurį elementą "teisingiau" judinti — ne automatiškai tą, kurį lengviausia pajudinti kode.

## 9. Hero/header stiliaus pataisymai (`021a12e1`)

- Pašalinta telefono eilutė po CTA mygtuku hero sekcijoje (CTA pasiliko).
- Padidintas header'io telefono numeris (`text-sm` → `text-base lg:text-lg`, `font-semibold`).
- Teksto blokas paslinktas arčiau centro tik desktop'e (`left-[6%]` → `md:left-[21%]`), patikrinta, kad nebepersidengia su Apželdinimas hotspot'u nei vienam iš 1920/1440/1024px.

## 10. ServicePopup nuotraukos (`61121570`)

Pridėta po 1 nuotrauką į 4 paslaugų popup'ų (apzeldinimas/laistymas/veja/trinkelės) viršų — `src/lib/services-content.ts` naujas `image?` laukas + `ServicePopup.tsx` renderinimas. Nuotrauka yra **scroll'inamo turinio dalis** (ne fiksuota virš), kad nesulaužytų mobile bottom-sheet `max-md:h-[85vh]` aukščio skaičiavimo — patikrinta matematiškai (717px = lygiai 85% nuo 844px testinio viewport'o).

## 11. Git workflow disciplina

**Du atskiri atvejai šioje sesijoje**, kai commit'ai pasiliko tik lokaliai ir `atd-lt.vercel.app` jų nematė, kol vartotojas paprašė patikrinti `git log origin/main..main`. Dėl to:
- Į [CLAUDE.md](CLAUDE.md) pridėta PRIVALOMA taisyklė: push iškart po kiekvieno commit'o, be prašymo.
- Šios sesijos pabaigoje ta taisyklė buvo laikomasi automatiškai po kiekvieno tolesnio commit'o.

## 12. Spam apsauga, Facebook nuoroda, mobile overflow ir hero overlay (`03dabc12`, `8e4dd34e`, `fa022f5e`, `3959bdc3`)

Tęsinys po šio žurnalo pirmo įrašo. Keturi atskiri, vartotojo paeiliui užsakyti pataisymai:

**a) `/api/lead` spam apsauga (`03dabc12`)**
- Honeypot laukas (`company`) pridėtas į kontaktų formą — `KontaktaiPage.tsx`: off-screen (`absolute -left-[9999px]`, NE `display:none`/`type="hidden"`, nes tikri bot'ai tai atpažįsta), `aria-hidden="true"`, `tabIndex={-1}`, kad screen reader'iai ir Tab navigacija praleistų.
- `src/app/api/lead/route.ts`: jei `company` užpildytas, tyliai grąžina `{success:true}` BE `saveLead()` kvietimo (botas mano, kad pavyko; Airtable'o neapkrauname šlamštu).
- Ilgio validacija visiems laukams (`MAX_LENGTHS`: vardas 100, telefonas 30, email 100, žinutė 2000) — viršijus, grąžina generinę 400 klaidą, neatskleidžiant kurio lauko problema.

**b) Tikra Facebook nuoroda + schemos patikra (`8e4dd34e`)**
- `Footer.tsx`: pridėta tikra Facebook nuoroda (`https://www.facebook.com/RoberasATD.LT`, inline SVG ikona — **`lucide-react` šiame pakete NETURI "Facebook" ikonos**, brand ikonos iš jo pašalintos, naudotas rankinis SVG).
- Patikrinta `src/lib/schemas.ts` (jokio `sameAs` lauko — nepridėta, nes vartotojo instrukcija buvo "jei yra, pataisyk", ne "pridėk naują") ir `public/llms.txt` (jokio Facebook paminėjimo) — **sąmoningai NEpakeisti**, nes nebuvo ką taisyti.

**c) Mobile horizontalus overflow (`fa022f5e`)**
- Vartotojas pranešė apie real-device bug'ą (screenshot'ai iš telefono): dešinėje pusėje per visą puslapio aukštį papildoma juosta, puslapis horizontaliai slenkasi.
- Šaknis: `globals.css` `html`/`body` neturėjo `overflow-x: hidden`. Mobilios naršyklės "layout viewport" plėtimosi algoritmas ignoruoja tarpinį `overflow:hidden` ant pavienių `<div>` (čia — hotspot horizontali scroll juosta) ir vis tiek išplečia VISO puslapio viewport'ą iki descendant turinio pločio, jei tai nesustabdyta `html`/`body` lygmenyje.
- Fix: `overflow-x: hidden` pridėtas IR ant `html`, IR ant `body` (`globals.css` `@layer base`) — empiriškai patikrinta, kad abu būtini (pašalinus iš vieno, bug'as sugrįžta).
- **Svarbi pamoka dėl diagnostikos metodo:** vartotojo duotas vienaeilis `scrollWidth > clientWidth` filtras NIEKADA negrąžins tuščio sąrašo, kol egzistuoja teisėtas horizontaliai slenkantis elementas (čia — hotspot juosta), nes `Element.scrollWidth` per W3C specifikaciją atspindi turinio dydį nepriklausomai nuo `overflow` reikšmės tarpiniuose protėviuose. **Autoritetingas patikrinimas:** `document.scrollingElement.scrollWidth === clientWidth` ir `window.innerWidth === document.documentElement.clientWidth` — šis testas REALIAI atspindi, ar naršyklė leidžia puslapiui slinkti horizontaliai. Naudoti šį metodą, ne naivų `querySelectorAll('*')` filtrą, kitiems panašiems bug'ams ateityje.
- Pakeliui rasta **Turbopack CSS HMR cache staleness** (ne real bug) — po fix'o `getComputedStyle` rodė seną reikšmę per live HMR; išsisprendė `rm -rf .next` + serverio restart.

**d) Hero statinio vaizdo overlay → gradientas (`3959bdc3`)**
- Vartotojas pastebėjo (2 screenshot'ais iš telefono): po video→statinio vaizdo perjungimo, statinis kadras atrodo tamsesnis nei video paskutinis kadras.
- Diagnozė PRIEŠ taisymą (atskiras žingsnis, kaip paprašyta): `GardenSceneHero.tsx` turėjo `<div className="absolute inset-0 bg-black/25" />` virš `main_one.png`, bet `<video>` elementas analogiško overlay'aus neturėjo — todėl persijungimas sukurdavo patamsėjimo šuolį.
- Fix: plokščias `bg-black/25` pakeistas į vertikalų gradientą `bg-gradient-to-t from-black/45 via-black/10 to-transparent` — apačioje (kur H1/H2/CTA) stipresnis kontrastas (45% > buvęs 25%), viršuje (dangus/medžiai, atitinka video kadrą) **visiškai skaidru**, šuolio nebėra.
- Patikrinta: (1) teksto kontrastas 1920/1440/1024/375px pločiuose — visur skaitomas; (2) hotspot žymės turi savo nepriklausomą tamsų fono apskritimą (`HotspotMarker.tsx`, `rgba(10,10,10,0.50)` + blur), nepriklauso nuo page gradiento, todėl matomos net ant skaidresnės zonos; (3) `getComputedStyle` patvirtino tikslias gradiento reikšmes (`0% black/0.45 → 50% black/0.1 → 100% transparent`).
- **Pastaba dėl įrankių:** `preview_screenshot` su custom dydžiais (1920×1080, 1440×900) šioje sesijoje grąžino teisingą turinį, bet su klaidingu "letterboxing" (turinys susitraukęs į kampą, likusi dalis tuščia) — preset dydžiai (`mobile`, ir custom 1024×768) renderinosi pilnai teisingai. Jei screenshot atrodo tuščias/susitraukęs prie custom dydžio, tikėtina tai įrankio artefaktas, ne realus puslapio bug'as — patvirtinti per `window.innerWidth`/`getBoundingClientRect()` prieš dėl to nerimaujant.

---

## 13. GA4 integracija su cookie consent (`cb83c931`)

- Įdiegtas `@next/third-parties`. `src/components/Analytics.tsx` (client) renderina `<GoogleAnalytics gaId={...} />` SĄLYGIŠKAI — tik jei `localStorage["atd-cookie-consent"] === "accepted"`. ID skaitomas iš `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`.env.local`, gitignored).
- `src/lib/cookieConsent.ts` — bendras helperis (`getStoredConsent`/`setStoredConsent`) + `CustomEvent("atd-cookie-consent-change")`, kad `Analytics.tsx` reaguotų į vartotojo pasirinkimą GYVAI, be page reload.
- `src/components/CookieConsent.tsx` — fixed bottom banneris, 2 mygtukai (Sutinku/Atmesti), LT/EN per `translations.ts` (`cookieConsent` raktas). Banneris nebesirodo, kai pasirinkimas jau įrašytas `localStorage`.
- Patikrinta `preview_network` įrankiu: prieš paspaudimą jokio `googletagmanager.com`/`google-analytics.com` request'o NEIŠEINA; po "Sutinku" — `gtag/js` + realus `page_view` collect ping iškart (be reload); po "Atmesti" — niekada nepasileidžia, net po reload.
- **Svarbu kitai sesijai / vartotojui:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` yra TIK `.env.local` (gitignored, nepasiekia Vercel). Kad GA veiktų production'e, reikia tą pačią reikšmę (`G-SQXZ5DL1W5`) pridėti Vercel project → Settings → Environment Variables, tada redeploy.

---

## 14. 1 etapo paleidimo darbai — šaka `claude/atd-launch-and-polish-8bc650` (`71c4dec5`)

Visa ši sesija dirba **atskiroje šakoje** (`claude/atd-launch-and-polish-8bc650`), ne `main`. Vercel duoda peržiūros URL iš šios šakos. `main` ir `new.atd.lt` nekeičiami, kol Robertas patvirtins.

**a) Dead links pataisyti (`services-content.ts`)**
- `ctaHref: "/darbai"` → `/kontaktai` (galerijos popup CTA)
- `ctaHref: "/patarimai"` → `/kontaktai` (patarimų popup CTA)
- Header ir GardenSceneHero jau buvo pataisyti ankstesnėje sesijoje (pašalintos/pakomentuotos nuorodos). Šioje sesijoje pataisyti tik services-content.ts likę du.

**b) 301 redirect'ai (`next.config.ts`)**
- 35 taisyklės pagal `redirectai.md` lentelę — visi seni atd.lt puslapių numeriai (`/lt/pages/<nr>/*`) → atitinkami nauji URL.
- Svarbiausia: veja (`2187`, `2193`, `2199`), apželdinimas (`2188`, `2190`, `1934`), tvenkiniai (`1937`, `2194`, `2196`), kontaktai (`1947`).
- Atsarginė taisyklė paskutinė: `/lt/pages/:path*` → `/`.
- Redirektai taip pat: `/lt`, `/lt.php`, `/index.php`, `/en`, `/en.php`, `/lt/site-tree`, `/en/site-tree` ir t.t.

**c) `/paslaugos/tvenkiniai` puslapis**
- Nauja šaka navigacijoje (Header + Footer automatiškai per `SERVICE_LINKS`).
- Turinys iš senos svetainės aprašymų: kasimas/įrengimas, valymas, įžuvinimas — be konkrečių kainų (`"Kaina pagal apžiūrą"`).
- LT ir EN vertimas `translations.ts` (`tvenkiniaiPas` raktas).
- Vertimas: `src/components/pages/TvenkiniaiPas.tsx`, route: `src/app/paslaugos/tvenkiniai/page.tsx`.
- Struktūra: Hero → Services → Process → FAQ → CTA (lygiai kaip kiti paslaugų puslapiai).

**d) El. pašto pranešimai (`/api/lead`)**
- Resend REST API (direct fetch, nereikia npm paketo).
- Klaida siunčiant emailą NEBLOKUOJA vartotojo atsakymo — `sendEmailNotification()` kviečiamas su `.catch()`.
- Jei `RESEND_API_KEY` nenustatytas — email tiesiog praleidžiamas, Airtable vis tiek veikia.
- **Reikalingi Vercel env vars** (Settings → Environment Variables → Production + Preview):
  - `RESEND_API_KEY` — iš resend.com (nemokamas, 100 el./dieną)
  - `RESEND_FROM` — opcionalus; numatytasis `"ATD svetainė <noreply@atd.lt>"` (reikia domeno verifikacijos Resend'e); kol domenų nėra, galima naudoti `"onboarding@resend.dev"` (tik testavimui).
- **Kaip pasitikrinti**: užpildyti formą peržiūros URL → Airtable turi gautı įrašą, el. paštas `Robertas@atd.lt` turi gauti pranešimą.

---

## Žinomi neuždaryti dalykai (kitai sesijai)

- **Mobile**: hero H1 tekstas ir mobile service strip (apačioje) galimai šiek tiek persidengia ~9px ties 390px pločiu — rasta, **nepataisyta** (pre-existing, ne šios sesijos pakeitimų pasekmė; vartotojas neprašė taisyti dabar).
- `apzeldinimas-traku-vokes-dvaras-1.jpg` — nuotrauka egzistuoja `public/images/`, niekur nenaudojama. Reikės sprendimo, kur ją rodyti (homepage nauja sekcija? `/darbai` puslapis, kai bus sukurtas?).
- `/darbai` (portfolio) puslapis sąmoningai NEsukurtas — keletą kartų aiškiai atidėtas kaip atskiras darbas.
- `/paslaugos/prekyba-augalais`, `/patarimai` puslapių vis dar nėra — `services-content.ts` jiems turi popup turinį, bet jokio route'o.
- AI kalkuliatorius (`/api/calculate`) ir Airtable augalų kainų paieška (aprašyta `docs/ATD-remake.md`) — neimplementuota, tik planavimo dokumentuose.
- **GA4 `NEXT_PUBLIC_GA_MEASUREMENT_ID` reikia pridėti Vercel env vars** (žr. skyrių 13) — kol nepridėta, production'e GA4 niekada nesikrauna, net jei vartotojas paspaudžia "Sutinku".
- GitHub repo `master` šaka (nesusijusi istorija) — neištirta giliau, nepaliesta.

---

## 15. Nepriklausomas Codex auditas — 2026-10-17

Perskaitytas CODEX_REVIEW.md ir atliktas esamos šakos `claude/atd-launch-and-polish-8bc650`, HEAD `e1f4430f`, vizualinis, kodo, SEO ir GEO auditas. Rezultatas: `atd-lt-audit/FULL-AUDIT-REPORT.md`, atskiras ACTION-PLAN.md, penkios sričių ataskaitos, struktūriniai JSON įrodymai ir 21 production ekrano kopija.

- Programos kodas ir paketai nekeisti, jokių commit / push / deploy. Ankstesni žurnalo įrašai palikti istorijai; jų sąrašas apie dar neegzistuojančią galeriją nebėra dabartinės būklės patvirtinimas.
- TypeScript ir production build praėjo (build prireikė tinklo Google Fonts). Lint nepraeina dėl penkių react-hooks/set-state-in-effect klaidų. Nominali z-index tvarka teisinga, bet mobile hero paslaugų juostą uždengia sticky CTA.
- Patikrinti visi 8 vieši puslapiai 1440 ir 390 px, papildomi homepage pločiai 320 / 768 / 1024. 200 atsakymai, 0 pageerror, dokumento horizontalus overflow nerastas. /darbai header kontrastas 1,13:1, dropdown nevaldomas klaviatūra ir nutrūksta pereinant pelės tarpą; dialogams trūksta fokuso / Escape valdymo. No-JS homepage H1/CTA nematomi, statistika HTML rodo 0+.
- Kainų BiLang pakeitimas teisingas, visos galerijos nuotraukos egzistuoja, filtrų patikra praėjo. Nėra patvirtinto šriftų gedimo ar „dingusių sekcijų“ klaidos; pirmų screenshot skenavimo smooth-scroll artefaktas atskirtas ir pataisytas audito skripte.
- Sitemap apima 6/8 puslapių, EN tik kliento būsena su LT metadata, llms tebeskelbia nepatvirtintus Trakus. Galerijos „tikri ATD projektai“ teiginiai turi būti suderinti su CODEX_REVIEW nuotraukų kilmės pastaba; auditas netvirtina, kad nuotraukos svetimos.
- npm audit gautas iš registro, rastos priklausomybių pranešimų versijų atitiktys; ne kiekviena pranešimo taikymo sąlyga čia tenkinama. Detalės security.md, jokių išnaudojimo bandymų.
- API bandymai tik su mock; jokių įrašų Airtable ar el. laiškų. Tikras production indeksavimas, GSC/GBP/AI citavimas ir CrUX nepatvirtinti; vietiniai lab duomenys atskirti. Joks SEO/GEO rubrikos balas nėra realaus platformų matomumo matavimas.

## 16. Autorizuoti audito pataisymai, išsaugant durų efektą — 2026-10-17

Vartotojas autorizavo klaidų taisymą ir aiškiai paprašė išsaugoti hero durų atsidarymo efektą. Taip pat patvirtino, kad **visos 13 galerijos nuotraukų yra ATD darbai**. Hero video ir pagrindinis kadras nepakeisti, 2× playbackRate bei desktop žymeklių koordinatės išsaugoti; pridėtas video klaidos / užstrigimo ir no-JS fallback. SHA-256 patvirtinta prieš Git HEAD.

Įgyvendinti navigacijos, native dialogų ir fokuso, mobiliosios CTA / hero išdėstymo, formos / API validacijos ir dažnio ribojimo, email `after` / HTTP klaidų, slapukų nustatymų, kontrasto, lokalizacijos, reduced motion ir SEO pakeitimai. LT URL išsaugoti, EN turi /en URL. Pagal naujos Next versijos vadovą puslapiai generuojami `src/app/[lang]/[[...slug]]/page.tsx`, šakninis layout perkeltas į `[lang]`; `src/proxy.ts` tik viduje perrašo LT į /lt. Sitemap dabar 16 kalbinių URL.

Next / third-parties / eslint-config-next 16.4.2; nereikalingas shadcn CLI pašalintas, jo CSS utilities saugomos src/app/component-utilities.css. `npm audit --omit=dev` — 0; pilname audite liko 5 high kūrimo įrankių įrašai vienoje braces grandinėje, saugaus suderinamo pataisymo registre nėra. Force downgrade netaikytas.

Patikros: build, lint, tsc ir diff --check PASS; 375 / 375 LT/EN vertimų raktai; 46/46 naršyklės ir 15/15 izoliuotų API bandymų, 0 pageerror. Jokių tikrų lead / el. laiškų ar deploy. Pasirenkamam bendram serverless limitui reikalingi UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN; be jų veikia per-process limitas. Tikri hosting env / tiekėjai / indeksavimas nepatvirtinti.

Pilna pataisymų suvestinė, ribos ir įrodymai: `atd-lt-audit/FIXES.md`, `atd-lt-audit/after/verification.json`, `atd-lt-audit/evidence/lead-fixes-results.json`. Pradinio audito balai palikti kaip istorinė būklė, o ne naujas įvertinimas. Commit / push neatlikti; darbas vykdytas toje pačioje atskiroje peržiūros šakoje.

## 17. Vienkartinė paslaugų proceso animacija — 2026-10-17

Vartotojas paprašė visų penkių paslaugų 1–2–3 sekose vieną kartą nupiešti jungiamąją liniją ir paeiliui atskleisti numerius, palaikant reduced motion. Bendras `ProcessSteps.tsx` pakeičia dubliuotą etapų atvaizdavimą; LT/EN tekstai išsaugoti. Desktop jungtis horizontali, telefone vertikali, tiksliai tarp numerių centrų. Visa seka 780 ms, be ciklų ir pakartotinio paleidimo slenkant. Aprašymai neanimuojami; esami heading efektai išsaugoti. Be JavaScript / IntersectionObserver arba įjungus reduced motion numeriai ir linijos statiškai matomi. Pakeitus judesio nuostatą sesijos metu efektas taip pat pašalinamas. Naujų priklausomybių nėra.

Patikra: 19/19 Edge testų, 0 pageerror; visi penki LT puslapiai 1440 / 390 px ir penki EN desktop, sumažintas judesys, jo pakeitimas sesijos metu, no-JS, animacijos seka / trukmė / nepasikartojimas, jungčių geometrija. Viena bendra desktop / mobile vizualinė peržiūra, taisymų po jos nereikėjo. Įrodymai `atd-lt-audit/after/process/verification.json`, dvi ekrano kopijos tame pačiame kataloge, skriptas `atd-lt-audit/evidence/verify-process-motion.cjs`.

Lint ir tsc PASS. `next build` Turbopack šiame paleidime nutrūko dėl PostCSS pagalbinio Node proceso (ir sandbox, ir išplėstomis teisėmis); production `npx next build --webpack` PASS. package.json build komanda nepakeista. Hero MP4 SHA-256 tebėra `d91249bb704834626f73b9579641fe245eb9bb07e1d97a1265bc9406c1d577ed`; hero komponentas šiame pakeitime neliestas. Production peržiūra atnaujinta `http://localhost:3100`, exec session 4518. Commit / push / deploy neatlikti.

## 18. Nuorodų pabraukimas ir CTA rodyklės — 2026-10-17

Vartotojas autorizavo abu mikroefektus. `LocalizedLink` turi pasirenkamus `underline` / `arrow` parametrus, kurie nepatenka į HTML atributus. Tekstinėse header / dropdown / mobile meniu, footer ir breadcrumb nuorodose tekstas pabraukiamas iš kairės per 180 ms užvedus pelę arba gavus `focus-visible`. Pabraukiama pagal teksto, ne visos meniu eilutės plotį. CTA SVG rodyklės (aria-hidden) pasislenka 3 px per 180 ms: homepage kainos mygtuke, penkių paslaugų kainos / pasiūlymo mygtukuose, darbų puslapio kontakte ir service popup. Apželdinimo nuorodos į laistymą tekstinė rodyklė abiem kalbomis pakeista tuo pačiu SVG. Telefono / email mygtukams papildomos rodyklės nedėtos. Reduced motion: pabraukimas momentinis, rodyklė nejuda; hover animacija tik fine pointer / hover įrenginiams. Jokių naujų priklausomybių.

Patikra: 24/24 Edge testų, 0 pageerror; visi 8 LT ir EN puslapiai, mouse / keyboard fokusas, poslinkis be layout shift, reduced motion ir penki 320 px touch scenarijai. Pradinis vienos patikros neatitikimas buvo computed CSS nulio formatas (0px vs 0%), pataisytas tik tikrinimas. Dvi desktop / mobile ekrano kopijos vizualiai peržiūrėtos, UI pataisymų po peržiūros nereikėjo. Įrodymai `atd-lt-audit/after/links/verification.json`, skriptas `atd-lt-audit/evidence/verify-link-motion.cjs`. Lint / tsc / diff --check ir production webpack build PASS. Hero intro / video / fonas / žymekliai nepakeisti, `GardenSceneHero` pridėtas tik CTA arrow parametras. Peržiūra localhost:3100 atnaujinta, exec session 46702. Commit / push / deploy neatlikti. Vartotojas šiuo metu savarankiškai siunčiasi 419 nuotraukų iš Google Drive; atranka dar nepradėta.

## 19. Audito pataisymų ir animacijų commit / push autorizacija — 2026-10-17

Vartotojas aiškiai paprašė commitinti ir pushinti audito pataisymus bei naujas animacijas. Po `git fetch origin` patvirtinta, kad `origin/main` ir darbo šakos HEAD sutampa (`e1f4430f`), todėl galimas įprastas fast-forward push. Parengtas vienas bendras commit su kodu, audito ataskaitomis ir patikrų įrodymais. Publikavimo tikslas pagal CLAUDE.md — `main`, taip pat išsaugoma `claude/atd-launch-and-polish-8bc650` šaka. Anksčiau vartotojo pateiktas untracked `CODEX_REVIEW.md` nėra mūsų pakeitimas ir paliekamas vietoje neįtrauktas į commit. Ankstesnės sekcijos apie commit / push nebuvimą aprašo tų etapų būseną. Galutinės patikros: lint, tsc, webpack production build, 46 bendros naršyklės / 15 API / 19 proceso animacijos / 24 nuorodų ir CTA patikros; vėlesnės patikros atitinka vėlesnių pakeitimų apimtį.

## 20. Senos informacijos migracija, patarimų skiltis ir SEO / GEO — 2026-10-18

Vartotojas paprašė peržiūrėti seną www.atd.lt naudingą informaciją, naujos svetainės SEO ir galimybes būti randamiems / rekomenduojamiems AI. Naudoti jo nurodyti seo-geo, seo-page ir seo-flow; UI plėtrai incumbent Impeccable gairės. Vartotojas patvirtino dabartinį juridinį pavadinimą **MB „ATD.LT“** ir kryptį į penkias naujos svetainės paslaugas: medžių / krūmų pjovimo ir apleistų sklypų tvarkymo nebesiūlome.

Tiesioginis HTTP patvirtino: www.atd.lt/ → senas /lt/ (200); senas robots visus leidžia, /sitemap.xml tuo metu 500. Nauja vieša Vercel versija pasiekiama 200 ir canonical nukreipia į atd.lt, kuris dar rodo seną sistemą. DNS / hostingas / profiliai nekeisti.

Senoje patarimų skiltyje rasti 6 teminiai įrašai ir „test“. Svarbi klaida: 2193 pavadinimas apie veją, tekstas apie krūmų pjovimo broką. 2192 turi senus teisinius tekstus ir kainas litais; nekopijuotas. 2195 nebeatitinka dabartinių paslaugų. 2196 biologiniai / kiekių / rūšių patarimai neperpublikuoti automatiškai. 2191 ir 2194 temos perrašytos be senų kainų ir nepagrįstų teiginių.

Pridėta /patarimai ir du straipsniai abiem kalbomis (6 nauji URL): darbų planas ir tvenkinio kasimo planavimas. Article / CollectionPage / BreadcrumbList, localized metadata / OG / hreflang, sitemap dabar 22 URL, tikros header / footer / homepage ir straipsnių nuorodos. Popup „Skaityti visus patarimus“ pagaliau veda į tikrą skiltį ir nebežada neegzistuojančių straipsnių. Visi nauji UI / redakciniai tekstai centralizuoti translations.ts, tips-content tik reexport. Datos / autoriaus kvalifikacijos / rekomendacijų balai neišgalvoti. Prieš publikavimą savininkas gali patikslinti praktinius tekstus.

1946 → hub, 2191 → planavimo straipsnis, 2194 → tvenkinio straipsnis (308), taip pat jų /lt/lt/pages variantai. Nebeaktualios temos ir „test“ 404; 2193 / 2196 ankstesni service redirect išsaugoti. MB ATD.LT matoma footer / kontaktuose ir legalName schemoje; iš schemos pašalintas nepatvirtintas foundingDate 2012. Homepage po hero ir stats pridėtas aiškus įmonės / geografijos / 5 paslaugų pristatymas. Hero durų komponentas ir media šiame etape nepakeisti, MP4 SHA-256 vis dar D91249BB704834626F73B9579641FE245EB9BB07E1D97A1265BC9406C1D577ED.

Patikra: lint / tsc / webpack production build PASS; 25/25 Edge bandymai, 0 pageerror. SSR / no-JS, LT/EN, visų naujų straipsnių nuorodos, schema / metadata / sitemap, 308 / 404 ir mobile meniu. Vienas bendras desktop / mobile vizualinis turas; viena pataisymų partija (skaitymo metu telefonuose paslėpti floating chat, homepage pridėtas pristatymas), vienas patvirtinimo turas. Vietinė peržiūra localhost:3100, session 83590. Šio etapo commit / push neatliktas, ankstesnis bfb4e199 jau GitHub.

Ataskaita ir faktiniai ribojimai: `atd-lt-audit/seo-content-2026-10-18/GEO-ANALYSIS.md`; inventorius `legacy-content-map.csv`; `public-endpoints.json`, `page-samples.json`, `verification.json`, 8 screenshots. Tikro GBP profilio, GSC / Bing / GA paskyrų, realių CWV ir AI rekomendacijų dažnio nepatvirtinta. llms.txt netraktuojamas kaip citavimo ar Google reitingo garantija. Svarbiausi tolesni veiksmai: domeno migracija, GSC / GBP ir viešų įmonės duomenų nuoseklumas, tikrų projektų istorijos iš vartotojo tvarkomų nuotraukų.

## 21. Objektų nuotraukų atrankos pradžia — 2026-10-18

Vartotojas autorizavo nuotraukų peržiūrą, rūšiavimą ir paruošimą svetainei iš `C:\CURSOR\ATD_Remake\Objektų_foto`, siūlydamas dirbti po vieną aplanką ir klausti neaiškių faktų. Rasti 31 objekto / teminiai aplankai. Pirmas peržiūrėtas `34 istorijos`: 23 JPG ir 1 MP4. Taikytos seo-images failų paruošimo gairės. Svetainės komponentai ir hero nepakeisti.

Sukurtas `34 istorijos\Svetainei`: 8 atrinktų originalų kopijos, 16 WebP (ilgoji kraštinė iki 800 / 1600 px, q82, be didinimo ir apkarpymo, EXIF pasukimas), 4 šlaito darbų originalų kopijos atskirame rezerve, visų nuotraukų kontaktinis lapas, SKAITYTI.md ir atranka.json su LT/EN alt tekstų pasiūlymais / originalų atitikmenimis / SHA-256 / matmenimis / svoriu / visų JPG sprendimais. Originalai nejudinti ir nekeisti; WebP neperkeliamas EXIF / GPS. 16 variantų iškoduoti ir patikrinti matmenys; atrinktų kopijų hash sutampa su originalais. WebP bendras dydis 4 654 032 baitai, vieno failo 49 614–684 740 baitų; didieji variantai yra paruošti šaltiniai, svetainėje dar reikės naudoti tinkamus responsive dydžius. Pagrindinis kandidatas 20200623_142501.jpg vizualiai patikrintas po konvertavimo. MP4 neperžiūrėtas, neparuoštas publikavimui.

Pateiktas klausimas vartotojui dėl atliktų ATD darbų apimties, viešo pavadinimo / vietovės ir šlaito nuotraukų priklausymo šiam objektui; atsakymo šiame etape dar nėra. Prieš / po poros nepatvirtintos, darbų datos nespėjamos iš failų vardų. Kiti 30 aplankų neperžiūrėti. Į svetainę nieko nekelta, commit / push neatlikti. Atrankos pagalbiniai skriptai `atd-lt-audit/evidence/prepare-photo-selection.cjs`, `export-34-istorijos.cjs`, darbinė peržiūra `atd-lt-audit/photo-selection/34-istorijos/`.

### 21.1. „34 istorijos“ faktų patvirtinimas ir antras aplankas

Vartotojas patvirtino: visas „34 istorijos“ aplankas, įskaitant šlaito seką, yra tas pats objektas; ATD atliko želdinimą, grunto paruošimą, šlaito formavimą, bet NE takų ir trinkelių įrengimą. Viešas pavadinimas „34 istorijos“ leidžiamas. Atnaujinti Svetainei/atranka.json ir SKAITYTI.md, pridėti 2 šlaito kadrai: dabar 10 atrinktų kopijų ir 20 WebP. Parengtas LT/EN projekto aprašo ruošinys su aiškiomis darbų ribomis. Prieš/po slankiklio pora tebėra nepatvirtinta.

Vieši šaltiniai: Omberg straipsnis https://omberg.lt/naujienos/omberg-group-parduoti-daugiau-nei-2000-butu-paraiska-ilgalaikei-lyderystei/ įvardija projektą Gineitiškėse; https://citify.eu/lt/projects/8600/34-istorijos/ — Pakonių g., Vilnius. Viešam projekto aprašui parinkta „Vilnius“. Konkretus Google Maps įrašas netikrintas. Pagalbinis papildymo skriptas evidence/confirm-34-istorijos.cjs.

Pradėta „Alvydas simlita“ peržiūra: 11 JPG, kontaktinis lapas ir techninis inventorius atd-lt-audit/photo-selection/alvydas-simlita/. Yra 800x600 ir 600x800 originalų — jų nedidinti. Matosi sodinimo eiga; savininko paprašyta patvirtinti ATD darbų ribas, viešą vietovę / projekto pavadinimą. Šio objekto Svetainei dar nesukurtas, faktai nespėjami. Į svetainę nieko nekelta, commit/push neatlikti.

### 21.2. Senasis Tarpupis — atranka ir patvirtintos darbų ribos

Vartotojas patvirtino „Alvydas simlita“ objekto vietovę — Senasis Tarpupis — ir darbus: veja, augalų sodinimas, geotekstilės klojimas, mulčas. Aiškiai nurodė nenaudoti vardų. Viešas rinkinio pavadinimas „Privataus sklypo apželdinimas Senajame Tarpupyje“, failų prefiksas senasis-tarpupis; originalaus aplanko pavadinimas paliktas tik vidiniam atsekamumui.

Sukurtas objekto Svetainei aplankas: 7 originalų kopijos ir 12 WebP (2 mažos raiškos atrinktiems originalams tik po vieną 800 px variantą; kitiems 800/1600). Originalai nepakeisti, kopijų SHA-256 patikrinti, visi WebP iškoduoti, matmenys ir EXIF nebuvimas patikrinti. Vienas didelis WebP vizualiai peržiūrėtas. Atranka.json turi LT/EN aprašų / alt tekstų ruošinius, patvirtintas darbų ribas, visų 11 JPG sprendimus; SKAITYTI.md ir bendras kontaktinis lapas. Galutinio užmulčiuoto želdyno kadro nepatvirtinta; dauguma nuotraukų rodo darbų eigą, nebaigtą geotekstilę / augalus vazonuose. Prieš/po poros neparinkta. Takų / trinkelių darbai ATD nepriskiriami. Generavimas / retušas netaikytas.

Pakartotinai panaudojamas exporter: atd-lt-audit/evidence/export-project-photos.cjs; objekto nustatymai photo-selection/alvydas-simlita/selection-config.json. Šis exporter stabdo darbą, jei Svetainei jau egzistuoja, ir nedubliuoja mažų failų variantų.

Peržiūrėtas trečio aplanko „Aš mykliu gamtą renginys vaikams“ penkių JPG kontaktinis lapas; jame dar 3 MP4, kurie neperžiūrėti. Nuotraukos — panašūs grupiniai renginio kadrai. Vartotojo paklausta apie ATD vaidmenį ir ar ruošti kaip veiklos istoriją, ar kol kas praleisti. Renginio Svetainei dar nesukurtas. Svetainės kodas ir hero nepakeisti, commit / push neatlikti.

### 21.3. Renginys „Kuo vardu tavo žuvis?“

Savininkas pateikė istorinį https://atd.lt/lt/pages/1949/aplinkos-tvarkymas/myliu-gamta ir paaiškino konkretų vaikų renginį: pokalbis apie gamtos saugojimą / elgesį gamtoje, jo nupirkti karosiukai, kiekvienas vaikas žuvytei suteikė vardą ir ją paleido. Savininkas norėtų renginį tęsti. Tai užfiksuota kaip noras, ne suplanuotas kitas renginys.

Perskaitytas www variantas per web (tiesioginis hosto HTTP bandymas DNS nesėkmingas). Senas tekstas pristato platesnę „Aš Myliu Gamtą“ iniciatyvą; konkretaus vaikų renginio pavadinimo iš jo netvirtiname. Senų pažadų dalį pajamų skirti iniciatyvai, prekybos atributika ir ekologinių rezultatų į naują ruošinį neperkėlėme. Renginio faktai remiasi savininko pasakojimu. Šaltinio apibendrinimas ir ribos išsaugoti selection-config.json / atranka.json, ne pažodinis seno straipsnio kopijavimas.

Sukurtas renginio Svetainei: 2 JPG kopijos, 4 WebP, patikrintos kopijos / matmenys / dekodavimas / EXIF nebuvimas, pagrindinis variantas peržiūrėtas. LT/EN pasakojimo ir alt tekstų ruošiniai; neviešinta. Trys MP4 dar neperžiūrėti. Paklausta renginio datos / vietos ir ar grupines dalyvių nuotraukas galima viešinti. Nepriskirta komercinių projektų galerijai.

Pradėta „Augalai vietoj trinkelių“ peržiūra: 8 JPG kontaktinis lapas ir inventorius photo-selection/augalai-vietoj-trinkeliu/. Matosi dangos išardymo vietos, sodinimas ir paruoštas gruntas. Paklausta ATD darbų apimties, vietovės ir ar dangos šalinimo tikslas buvo pakeisti ją želdiniais. Svetainei dar neparuoštas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.4. Renginio vieta / data / viešinimas ir Galgių rinkinys

Savininkas patvirtino renginio vietą: Užupis, prie Užupio prūdelio, dalyvavo viena darželio grupė (įstaiga neprisimenama). Leido nuotraukas viešinti ATD svetainėje ir paminėti skirtą laiką bei iš objektų uždirbtas lėšas. Tikslių metų neprisiminė. Patikrintas trijų originalių JPG EXIF TIFF DateTimeOriginal: 20160520_113508 -> 2016:05:20 11:35:07; 113510 -> 11:35:09; 113525 -> 11:35:24. Visur 2016-05-20; fotoaparato laikrodžio nepriklausomai netikrinome. Viešas ruošinys pažymi 2016 m. pagal nuotraukų metaduomenis. Atnaujinti renginio selection-config.json, Svetainei/atranka.json ir SKAITYTI.md. Naujo renginio nėra suplanuota; fiksuota kiekvieno užsakymo finansavimo dalis nepatvirtinta.

„Augalai vietoj trinkelių“ savininkas patvirtino: Galgiai, naujo namo savininkui trūko želdinių, vietos parinktos pagal automobiliams reikalingą erdvę; ATD pjovė / ardė esamas trinkeles, sodino augalus ir papildomai paruošė / pasėjo veją. Sukurtas Svetainei su 6 originalų kopijomis, 12 patikrintų WebP, LT/EN aprašais / alt, visų 8 failų sprendimais. Pagrindinis rezultato WebP vizualiai patikrintas. Pradinės būklės ir pasodintų augalų kadrai yra, tačiau skirtingų rakursų; slankiklio pora nepatvirtinta. Nėra sužaliavusios naujos vejos kadro. Originalai nepakeisti.

Kitas aplankas „Avia solutions pušis“ turi 17 JPG. SHA-256 patvirtinta, kad 8 failai yra identiškos Galgių aplanko nuotraukos — nekelti į Avia projekto istoriją ir neištrinti originalų. Įrodymai photo-selection/augalai-vietoj-trinkeliu/cross-folder-duplicates.json. Likę 9 JPG rodo didelių pušų atvežimą / sodinimą ir vėlesnį vaizdą. Peržiūrėtas kontaktinis lapas photo-selection/avia-solutions-pusis/. Paklausta darbų, vietovės, viešo pavadinimo ir ar 9 kadrai yra vienas objektas. Svetainei šiame aplanke dar nesukurtas. Svetainės komponentai nepakeisti, commit/push neatlikti.

### 21.5. „AeroCity Tech Valley“ atranka

Savininkas patvirtino vietovę / objekto pavadinimą „AeroCity Tech Valley“ ir vieną objektą visoms 9 pušų atvežimo, sodinimo ir vėlesnių želdinių nuotraukoms. Patvirtinti ATD darbai — didelių pušų atvežimas, sodinimas ir želdiniai. Viešame tekste naudojamas šis pavadinimas; papildomas „Avia Solutions“ užsakovo vardas nepridedamas.

Sukurtas „Avia solutions pušis/Svetainei“: 6 atrinktų originalų kopijos, 12 WebP, LT/EN tekstų / alt ruošiniai, visų 17 originalų sprendimai ir kontaktinis lapas. 8 SHA-256 patvirtinti Galgių dubliai neįtraukti į publikavimo atranką; originalai palikti. Kontaktinis lapas rodo visus aplanko originalus, įskaitant dublį — SKAITYTI aiškiai nurodo šiam projektui naudoti tik atrinktus originalus / WebP. Kopijos ir WebP patikrinti exporter; bendro vėlesnio vaizdo WebP peržiūrėtas. Prieš / po slankiklio pora neparinkta, kiekių / aukščių / datų nespėta.

Toliau peržiūrėtas „Belmontas“: 17 JPG ir vienas MP4 (neperžiūrėtas). Kontaktinis lapas / inventorius photo-selection/belmontas/. Matosi grunto darbai, akmenų šlaitas, latakas, laistymo įranga ir dangų eiga; savininko paklausta, kokie darbai ATD, kokį pavadinimą naudoti ir ar yra baigto rezultato vaizdų / ar MP4 rodo rezultatą. Svetainei dar nesukurtas. Svetainės kodas ir hero nepakeisti; commit/push neatlikti.

### 21.6. Belmonto projektas ir video kadrai

Savininkas patvirtino pavadinimą „Belmonto projektas“, rezultatą MP4 ir darbų apimtį: grunto keitimas, atraminės sienelės ardymas, akmenų šlaitas, tako betonavimas, akmeninės trinkelės, laistymas, tinklas nuo kurmių. Pagrindinė specifika — vos 97 cm pločio įvažiavimas; didžioji darbų ir medžiagų pervežimo dalis rankomis, kastuvais / karučiais, daliai darbų itin mažas krautuvas. Neaprašyti visi darbai kaip absoliučiai be technikos.

MP4 20260911_171427.mp4: 1080x1920, 75.454813 s, 265562207 B. Playwright-bundled FFmpeg šio MP4 neišdekodavo. Sukurtas evidence/inspect-local-video.cjs: tik laikinas vietinis HTTP range serveris ir Edge dekoderis; paimti 12 kadrų per visą video, sudarytas kontaktinis lapas / video-review.json. Sandbox Edge nepasileido; su require_escalated peržiūra pavyko. Browser ir serveris uždaromi skripto finally. Tai atrankinė vizualinė kadrų peržiūra, garso nevertinome, ne kiekvieno kadro patikra.

Sukurtas Belmontas/Svetainei: 6 originalių darbų eigos JPG kopijos, 3 aiškiai išvestiniais pažymėti rezultato JPG kadrai iš video (33.01 / 45.59 / 58.16 s) atskirame 03-kadrai-is-video, 18 WebP, LT/EN aprašas apie 97 cm priėjimą, alt / sha256 / matmenys, nuotraukų ir video kontaktiniai lapai. Kopijos ir visi WebP patikrinti, tako rezultato WebP peržiūrėtas. Kadre kai kur dar yra medžiagų; jų neretušavome. Terasos darbai ATD nepriskirti. Originalus video nepakeistas ir nekopijuotas; internetui suspausta MP4 / iškarpa dar NEparuošta. Prieš/po slankiklio poros nepatvirtinta. Exporter papildytas derivedFrom / sourceFile / atskirų video kadrų palaikymu.

Toliau peržiūrėtas Bendrusai: 10 vaizdų (5 PNG, 4 HEIC, 1 JPEG). HEIC Sharp dekoduoja sėkmingai; kontaktinių lapų skriptas papildytas HEIC / HEIF, sudarytas visų 10 kadrų lapas / inventorius photo-selection/bendrusai/. Svetainei dar nesukurtas. Paklausta patikslinti viešą vietovę / pavadinimą, ATD darbus, ar visi kadrai vieno objekto ir ar yra sužaliavusios vejos rezultatas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.7. Bebrusų projekto faktai ir rinkinys

Savininkas atskirai patvirtino vietovės rašybą „Bebrusai“ (originalus aplankas „Bendrusai“ paliktas). Darbai: šlaitų formavimas, grunto keitimas ir lyginimas, vejos sėja. Objektas prie ežero; dėl padėties ir privažiavimo ribojimų didžioji dalis darbų rankomis. Takai ir trinkelės kitų rangovų. Augalų sodinimo / laistymo ATD nepriskiriame, nes nepatvirtinta.

Bendrusai/Svetainei paruoštos 6 originalų kopijos, 12 patikrintų WebP, LT/EN faktai / aprašai / alt ir visų 10 failų sprendimai. Viešas pavadinimas „Šlaitų formavimas ir vejos sėja Bebrusuose“, failų prefiksas bebrusai. Originalai nepakeisti. Šlaito WebP vizualiai peržiūrėtas. Nėra sužaliavusios vejos rezultato. Kai kuriuose kadruose technika, todėl nevadinti visiškai rankiniu objektu. Žemesnės raiškos 960x467 JPEG nedidintas; jo variantai 800 ir 960 px.

Pradėta Bukiškio progimnazijos 7 HEIC peržiūra. Šie failai tikri HEVC, kurio Sharp dekoderis nepalaiko (ankstesni Messenger HEIC buvo nuskaitomi). Į realaus vartotojo TEMP/atd-photo-heif-tools atskirai įdiegtas pillow-heif 1.8.1 su Pillow 13.0.0, nekeičiant projekto package.json / lock. decode-heic.py kuria PNG peržiūros kopijas tik worktree, originalų nekeičia. Įdiegimo TEMP skiriasi nuo sandbox TEMP, tad dekodavimo komandą reikia paleisti įprasto vartotojo kontekstu. prepare-photo-selection palaiko atskirą decode aplanką; exporter decodeFile laukas leidžia kopijuoti tikrą HEIC originalą, bet WebP kurti iš jo iškoduotos PNG kopijos. Šio objekto faktai dar nepatvirtinti ir Svetainei nesukurtas.

Bukiškio tęsinys: visi 7 HEIC iškoduoti ir bendras kontaktinis lapas peržiūrėtas. Matosi grunto darbai, atvežamas gruntas, takas ir vienas vėlesnis vejos vaizdas. Paklausta patvirtinti ATD darbus, tako priklausymą ir viešą pavadinimą „Bukiškio progimnazijos teritorijos tvarkymas“. Svetainei dar nesukurtas; PNG dekodavimo kopijos worktree tik vidiniam naudojimui.

### 21.8. Bukiškio progimnazijos atranka ir Gilužio rivjeros peržiūra

Savininkas patvirtino viešą pavadinimą „Bukiškio progimnazijos teritorijos tvarkymas“ ir tik šiuos ATD darbus: grunto atvežimas / keitimas, lyginimas, vejos sėja. Tako ATD neįrengė. Paruoštas Bukiškio progimnazija/Svetainei: 4 nepakeistų HEIC originalų kopijos, 8 WebP iš visos raiškos dekoduotų PNG, LT/EN aprašai / alt, visų 7 failų sprendimai, bendras kontaktinis lapas. Exporter patikrino kopijas ir variantus; vėlesnės vejos WebP vizualiai peržiūrėtas. Labai vertikalų rezultato kadrą naudoti tinkamame bloke. Prieš / po slankiklio poros nepatvirtinta, svetainėje dar nepublikuota.

„Gilužio rivjera“: 158 vaizdai (141 JPG, 17 HEIC) ir 1 MP4. Visi vaizdai peržiūrėti 7 kontaktiniuose lapuose po 24. HEIC sukurti tik 1200 px PNG peržiūros variantai — prieš eksportą atrinktus HEVC HEIC būtina iškoduoti visa raiška į atskirą decoded katalogą; nekurti 1600 px iš 1200 px peržiūros. decode-heic.py dabar priima neprivalomą max-edge; be jo visos raiškos, su 1200 tik peržiūros. prepare-photo-selection papildytas atskirais contact-page-01..07.jpg ir mišriu preview / original fallback.

Yra 18 vaizdinių kandidatų visual-shortlist.json (tik kandidatų sąrašas, ne viešas rinkinys). Matosi skirtingi įrengimo etapai, augalų atvežimas, geotekstilė, vejos / gyvatvorės ir sezoninis žydėjimas. Nr. 10 (20220503_123255.jpg) ir Nr. 119 (20230612_131542.jpg) panaši tos pačios vietos kompozicija, tačiau slankiklio poros tiksliai nepatikrinta ir nežadama. MP4 neperžiūrėtas. Savininko paklausta ATD darbų ribų (įskaitant takus / trinkeles / pergoles), ar visi kadrai šio objekto ir ar pavadinimą galima viešinti. Svetainei nesukurtas, faktai nespėjami. Svetainės kodas ir hero nepakeisti, commit/push neatlikti.

### 21.9. „Gilužio rivjeros“ patvirtintas darbų mastas ir galutinė nuotraukų atranka

Savininkas patvirtino viešą pavadinimą „Gilužio rivjera“, ATD darbus: gruntą / šlaitus, veją, augalų tiekimą ir sodinimą, geotekstilę / mulčą, laistymą ir želdinių priežiūrą. Takai, trinkelės ir pergolės kitų rangovų. Savininko pateiktas apytikslis pasodintų augalų kiekis ~16 000 — viešai rašyti „apie 16 000“, tai nėra nepriklausoma inventorizacija. Vartotojo pateikta https://www.giluziorivjera.lt/ perskaityta per web, patvirtina gyvenamąjį projektą Pilaitėje prie ežero; ATD darbų ir kiekio šaltinis savininkas, ne vystytojo puslapis.

Sukurtas Gilužio rivjera/Svetainei: 16 originalų kopijų, 32 WebP, visų 158 vaizdų sprendimai, LT/EN projekto / alt ruošiniai ir 7 atskiri kontaktiniai lapai. Atranka apima pradžią, grunto darbus, augalų atvežimą, sodinimą / geotekstilę, mulčą, veją ir skirtingų sezonų žydėjimą. Dvi atrinktos HEVC HEIC iškoduotos visa raiška į decoded-full; 1200 px peržiūros eksportui nenaudotos. Exporter patikrino kopijas ir visus WebP. Geltonai žydinčio želdyno WebP vizualiai patikrintas.

Tos pačios vietos 20220503_123255.jpg ir 20230612_131542.jpg peržiūrėti didesniu formatu: rakursas ir pastato perspektyva skiriasi. Tinka atskiram pradžia / rezultatas pasakojimui, ne tiesioginiam suregistruotam slankikliui. Originalai nekarpyti / neperspektyvinti. Projektinių planų ekrano kadrai neatrinkti. Dviejų atskiro akmenų sienelės kampo kadrų (106, 107) konkretus kontekstas nepatvirtintas, todėl nepublikuojami ir neatrinkti. MP4 20220718_174350.mp4 dar neperžiūrėtas / internetui neparuoštas. Konfigūraciją kuria evidence/configure-giluzio-selection.cjs.

Toliau peržiūrėtas „Helsinkio“: 16 JPG, kontaktinis lapas photo-selection/helsinkio/. Matosi grunto darbai ir vėlesnė veja prie mūrinių pastatų. Paklausta viešo pavadinimo / vietovės, ATD darbų ribų ir ar visi kadrai vienas objektas. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.10. Helsinkio projektas ir mišrus vejos aplankas

Savininkas patvirtino „Helsinkio“ kaip vieną objektą Helsinkio gatvėje ir ATD darbų apimtį: grunto keitimas / lyginimas, šlaitai, vejos sėja, takai ir kiti matomi darbai. Papildomos neįvardytos darbų rūšys ruošinyje nespėjamos. Pateikė https://maps.app.goo.gl/QwvbYE7UAEaFfu3z8. Web trumpųjų nuorodų neatidarė, sandbox DNS neveikė; įprasto vartotojo Invoke-WebRequest tik peradresavimo skaitymas grąžino Google Maps search 54.719089,+25.202312. Koordinatės vidiniame atranka.json; viešame tekste tik Helsinkio gatvė, be privataus adreso.

Helsinkio/Svetainei sukurtos 7 originalų kopijos, 14 WebP, LT/EN projekto / alt ruošiniai, visų 16 failų sprendimai. Kopijos / WebP patikrinti, pagrindinis vejos WebP vizualiai peržiūrėtas. Takų kadrai rodo darbų eigą, ne jų galutinį rezultatą. Tiksli vienodo rakurso prieš/po pora neparinkta. Originalai nepakeisti, svetainėje dar nepublikuota.

Toliau visi 46 „Įvairūs vejos projektai“ vaizdai peržiūrėti dviejuose kontaktiniuose lapuose: 24 JPG ir 22 HEIC, pastariesiems tik 1200 px dekodavimo peržiūros. Prieš HEVC HEIC eksportą reikės pilnos raiškos dekodavimo atskirai. Matosi skirtingi objektai; nesujungti į vieną fiktyvų projektą. Vartotojo paklausta, ar ruošti bendrą bevardį / be vietovių vejos darbų rinkinį ir ar grunto paruošimas / sėja visuose kadruose ATD. Taip pat atskirai paklausta, ar purkštuvų Nr. 38–41 ir trinkelių Nr. 43–46 darbai ATD (Nr. 42 bendras grunto vaizdas). Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.11. Mišri darbų kolekcija ir Jomanto parko peržiūra

Savininkas patvirtino, kad „Įvairūs vejos projektai“ yra skirtingų objektų kratinys be vardų ir vietovių; ATD atliko grunto keitimą / paruošimą, vejos įrengimą ir dalį priežiūros. Atskirai patvirtino laistymą ir trinkeles anksčiau nurodytuose kadruose.

Sukurtas Įvairūs vejos projektai/Svetainei: 14 originalų kopijų, 28 WebP. Kopijos ir WebP fiziškai sugrupuoti pagal veja (9), laistymas (2), trinkeles (3); manifestas turi serviceGroup ir collection=true. Nesuformuota viena fiktyvi projekto istorija ir nesuporuoti skirtingų vietų prieš / po kadrai. 6 HEVC HEIC iškoduoti visa raiška į decoded-full, neeksportuota iš 1200 px peržiūrų. Kopijų hash / WebP patikrinti, purkštuvo WebP vizualiai peržiūrėtas. LT/EN tekstai / alt, sprendimai visiems 46, 2 peržiūros lapai. Originalai nepakeisti.

Exporter papildytas serviceGroup palaikymu — naujiems rinkiniams kuria paslaugų poaplankius, ankstesni rinkiniai neperrašyti. Kolekcijos generatorius evidence/configure-mixed-lawns-selection.cjs.

Toliau peržiūrėti visi 56 „Jomanto parkas“ vaizdai 3 kontaktiniuose lapuose, HEIC peržiūros tik 1200 px. Yra darbai palei dviračių taką, jauni kiemų želdiniai ir žydintis vėlesnis vaizdas. 13 preliminarių kandidatų visual-shortlist.json. Paklausta ATD darbų ribų, ar gatvės ir kiemų kadrai vienas projektas, viešo pavadinimo / vietovės ir takų autorystės. Svetainei nesukurtas. HEVC HEIC atrinkus reikia iškoduoti visa raiška. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.12. „Jomanto parko“ patvirtintas rinkinys

Savininkas patvirtino „Jomanto parkas“ pavadinimą ir ATD darbus: augalų tiekimas / sodinimas, gruntas, geotekstilė / mulčas, veja, laistymas, priežiūra. Takai kitų rangovų. Pateiktas https://galio.lt/lt/gyvenimui/jomanto-parkas/ perskaitytas: pavadinimas, Vilnius / Baltupiai; svetainėje nurodyta statybų pabaiga nėra ATD darbų data ir į ruošinį neperkelta.

Jomanto parkas/Svetainei paruošta 10 originalų kopijų, 20 WebP iš kiemo želdinių kadrų: jauni augalai, mulčas, vėlesnis žydėjimas, bendri kiemo vaizdai ir žiedų detalė. 4 atrinkti HEVC HEIC iškoduoti visa raiška į decoded-full. Kopijos / WebP patikrinti, pagrindinis platus želdinių kadras vizualiai peržiūrėtas. LT/EN projekto ir alt ruošiniai, sprendimai visiems 56, 3 kontaktiniai lapai. Gatvės prie dviračių tako kadrai Nr. 3–8 ir 22–23 palikti rezerve, nes savininkas atskirai nepatvirtino šios atkarpos apimties; patvirtintos kiemo istorijos jie neblokuoja. Exporto konfigūracija kuriama configure-jomanto-selection.cjs. Prieš / po slankiklio pora neparinkta, kiekių / plotų / datų nespėjama.

Toliau „Kazimiero Namas“: peržiūrėti 33 HEIC (1200 px peržiūros) dviejuose kontaktiniuose lapuose; 3 MP4 neperžiūrėti. Matosi grunto darbai, vamzdžiai, augalai, akmenų juostos ir ruloninė veja, laistymo vožtuvų dėžė. Paklausta tikslių ATD darbų ir viešos vietovės / neutralaus pavadinimo, asmens vardas viešam rinkiniui nenaudojamas. Atskiras Nr. 6 (20240419_131623.heic) rodo kitokį didelės statybvietės kontekstą — paklausta, ar priklauso šiam objektui. Svetainei nesukurtas. Atrinktus HEVC HEIC prieš eksportą reikės dekoduoti visa raiška. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.13. „Individualus namas“ — vidinio kiemo logistika

Savininkas patvirtino neutralų viešą pavadinimą „Individualus namas“ ir ATD darbus: grunto keitimas, drenažas / vandens nuvedimas, laistymas, augalų sodinimas, akmenų kompozicijos, ruloninė veja. Esminis iššūkis: iš gatvės į vidinį kiemą galima patekti tik per garažą ir garaže esančias duris, todėl visi gruntai, akmenys, sistemų medžiagos ir ruloninė veja suvežti šiuo keliu. Durų plotis, kiekiai ir konkretūs drenažo sprendiniai nepatvirtinti ir nespėjami. Vietovė nepateikta, nenaudojama. Vardas viešai neskelbiamas.

20240419_131623.heic savininkas nurodė ignoruoti kaip galimai pašalinį kadrą — neatrinktas. Originalai ir visų pradinių failų vidinis kontaktinis lapas palikti, tai ne publikavimo galerija.

Kazimiero Namas/Svetainei sukurtos 10 originalių HEIC kopijų, 20 WebP iš visos raiškos dekoduotų PNG, LT/EN aprašas / alt ir visų 33 failų sprendimai, 2 kontaktiniai lapai. Kopijos / WebP patikrinti, pagrindinis vejos kadras vizualiai peržiūrėtas (matosi įrankis priekinio plano apačioje; tai darbų rezultato, ne retušuota reprezentacinė foto). Patvirtinti darbai atskirti nuo terasos / pastato konteksto. 3 MP4 neperžiūrėti / internetui neparuošti. Prieš/po slankiklio pora neparengta. Generatorius evidence/configure-individual-house-selection.cjs.

Toliau „KIntų 11“: 11 JPG peržiūrėti, kontaktinis lapas / inventorius photo-selection/kintu-11/. Matosi augalai prie pastato ir terasos augalų loviai. Paklausta viešo pavadinimo / vietovės, ATD darbų apimties ir ar abi zonos vienas objektas bei ATD įrengtos. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.14. „Kintų 11“ — kiemas ir terasa, patikslinta apimtis

Pirmoje savininko žinutėje patvirtinti grunto darbai, mulčiavimas, augalai ir priežiūra, akcentuota terasa. Tolesne žinute savininkas aiškiai patikslino, kad ATD apželdino IR vidinį kiemą žemės lygyje, IR terasą. Ankstesnė komentarų prielaida apie tik terasą atšaukta prieš kuriant rinkinį; iki patikslinimo Svetainei neegzistavo. Viešas pavadinimas „Kintų 11“.

Vartotojui leidus ieškoti internete, rastas oficialus https://galio.lt/lt/verslui/kintu-11/ (biurų / verslo pastatas Vilniuje, Šnipiškėse, terasa). Vystytojo duomenys tik vietovės / projekto kontekstas, ATD darbų šaltinis savininkas. Vejos / laistymo, terasos konstrukcijų / lovių gamybos darbai nepatvirtinti ir ATD nepriskiriami.

KIntų 11/Svetainei: 7 JPG kopijos (3 kiemas, 4 terasa), 14 WebP, LT/EN abiejų zonų tekstai / alt, area laukas ir zonas nurodantys failų pavadinimai, sprendimai visiems 11. Kopijos / WebP patikrinti, pagrindinis terasos WebP vizualiai peržiūrėtas. Originalai nepakeisti, visi kadrai vertikalūs; prieš/po nėra. Generatorius configure-kintu-selection.cjs.

Toliau peržiūrėtos 14 JPG aplanke „Liepsnele, lopselis-darzelis“, kontaktinis lapas photo-selection/liepsnele/. Matosi takų ardymas / pagrindo darbai / bortai / vėlesnė danga. Paklausta vietovės, viešo pavadinimo, ATD darbų ribų ir ar senos plytelės perklotos, ar danga nauja. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.15. „Liepsnelės“ lauko teritorija

Savininkas patvirtino lopšelio-darželio „Liepsnelė“ lauko / išorinės teritorijos darbus: senų plytelių pakeitimas naujomis, vejos bortai, veja, šulinių aukščių reguliavimas, altitudės ir nuolydžiai, lauko teritorijos paruošimas naudojimui. Ne pastato vidus. Vietovė nepateikta ir neįrašyta. Nauja danga neaprašyta kaip senų plytelių perklojimas; šulinių reguliavimas nevadinamas naujo nuotekų tinklo įrengimu.

Liepsnele, lopselis-darzelis/Svetainei: 7 JPG kopijos, 14 WebP, LT/EN aprašai / alt, visų 14 failų sprendimai ir kontaktinis lapas. Kopijos / WebP patikrinti, pagrindinis tako WebP vizualiai peržiūrėtas. Sužaliavusios naujos vejos atskiro rezultato nėra; darbą patvirtino savininkas. Kai kuriuose kadruose dar matosi medžiagos, neretušuota. Prieš/po slankiklio pora neparinkta, specifikacijos / kiekiai / datos nespėjami. Generatorius configure-liepsnele-selection.cjs.

Toliau visi 25 „Lino Namas“ JPG peržiūrėti 2 lapuose photo-selection/privatus-namas-l/. Matosi dangų / takų ir vejos grunto darbai, želdiniai. Nr. 13 (20260807_203452.jpg) atsitiktinis kojos kadras, neatrinkti; nereikia vartotojo paaiškinimo. Paklausta neutralaus viešo pavadinimo / vietovės, konkrečių ATD darbų ir ar visos zonos vienas objektas. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.16. Privataus namo takų ir dangų rinkinys

Savininkas patvirtino „Lino Namas“ kaip vieną objektą ir tik ATD trinkeles / takus, bortus bei grunto paruošimą. Konkretaus neutralaus pavadinimo ar vietovės nepateikė; parinktas aprašomasis „Privataus namo takų ir dangų įrengimas“, be asmens vardo / adreso. Vejos sėja, augalų sodinimas ir laistymas nepatvirtinti, ATD nepriskiriami.

Lino Namas/Svetainei: 8 originalų kopijos, 16 WebP, LT/EN tekstai / alt, visų 25 sprendimai ir 2 kontaktiniai lapai. Exporter patikrino kopijas / variantus. Didesnė 20260807_181713.jpg peržiūra parodė neužbaigtus tako kraštus ir įrankius: išvestinių failų slug pataisytas iš 05-takas-palei-nama į 05-tako-klojimo-eiga, role / alt / aprašas patikslinti į darbų eigą, ne baigtą rezultatą. Generatorius configure-private-paving-selection.cjs ir atranka.json / SKAITYTI.md sinchronizuoti; visų 16 nuorodų failai egzistuoja. Originalai nepakeisti. Atsitiktinis kojos kadras 20260807_203452.jpg neatrinktas.

Toliau visi 17 „Mangirdo akmenys ir veja“ JPG peržiūrėti kontakte photo-selection/akmenys-ir-veja/. 15 failų ilgoji kraštinė tik 800 px, 2 didesnės raiškos (IMG_20210719_130041.jpg ir IMG_20210809_143849.jpg). Matosi akmenys / siena, grunto ir sėjos eiga, balta danga, vėlesnė veja ir purkštuvai. Paklausta neutralaus pavadinimo / vietovės, konkrečių ATD darbų, ar visos zonos vienas objektas ir ar yra didesni originalai. Mažų failų nedidinti. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.17. Verkių akmenų ir vejos projektas

Vartotojas paaiškino, kad ankstesnį klausimą praleido netyčia. Patvirtino darbus: grunto keitimas, vejos sėja, laistymo sistemos montavimas, akmenų atvežimas, laužavietė, pasisėdėjimo zona ir atraminė siena iš akmenų; šiame aplanke matomi darbai ATD. Vietovės rašyba atskirai patvirtinta „Verkiai“.

Mangirdo akmenys ir veja/Svetainei paruoštos 8 originalų kopijos, 10 WebP, neutralus LT/EN pavadinimas „Akmenų kompozicijos ir veja Verkiuose“, patvirtintas aprašas / alt, visų 17 sprendimai, kontaktinis lapas. 6 atrinkti mažos raiškos originalai turi tik vieną 800 px variantą, du didesni (IMG_20210719_130041.jpg ir IMG_20210809_143849.jpg) po 800/1600. Maži failai nedidinti. Kopijos / WebP patikrinti, didelis vejos / purkštuvo rezultato kadras vizualiai peržiūrėtas. Kontaktai su automobilių numeriais tik faktinis scenos fonas, neretušuota. Techninių sienos skaičiavimų / kiekių / datų nespėjama. Generatorius configure-verkiai-selection.cjs.

Toliau „MO garden“: peržiūrėti 12 JPG, kontaktinis lapas / inventorius photo-selection/mo-garden/. Matosi ruloninės vejos atvežimas ir vėlesnė veja tarp sublokuotų namų; 1 MP4 neperžiūrėtas. Paklausta viešo pavadinimo / vietovės, ATD darbų (gruntas, ruloninės vejos tiekimas / klojimas, laistymas, priežiūra) ir ar visi kadrai vienas objektas. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.18. „MO Garden“ ir Naujosios Anglijos peržiūra

Savininkas patvirtino „MO Garden“ kaip vieną objektą ir darbus: grunto paruošimas, ruloninės vejos tiekimas / klojimas, laistymas. Pateiktas https://mogarden.lt/ perskaitytas: oficiali vietovė Vilnius / Pilaitė, Mozūriškių g. 200; tai tik projekto konteksto šaltinis, ne ATD rangos darbų įrodymas. Priežiūra nepatvirtinta ir neįrašyta.

MO garden/Svetainei: 5 originalų kopijos, 10 WebP, LT/EN ruošiniai / alt, visų 12 sprendimai, kontaktinis lapas. Kopijos / WebP patikrinti, pagrindinis vejos tarp namų WebP vizualiai peržiūrėtas. Atrinktas atvežimas ir skirtingi įrengtos vejos plotai, atskirų aiškių grunto / laistymo montavimo kadrų nėra. Visi originalai vertikalūs. MP4 20230630_162225.mp4 dar neperžiūrėtas / internetui neparuoštas. Generatorius configure-mo-garden-selection.cjs.

Toliau „Naujoji Anglija“: 14 JPG kontaktinis lapas peržiūrėtas photo-selection/naujoji-anglija/. Matosi grunto / šlaito darbai, balta danga ir vėlesni takų / aplinkos vaizdai. Pastatų architektūra panaši į „Helsinkio“, bet nepriskirta tam pačiam objektui be patvirtinimo. Paklausta pavadinimo / vietovės, ar atskiras objektas ar Helsinkio dalis, ATD darbų ribų ir baltos dangos tipo / paskirties. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.19. „Naujoji Anglija“ — ilgas šlaitas ir privažiavimas iš apačios

Savininkas pateikė https://rewo.lt/projektai/naujoji-anglija-2/ ir paaiškino užduotį: suformuoti ilgą vientisą lygų šlaitą išlaikant altitudes, be vingių / duobių. Keli ilgastrėliai ekskavatoriai, technikos privažiavimas tik iš apačios, ne iš viršaus. Balta danga — agrotekstilė; savininko nurodytas naudojimo tikslas palankesnė temperatūra / spartesnis vejos dygimas ir apsauga nuo lietaus bei paukščių. Ruošinyje tai projekto tikslas, ne išmatuotas efektas ar garantija.

Oficialus REWO puslapis perskaitytas: „Naujoji Anglija“, Mozūriškių g. 138, Vilnius. Jo sklypo plotas / statybų datos nėra ATD darbų kiekiai / datos ir neperkelti. Helsinkio projekto ryšys nepatvirtintas, istorijos nesujungtos. Takai, laistymas ar pastatų darbai šiame etape nepatvirtinti ir nepriskiriami ATD.

Naujoji Anglija/Svetainei: 5 JPG kopijos, 10 WebP, LT/EN šlaito istorija / alt, visų 14 sprendimai ir kontaktinis lapas. Kopijos / WebP patikrinti, platus agrotekstile uždengto šlaito WebP vizualiai peržiūrėtas. Atranka koncentruota į formavimą ir dangą; sužaliavusio šlaito rezultato nėra. Generatorius configure-naujoji-anglija-selection.cjs.

Toliau visi 44 „Nok Nok“ JPG peržiūrėti 2 kontaktiniuose lapuose, photo-selection/nok-nok/. SHA-256 patvirtintos 6 tikslių dublikatų poros (38 unikalūs vaizdai), duplicates.json; originalai neištrinti. Matosi grunto / dangų darbai, ruloninės vejos klojimas ir vėlesnė veja, medžiai. Paklausta viešo pavadinimo / vietovės, konkrečių ATD darbų ir ar visos zonos vienas objektas. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.20. „Nok Nok Home“ — darbas nuo statybų pradžios

Savininkas patvirtino pavadinimą „Nok Nok Home“, vieną objektą visoms zonoms ir ATD gruntą / altitudes, šulinių / drenažo darbus, takus / trinkeles / stovėjimo vietas / bortus, pagrindų smėlį / skaldą / tankinimą, grunto keitimą, ruloninę veją, medžius, laistymą ir priežiūrą. Pagrindinė specifika — ATD pradėjo grunto darbus dar prieš pastatų atsiradimą, vėliau dirbo etapais kartu su statybomis, pabaigoje visame projekte įrengė ruloninę veją. Pastatų statyba ATD nepriskiriama.

Vartotojo nuoroda https://maps.app.goo.gl/WXnzqQUZ7EL6eW3H8 perskaityta peradresavimu į Google Maps vietą „Nok Nok Home“, žymeklis 54.7095587,25.166095. URL pašalintas gale buvęs NBSP. Tikslios koordinatės vidiniame manifeste; miesto / rajono papildomai nespėta.

Nok Nok/Svetainei: 11 originalų kopijų, 22 WebP, LT/EN etapinio darbo istorija / alt, visų 44 failų sprendimai, 6 SHA-256 dublikatų poros ir 2 kontaktiniai lapai. Pasirinkti failai be Copy dublikatų. Kopijos / WebP patikrinti, pagrindinis vejos WebP vizualiai peržiūrėtas. Ankstyvas gruntas, dangos, ruloninės vejos eiga ir vėlesnis vaizdas. Plotų / sluoksnių storių / tūrių / kalendorinių datų nespėti. Generatorius configure-nok-nok-selection.cjs.

Toliau visi 104 Pilaitės gimnazijos vaizdai peržiūrėti 5 kontaktiniuose lapuose, photo-selection/pilaites-gimnazija/. 3 HEIC turi tik 1200 px peržiūros kopijas; prieš eksportą pasirinktiems HEVC reikia pilnos raiškos dekodavimo. 17 kandidatų visual-shortlist.json, ne galutinė atranka. Matosi medžių perkėlimas / atvežimas, didelių medžių kėlimas, kiemo ir terasų želdiniai, gruntas, laistymas, gatvės ir vėlesni žydintys plotai. Paklausta ATD darbų ribų (įskaitant takus), ar visos zonos ta pati apimtis, viešo pavadinimo ir reikšmingo masto / iššūkio. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.21. Pilaitės gimnazijos pavadinimo ir vietos patvirtinimas

Vartotojas pateikė „Vilnius Pilaitė Gymnasium“ ir https://maps.app.goo.gl/yrngWAYe9bzeegia8. Nuorodos peradresavimas perskaitytas: vieta tuo pačiu pavadinimu, žymeklis 54.7076803,25.1807977. Vidiniai faktai išsaugoti photo-selection/pilaites-gimnazija/confirmed-facts.json; LT pavadinimas „Vilniaus Pilaitės gimnazija“.

Ši vartotojo žinutė patvirtino tik pavadinimą / vietą, ne ankstesniame klausime išvardytą darbų apimtį. Dar kartą tikslingai paklausta, ar ATD medžių perkėlimas, augalų tiekimas / sodinimas, gruntas, veja, laistymas, mulčias / priežiūra, ir kam priklausė takai / terasos bei gatvės ir kiemo želdiniai. Svetainei dar nesukurtas, darbų autorystė iš nuotraukų nespėjama. Kiti objektai šiame etape nepradėti. Svetainės kodas / hero nepakeisti, commit/push neatlikti.
### 21.22. Pilaitės gimnazijos patvirtinta apimtis ir atranka

Savininkas patvirtino esamų medžių iškėlimą dar prieš pastato statybą, kiemo ir gatvės želdinius, augalų / medžių sodinimą, grunto darbus ir mulčiavimą. Mastas: 35 000 augalų, 1 200 m³ augalinio grunto, 96 erdviniai metrai mulčio. Laistymo sistemos ATD neįrengė; takai ir trinkelės — UAB „Kerista“. Vejos įrengimo / priežiūros apimtis atskirai nepatvirtinta ir ruošinyje nepriskirta.

Iššūkiai — ilgastrėlis kranas sunkiai pasiekiamoms zonoms ir trumpi darbų langai tarp kitų rangovų darbų. Kelias rekordines dienas pasodinta po 3 500 augalų; tai nėra vidurkis ar būsimo našumo pažadas. Kiekiai grindžiami savininko informacija, ne nuotraukų skaičiavimu.

Pilaitės gimazija/Svetainei: 14 originalų kopijų, 28 WebP, LT/EN ruošiniai ir alt, visų 104 nuotraukų sprendimai, 5 peržiūros lapai. Vienas pasirinktas HEIC dekoduotas pilna 3024 × 4032 raiška. SHA-256 kopijos ir visi WebP patikrinti; pagrindinis žydinčių želdinių WebP vizualiai peržiūrėtas. Generatorius configure-pilaites-selection.cjs. Į svetainę neįkelta.

Toliau „Popieriaus fabrikas“: peržiūrėti visi 30 JPG dviejuose kontaktiniuose lapuose, photo-selection/popieriaus-fabrikas/. Matosi kasimo technika prie vandens, krantai / akmenys, vejos klojimo eiga ir vėlesnis žalias rezultatas prie senų pastatų. Vienas MP4 neperžiūrėtas. Paklausta pavadinimo / vietovės, konkrečios ATD darbų apimties, ar visi kadrai vienas objektas ir iššūkio. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.23. Popieriaus fabriko kanalo rekonstrukcija

Savininkas patvirtino viešą pavadinimą „Popieriaus fabriko teritorija“, vieną objektą visiems 30 kadrų, kanalo valymą / rekonstrukciją / performavimą, krantų ir šlaitų tvarkymą, geotekstilę kanale, akmenis ir skaldą dugne, altitudes / nuolydžius, ruloninę veją ir dalies augalų sodinimą. Iššūkiai — purvinas kanalo valymas, siauri pravažiavimai, ilgastrėlis ekskavatorius prie senų saugomų pastatų išlaikant teritorijos vaizdą. Pastatų restauravimas ir aplinkosauginis rezultatas nepriskirti.

Pateiktos https://maps.app.goo.gl/HRhNrpKHtkFFwUde7 nuorodos peradresavimas perskaitytas: Google Maps koordinačių paieška 54.767637,25.332484, be vietos pavadinimo. Koordinatės vidiniame manifeste, miesto / istorinio fabriko pavadinimas nespėtas.

Popieriaus fabrikas/Svetainei: 9 originalų kopijos, 18 WebP, LT/EN ruošiniai / alt, visų 30 nuotraukų sprendimai ir 2 kontaktiniai lapai. SHA-256 kopijos, WebP matmenys, dekodavimas ir EXIF nebuvimas patikrinti; pagrindinis kanalo / seno pastato WebP vizualiai peržiūrėtas. MP4 neperžiūrėtas ir neparuoštas. Generatorius configure-popieriaus-selection.cjs.

Toliau „Rasos namas“: peržiūrėti visi 16 JPG kontaktiniame lape photo-selection/privatus-namas-r/. Matosi laiptų / aikštelės darbai, betonavimas, dangos, veja ir želdiniai, baseino zona. Paklausta neutralaus viešo pavadinimo / vietovės, darbų apimties, ar visi kadrai vienas objektas ir ar baseino dangos ATD. Asmens vardas viešai nenaudojamas. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.24. Individualus namas Lazdynėliuose — aplinkos perdarymas

Savininkas patvirtino vieną objektą Lazdynėliuose, trinkelių perklojimą, įėjimų / laiptų perbetonavimą, nuolydžių perdarymą, vejos persėjimą, augalų persodinimą ir visos aplinkos aplink baseiną darbus. Baseino ATD neįrengė. Keturių žmonių komanda dirbo apie mėnesį. Technikos tiesioginio patekimo nėra; dalį medžiagų perkėlė sunkvežimiu per tvorą iš gatvės, kitas gabeno rankomis.

Ankstesnių rangovų darbų kokybės paaiškinimas saugomas vidiniuose faktuose kaip savininko pasakojimas. Viešas ruošinys aprašo konkrečius ATD taisymus, ne nepriklausomą statybos kokybės ekspertizę. Viešas pavadinimas „Individualaus namo aplinkos atnaujinimas Lazdynėliuose“, asmens vardas neviešinamas.

Rasos namas/Svetainei: 8 originalų kopijos, 16 WebP, LT/EN ruošiniai / alt ir visų 16 nuotraukų sprendimai. Kopijų SHA-256, WebP dekodavimas, matmenys ir EXIF nebuvimas patikrinti; pagrindinis tako / želdinių vaizdas vizualiai peržiūrėtas. Laiptų ir baseino darbų eigos vaizdai nevadinami pilnai užbaigtais. Generatorius configure-lazdyneliai-selection.cjs.

Toliau „Švaros broliai“: peržiūrėta 16 JPG kontaktiniame lape photo-selection/svaros-broliai/. Augalai, geotekstilės / mulčio zonos, akmenų atvežimas ir gręžimas, vėlesnės kompozicijos prie plovyklos. Vienas 800 × 600 originalas, kiti didelės raiškos. Paklausta vietovės / plovyklos, viešo pavadinimo, ATD darbų apimties, ar vienas objektas, ir akmens gręžimo paskirties. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.


### 21.25. PRO BRO Express — apželdinimas ir akmenų nuvalymas

Savininkas pateikė PRO BRO Express plovyklos pavadinimą ir vietą https://maps.app.goo.gl/6ybD387sfkjnExei9. Peradresavimas patvirtina vietą tuo pačiu pavadinimu, koordinatės 54.6733595,25.2978381. Patvirtinta ATD apimtis: gruntas, augalų tiekimas / sodinimas, akmenų kompozicijos, geotekstilė, mulčiavimas, laistymas ir priežiūra.

SVARBUS ankstesnės vaizdo interpretacijos pataisymas: akmuo NEBUVO gręžiamas, jis valomas nuo atvežant prilipusio purvo / molio. Savininkas prieš objekto perdavimą akmenis nuplauna ir nuvalo, prireikus metaliniais šepečiais. Gręžimo / vandens elemento / akmens apšvietimo teiginiai netaikomi. Atskiras visų 16 kadrų priklausymo vienam objektui patvirtinimas negautas, manifeste tai aiškiai palikta nepatvirtinta.

Švaros broliai/Svetainei: 7 originalų kopijos, 14 WebP, LT/EN tekstas / alt ir visų 16 failų sprendimai. Kopijų SHA-256, WebP dekodavimas / matmenys ir EXIF nebuvimas patikrinti. Pagrindinis augalų / akmenų ir nuvalyto akmens vaizdas vizualiai peržiūrėti; pastarojo alt patikslintas kaip jau nuvalyto akmens detalė. Generatorius configure-pro-bro-selection.cjs. Originalai nekeičiami.

Toliau Trakų Vokės Dvaras: visi 143 JPG peržiūrėti 6 kontaktiniuose lapuose photo-selection/traku-vokes-dvaras/. Medžių atvežimas / sodinimas, gruntas, gėlynai, veja, laistymo vaizdai, vėlesni želdiniai. 2 MP4 neperžiūrėti. 5 FB_IMG vaizdai (įskaitant iš oro) kilmė / naudojimo teisė tikslinama, į publikavimo atranką kol kas neįtraukiami. Paklausta konkrečios ATD apimties, takų / bortų / fontano autorystės, visų zonų priklausymo projektui ir reikšmingų skaičių / iššūkių. Svetainei nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.26. Trakų Vokės dvaras — nuosekli transformacija

Savininkas patvirtino: dvejų metų darbas, 5,5 ha pasėtos vejos, 55 000 augalų įskaitant svogūninius, 12 vilkikų augalų. ATD grunto keitimas / atvežimas, altitudės, medžių ir kitų augalų tiekimas / sodinimas, visi gėlynai, laistymas ir priežiūra. Visų želdinių zonų gruntai ir želdiniai ATD. Elektra, takai, bortai, fontanai ir pastato restauracija ne ATD.

Savininkas aiškiai pageidavo ne vien prieš / po, o visos evoliucijos nuo duobių ir medžių iki rezultato. FB_IMG vaizdus iš oro autorizavo naudoti savo atsakomybe, pirminio šaltinio neprisimena (gal savivaldybės puslapis); prašant numatė išimti. Tiksli autorystė / pirminė licencija nepatvirtinta ir taip užfiksuota, nevadinama ATD fotografija.

Trakų Vokės Dvaras/Svetainei: 22 originalų kopijos ir 43 WebP. Šeši etapai stage laukuose ir numeruoti failai: gruntas / duobės; medžiai; gėlynai / gruntas; veja / medžiai; vėlesni želdiniai / laistymas; bendri vaizdai iš oro. Įtraukti 2 FB_IMG, ne visi 5; iki 1081 / 1080 px be didinimo. Vienas 800 px želdinių prie rūmų vaizdas turi tik vieną variantą. Visiems 143 vaizdams sprendimai, LT/EN tekstai / alt, kontaktinis lapas ir 6 atskiri peržiūros lapai. Kopijų SHA-256 ir WebP dekodavimas / matmenys / EXIF nebuvimas patikrinti; didelės raiškos pagrindinis gėlynas ir vienas vaizdas iš oro vizualiai peržiūrėti. Generatorius configure-traku-voke-selection.cjs. 2 MP4 dar neperžiūrėti. Į svetainę neįkelta.

Toliau Turniškės senas prūdas: visi 38 JPG peržiūrėti 2 kontaktiniuose lapuose photo-selection/turniskes-senas-prudas/. 7 MP4 neperžiūrėti. Matosi senas tvenkinys, ardymas / gruntas, akmenys / juoda danga / skalda, vėlesnė vešli augalų kompozicija. Nepriskirta sausam sodui / veikiančiam vandens elementui be savininko atsakymo. Paklausta darbų apimties, viešo pavadinimo, ar vienas objektas, ir atskirai žaidimų aikštelės 20190409_172603.jpg (Nr. 10) priklausymo. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.27. Eureka mokyklos vieta ir žaidimų aikštelės kadro atmetimas

Savininkas patvirtino objekto pavadinimą Eureka primary school ir https://maps.app.goo.gl/hEJTs1xvK1XgwM6q9. Peradresavimas perskaitytas: Eureka primary school, žymeklis 54.7381689,25.2926119. Užfiksuota photo-selection/turniskes-senas-prudas/confirmed-facts.json.

20190409_172603.jpg (Nr. 10, žaidimų aikštelė) savininko nurodymu ignoruojamas tvenkinio transformacijos istorijoje. Originalas neištrintas ir neperkeltas; nepadaryta prielaida, kad jis kito objekto. Darbų apimtis / ar panaikintas vandens elementas šiame atsakyme nepatvirtinta, todėl pakartotinai tikslingai paklausta. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.28. Eureka — seno tvenkinio transformacija

Savininkas patvirtino seno tvenkinio užpylimą dėl vaikų įkritimo rizikos ir naują akmenų / augalų kompoziciją su kalvelėmis bei takeliais. Užpylimui 24 sunkvežimiai grunto (ne m³, talpa nepatvirtinta). Paliktas vienas veikiantis vandens elementas — šaltinis ir tarp akmenų / želdinių tekantis upelis. Negalima teigti, kad visas vanduo panaikintas. ATD visas gruntas, akmenys, geotekstilė, skalda, sodinimas, laistymas, veja ir takeliai; visi kompozicijos kadrai vienas projektas.

Turniškės senas prūdas/Svetainei: 12 originalų kopijų, 24 WebP, LT/EN ruošiniai ir alt, visų 38 nuotraukų sprendimai, kontaktinis ir 2 paginuoti lapai. Nr. 10 žaidimų aikštelė neatrinkta savininko nurodymu, originalas paliktas. Kopijos / eksportai patikrinti SHA-256, dekodavimu, matmenimis ir EXIF nebuvimu; pagrindinis suaugusių želdinių / takelių vaizdas vizualiai peržiūrėtas. 7 MP4 neperžiūrėti. Generatorius configure-eureka-selection.cjs.

Toliau Turniškių dominija: visi 142 JPG peržiūrėti 6 kontaktiniuose lapuose photo-selection/turniskiu-dominija/. Matosi gruntas, augalų / pušų atvežimas, sodinimas, šilokų kilimai, mulčias, veja, vėlesni gausūs želdiniai; 3 MP4 neperžiūrėti. Paklausta pavadinimo / vietos, konkrečios ATD apimties, takų / bortų / aikštelių autorystės, masto / iššūkio. Atskirai paklausta tvenkinio / plataus šlaito kadrų ir 20190225 statybvietės priklausymo projektui. Svetainei dar nesukurtas. Svetainės kodas / hero nepakeisti, commit/push neatlikti.

### 21.29. Turniškių dominija — pirmasis didesnis apželdinimo projektas

Savininkas patvirtino 2 650 augalų, gruntą, augalų / didelių pušų tiekimą ir sodinimą, šilokų kilimus, geotekstilę / mulčią, veją, laistymą, šlaitus / drenažą. Takai, bortai, aikštelės — kitų rangovų. Tai savininko pirmasis didesnis želdinimo užsakymas, atspirties taškas į didesnius objektus. REWO pateikto projekto puslapio paieškos rezultatas patvirtino Turniškių g. 34A, Vilnius, bet vystytojo datos / plotai nepriskirti ATD darbams. Tvenkinio vaizdai neatrinkti, miškingas šlaitas su balta agroplėvele patvirtintas. 20190225 statybvietės priklausymas liko nepatvirtintas, kadrai neatrinkti.

Turniškių dominija/Svetainei: 18 originalų kopijų, 36 WebP, LT/EN aprašas / alt ir visų 142 kadrų sprendimai. Kopijos ir eksportai patikrinti; pagrindinis suaugusių želdinių vaizdas vizualiai peržiūrėtas. 3 MP4 neperžiūrėti. Generatorius configure-dominija-selection.cjs.

### 21.30. Likę keturi rinkiniai užbaigti

Vartotojas, išvykdamas, nurodė toliau dirbti savarankiškai ir užbaigus nuotraukas pradėti svetainės atliktų darbų galeriją. Tvenkiniai ir Veja — įvairių objektų bendri rinkiniai be vietovių / užsakovų. Veja Turniškės — vieno namo pasėta veja. Gimnazija — senos dangos ardymas, visų smėlio / skaldos pagrindų pakeitimas, apie 850 m² naujos dangos ir 500 m² vejos; netikėta žiema, įšalusio grunto atitirpinimas ir darbų užbaigimas.

Tvenkiniai/Svetainei: 11 kopijų / 22 WebP iš 46 JPG; dumblių detalės ir nesusijęs vejos kadras praleisti. Veja/Svetainei: 7 / 14 iš 28 JPG. Veja Turniškės/Svetainei: 2 / 4 iš 2 JPG. Vilniaus šv. Jono Pauliaus II gimnazija/Svetainei: 8 / 16 iš 27 vaizdų, vienas pasirinktas rezultato HEIC dekoduotas pilna 3024 × 4032 raiška. EFFECTS variantas ir vizualiai nesusijęs grunto kadras Nr. 27 neatrinkti. Visos kopijos / WebP patikrinti, pagrindinis gimnazijos rezultatas vizualiai peržiūrėtas. Grunto sluoksnių storiai, atitirpinimo metodas ir tvenkinių matmenys nespėti. Generatorius configure-final-selections.cjs. Visi 31 pirminio lygio nuotraukų aplankai dabar turi Svetainei atranką. Originalai nekeisti.

### 21.31. Atliktų darbų galerija — 31 istorija ir 276 nuotraukos

Autorizacija tiesiogiai iš vartotojo: baigus aplankus pradėti galeriją svetainėje; dirbti savarankiškai. Esama /darbai galerija pakeista į projektų / bendrų rinkinių naršymą, ne vien 13 padrikų vaizdų. /en/darbai palaikoma. Vieši neutralūs pavadinimai ir tekstai imti iš savininko patvirtintų atrankų manifestų. Mišrių objektų rinkiniai aiškiai pažymėti; renginys turi atskirą Bendruomenei grupę. Foto kopijos / GPS / vidiniai manifestai į public neperkelti.

Duomenys src/lib/gallery-projects.json: 31 istorija / rinkinys, 276 nuotraukos, 543 WebP variantai (~149,6 MB diske, ne vienu metu naršyklėje). Vieši failai public/images/projects/<neutralus-id>/. Tik 10 projekto viršelių pradžioje, native lazy loading ir responsive srcset; daugiau rodoma mygtuku. Visi projekto vaizdai atsidaro numeruota darbų eigos seka, su caption / LT/EN aprašu ir patvirtintų darbų ribomis. Modal: rodyklės, miniatiūros, klaviatūros ArrowLeft / ArrowRight, Escape, fokuso grąžinimas ir inert fonas per esamą Modal. Nuotraukos peržiūroje contain, failai neapkarpyti; viršeliai vizualiai cover.

Failai: DarbaiPage.tsx, DarbaiPage.module.css, gallery-projects.json, papildyti translations.ts darbaiPage LT/EN. Generatorius build-gallery-assets.cjs; atd-lt-audit/photo-selection/gallery-provenance.json atseka visus viešus failus į originalų atrankas ir SHA-256. FB_IMG autorystės neapibrėžtumas / savininko leidimas išlikęs vidiniame manifeste. Kitų rangovų darbų ribos aiškiai įrašytos atitinkamiems objektams. Jokio naujo tikslių adresų / datų / kiekių spėjimo.

Patikros: tsc --noEmit ir tikslinis ESLint praėjo; Impeccable detector [] (vienas paleidimas). Numatyto npm run build Turbopack pirmiausia krito dėl senos CSS worker podėlio būsenos. Patikrintame worktree .next/cache/turbopack perkeltas į atkuriamą .next/cache/turbopack-before-gallery; po to įprastas npm run build PRAĖJO, visos 26 svetainės statinės / SSG išvestys. Webpack build taip pat buvo praėjęs. Joks projekto build režimas / konfigūracija dėl to neperrašyta.

verify-project-gallery.cjs patikrino 543 failų egzistavimą, LT/EN prie 1440 / 390 px, filtrus, visų 31 parodymą, modal rodykles, Escape, fokuso grąžinimą, horizontalų overflow ir JS klaidas: viskas praėjo. Ekrano kopijos tik po visų img.decode: .impeccable/review/desktop.png, mobile.png, *-first.png, *-viewer.png; gallery-checks.json. Pradiniai neužkrautų lazy vaizdų capture pakeisti pilnai dekoduotais. git diff --check praėjo (tik informaciniai LF/CRLF pranešimai).

Impeccable finish reviewer SHIP: atd-lt-audit/gallery-finish-review.md. Documenter: atd-lt-audit/gallery-design-documentation.md — esama sistema išlaikyta, seno PRODUCT formato / trūkstamo DESIGN konteksto netvarkė nepaprašytas. Galerijos kryptis atd-lt-audit/gallery-surface-brief.md. Tai esamos galerijos papildymas, ne nauja vizualinė tapatybė. Hero durys / GardenSceneHero / jo greitis / hotspotai nepakeisti. Ankstesni SEO pakeitimai išlikę; jokio commit / push / deploy.

Peržiūra palikta http://localhost:3100/darbai ir /en/darbai, galutinis production serveris exec session 36971; Codex browser atidarymas grąžino queued. Vaizdo įrašai (išskyrus anksčiau atrinktus Belmonto kadrus) daugumoje aplankų tebėra neperžiūrėti / internetui neparuošti, kaip nurodyta jų manifestuose. Šis darbas užbaigė nuotraukų, ne visų MP4 apdorojimą.

### 21.32. Galerijos SEO / GEO, indeksuojamos istorijos ir paruošimas publikavimui

Vartotojas aiškiai nurodė sutvarkyti SEO / GEO, tada atlikti commit ir push, po to tikrins online. Pridėti 31 atskiri projekto / rinkinio puslapiai kiekviena kalba (62 URL) maršrute src/app/[lang]/darbai/[project]/page.tsx. Aprašai ir visos projekto nuotraukos / caption pateikiami statiniame HTML, nepriklausomai nuo modal ar JavaScript. Naudoti tik patvirtinti galerijos duomenys, įmonės autorystė ATD / MB ATD.LT; neišgalvotos darbų / publikavimo datos ar nauji kiekiai.

SEO: unikalūs title / meta description, self canonical, LT/EN/x-default alternates, projekto viršelio OG / Twitter, index/follow. Struktūriniai duomenys: galerijos CollectionPage / ItemList su 31 tikru URL, projektų Article su matomu aprašu, ImageGallery / ImageObject ir BreadcrumbList. Susijusių projektų / paslaugų / kontaktų nuorodos. Galerijoje visų 31 istorijų HTML nuorodų sąrašas ir tiesioginės pilno aprašo nuorodos. Sitemap dabar 84 URL (22 buvę + 62 projektų), abiejų kalbų alternates ir projektų viršeliai image sitemap. /lt/darbai/<id> nukreipia į kanoninį /darbai/<id>; nežinomi projektai 404. Header kontrastas taikomas ir projektų puslapiams.

GEO remiasi įskaitomu pirmosios šalies HTML / faktais / vidinėmis nuorodomis ir tikslia įmonės autoryste; nėra AI pozicijų ar citavimo garantijų. Tikrinta pagal oficialius Google AI features ir JavaScript SEO dokumentus. Esamas robots leidžia Google ir AI paieškos crawler prieigą; treniravimo leidimai nepakeisti. llms.txt nelaikomas reitingavimo priemone.

Patikros: TypeScript, tikslinis ESLint ir npm run build (Turbopack) praėjo; sugeneruotos 88 svetainės išvestys. verify-gallery-seo.cjs patikrino visus 62 projekto URL: 200, pilnas matomas HTML aprašas, viena H1, canonical, LT/EN alternates, visas nuotraukų skaičius ir Article / ImageGallery / Breadcrumb. Sitemap 84 URL; visų istorijų HTML nuorodos; 404 ir LT redirect; 1440 / 390 vaizdai be overflow, įskaitomas header. Atskiras verify-project-gallery.cjs pakartotinai patvirtino filtrus, modal / klaviatūrą ir 543 failus. Metaduomenų heuristika pagrindiniam galerijos puslapiui: templated false, low risk. git diff --check praėjo.

Commit / push bus atliekami į origin/main iš esamo worktree HEAD (remote main šiuo metu sutampa su pradiniu bfb4e199). Į commit įtraukiamas svetainės kodas ir 543 vieši WebP (~149,6 MB), bet ne ~652 MB vidinių kontaktinių lapų / dekoduotų originalų, ne asmeniniai nuotraukų šaltiniai. Hero durys ir GardenSceneHero nekeičiami. Iki commit viskas patikrinta vietiniame production serveryje 3100. GitHub CLI nėra prisijungęs, todėl deploy būsenai naudojamas prijungtas GitHub connector / viešo URL patikra, o git tinklo kredencialai veikia per fetch.

### 21.33. Visa LT/EN svetainė — komercinių sąlygų ir veikimo peržiūra

Savininko patvirtinta: nemokama tik pirminė konsultacija; apžiūra, matavimas ir projektavimas derinami individualiai. Garantijų trukmės ir pasiūlymo pateikimo terminai individualūs. Medžiai ir krūmai nemokamai keičiami tik objektuose, kuriuose ATD pati vykdo nuolatinę priežiūrą; taikymo sąlygos pasiūlyme / sutartyje. Patvirtinti 170+ projektų, 12+ metų, paskelbti vejos ir dangų tarifai bei Udenhout Trees. Vercel kol kas tik peržiūrai, atd.lt migracija vėliau. Aiškiai leista viena tikra testinė užklausa po paskelbimo (Airtable + pranešimas Robertas@atd.lt), iki šio commit tik imituoti formos atsakymai.

Pataisyti LT/EN matomi tekstai, paslaugų popup, metaduomenys, FAQ / Service schema ir public/llms.txt: pašalinti bendri nemokamos apžiūros / projekto / matavimo, 1 metų, 30 dienų ir 24–48 val. pažadai. Nėra automatiškai įskaičiuotų pagrindo darbų ar nemokamo atvykimo pažadų. Patvirtinti nuo tarifai išlaikyti; schema naudoja UnitPriceSpecification.minPrice. Sutvarkyti vejos įsišaknijimo, dangos pagrindo, laistymo ir tvenkinio žiemojimo netikslumai. Galerijos CTA nukreiptas į /darbai, nušlifuota kelių istorijų redakcija, taisyti vertimai / gramatika.

Visoms kalbų / projektų peržiūroms noindex, follow pagal bendrą SITE_ROBOTS. ATD_INDEXING_ENABLED=true įjungti tik vėliau pagrindinio domeno Production aplinkoje; Vercel branch preview visada noindex. Būsimi canonical / hreflang / sitemap lieka atd.lt. docs/domain-launch.md aprašo paleidimą; DNS nekeistas. Dabartinio atd.lt /darbai ir sitemap 500 / EN senas CMS nėra naujos versijos klaida ir nėra užbaigtas domeno perkėlimas.

Rastos ir pataisytos dvi veikimo klaidos: laistymo / tvenkinių puslapiuose nebuvo main-content taikinio; sumažinto judesio režimu GardenSceneHero serverio ir naršyklės pradinis HTML nesutapo (React418). Naujas useMotionPreference per useSyncExternalStore turi bendrą serverio / hydration snapshot ir tik paskui skaito media preference. Vaizdo failas, scenos vaizdas, 2x greitis, fallback ir hotspot koordinatės neperdaryti. Mobilius floating messenger mygtukus paslepia md breakpoint: jie dengė tekstus / formos valdiklius. Mobilios call / quote ir kontaktų inline WhatsApp / Viber išlieka. Pagerintas paslaugų hero / footer teksto kontrastas, trumpinti mobilūs rodikliai.

Patikros: TypeScript, ESLint ir įprastas Turbopack build praėjo (88 išvestys). Pirma build užstrigo dėl senos CSS worker cache; patikrintame worktree .next/cache/turbopack saugiai perkeltas į turbopack-before-full-audit. Pakartotas build praėjo ir dar vienas galutinis build po UI pataisų praėjo be podėlio keitimo. Konfigūracija / build režimas neperrašyti.

verify-full-site.cjs: visi 84 sitemap URL200, viena H1, kalbos / canonical / alternates / JSON-LD / preview noindex; 84 rastos vidinės nuorodos ir 298 paveikslų URL200; neaptikti seni komerciniai pažadai; teisinga nuolatinės priežiūros sąlyga FAQ schema; 404. verify-gallery-seo.cjs: visi62 projektų HTML / nuotraukos / schema ir sitemap84. Pirminė vizualinė peržiūra48 kombinacijos (11 pagrindinių maršrutų + projektas, LT/EN1440/390); po pataisų verify-audit-fixes.cjs32 kombinacijos, taip pat320px ir abi judesio nuostatos. Nėra homepage hydration klaidų ar mobilaus horizontal overflow, patvirtintas2x ir reduced-motion be video. Penki galutiniai peržiūros lapai vizualiai patikrinti. Formų validacija / mocked429 ir success / reikšmių išlaikymas / focus / meniu / galerijos klaviatūra / slapukai ištestuoti. Tikras laiško pristatymas lieka patikrai po paskelbimo.

Ataskaita docs/site-review-2026-10-18.md; vidiniai findings, screenshots, verification.json ir pagalbiniai skriptai atd-lt-audit/full-review / evidence. Specialistų peržiūrą aiškiai numatė taikytas SEO audit skill. Joks patikrų skaičius nevadinamas SEO / CWV / AI citavimo balu. Dalis Vercel automatinių patikrų buvo403SecurityCheckpoint; apsauga neapeita. Nuotraukų portfolio baigtas, dauguma pirminių MP4 dar neparuošti puslapiui. Šio etapo commit / push atliekamas iš esamo worktree HEAD į origin/main; asmeniniai photo-selection failai / kontaktiniai lapai nestage'inami.

### 21.34. Paskelbimas ir savininko leistas vienas tikras formos testas

466448bafa45fffe82cbaebdafb2089a1a1ad30e commit iškart push'intas į origin/main; Vercel success. Live patikra LT/EN darbai / apželdinimas / Trakų Vokės istorija200 ir noindex, sitemap200 su84URL, llms200 su naujomis sąlygomis. Tuo metu tracked darbo medis švarus, origin/main..HEAD tuščias.

Savininkas aiškiai leido vieną testinę užklausą. https://atd-lt.vercel.app/kontaktai per tikrą UI pateikta ATD TESTAS2026-10-18, žyma ATD-AUDIT-20261018-466448ba; vienasPOST,2026-10-18T15:16:12.687Z, HTTP200 {success:true}, forma rodo padėką. Tuščias honeypot, backend sėkmę grąžina tik po Airtable save. Tai patvirtina išsaugojimo kelią; pranešimas siunčiamas after(), todėl gavėjo el.laiško gavimas nepreziumuotas. Paklausta savininko, ar Robertas@atd.lt gavo. Antro tikro pateikimo nedaryti be naujo leidimo. Skriptas turi diskini attempted žymeklį ir stabdo pakartojimą; real-test-submission.json vidiniame full-review aplanke.

Po testinės užklausos screenshot nustatyta, kad desktop success fokusas gali atsidurti už fixed header: mocked patikroje status top41.25,bottom61.25,headerbottom77. Pataisyta KontaktaiPage: focus preventScroll ir scrollIntoView block:center be animacijos. Pakartotinė patikra tik su mocked HTTP200, jokių naujų įrašų / laiškų. Docs ataskaita atnaujinta tikrais rezultatais. Šis mažas papildomas pataisymas bus atskirai commit ir iškart push pagal privalomą workflow.

### 21.35. Laikinas kontaktinis Gmail adresas visoje svetainėje

Savininkas paaiškino, kad Robertas@atd.lt dėžutė nepasiekiama ir jos paslaugos serveris nebepalaiko. Aiškiai nurodė laikinai visur naudoti aplinkostvarkymo@gmail.com ir leido nurodyti technines kliūtis. Atskirai aiškiai autorizavo dar vieną pažymėtą testinę užklausą naujam Gmail gavėjui (ankstesnė viena jau panaudota senam adresui). Jokių daugiau tikrų pateikimų be naujos autorizacijos.

Pridėtas src/lib/contact.ts su viena vieša CONTACT_EMAIL reikšme ir mailto. Ji naudojama visų5paslaugų CTA, kontaktų hero ir kortelėje, footer, homepage LT/EN apraše, LocalBusiness schema ir lead API notification to. public/llms.txt pakeistas taip pat. LT/EN pranešimas apie laikiną adresą dėl techninių kliūčių kontaktuose ir footer. Seno kontaktinio adreso src / public nebėra. RESEND_FROM techninis patvirtinto siuntėjo nustatymas nepakeistas į savavališką Gmail from, nes gavėjas ir el.laiško siuntimo paslaugos domenas skirtingi dalykai.

Build88,TypeScript,ESLint praėjo. verify-full-site.cjs pakartota visiems84URL: kiekviename yra naujas adresas, teisinga LocalBusiness.email, visos mailto į Gmail; seno kontaktinio adreso nėra. 84vidinės nuorodos ir298images200, sitemap84/noindex/canonical/hreflang tikslūs. Pakartota responsive patikra su ilgesniu adresu. Atskiros ankstesnio formos fokuso pataisymo mocked LT/EN1280/390 patikros: success top~440,headerbottom77/69,tekstas aiškiai matomas ir fokusuotas. Naujas tikras Gmail testas tik po šio pakeitimo deploy; jo rezultatas nefabrikuojamas. Gmail connector profilis sutampa su aplinkostvarkymo@gmail.com; tikrinti tik konkretaus savininko leisto testo žymą, ne kitą korespondenciją.

### 21.36. Gmail pristatymas patvirtintas

87e05297003fca95d64f9b2375fb5cabe82dd4a9 commit iškart push į origin/main, Vercel success. Naujas savininko leistas vienas testas per live /kontaktai: ATD TESTAS GMAIL2026-10-18, žyma ATD-AUDIT-20261018-GMAIL, vienasPOST2026-10-18T16:51:27.607Z,HTTP200/success, UI padėka. Gmail connector profilis tikrai aplinkostvarkymo@gmail.com. Tikslinė in:anywhere žymos paieška rado laišką2026-10-18T16:51:31Z su INBOX etikete ir teisingu gavėju. Patvirtintas tikras saugojimas ir pristatymas, ne tik mocked atsakymas. Jokios kitos korespondencijos neskaitėme. Testo laiškas neperžymėtas / neištrintas; naujų testų nesiųsti be leidimo. real-gmail-test-submission.json ir live-gmail-confirmation.json vidiniame full-review aplanke.

Techninis pranešimo siuntėjas pagal realų laišką onboarding@resend.dev (Vercel RESEND_FROM), todėl domain-launch.md įrašytas patvirtinto įmonės siuntėjo paruošimas būsimo pagrindinio domeno paleidimo metu. Viešas kontaktas ir gavėjas Gmail jau veikia. Savavališkai nekeitėme From į Gmail ir nelietėme DNS. Ataskaita atnaujinta tikrais rezultatais. Tai dokumentacijos papildymas, svetainės kodas nuo patikrinto87e05297 nebepakeistas. Dokumentacijos commit iškart push; papildomas realus pateikimas nereikalingas.

### 21.37. Humanizer įdiegimas ir visos LT/EN svetainės tekstų redagavimas

Savininkas paprašė įdiegti https://github.com/blader/humanizer ir peržiūrėti visus LT/EN tekstus, kaip blogą pavyzdį pateikdamas new.atd.lt/darbai/kuo-vardu-tavo-zuvis. Per skill-installer helper įdiegtas globalus humanizer v3.1.0 į C:/Users/aplin/.codex/skills/humanizer; SKILL.md perskaitytas ir taikytas šiame darbe. Skill prieinamas ir naujame šio pokalbio kataloge. Subagentai nekviesti.

Perrašyti visų31 projektų/rinkinių aprašai abiem kalbomis, peržiūrėti276 nuotraukų alt/caption, pataisyti nenatūralūs. Redaguoti homepage,5paslaugų, kontaktų, galerijos,2patarimų straipsnių tekstai, mygtukai, meniu, paslaugų popup ir metaduomenys. Natūralūs tekstai nekeisti vien dėl keitimo. Pirmojo asmens ATD balsas vietoj trečiojo asmens ataskaitos, pašalintos vidinio atrinkimo pastabos, pasikartojančios išvados, reklaminiai tušti epitetai, pažodiniai EN vertimai. Renginys pasakojamas savininko žodžių pagrindu; metai praleisti, nes savininkas tiksliai neprisiminė, foto metadata nebepateikiama kaip istorijos dalis. Naujų datų, kiekių ar klientų faktų nepridėta. Renginio puslapis ir modal naudoja LT/EN „Renginio akimirkos“, „Apie renginį“, „Skaityti apie renginį“ vietoj darbų/projekto formuluočių.

Patvirtinti masto skaičiai, darbų ribos ir kitų rangovų autorystė išsaugoti. Nemokama tik pirminė konsultacija; apžiūra/matavimas/projektavimas individualūs. Garantijų terminas individualus; nemokamas medžių/krūmų keitimas tik ATD nuolat prižiūrimuose objektuose pagal sutartą taikymą. Nuo kainos nepakeistos. Gmail/formos gavėjas, URL, sitemap84, canonical, hreflang ir preview noindex nepakeisti. Jokių naujų realių formos pateikimų ar laiškų.

Next vietiniai metadata/i18n dokumentai perskaityti. TypeScript, ESLint, diff--check ir įprastas Turbopack build88 praėjo. Pirmus build sutrikdė ta pati pasenusio CSS worker podėlio klaida; tik patikrintame worktree .next/cache/turbopack perkeltas į turbopack-before-humanizer, tada standartinis build sėkmingas; konfigūracija nekeista. verify-full-site visi84URL200,84nuorodos/298images200, JSON-LD/metaduomenys/sąlygos tinkami. Galerijos struktūrinis palyginimas su HEAD patvirtino31id,276photos ir jų tvarką/variants/covers nepakeistus. verify-humanized-copy56 LT/EN1440/390 kombinacijos be JS klaidų ir overflow. Renginio LT mobile bei ENdesktop screenshots vizualiai peržiūrėti. Po jų tik renginio antraščių papildymas, galutinis build ir tikslinė patikra.

Ataskaita docs/copy-review-2026-10-18.md; vidiniai skriptai/evidence nestage'inami. Svetainės tekstų ir ataskaitos commit iš esamo worktree iškart push į origin/main pagal privalomą workflow. DNS nepakeistas; peržiūra tikrinama ir vartotojo nurodytame new.atd.lt.
