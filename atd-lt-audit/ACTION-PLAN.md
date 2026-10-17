# ATD audito taisymų prioritetai

2026-10-17. Šis dokumentas yra audito rekomendacijos, ne atliktų pataisymų sąrašas. Programos kodas nepakeistas. P0 nerasta; P1 taisyti prieš viešą paleidimą, P2 artimiausiu tvarkymo etapu, P3 vėliau. Nuotraukų ir verslo faktų patvirtinimas priklauso savininkui; kodo taisymus galima rengti lygiagrečiai.

## Pirmas etapas — paleidimo kokybė

| Eilė | Darbas | Priėmimo kriterijus |
|---|---|---|
| 1 | Atnaujinti ir įvertinti Next runtime saugumą | Suderintos palaikomos paketų versijos; iš naujo build, tsc, lint ir npm audit; pranešimų taikymo sąlygos dokumentuotos. Jokio aklo force downgrade. |
| 2 | Matomas homepage turinys nepriklausomai nuo video / JS | Pradiniame HTML teisingi 170+ / 12+, matomas H1 ir CTA; video užblokavimas / autoplay atsisakymas nepaslepia pagrindinio veiksmo. |
| 3 | Sutaisyti header temą ir paslaugų dropdown | /darbai logo, navigacija ir hamburger kontrastingi; Paslaugos veikia Enter, Space, pointer ir Escape; nėra 12 px hover „bedugnės“. |
| 4 | Sutvarkyti mobiliosios apačios elementus | 320 / 390 / 768 px, LT / EN, consent matomas / paslėptas; joks pirminis valdiklis ar tekstas neuždengtas; patikrinta tikro telefono safe-area. |
| 5 | Bendras prieinamas dialogo pagrindas | Galerija, ServicePopup, mobile menu: tinkama semantika, pradinis fokusas, Tab ciklas, Escape, fono slinkimo užraktas ir atkūrimas. |
| 6 | Patvirtinti galerijos darbų kilmę | Kiekvienam iš 13 vaizdų patvirtintas objektas, ATD vaidmuo ir teisė publikuoti; iki tol nei UI, nei metadata nepateikia nepatvirtintų darbų kaip tikrų. |

## Antras etapas — patikimas kontaktas ir indeksavimas

- Email vykdymas: `after` / await, response.ok, serverio klaidų stebėsena. Mock testuose užfiksuoti 429 ir neišspręsto pažado scenarijai; tikros integracijos priėmimą atlikti su vienu aiškiai pažymėtu bandomuoju lead po savininko suteiktos teisės siųsti.
- API: bendra schema, laukų / body dydžio ir paslaugos ribos, kontaktų formatas, teigiamas baigtinis plotas, dažnio ribojimas prieš išorines paslaugas. Formoje padėti nepasiekti paslėptų serverio ribų.
- Išspręsti 5 lint klaidas išsaugant SSR / hydration teisingumą.
- Sitemap: visi 8 canonical puslapiai; sena galerija → /darbai, kiti legacy URL → semantiškai artimas puslapis arba sąmoninga 404/410.
- Susitarti dėl EN paieškos tikslo. Jei EN turi būti indeksuojama, atskiri EN URL, SSR vertimai, metadata / schemos atitinkančios kalbą, abipusės kalbų nuorodos ir hreflang.
- Ištaisyti llms aptarnavimo teritoriją, medelynų terminą ir paslaugų sąrašą; aiškiai patvirtinti teikėją, specialistą ir tikrų darbų faktus. llms ar speciali „AI schema“ nėra Google AI matomumo reikalavimas.
- Valdomi slapukų nustatymai; prieinami formos statusai, matomas fokusas, sumažintas dekoratyvinis judesys, didesni ikoninių mygtukų plotai ir kontrastingas WhatsApp tekstas.

## Trečias etapas — turinio ir pateikimo užbaigimas

- Tvenkiniai formos pasirinkimuose, centralizuotos likusios LT / EN žymos, hero „WhatsApp / Viber“ nuorodos ir pavadinimo atitikimas.
- Tikras OG vaizdas, atnaujintas bendras paslaugų katalogas ir tvenkinių schema; struktūriniai duomenys atitinka matomą turinį.
- Galerijos pavadinimai pasiekiami be hover, keli patvirtinti projektų faktai, lietuviško teksto redakcija.
- Atšaukti seną FAQ rich-snippet sėkmės kriterijų; palikti lankytojui naudingus ir prieinamus DUK.
- Atnaujinti pasenusius SESSION_LOG / CODEX_REVIEW faktus tik patvirtinus naują būklę. PRODUCT.md naujos schemos migracija yra pasirenkamas atskiras `impeccable init` darbas.

## Tikrinimo pabaiga

Paleisti tik susijusius automatinius bei naršyklės testus, tada vieną galutinį LT / EN desktop ir mobile patvirtinimą. UX darbų seka pagal naudojamą metodiką: `$impeccable harden` → `$impeccable adapt` → `$impeccable colorize` → `$impeccable animate` → `$impeccable polish`.

Prie realaus deploy dar patikrinti host / canonical / redirects, Search Console indeksavimą, GA4 ir Resend konfigūraciją, GBP teisingumą. Dabartinis auditas jų nepatvirtino ir nekeičia hosting ar production būsenos.
