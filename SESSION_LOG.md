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
