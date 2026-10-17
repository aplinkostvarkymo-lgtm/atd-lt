# ATD audito pataisymai

2026-10-17. Darbas atliktas `claude/atd-launch-and-polish-8bc650` worktree, gavus vartotojo autorizaciją. Pradinis [auditas](FULL-AUDIT-REPORT.md) paliktas kaip istorinė būklė; jo balai neperskaičiuoti į spėjamus naujus balus.

Papildomai vartotojo užsakymu įgyvendintos vienkartinės 1–2–3 proceso linijų / numerių animacijos visuose penkiuose paslaugų puslapiuose ir tekstinių nuorodų / CTA mikroefektai. Sumažinto judesio alternatyvos patikrintos. Naujesni įrodymai: [proceso patikros](after/process/verification.json) (19/19) ir [nuorodų patikros](after/links/verification.json) (24/24). Production patikrai paskutiniuose etapuose naudotas `next build --webpack`, nes vietinis Turbopack pagalbinis procesas nutrūko. Detalės SESSION_LOG.md 17–19 skyriuose. Vartotojas vėliau autorizavo commit / push; žemiau nurodyta lokali būsena aprašo pradinį pataisymų etapą.

## Hero durų efektas išsaugotas

- Tas pats `public/videos/hero.mp4`, tas pats 2× playbackRate, autoplay / muted / playsInline ir perėjimas į tą patį `main_one.png`.
- SHA-256 sutampa su Git HEAD failu: `d91249bb704834626f73b9579641fe245eb9bb07e1d97a1265bc9406c1d577ed`.
- Naršyklėje video realiai grojo (`paused:false`), trukmė 4,033333 s; atsidarymo seka nepakeista. Desktop žymeklių koordinatės išsaugotos.
- Pridėtas atsarginis rodymas, kai play pažadas atmetamas, įvyksta media klaida arba video nepradeda groti / užstringa 10 sekundžių. Normaliai grojantis video nėra nutraukiamas fiksuotu intro laikmačiu: timeout atnaujinamas gaunant playback progresą.
- Be JavaScript rodomas statinis hero, tekstas, CTA ir tikros 170+ / 12+ reikšmės. Sumažinto judesio režime video praleidžiamas. Įprastoje versijoje tekstas ir toliau atsiskleidžia po durų efekto pagal vartotojo pasirinktą vizualinę kryptį.

## Įgyvendinta

| Audito punktai | Rezultatas |
|---|---|
| A01 | Next, third-parties ir eslint-config-next atnaujinti į 16.4.2. Saugūs suderinamų priklausomybių atnaujinimai. Pašalintas svetainei nereikalingas shadcn CLI, jo naudojami CSS utilities išsaugoti vietiniame faile. Produkcinio npm audit rezultatas 0. |
| A02, A05 | /darbai kontrastingas header. Paslaugų mygtukas atidaromas klaviatūra / paspaudimu, turi būseną, Escape ir nenutrūkstantį pelės kelią iki dropdown. Tabletėje naudojamas pakankamai vietos turintis hamburger. |
| A03, A04 | Intro atsarginės būsenos, tikra SSR statistika, mobile hero aukštis ir paslaugų juosta virš sticky CTA. Floating chat neuždengia mobile hero teksto; jis vėl rodomas nuslinkus nuo hero. |
| A06 | Bendras native top-layer Modal: dialogo semantika, inert fonas, scroll užraktas / atkūrimas, Tab ciklas ir pradžios / grąžinimo fokusas. Pritaikyta galerijai, paslaugų popup ir mobile meniu. |
| A07 | Vartotojas šiame pokalbyje patvirtino, kad visos 13 nuotraukų yra ATD darbai, įskaitant dvaro projektą. Nuotraukos ir faktiniai projektų pavadinimai išsaugoti. |
| A08 | Email siuntimas registruojamas Next `after`, tikrinamas HTTP rezultatas, klaidos registruojamos. Airtable klaida grąžina 502 ir nesiunčia email; sėkmingą išsaugojimą email klaida vis dar neblokuoja. Išorinių kvietimų timeout. |
| A09 | Srauto dydžio riba 16 KB, laukų ilgio / formato / paslaugos / ploto validacija, honeypot ir 5 užklausų per 10 min. limitas prieš tiekėjų kvietimus. Paruoštas pasirenkamas bendras Redis limitas; žr. ribas žemiau. |
| A10, A11 | 8 LT ir 8 EN serverio sugeneruoti puslapiai, atskiri EN URL, serverio html lang, title / description / canonical / hreflang / schema. Įprasti LT URL išsaugoti per vidinį proxy rewrite; EN prasideda /en. Sitemap turi 16 kalbinių URL. Kalbų ir vidinės nuorodos išlaiko kalbos kontekstą. |
| A12 | Sena galerija → /darbai. Pašalintas bendras nežinomų puslapių nukreipimas į home ir neturinčių patvirtinto pakaitalo paslaugų home taisyklės; tokie URL dabar grąžina 404. Žinomi konkrečių paslaugų peradresavimai išsaugoti. |
| A13, A14 | llms ištaisyta aptarnavimo zona, medelynų terminas ir paslaugų sąrašas. Kontaktinis asmuo Robertas matomas puslapyje, galerija patvirtinta savininko, papildyta bendra paslaugų ir darbo laiko schema. Nepateikti juridiniai rekvizitai, projektų metai ar apimtys neišgalvoti. |
| A15 | Slapukų nustatymus galima iš naujo atidaryti footer ir pakeisti pasirinkimą. Neįkeliama GA be sutikimo; pakeitus sutikimą išjungiamos tolesnės GA operacijos ir išvalomi prieinami _ga slapukai. Pasirinkimas saugomas ir uždraudus localStorage (tos sesijos atmintyje). |
| A16 | Stabili formos status sritis, atskira klaidos alert sritis ir fokusas į sėkmę. Išlaikomi duomenys po klaidos, lokalizuotas 429 pranešimas, klientinės ilgio ribos ir timeout. |
| A17, A18 | Reduced-motion MotionConfig, dekoratyvinis pulsas išjungiamas, sumažinto judesio režime nebe smooth scroll. Matomas fokusas, 44 px hamburger / close valdikliai, didesnė kalbos nuoroda. |
| A19 | Baltam WhatsApp kortelės tekstui naudojamas #0B7738 fonas: kontrastas 5,66:1. |
| A20 | Visos buvusios lint klaidos pašalintos, neapeinant React taisyklių. |
| A21, A22 | Kontaktų formoje yra Tvenkiniai, WhatsApp hero nuoroda tiksliai pavadinta. Lokalizuotos galerijos close ir map title žymos bei breadcrumb. |
| A23 | Tikras OG vaizdas iš ATD nuotraukos, OG / Twitter metadata, visų 5 paslaugų Service, lokalizuoti FAQ ir BreadcrumbList, vienas bendras LocalBusiness. JSON-LD saugiai escape'ina `<`. |
| A24, A25 | Galerijos pavadinimai matomi be hover. Pataisytos aptiktos LT rašybos klaidos, pažymėti pasenę specifikacijos šablonai ir pašalintas FAQ rich-result priėmimo kriterijus. |

## Patikrinimas

- `npm run build`: PASS, Next 16.4.2, 16 statinių kalbinių puslapių.
- `npm run lint`: PASS, 0 klaidų.
- `npx --no-install tsc --noEmit --incremental false`: PASS.
- `git diff --check`: PASS.
- LT / EN vertimų struktūra: po 375 lapinius raktus, trūkstamų nėra.
- Naršyklė: **46/46 patikros**, **0 pageerror**. Visi 8 puslapiai abiem kalbomis ir 1440 / 390 px, metadata, schema, vidinės nuorodos, meniu, dialogai, mobile paslaugų juosta, kalbos perėjimas, slapukų pasirinkimas, klaidos / sėkmės formos būsenos, no-JS, reduced motion ir video klaidos fallback.
- API: **15/15 izoliuotų bandymų**, įskaitant validaciją, didelį body, limitą prieš tiekėją, email HTTP 429 diagnostiką, `after` registravimą ir saugų atsakymą neveikiant sukonfigūruotam Redis.
- Media failo Git HEAD checksum patvirtinimas praėjo. Po funkcinio naršyklės patvirtinimo papildomai pakoreguotas WhatsApp ir neaktyvaus kalbos užrašo kontrastas; pakartoti build / lint / tsc.

Įrodymai: [after/verification.json](after/verification.json), [evidence/lead-fixes-results.json](evidence/lead-fixes-results.json), [produkcinis npm audit](evidence/npm-audit-production-after.json), [pilnas npm audit](evidence/npm-audit-after.json). Naujos ekrano kopijos kataloge `after/`. Tikras formas išoriniams tiekėjams naršyklės testuose pakeitė vietiniai mock atsakymai.

## Ribos ir paleidimo konfigūracija

1. **5 high npm pranešimai liko tik kūrimo įrankių grandinėje** `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. Registro suderinamo pataisymo nėra; force siūlo grįžti į eslint-config-next 14.2.35, todėl netaikyta. Tai 5 priklausomybių įrašai toje pačioje grandinėje, ne 5 patvirtintos production atakos. `npm audit --omit=dev` rodo 0.
2. **Be papildomos konfigūracijos limitas yra vieno Node proceso atmintyje.** Bendrai serverless instancijų ribai paruošti `UPSTASH_REDIS_REST_URL` ir `UPSTASH_REDIS_REST_TOKEN`. Abu turi būti nustatyti hostingo aplinkoje. Su jais naudojama atominė Redis operacija ir nepavykus limiteriui lead nerašomas. Realus Redis šiame darbe nekurtas / nebandytas.
3. **Tikras Airtable / Resend / GA4 / Google Maps ir hostingo konfigūravimas nepatvirtintas.** Nesiųstos tikros užklausos ar laiškai. Išsaugoti esami AIRTABLE / RESEND / GA matavimo ID env vardai. GSC / GBP / tikras AI citavimas / CrUX nematuoti. Juridiniams rekvizitams ar platesniems projektų aprašymams reikia tikrų savininko duomenų.
4. **Pakeitimai vietiniame worktree.** Commit / push / deploy neatlikti. Vietinė production peržiūra gali veikti localhost:3100; ji nepatvirtina, kad pakeitimai jau pasiekė viešą domeną. Ankstesnis localhost:3000 dev procesas nebuvo stabdomas.
