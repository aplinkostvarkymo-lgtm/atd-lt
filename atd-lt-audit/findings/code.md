# Kodo, API, lokalizacijos ir prieinamumo auditas

Data: 2026-10-17. Tikslas: `.claude/worktrees/atd-launch-and-polish-8bc650`. Aplikacijos kodas nekeistas; sukurti tik audito artefaktai. Perskaityti `CODEX_REVIEW.md`, `AGENTS.md`, `CLAUDE.md`, `SESSION_LOG.md`, visi `src/` komponentai ir API bei susijęs vietinis Next.js `after` vadovas. Build, lint ir naršyklės tikrinimą vykdo pagrindinis auditorius. Žemiau aiškiai atskiriamas kodo faktas nuo veikimo prielaidos; realios užklausos į Airtable / Resend nesiųstos.

## Veiksmai, kuriuos reikia pataisyti

### C01 — P2 — Pranešimas apie naują užklausą gali nutrūkti po serverless atsakymo

**Vieta:** `src/app/api/lead/route.ts:103–108`.

`sendEmailNotification()` paleidžiamas ir jo pažado nelaukiama, jis taip pat neregistruojamas per `after()` / `waitUntil()`. Handleris iš karto grąžina sėkmę. Vietinis izoliuotas bandymas patvirtino, kad HTTP atsakymas jau grąžintas, kol Resend `fetch` dar neišspręstas. Vercel aplinkoje tokiam darbui neužtikrinama užklausos vykdymo trukmė: užklausa liks Airtable, tačiau verslui skirtas el. laiškas gali nepasiekti gavėjo. Tai ne teiginys, kad kiekvienas laiškas prarandamas; tai konkreti neužregistruoto foninio darbo gyvavimo problema.

**Taisyti:** siuntimą registruoti `after(async () => ...)` su klaidų valdymu arba sąmoningai palaukti jo prieš atsakymą. Įdiegtas Next.js vadovas `C:/CURSOR/ATD_Remake/atd-lt/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md` aiškiai dokumentuoja serverless `waitUntil` reikalingumą.

### C02 — P2 — Resend klaidų atsakymai laikomi sėkme

**Vieta:** `src/app/api/lead/route.ts:30–42`.

`fetch` rezultatas netikrinamas. HTTP 401, 403, 422 ar 429 nereiškia atmesto JavaScript pažado, todėl žemiau esantis `.catch()` tokių klaidų neužfiksuos. Izoliuotas bandymas su Resend HTTP 429: forma gavo 200, `console.error` nepakviestas. Tai ypač aktualu numatytam `noreply@atd.lt` siuntėjui ir dienos limitams: diagnostika neparodys, kodėl pranešimai neateina.

**Taisyti:** patikrinti `response.ok`, įrašyti statusą ir saugiai apdoroti nesėkmę. Formos sėkmę galima ir toliau grįsti Airtable rezultatu, bet el. laiško nesėkmė turi būti matoma serverio stebėsenoje.

### C03 — P2 — Desktop paslaugų meniu neįmanoma atidaryti klaviatūra

**Vieta:** `src/components/layout/Header.tsx:62–78`.

`servicesOpen` įjungiamas tik `onMouseEnter`. Pats `<button>` neturi `onClick`, `onFocus` ar klaviatūros veiksmų; nėra ir `aria-expanded`. Desktop režimu Tab pasiekus „Paslaugos“ ir paspaudus Enter / Space niekas neatsidaro, todėl penki paslaugų puslapiai nepasiekiami šia navigacija. Tai taip pat netinkama planšetei su desktop pločio vaizdu ir lietimo įvestimi.

**Taisyti:** suteikti mygtukui atidarymo / uždarymo veiksmą, būsenos semantiką ir Escape / focus valdymą. Papildomai naršyklėje patikrinti `mt-3` tarpą iki absoliučiai pozicionuoto dropdown (`Header.tsx:84`): tai atskiras pelės kelio patikrinimas, ne šiame dokumente patvirtintas gedimas.

### C04 — P2 — Modalų ir mobiliojo meniu fokusas lieka už uždengiančio sluoksnio

**Vieta:** `src/components/ui/ServicePopup.tsx:204–235`, `src/components/pages/DarbaiPage.tsx:223–263`, `src/components/layout/Header.tsx:133–198`.

Visi trys sluoksniai yra bendri `div`, neturi dialogo semantikos / prieinamo pavadinimo, neperkelia fokuso į atidarytą turinį, nesulaiko Tab jo viduje ir nepažymi fono kaip `inert`. Pvz., atidarius paslaugos popup iš hero, fokusas lieka paspaustame hotspot, o kitas Tab gali pasiekti už tamsaus fono esančią nuorodą. Ekrano skaitytuvas taip pat negauna aiškaus pranešimo, kad atsidarė dialogas.

Galerijoje papildomai nėra Escape uždarymo ir jokio scroll užrakto (`DarbaiPage.tsx:3,117–118,223–267`); ratuku ar lietimu slenka puslapis po vaizdu. Paslaugų popup Escape ir scroll užraktą jau turi (`ServicePopup.tsx:164–179`), todėl jo taisyme reikia išsaugoti šį veikimą. Mobilus meniu taip pat neturi Escape ir scroll užrakto.

**Taisyti:** naudoti turimą Radix Dialog ar lygiavertį bendrą prieinamą dialogo pagrindą: dialogo pavadinimas, pradinis fokusas, Tab ciklas, Escape, fokuso grąžinimas ir scroll būsenos atkūrimas. Galerijos uždarymas dabar apskritai neužrakina scroll, todėl „ar scroll atsirakina uždarius“ vienas pats nepatvirtintų teisingo įgyvendinimo.

### C05 — P2 — API leidžia apeiti deklaruojamą formos validaciją ir kartoti rašymus be ribos

**Vieta:** `src/app/api/lead/route.ts:59–90`; `src/lib/airtable.ts:28–44`.

Honeypot atmeta tik užpildytą `company`; jo nepateikus visiškai pakanka bet kokių netuščių `vardas` ir `telefonas`. Nėra užklausų dažnio ribojimo; kiekvienas pakartojimas pasiekia Airtable ir, sukonfigūravus, Resend. Izoliuotas penkių vienodų užklausų bandymas davė penkis `saveLead` kvietimus ir penkis 200. Tai tiesioginis kelių išorinių paslaugų kvotų ir gautųjų užpildymo kelias; honeypot vienas nėra apsauga nuo tikslingo skripto.

Papildomas validacijos trūkumas: `paslauga` ir `plotas` neturi jokio ilgio / semantikos ribojimo, telefonas nėra tikrinamas kaip telefonas, el. paštas kaip adresas. Bandymuose 100 000 ženklų paslauga, `telefonas: "x"`, `email: "not-an-email"`, `plotas: "-100"` buvo perduoti `saveLead` mock. Tikras Airtable gali dalį tokių duomenų atmesti; tai reikštų išorinį 502 vietoj aiškaus vietinio 400, o ne validacijos egzistavimą API sluoksnyje.

**Taisyti:** riboti dažnį prieš išorinius kvietimus, riboti JSON / laukų dydžius, naudoti paslaugų enum, teigiamą baigtinį plotą ir pagrįstą kontaktų formatų tikrinimą. Atitinkamas `maxLength` pridėti ir formai (`KontaktaiPage.tsx:164–202`), kad vartotojas neatsiremtų į paslėptą 100 / 2000 ženklų serverio ribą.

### C06 — P2 — Po pasirinkimo negalima iš naujo atidaryti slapukų nustatymų

**Vieta:** `src/components/CookieConsent.tsx:15–21`; `src/components/layout/Footer.tsx:9–86`; `src/components/Analytics.tsx:12–26`.

Įrašius accepted / rejected baneris paslepiamas; pakartotinai atidaryti ar pakeisti pasirinkimą skirtos sąsajos visuose `src/` failuose nėra. Žmogus, anksčiau paspaudęs „Sutinku“, negali svetainėje sustabdyti tolesnio analitikos įkėlimo. Tam šiuo metu reikėtų pačiam išvalyti localStorage.

**Taisyti:** pastovi „Slapukų nustatymai“ nuoroda ir aiškus pasirinkimo keitimo mechanizmas. Jei keitimas vyksta jau įkėlus GA, vien React komponento pašalinimas savaime negarantuoja anksčiau paleisto trečiosios šalies skripto sustabdymo; numatyti GA consent atnaujinimą / tinkamą išjungimą. Čia konstatuojama sąsajos funkcijos stoka; teisinės atitikties išvada nedaroma.

### C07 — P2 — Kontaktų formos rezultatai nepranešami pagalbinėms technologijoms

**Vieta:** `src/components/pages/KontaktaiPage.tsx:145–155,205–206`.

Sėkmė ir klaida pateikiamos kaip paprasti `<p>`, be `role="status"`, `role="alert"`, `aria-live` ar fokusavimo. Sėkmės atveju visa fokusuota forma pašalinama iš DOM ir pakeičiama tekstu, todėl klaviatūros / ekrano skaitytuvo vartotojas gali negauna rezultato ir praranda prasmingą fokuso vietą. Būsenos „Siunčiama“ tekstas pasikeičia užblokuotame mygtuke, bet tai nepakeičia galutinio būsenos paskelbimo.

**Taisyti:** stabili gyva būsenos sritis, tinkamas klaidos paskelbimas ir valdomas fokusas po sėkmės. Nesėkmės atveju išsaugoti užpildytus laukus, kaip daroma dabar.

### C08 — P2 — Hero paslaugų žymekliai panaikina matomą klaviatūros fokusą

**Vieta:** `src/components/ui/HotspotMarker.tsx:200–213`.

Ir mygtuko, ir nuorodos šakose yra `outline-none`; nėra jokio `focus-visible` ring / outline / kitos fokusavimo stiliaus alternatyvos. Žymekliai yra reali Tab navigacijos dalis (`tabIndex=0` po pasirodymo), tačiau žmogus nemato, kurį jų valdo. Hover animacija čia taikoma tik per `whileHover`, ne klaviatūros fokusą.

**Taisyti:** aiškus kontrastingas `focus-visible` indikatorius ant viso interaktyvaus žymeklio.

### C09 — P3 — Dvi naujos prieinamumo žymos lieka lietuviškos EN režimu

**Vieta:** `src/components/pages/DarbaiPage.tsx:258`; `src/components/pages/KontaktaiPage.tsx:291`.

Galerijos uždarymo mygtukas visada vadinasi „Uždaryti“, iframe visada „ATD aptarnaujama teritorija — Vilnius“. Pakeitus svetainę į EN, dokumento kalba tampa anglų, tačiau šios žymos nepersijungia. `ServicePopup` jau turi tinkamą `translations[lang].common.close`, todėl galerijoje galima pakartoti tą patį.

**Taisyti:** naudoti bendrą close vertimą ir naują LT / EN map title raktą. Taip pat iškelti į centralizuotus vertimus galerijos breadcrumb inline LT / EN šaką (`DarbaiPage.tsx:137`), kad būtų laikomasi projekto tekstų laikymo taisyklės; pats breadcrumb rodomas abiem kalbomis teisingai.

### C10 — P3 — Tvenkinių paslaugos nėra kontaktų formos pasirinkimuose

**Vieta:** `src/components/pages/KontaktaiPage.tsx:19,187–189`; palyginti `src/components/layout/Header.tsx:10–15`.

Navigacijoje ir atskirame puslapyje jau yra penktoji paslauga „Tvenkiniai“, bet `SERVICE_OPTIONS` sąraše tik pirmos keturios. Atėjęs iš `/paslaugos/tvenkiniai` klientas negali pasirinkti užsakomos paslaugos ir turi aiškinti ją žinute; užklausa gali patekti be klasifikavimo.

**Taisyti:** naudoti vieną bendrą visų siūlomų paslaugų sąrašą arba papildyti pasirinkimus; geriau perduoti CTA paslaugos kontekstą ir ją iš anksto parinkti.

## Kiti patikrinti aspektai ir ribos

- **Kainų pakeitimas atliktas teisingai:** abu `price` tipai yra `BiLang`; visi šeši comparison / materials kainų įrašai turi LT ir EN; vieninteliai du jų renderinimai naudoja `item.price[lang]` (`ServicePopup.tsx:24,92`).
- **Vertimų raktai:** TS objektų palyginimas rado po 368 lapinius LT / EN raktus, trūkstamų nėra. Tai patikrina struktūrinį pilnumą, ne viso teksto vertimo kokybę.
- **Galerijos failai:** visi 13 tiesiogiai nurodytų vaizdų yra `public/images/`; nėra patvirtintos dingusio failo klaidos. Filtrų kategorijos atitinka duomenis; jų animacijų stabilumą tikrina naršyklės auditas.
- **Vejos procesas:** trijų žingsnių procese neliko atskiros nuotraukos ar SVG; nuotraukos paliktos kitose skiltyse. Šis atšaukimas nuoseklus su CODEX_REVIEW aprašymu.
- **Kontaktų FAQ:** klausimai ir atsakymai atvaizduojami per `t` / `translations[lang]`; `aria-expanded` yra. FAQ schema iš šiuo metu nuosekliai sunumeruotų q1–q5 / a1–a5 sugeneruojama be praleidimo. SEO interpretaciją vertina atskira audito dalis.
- **WhatsApp / Viber:** numeris yra pastovi reikšmė, URL nekonstruojamas iš vartotojo duomenų; šiame kode nerasta tokios XSS injekcijos. WhatsApp naujas langas turi `noopener noreferrer`.
- **API raktai:** paieškoje per `src/`, konfigūraciją ir viešus failus klientui išduodamų Airtable / Resend slaptų raktų nerasta. GA matavimo ID yra viešas identifikatorius. Airtable naudojamas tik API route importų grandinėje; `server-only` apsauginio importo nėra, bet dabartinis panaudojimas pats savaime rakto neišduoda.
- **Maps:** iframe URL pastovus ir vartotojo HTML neįterpiamas. Tačiau iframe nėra susietas su sutikimu: `KontaktaiPage.tsx:283–291` renderinamas ir po reject; `loading="lazy"` tik atideda įkėlimą iki priartėjimo prie vaizdo. Tai techninis trečiosios šalies užklausos faktas, ne patvirtinimas, kokius slapukus Google įrašo. Reikia naršyklės tinklo ir privatumo turinio patikrinimo; nekeliama nepagrįsta teisinė išvada.
- **GA prieš sutikimą:** `Analytics.tsx:24` aiškiai neleidžia renderinti GA be accepted ir be GA_ID. Production konfigūracijos buvimas iš kodo vieno neįrodomas.
- **Sluoksniai:** CTA 40 < FloatingChat 45 < Header / cookie 50 < meniu 60 / 70 < popup / lightbox 80 / 90. Root padding apima ir Footer (`layout.tsx:63–66`). Faktinius susidūrimus bei safe-area tikrina vizualinis auditas.
- **Kontaktų hero nuorodos tekstas:** „WhatsApp / Viber“ (`translations.ts:374,779`) veda tik į `wa.me` (`KontaktaiPage.tsx:82`); atskiras Viber kontaktas yra žemiau ir floating grupėje. Siūloma hero label pakeisti į „WhatsApp“ arba pateikti du atskirus mygtukus.
- **Lietuviško teksto kokybė:** `translations.ts:285` „kiemuil“ → „kiemui“; `:344` „ties dugnusu nešąla“ → taisyklingai suformuluoti; `:345` „sodybos tvenkiniu?“ → „sodybos tvenkiniui?“; `:346` kelių žuvų sąrašo „atsparus“ → „atsparios“. Tai redakciniai P3 darbai, o ne programinės logikos gedimai.
- **Sumažintas judesys:** parent hero praleidžia video su reduced motion, bet hotspot pulso `repeat: Infinity` komponentas (`HotspotMarker.tsx:94–123`) preference neskaito. Paslaugų puslapių fadeUp ir modalų animacijos taip pat neturi bendro MotionConfig reducedMotion. Rekomenduojamas naršyklės prefers-reduced-motion patikrinimas; judesio realaus poveikio stiprumas čia nematuotas.
- **Šriftų hipotezė atmesta:** `globals.css` custom font kintamųjų vardai sutampa su next/font vardais, tačiau pagrindinio auditoriaus naršyklės patikra patvirtino teisingą DM Sans `body` computed font. Šriftų gedimo nėra. Taip pat vien šaltinio neužtenka teigti, kad greitas galerijos filtravimas sugenda.

## Pakartojamas izoliuotas API įrodymas

`node atd-lt-audit/evidence/lead-api-mocked.cjs`

Skriptas perskaito esamą TS handlerį ir vykdo jį atskiroje VM su netikru `saveLead`, netikru Resend fetch ir netikru API raktu `MOCK_ONLY`. Jokio tinklo ir jokių išorinių įrašų. Rezultatai: `atd-lt-audit/evidence/lead-api-mocked-results.json`. Honeypot suveikė (200 be save); trūkstamas telefonas atmestas (400 be save); aprašyti nevalidūs laukai ir kartojimai pasiekė save mock; Resend 429 neužregistruotas; response grįžo dar laukiant email fetch.
