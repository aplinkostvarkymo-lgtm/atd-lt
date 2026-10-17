# ATD: vizualinis, kodo, SEO ir GEO auditas

> Ši ataskaita fiksuoja būklę iki taisymų. Vartotojas vėliau autorizavo pataisymus, paprašė išsaugoti hero durų efektą ir patvirtino, kad visos 13 galerijos nuotraukų yra ATD darbai. Dabartinė taisymų būklė: [FIXES.md](FIXES.md). Žemiau esantys pradiniai balai ir radinių skaičiai nėra naujas pataisytos versijos įvertinimas.

**Data:** 2026-10-17, Europe/Vilnius. **Šaka:** `claude/atd-launch-and-polish-8bc650`. **HEAD:** `e1f4430f940498c5f97dafc2969f7339e883193d`.

**Audituotas katalogas:** `C:/CURSOR/ATD_Remake/atd-lt/.claude/worktrees/atd-launch-and-polish-8bc650`.

## Pagrindinė išvada

Esama dizaino kryptis nuosekli, kainų lokalizacijos pataisa atlikta teisingai, TypeScript ir production build praeina. Vis dėlto prieš viešą paleidimą rekomenduoju sutvarkyti kelias reikšmingas naudojimo ir patikimumo problemas: vos matomą galerijos navigaciją, video būsenai priklausantį homepage turinį, mobiliosios juostos persidengimą, neveikiantį paslaugų meniu kelią, dialogų prieinamumą ir priklausomybių saugumą. Atskirai būtina patvirtinti galerijos darbų kilmę.

Programos kodas, dependencies, Git šaka ir hosting nekeisti. Sukurti audito artefaktai bei papildytas sesijos žurnalas. Jokių commit, push, deploy ar tikrų lead / el. laiškų siuntimų.

Suvienodintame žemiau esančiame registre: **7 P1, 13 P2, 5 P3; P0 nenustatyta**. Tai 25 prioritetiniai punktai, apimantys ir pagerinimus; subataskaitų radiniai gali persidengti, todėl jų skaičių nereikia sudėti dar kartą.

## Apimtis ir įrodymai

Perskaityti CODEX_REVIEW.md, AGENTS.md, CLAUDE.md, SESSION_LOG.md, PRODUCT.md, susijusios specifikacijos, source bei vietiniai Next.js 16.2.4 vadovai. CODEX_REVIEW yra tikrinamas perdavimo dokumentas, ne garantija, kad jo teiginiai atitinka kodą. Jo paminėtas „remote branch main“ netapatinamas su audituota vietine šaka.

- Visi 8 vieši puslapiai: pradinis, veja, apželdinimas, trinkelės, laistymas, tvenkiniai, kontaktai, darbai.
- Microsoft Edge 155 per Playwright, production localhost:3100, desktop **1440×900** ir mobile **390×844**; papildomi homepage matavimai **320 / 768 / 1024 px**. 21 PNG kopija, įskaitant dialogus, cookie būseną ir no-JS.
- Kodo / API / vertimų auditai, build / lint / tsc, npm security registry užklausa, realaus serverio robots / sitemap / llms / redirect / 404 atsakymai.
- Izoliuoti /api/lead scenarijai su mock Airtable ir mock Resend: jokių išorinių duomenų įrašų.
- Du vietiniai emuliuoto mobilaus našumo bandymai, aiškiai atskirti nuo realių vartotojų CWV.
- Oficialūs Google, W3C ir Vercel šaltiniai panaudoti aktualiems SEO / prieinamumo / saugumo teiginiams tikrinti. Nuorodos pateiktos atitinkamose subataskaitose.

Neišmatuota: realaus deploy indeksavimas, Google pasirinktas canonical, GSC / GA4 / GBP / backlink rezultatai, AI citatos, CrUX p75, INP ir Lighthouse Agentic Browsing X/N. Viešų atd.lt / new.atd.lt bandymų per web priemonę nepavyko užbaigti; tai nėra įrodymas, kad domenai ar botų prieiga neveikia. Fizinis telefonas / iOS safe-area netikrinti. Šis auditas nepatvirtina visos produkcinės aplinkos būklės.

## Patikrų rezultatai

| Patikra | Rezultatas |
|---|---|
| TypeScript | PASS, 0 klaidų |
| Production build | PASS; pirmas riboto tinklo bandymas negavo Google Fonts, pakartotas sėkmingai |
| ESLint | FAIL: 5 react-hooks/set-state-in-effect klaidos |
| Naršyklėje 8 puslapiai × 2 pločiai | 16/16 HTTP 200, 0 pageerror, po vieną H1 |
| Dokumento horizontalus overflow | Nerasta 1440 / 390; homepage papildomai nerasta 320 / 768 / 1024 |
| Canonical, pavadinimai ir aprašymai | 8/8 pateikiami, individualūs LT puslapiams |
| Sitemap | HTTP 200, **6 iš 8** puslapių |
| robots.txt ir llms.txt | HTTP 200; botų leidimai šaltinyje, llms turinys pasenęs |
| Galerija | 13/13 failų yra, filtrai baigiasi teisingais 13 elementų; Escape neveikia |
| LT / EN struktūra | Po 368 vertimų lapinius raktus; struktūrinių trūkumų nėra, bet yra hardcoded žymų ir LT metadata EN režime |
| Mechaninis Impeccable detektorius | `[]`; naršyklė vis tiek patvirtino UX ir prieinamumo problemas |
| npm audit | 27 paketų įrašai: 2 critical, 18 high, 5 moderate, 2 low; taikymo sąlygos vertintos atskirai |

## Suvienodintas prioritetų registras

| ID | Prioritetas | Radinys ir konkretus poveikis | Įrodymas / detalės |
|---|---|---|---|
| A01 | P1 | Užfiksuota Next 16.2.4 patenka į saugumo pranešimų intervalus; reikia atnaujinimo ir sąlygų analizės. Auditas neįrodo sėkmingo išnaudojimo. | [S01, saugumas](findings/security.md), package.json:17, npm-audit.json |
| A02 | P1 | Balta navigacija /darbai ant cream fono: **1,13:1**, sunku matyti nuorodas ir menu ikoną. | [V01](findings/visual.md), Header.tsx:35–47, darbai-1440.png / darbai-390.png |
| A03 | P1 | Homepage H1 / CTA slepiami iki kliento video būsenos; no-JS nematomi, SSR statistika 0+. Viename mobile lab bandyme hero opacity liko 0. | [SEO-GEO-02](findings/seo-geo.md), [našumas](findings/performance.md), GardenSceneHero.tsx:51–52,93–94,135–136 |
| A04 | P1 | Mobile CTA y=773–844 dengia hero paslaugų juostą y=786–844; chat mygtukai sutampa su tekstu. | [V02](findings/visual.md), production-checks.json, home-390.png |
| A05 | P1 | Paslaugų dropdown neatsidaro Enter; judant per tarpą iki dropdown užsidaro ir pele. | [V03](findings/visual.md), Header.tsx:62–84, browser-data.json |
| A06 | P1 | Galerijos / mobile menu Escape neveikia, modaluose nevaldomas fokusas; ServicePopup palaiko Escape / scroll, tačiau nesulaiko fokuso. | [V04](findings/visual.md), [C04](findings/code.md), dialogCount=0, fokusas lieka fone |
| A07 | P1 | „Realūs ATD projektai“ ir konkretaus dvaro projekto teiginiai nesuderinti su perdavimo dokumente aprašyta nuotraukų kilme. | [SEO-GEO-01](findings/seo-geo.md); faktus patvirtinti, o ne automatiškai laikyti nuotraukas svetimomis |
| A08 | P2 | El. pašto pažado nelaukiama / neregistruojama užklausoje; Resend HTTP klaidos nepastebimos. Užklausa išsaugoma, bet verslas gali negauti pranešimo. | [C01–C02](findings/code.md), api/lead/route.ts:30–42,103–108, mock rezultatai |
| A09 | P2 | API trūksta lauko / dydžio / formato / dažnio ribojimų; honeypot neapsaugo nuo skripto, kuris jo nepildo. | [C05](findings/code.md), api/lead/route.ts:59–90; 5 mock užklausos → 5 saveLead |
| A10 | P2 | Sitemap nėra /darbai ir /paslaugos/tvenkiniai; puslapiai atrandami kitais keliais, tad tai nėra noindex. | [SEO-GEO-03](findings/seo-geo.md), sitemap.ts:5–37, tikras XML |
| A11 | P2 | EN nėra atskirai indeksuojama ar pasidalijama; EN UI rodomas su LT title / description / FAQ schemomis. | [SEO-GEO-04](findings/seo-geo.md), LanguageContext.tsx:17–30; naršyklėje h1 „Our Work“, title LT |
| A12 | P2 | Sena galerija nukreipiama į home, nors jau yra /darbai; kiti platūs home redirect'ai turi būti semantiškai peržiūrėti. | [SEO-GEO-05](findings/seo-geo.md), /lt/gallery/test → 308 / |
| A13 | P2 | llms vis dar skelbia nepatvirtintus Trakus ir pasenusį paslaugų sąrašą / terminą. | [SEO-GEO-06](findings/seo-geo.md), public/llms.txt:9–16,40 |
| A14 | P2 | Mažai patikrinamų įmonės / atsakingo specialisto ir realių projektų faktų; sunkiau įvertinti skelbiamą patirtį. | [SEO-GEO-07](findings/seo-geo.md); redakcinė pasitikėjimo rekomendacija |
| A15 | P2 | Nėra galimybės iš naujo atidaryti slapukų nustatymų ir pakeisti pasirinkimą svetainėje. | [C06](findings/code.md), CookieConsent.tsx:15–21, Footer |
| A16 | P2 | Forma nepaskelbia sėkmės / klaidos live srityje; sėkmės metu pašalinamas fokusuotas formos turinys. | [C07](findings/code.md), KontaktaiPage.tsx:145–155,205–206 |
| A17 | P2 | Reduced motion išjungia video, bet palieka 8 nuolatines hotspot animacijas. | [V05](findings/visual.md), HotspotMarker.tsx:94–123 |
| A18 | P2 | Hotspot outline nuimtas be pakaitalo; hamburger 22×16 px ir kiti pagrindiniai ikoniniai valdikliai per maži patogiam lietimui. | [V06](findings/visual.md), [C08](findings/code.md) |
| A19 | P2 | Baltas WhatsApp tekstas kontaktų kortelėje ant #25D366 turi **1,98:1** kontrastą. | [V07](findings/visual.md), KontaktaiPage.tsx:241–247 |
| A20 | P2 | Nepraleidžiamas deklaruotas lint kokybės vartas: 5 klaidos. Tai nėra TypeScript / build nesėkmė. | [saugumo / patikrų ataskaita](findings/security.md), konkrečios eilutės joje |
| A21 | P3 | Tvenkinių paslaugos nėra kontaktų formos pasirinkimuose; hero „WhatsApp / Viber“ veda tik į WhatsApp. | [C10 ir kitos pastabos](findings/code.md), KontaktaiPage.tsx:19,82 |
| A22 | P3 | EN režime galerijos close aria-label ir iframe title lieka LT; dalis tekstų ne centralizuotuose vertimuose. | [C09](findings/code.md), DarbaiPage.tsx:258, KontaktaiPage.tsx:291 |
| A23 | P3 | Nėra OG vaizdo; tvenkinių Service ir bendras paslaugų katalogas / darbo valandos nepilni, kontaktuose schema dubliuojama. | [SEO-GEO-08](findings/seo-geo.md), schemas.ts, route metadata |
| A24 | P3 | Galerijos pavadinimai matomi tik hover; telefone sunkiau suprasti objektą. | [V08](findings/visual.md), DarbaiPage.tsx:193–199 |
| A25 | P3 | Pasenęs FAQ rich-result tikslas ir lietuviško teksto klaidos klaidina darbų priėmimą bei mažina pateikimo kokybę. | [SEO-GEO-09](findings/seo-geo.md), [redakcinės pastabos](findings/code.md) |

## Vietinės parengties vertinimas

Skaičiai žemiau — **ekspertinė audito rubrika**, ne Google / Lighthouse / tikro AI matomumo matavimas. Jų paskirtis palyginti tą patį projektą po taisymų, naudojant tuos pačius kriterijus. Jie nepakeičia aukščiau pateiktų konkrečių radinių.

### UI techninė kokybė: 10/20

| Sritis | Balai / 4 | Pagrindas |
|---|---:|---|
| Prieinamumas | 1 | Meniu, fokusas, dialogai ir patvirtinti kontrasto trūkumai |
| Našumo įgyvendinimas | 2 | Optimizuoti vaizdai, bet intro slepia pagrindinį turinį; riboti lab duomenys |
| Dizaino tokenų nuoseklumas | 3 | Esama spalvų / tipografijos sistema nuosekli; dark mode produktui nepareikalautas ir nebaudžiamas |
| Responsive | 2 | Nėra overflow, bet mobile valdikliai persidengia |
| Įgyvendinimo vientisumas | 2 | Kryptis vieninga, tačiau galerijos kilmės ir funkcinių būsenų klausimai neuždaryti |

### SEO parengtis: 66/100 pagal vertintą apimtį

| Sritis | Rubrikos balas | Svoris |
|---|---:|---:|
| Techninis SEO | 75 | 22 |
| Turinio kokybė / patikrinamumas | 55 | 23 |
| On-page | 65 | 20 |
| Struktūriniai duomenys | 75 | 10 |
| AI turinio parengtis | 55 | 10 |
| Vaizdai | 80 | 5 |
| CWV | nevertinta balu | 10 neįtrauktas |

Formulė: `(75×22 + 55×23 + 65×20 + 75×10 + 55×10 + 80×5) / 90 = 65,72`, suapvalinta iki 66. CWV svoris išimtas ir likę perskaičiuoti, nes turime tik du vietinius lab bandymus ir nepatikimą homepage pagrindinio turinio matomumą. Tai nėra pilnas 100% duomenų SEO health matavimas.

### GEO turinio / techninė parengtis: 58/100

Rubrika: cituojami savarankiški atsakymai 13/25, struktūra 14/20, naudingas tekstas + vaizdai 10/15, patikrinama patirtis / subjektas 8/20, techninis prieinamumas 13/20. Pagrindas: konkretūs kainų ir terminų atsakymai geri, bet projektų įrodymai, EN atrandamumas ir pradinio HTML faktai silpni. llms buvimas nesuteikia balų.

**Google AIO / AI Mode, ChatGPT ir Perplexity realaus matomumo balų nėra.** Citavimas ar prekės ženklo minėjimas nebuvo išmatuoti. robots leidimas reiškia tik taisyklių parengtį, ne garantuotą citavimą; WAF / CDN botų apdorojimas nežinomas. Detali botų matrica pateikta [SEO / GEO ataskaitoje](findings/seo-geo.md).

## CODEX_REVIEW punktų atsakymas

- `ComparisonItem` ir `MaterialItem` kainos teisingai pakeistos į BiLang. Visi 6 comparison/material kainų įrašai ir abu renderinimo keliai korektiški.
- Vejoje proceso SVG ir atskira proceso nuotrauka pašalinti kaip aprašyta; iliustracijų grąžinimas nesiūlomas.
- FloatingChat numeriai pastovūs, WhatsApp turi noopener noreferrer, šioje vietoje XSS kelio iš vartotojo duomenų nerasta.
- Maps iframe URL pastovus. Jo buvimas nėra dinaminės HTML injekcijos problema; title dar nelokalizuotas, išorinis žemėlapio tinklo elgesys nevertintas kaip teisinė išvada.
- Root mobile padding apima Footer, nominali z-index tvarka atitinka aprašymą; praktinis hero persidengimas vis tiek patvirtintas.
- Kontaktų FAQ generuojamas iš egzistuojančių q1–q5 / a1–a5 porų, schema parsuoja. EN naudojama LT schema; Google rich-result pažadas nėra tinkamas dabartinis sėkmės kriterijus.
- Galerijos 13 failų yra, filtrai veikia. Tačiau lightbox scroll iš viso neužrakinamas — vien „ar atsirakina uždarius“ patikra būtų per siaura. Escape / fokusas neteisingi.
- Klientui pateikiamų Airtable / Resend slaptų raktų source paieškoje nerasta. Nepatikrintas Vercel env ir tikra pristatymo grandinė.
- TypeScript ir build praeina; lint nepraeina. CODEX_REVIEW build sąrašas vienas neapima visų kokybės vartų.

## Ką išlaikyti

Individualūs canonical / metadata LT puslapiams, serverio JSON-LD, konkretūs kainų ir darbų trukmės atsakymai, abiejų kalbų vertimų struktūra, turimų nuotraukų Next Image optimizavimas, veikiantis galerijos filtravimas, aiškus telefono numeris ir bendra žalios / fotografijos / tipografijos kryptis. Svetainės nereikia perkurti nuo nulio.

## Taisymų tvarka ir failai

[ACTION-PLAN.md](ACTION-PLAN.md) pateikia darbus su priėmimo kriterijais. Rekomenduojama pradėti nuo A01–A07, tada sutvarkyti kontaktų patikimumą, lint ir SEO aprėptį, paskui turinio / prieinamumo užbaigimą.

| Artefaktas | Turinys |
|---|---|
| [findings/visual.md](findings/visual.md) | Vizualinis / UX / a11y vertinimas ir false positives |
| [findings/code.md](findings/code.md) | Tikslūs kodo / API / lokalizacijos radiniai |
| [findings/seo-geo.md](findings/seo-geo.md) | SEO, GEO, schema, local / entity ir botų matrica |
| [findings/security.md](findings/security.md) | npm pranešimų sąlygos ir build / lint rezultatai |
| [findings/performance.md](findings/performance.md) | Vietiniai našumo matavimai ir jų ribos |
| [browser-data.json](browser-data.json) | 16 puslapio / viewport kombinacijų DOM ir sąveikų duomenys |
| [production-checks.json](production-checks.json) | Papildomi pločiai, popup, HTTP, assets, lab performance |
| [evidence/lead-api-mocked-results.json](evidence/lead-api-mocked-results.json) | API scenarijai be išorinių rašymų |
| [evidence/npm-audit.json](evidence/npm-audit.json) | Viešo npm registro atsakymas |
| screenshots/ | 21 production ekrano kopija |

Markdown ir JSON artefaktai yra pagrindinis šio audito rezultatas. Pagal poreikį iš jų galima parengti ir PDF ataskaitą.

Papildoma dokumentacijos pastaba: PRODUCT.md turi nebenaudojamą Register skyrių ir senesnę Impeccable produkto schemą. Tai ne audito blokas; pašalinimą ir `impeccable init` migraciją palikome atskiram pasirenkamam darbui.
