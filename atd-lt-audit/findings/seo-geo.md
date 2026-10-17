# ATD SEO, GEO ir agentų prieigos auditas

Data: 2026-10-17 (Europe/Vilnius). Audituota vietinė šaka, HEAD `e1f4430f940498c5f97dafc2969f7339e883193d`.

Visos žemiau nurodytos kodo vietos yra kataloge `C:/CURSOR/ATD_Remake/atd-lt/.claude/worktrees/atd-launch-and-polish-8bc650`. Tai šaltinio kodo analizė. Programos kodas nekeistas, užklausos / lead forma nesiųstos. Perskaityti CODEX_REVIEW.md, AGENTS.md, CLAUDE.md, SESSION_LOG.md ir spec/03-seo-spec.md. Naudotos seo-geo ir seo-agentic metodikos, jų aktualūs techniniai teiginiai tikrinti oficialiuose šaltiniuose.

## Apimtis ir įrodymų ribos

- Patikrinti visi 8 vieši puslapių route'ai: `/`, 5 paslaugos, `/kontaktai`, `/darbai`; jų metadata, canonical, JSON-LD, navigacija, sitemap ir robots / llms šaltiniai.
- Matomi faktai: 8/8 turi individualų canonical ir pavadinimą / aprašymą (homepage paveldi pavadinimą ir aprašymą iš layout); sitemap apima 6/8; Service schema pateikiama 4/5 paslaugų puslapiuose; FAQPage schema pateikiama 5 puslapiuose (4 paslaugų ir kontaktų).
- Produkcinė HTTP būsena, Google pasirinktas canonical, indeksavimas, GSC / GA4 rezultatai, Google Business Profile, atgalinės nuorodos, realios AI citatos ir platformų matomumas nematuoti. Nėra duomenų teigti, kad svetainė nerankina ar nėra cituojama.
- `web` priemonė negalėjo pasiekti `https://atd.lt/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` ("URL ... is not accessible via this tool"). Tai nėra serverio HTTP klaidos ar realių botų blokavimo įrodymas.
- Lighthouse Agentic Browsing X/N, Agent-UX, CrUX ir CWV šioje dalyje negauti. Nematuoti dydžiai nekeičiami spėjamais balais. GEO parengtis vertinama kokybiškai: techninis pagrindas dalinis, pasitikėjimo ir tikro angliško indeksavimo spragos reikšmingos. Bendras skaitinis SEO / GEO balas neskaičiuotas.
- JavaScript / no-JS vizualinio atvaizdavimo ir tikrų status kodų patikra perduota pagrindiniam audito vykdytojui; žemiau aiškiai atskirtos iš kodo nustatytos būsenos ir dar nepatvirtinti produkciniai padariniai.

## Prioritetiniai radiniai

### SEO-GEO-01 — P1: galerija viešai prisistato kaip tikri ATD darbai, nors perdavimo dokumentas jų kilmę laiko nepatvirtinta

**Įrodymai:** `CODEX_REVIEW.md:288` nurodo, kad galerijoje bendros nuotraukos, tikras projekto nuotraukas planuota pateikti vėliau. `src/lib/translations.ts:397` ir `:802` teigia „Realūs ATD projektai Vilniuje“ / „Real ATD projects in Vilnius“. `src/app/darbai/page.tsx:7` ir `:16` tą patį teigia meta aprašymuose. `src/components/pages/DarbaiPage.tsx:58–61` konkretų vaizdą pavadina „Trakų Vokės dvaro apželdinimas“. Ankstesniame SESSION_LOG.md:64 ši nuotrauka buvo atidėta vartotojo sprendimu.

**Poveikis:** paieškos ištrauka ir galerija pateikia autorystės / patirties įrodymą, kurio patvirtinimo audituotas perdavimo dokumentas nesuteikia. Tai pasitikėjimo ir klaidinančios komunikacijos rizika. Auditas netvirtina, kad nuotraukos pavogtos ar ATD ten nedirbo: dokumentai vienas kitam prieštarauja.

**Veiksmas prieš paleidimą:** kiekvienam objektui patvirtinti ATD dalyvavimą ir publikavimo teisę; kol nepatvirtinta, pašalinti atitinkamą darbą arba aiškiai žymėti vaizdą kaip iliustracinį tiek LT, tiek EN, taip pat metadata. Patvirtintiems darbams pridėti vietą, metus, darbų apimtį, ATD atsakomybę ir bent vieną realų rezultatą. Vengti klientų privačių duomenų.

**Patikra:** visų 13 vaizdų kilmės lentelė ir pavadinimų / metadata atitikimas. Tai paleidimo turinio patvirtinimo punktas, ne automatiškai daroma išvada apie visą įmonę. Google akcentuoja realia patirtimi paremtą turinį: [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### SEO-GEO-02 — P1: pagrindinio puslapio H1 ir CTA matomumas priklauso nuo video bei kliento būsenos

**Įrodymai:** `src/components/sections/GardenSceneHero.tsx:51–52` pradžioje `showImage=false`, `showHotspots=false`; `:93–94` perjungimas tik `onEnded` / `onError`; `:133–136` H1 / CTA tėvinis motion blokas pradeda `opacity:0`, o matomas tampa tik `showImage=true`. `src/components/sections/StatsBar.tsx:48` skaičiai prasideda nuo nulio; `:77–78` tikslai 170 ir 12, `:92`, `:107` išvedami kliento skaičiai. `src/app/page.tsx:13–15` pagrindinis turinys yra tik hero ir statistika.

**Poveikis:** neįvykus JS, video pabaigos įvykiui arba `prefers-reduced-motion` effect, pagrindinė žinutė ir CTA lieka nematomi. Statinis ištraukiklis gali gauti 0+ vietoj 170+ / 12+; serverio HTML esantis H1 tekstas dar nereiškia, kad jis matomas. Tai prieinamumo ir agentų naudojimo problema; nėra įrodymas, kad Google visai nemato šio URL.

**Veiksmas:** turinį ir tikras statistikos reikšmes pateikti matomus pradiniame HTML, o video / animaciją dėti kaip progresyvų pagerinimą; užtikrinti atsarginį vaizdą ir matomą CTA nepriklausomai nuo autoplay / tinklo / kliento JS. Konkretų vizualinį atkūrimą pridėti iš bendro audito įrodymų.

**Patikra:** išjungti JavaScript ir užblokuoti video; patikrinti matomą H1, kontaktinį CTA ir tikras skaitines reikšmes. Tikrinti ir autoplay atsisakymą. [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Applebot rendering guidance](https://support.apple.com/en-us/119829).

### SEO-GEO-03 — P2: du esami puslapiai neįtraukti į sitemap

**Įrodymai:** visas `src/app/sitemap.ts:5–37` grąžina tik `/`, veją, apželdinimą, laistymą, trinkeles, kontaktus. Egzistuoja `src/app/darbai/page.tsx:4–23` ir `src/app/paslaugos/tvenkiniai/page.tsx:4–26`, abu su savo canonical. Navigacijoje tvenkiniai yra `src/components/layout/Header.tsx:15`.

**Poveikis:** sitemap atsilieka nuo route'ų ir nepateikia dviejų naujų page URL paieškos sistemoms. Vidinės nuorodos padeda juos atrasti, todėl tai nėra indeksavimo blokas.

**Veiksmas:** įtraukti abu canonical URL; vientisą paslaugų / puslapių registrą naudoti navigacijai ir sitemap. `lastModified` dėti tik turint tikrą reikšmingo atnaujinimo datą. Nereikia kas kartą generuoti netikrų „šiandien atnaujinta“ reikšmių; priority ir changefreq keitimas Google nepadės.

**Patikra:** sugeneruotame `/sitemap.xml` turi būti 8 konkretūs indeksuotini canonical URL ir jokių neegzistuojančių /kaina ar /apie. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

### SEO-GEO-04 — P2: EN yra sąsajos būsena, neturi savarankiškai atrandamų URL ir metadata

**Įrodymai:** `src/contexts/LanguageContext.tsx:17–30` visada pradeda LT, vėliau skaito localStorage `atd-lang`; tik `document.documentElement.lang` keičiamas effect. `src/components/ui/LanguageToggle.tsx:14–17` kalbą keičia button, nėra EN nuorodos. `src/app/layout.tsx:29–47` metadata LT ir og locale `lt_LT`; visų route'ų metadata taip pat statinė LT. `src/lib/schemas.ts:88`, `:101`, `:103`, `:118–120` FAQ generuojami tik iš `translations.lt`. `next.config.ts:16–17` `/en` ir `/en.php` siunčia į LT pradžią.

**Poveikis:** įprastas naujas crawler apsilankymas gauna LT. Angliško turinio negalima atskirai nurodyti, dalytis ar pateikti kaip indeksuotiną EN alternatyvą; EN vartotojo turinys ir lietuviškas title / description / FAQ schema išsiskiria. LT SEO tai savaime neužblokuoja. Prioritetas aktualus, jei norima pritraukti ir EN organines užklausas.

**Veiksmas:** jeigu EN skirta paieškai, naudoti savarankiškus `/en/...` URL, serverio kalbą, lokalizuotus title / description / OG / JSON-LD, abipusį hreflang ir self-canonical kiekvienai kalbai. Kalbos jungiklis turi turėti tikras nuorodas. Jei EN tik patogumo funkcija, aiškiai priimti šį apribojimą; vien `lang` atributas problemos neišsprendžia.

**Patikra:** švari naršyklė ir HTTP fetch į EN URL be localStorage turi grąžinti EN pagrindinį turinį bei metadata; LT ir EN nuorodos tarpusavyje sutampa. [Google multilingual site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

### SEO-GEO-05 — P2: senos galerijos ir didelės dalies turinio redirect'ai nukreipia į minimalų homepage

**Įrodymai:** `next.config.ts:65` `/lt/gallery/:path*` nukreipia į `/`, nors yra `/darbai`. `:44–68` daug skirtingų senų turinio URL siunčiami į `/`, `:71` yra bendra `/lt/pages/:path*` taisyklė. Homepage sudaro tik 2 sekcijos (`src/app/page.tsx:13–15`), todėl tai nėra parodytas konsoliduotas seno turinio puslapis.

**Poveikis:** galerijos lankytojas neatkeliauja į naują galeriją. Kitų turinio URL atveju reikia patikrinti seno URL temą: jei tema nesutampa, gali pradingti naudingi nukreipimo ir relevantiškumo signalai, o paieška redirect'ą vertinti kaip soft 404. Netvirtinama, kad visi home redirect'ai neteisingi: dalis yra pagrindinio puslapio alternatyvos.

**Veiksmas:** `/lt/gallery/*` sieti su patvirtinta `/darbai` galerija; likusias senas temas inventorizuoti ir nukreipti į tikrai artimiausią turinį. Turiniui be pakaitalo geriau sąmoninga 404 / 410 negu nerelevantiška home taisyklė. Atskira `/en/pages/...` senųjų URL grupė šiame config nematoma; jos realų naudojimą patikrinti iš seno sitemap / GSC, nekurti taisyklių iš spėjimo.

**Patikra:** lentelė „senas URL → tema → naujas URL → statusas“, tikrinant realų produkcinį atsakymą ir galutinio puslapio turinį. Google priima tiek 301, tiek 308; `permanent:true` nereikia „taisyti į 301“ vien dėl sesijos pavadinimo. [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

### SEO-GEO-06 — P2: viešame llms apraše likusi nepatvirtinta aptarnavimo zona ir pasenęs paslaugų sąrašas

**Įrodymai:** `public/llms.txt:16` įvardija Trakus; `src/lib/translations.ts:304`, `:360`, `:383` rodo Vilnių ir rajoną, o `SESSION_LOG.md:51` aiškiai sako „Trakai“ pašalinta kaip nepatvirtinta. `public/llms.txt:9–12` turi tik 4 paslaugas, tvenkinio nėra, nors `Header.tsx:15` ir tvenkinių route'as yra. `public/llms.txt:40` „Olandijos daržynų“ prieštarauja terminui „medelynų“ (`translations.ts:227`).

**Poveikis:** failą skaitanti sistema gali gauti kitą aptarnavimo pažadą nei puslapio lankytojas. Tai faktų ir turinio priežiūros klaida. `llms.txt` nėra Google AI matomumo reikalavimas, jo sutvarkymas nėra pažadas pakelti pozicijas.

**Veiksmas:** patvirtinti vieną paslaugų / zonos / garantijų / kainų šaltinį, atnaujinti llms iš jo arba failą visai atsisakyti palaikyti. Nekopijuoti pasenusio spec/03-seo-spec.md šablono kainų. [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

### SEO-GEO-07 — P2: trūksta lengvai patikrinamos įmonės ir projektų patirties informacijos

**Įrodymai:** `src/lib/schemas.ts:8–25` yra prekės ženklas, telefonas, el. paštas ir bendras Vilniaus adresas, foundingDate „2012“. `src/components/layout/Footer.tsx:16–22`, `:48–71` rodo prekės ženklą ir kontaktus, bet nesieja jo su konkrečiu juridiniu / veiklos subjektu ar atsakingo specialisto profiliu. Viešų `/apie`, komandos ar projektų atvejų route'ų nėra. 170+ ir 12+ kartojami `StatsBar.tsx:77–78` ir `translations.ts:67–70`; galerijoje tik vaizdo pavadinimai, nėra datų / apimties / rezultato.

**Poveikis:** telefonas ir Facebook leidžia susisiekti, bet sunkiau atskirti ATD nuo bendro paslaugų prekės ženklo ir įvertinti skelbiamą patirtį. Tai redakcinė pasitikėjimo / GEO rekomendacija, ne schema validacijos klaida ar teiginys apie neteisėtą veiklą. 12+ neprieštarauja 2012 datai, tik yra konservatyvus, laike neprižiūrimas skaičius.

**Veiksmas:** kontaktuose įvardyti tikrą paslaugos teikėją ir atsakingą specialistą, viešą kontaktinę informaciją, patvirtintas veiklos ribas; pateikti kelis realius darbų atvejus su metodais ir rezultatais. Jei gatvės adresas nėra viešas lankymo taškas, jo nekurti ir miesto centro koordinatės nepaversti „biuro vieta“. GBP ir registrų atitikimą tikrinti su realiais savininko duomenimis. [Google helpful-content self-assessment](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### SEO-GEO-08 — P3: neparengtas socialinis vaizdas ir yra smulkių struktūrinių duomenų spragų

**Įrodymai:** `src/app/layout.tsx:41–46` ir visų route'ų openGraph neturi images; `public` / `src/app` nėra opengraph-image ar twitter-image failo. `src/lib/schemas.ts:30–35` paslaugų kataloge nėra tvenkinių; `src/app/paslaugos/tvenkiniai/page.tsx:29–30` visai nėra Service JSON-LD; kitose 4 paslaugose yra. `src/app/kontaktai/page.tsx:31` pakartoja tą pačią LocalBusiness schemą, kuri jau dedama `layout.tsx:60` su tuo pačiu @id. `schemas.ts:3–37` neturi openingHoursSpecification, nors valandos viešai rodomos.

**Poveikis:** dalijantis nuoroda prarandama kontrolė, kokį vaizdą rodys platforma; mašininis paslaugų katalogas dalinis. Pasikartojanti identiška entity paprastai nėra kritinė klaida, tačiau didina priežiūros kainą. Service schema nebuvimas nėra indeksavimo blokas ir nėra specialus Google GEO reikalavimas.

**Veiksmas:** vienas tikras ATD OG vaizdas su aiškiu fallback, prireikus atskiri paslaugų vaizdai; papildyti tvenkinio Service ir bendrą katalogą, įdėti patvirtintą darbo laiką, išvengti dubliavimo kontaktuose. Galima pridėti BreadcrumbList, kai yra vizualūs breadcrumb. Schema turi atkartoti realiai viešą turinį; nereikia kurti reitingų ar atsiliepimų.

**Patikra:** serverio HTML ir socialinių peržiūrų tikrinimas, JSON-LD parsavimas / Schema.org validacija, patvirtintų įmonės duomenų atitikimas. [Google LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).

### SEO-GEO-09 — P3: SEO specifikacijoje likęs nebegaliojantis FAQ rich-result tikslas

**Įrodymai:** `spec/03-seo-spec.md:294` tikrinimo punktas žada „FAQ rich snippet“. Oficialus Google 2026-05-08 atnaujinimas praneša, kad FAQ rezultatai neberodomi nuo 2026-05-07; 2026-06-15 dokumentacija pašalinta. Tai aktualiau nei senasis taisyklės supaprastinimas „tik valdžios ir sveikatos svetainėms“.

**Poveikis:** įgyvendinama ir matuojama funkcija, kuri Google paieškoje jau nebeegzistuoja. Esamas FAQPage JSON-LD vis dar gali būti Schema.org prasme taisyklingas, o DUK tekstas naudingas lankytojams.

**Veiksmas:** pakeisti spec sėkmės kriterijų į teisingą DUK turinį, prieinamą pateikimą ir schema atitikimą tekstui; neprioritetinti trūkstamos tvenkinių FAQ schemos kaip snippet augimo darbo. [Google documentation updates — May and June 2026](https://developers.google.com/search/updates).

## Kas jau gerai

- Visų 8 viešų route'ų canonical nurodo teisingą savo kelią `https://atd.lt` domene. Home canonical nėra globaliai primestas visoms paslaugoms. Produkcijos host / redirect ir galutinis Google pasirinkimas dar turi būti patikrinti.
- Visos paslaugos turi individualias LT antraštes ir aprašymus, aiškią vietą, konkrečias kainas ten, kur jos patvirtintos. Kontaktų telefonas, el. paštas ir darbo laikas tarp vartotojo teksto bei llms suderinti.
- Paslaugų kainų DUK yra konkretūs ir atsako į klausimą pirmu sakiniu: vejos kaina `translations.ts:102`, vejos darbų trukmė `:106`, grunto paruošimas `:108`, trinkelių kaina ir jos apimtis `:163`, laistymo biudžetas `:285`, kontaktų pasiūlymo terminas `:381`. Tokią aiškią kalbą verta išlaikyti; nereikia dirbtinai ilginti iki tariamo AI žodžių skaičiaus standarto.
- `buildFaqSchema.ts:10–17` nuosekliai surenka egzistuojančias q/a poras. Dabartiniuose LT duomenyse nėra numeracijos spragų: 4 paslaugos po 6 klausimus ir kontaktai 5. Kontaktų schema naudoja tuos pačius LT vertimus kaip UI, ne atskirai kopijuotą tekstą.
- FAQ atsakymai atsiranda paspaudus (`KontaktaiPage.tsx:337–349`, analogiškai paslaugose); jie nėra nuolat matomame HTML. Tai svarbu paprastiems JS nevykdantiems ištraukikliams, bet savaime neįrodo schema pažeidimo — atsakymai vartotojui pasiekiami. Native details / serverio HTML panelės galėtų sumažinti priklausomybę nuo JS.
- JSON-LD yra serverio route'ų / layout renderinamas, o ne po hydration įkeliamas effect. `SchemaOrg.tsx:5` išveda vietinius statinius objektus; šioje versijoje nematyti iš formos ar API teksto konstruojamos JSON-LD injekcijos.
- Map pavadintas aptarnaujama teritorija (`translations.ts:375–376`, iframe title `KontaktaiPage.tsx:291`), todėl generinis Vilniaus žemėlapis čia neturi būti neteisingai vadinamas „suklastotu biuro adresu“.
- Facebook nuoroda `sameAs` (`schemas.ts:14`) sutampa su naudota realia `RoberasATD.LT` paskyra; nepriskirti senam SESSION_LOG teiginiui apie sameAs nebuvimą dabartinės būsenos statuso.

## AI crawler ir agentų prieigos matrica

Tai vietinio robots failo analizė (`public/robots.txt:1–23`), ne produkcinio WAF / tikro bėgančio boto matavimas.

| Agentas / token | Paskirtis | Vietinė politika |
|---|---|---|
| Googlebot | Google Search, įskaitant paieškos AI šaltinių techninį pagrindą | Leidžiamas per `*`; `/api/` draudžiamas |
| OAI-SearchBot | ChatGPT paieškos šaltiniai | Leidžiamas per `*`; `/api/` draudžiamas |
| PerplexityBot | Perplexity paieška | Aiški Allow `/` grupė |
| Claude-SearchBot | Claude paieškos indeksavimas | Leidžiamas per `*`; `/api/` draudžiamas |
| Applebot | Apple paieškos funkcijos | Leidžiamas per `*`; `/api/` draudžiamas |
| GPTBot | Galimas OpenAI modelių mokymas | Aiški Allow `/` grupė |
| ClaudeBot | Galimas Anthropic modelių mokymas | Aiški Allow `/` grupė |
| CCBot | Bendras crawl / mokymui naudojami duomenys | Leidžiamas per `*`; `/api/` draudžiamas; šios platformos atskiras faktinis naudojimas netikrintas |
| Google-Extended | Gemini mokymo ir konkrečių Gemini grounding naudojimų valdymo token | Aiški Allow `/`; nekeičia Google Search įtraukimo ar reitingo |
| Applebot-Extended | Apple foundation modelių mokymo valdymo token | Aiški Allow `/`; tai nėra atskiras crawl / paieškos reitingo leidimas |
| ChatGPT-User | Vartotojo paprašytas paėmimas | Vietiniame faile nesublokuotas; tiekėjas nurodo, kad robots taisyklės gali nebūti taikomos |
| Perplexity-User | Vartotojo paprašytas paėmimas | Vietiniame faile nesublokuotas; tiekėjas nurodo paprastai ignoruojantis robots šiam režimui |
| Claude-User | Vartotojo paprašytas paėmimas | Leidžiamas per `*`; Anthropic nurodo gerbiantis robots |

`OAI-SearchBot` ar `Claude-SearchBot` atskirų grupių nebuvimas nėra blokavimas. Specifinės Allow `/` grupės neperima `*` grupės `/api/` draudimo; jeigu to draudimo norima visiems crawler'iams, kartoti ir specialiose grupėse. Tai P3 politikos nuoseklumo smulkmena, ne lead API apsauga — robots nėra autentifikacija. Mokymo politikos nekeisti tyliai: ji nėra būtina paieškos leidimui.

Šaltiniai, patikrinti 2026-10-17: [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html), [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Google crawler tokens](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Applebot](https://support.apple.com/en-us/119829).

## Agentų naudojimas ir discovery

| Sritis | Nustatyta iš šaltinio | Vertinimas / kas liko |
|---|---|---|
| Formos laukai | `KontaktaiPage.tsx:163–201` turi label/htmlFor, vardą, tel, email, paslaugą, plotą ir žinutę | Geras semantinis pagrindas; tikro accessibility tree / klaviatūros testas priklauso bendram auditui |
| Siuntimo būsena | `:145–153` sėkmės tekstas, `:205–216` klaida / loading; nėra role=status / role=alert / aria-live | P2 prieinamumo rekomendacija: būsenos keitimą patikimai paskelbti skaitytuvui / agentui; siuntimo patvirtinimas svarbesnis už WebMCP |
| Modalas | `DarbaiPage.tsx:222–264` lightbox neturi dialog role / aria-modal, escape / focus logikos | Perduota UI / kodo auditui; svarbu ir browser agentams, ne vien žmonėms |
| llms.txt | Yra | Pataisyti faktus (06); ne Google reikalavimas |
| Markdown pristatymas | Nėra .md route / text/markdown / Vary: Accept realizacijos šaltinyje | Neprivalomas pagerinimas, ne paleidimo defektas; production content negotiation netikrinta |
| ai-catalog.json / .well-known agent discovery | Nerasta tarp viešų failų / route'ų | Svetainė neteikia agentų produktų ar viešos įrankių platformos; nereikia dėl „GEO balo“ |
| WebMCP | Nėra registerTool / modelContext ar form annotation | Pasirenkamas, kintančio standarto pagerinimas; nesiūlyti kaip būtinos SEO infrastruktūros |
| Content-Signal | Nėra robots faile | Pasirenkama siūloma politika, ne RFC 9309 direktyva ir ne Google reitingavimo signalas |
| WAF / CAPTCHA | Nematuota | Neprilyginti web įrankio pasiekiamumo klaidos tikro bot IP blokui; tikrinti production logus ir oficialius IP |
| Neegzistuojantys URL / statusai | Nėra catch-all App route kodo; runtime čia netikrintas | Patikrinti tikrą 404, taip pat neegzistuojančius llms / katalogo failus. Kodo nebuvimas negarantuoja edge elgesio |

Šiam paslaugų verslui pirmiausia reikia stabilios matomos svetainės, aiškių vardų, nuorodų, formos būsenų ir tikrų faktų. Technologiniai discovery priedai neturi užgožti šių darbų.

## GEO turinys ir tolesnis matavimas

Google AI Overviews / AI Mode, ChatGPT ir Perplexity matomumas: **nematuotas kiekvienoje platformoje**. Jokie procentai, pozicijos ar platformų balai nepateikiami. Wikipedia, Reddit, YouTube, LinkedIn paminėjimai netirti; nerastos nuorodos audituotame kode neįrodo, kad paminėjimų internete nėra. Nerekomenduojama kurti dirbtinių Wikipedia / Reddit paminėjimų.

Svarbiausi naudingi pakeitimai: patvirtintas portfolio, matomas homepage turinys, tvarkingi migravimo tikslai, visi route'ai sitemap, aiški EN strategija, vienodi verslo faktai. Homepage galima pridėti trumpą tikrą ATD pristatymą, penkių paslaugų santrauką su nuorodomis, patvirtinto darbo mini atvejį ir sąlygas, kuo remiasi „nemokama apžiūra / nuo ...“ pažadas. Specialistui priskirtas paaiškinimas būtų naudingesnis už bendrą straipsnį.

Turinio redagavimo pavyzdžiai be naujų faktų:

- Vietoj nepatvirtinto „Realūs ATD projektai“ naudoti „Paslaugų ir darbų pavyzdžiai“ tik tada, kai aiškiai atskiriama, kurie vaizdai iliustraciniai; patvirtinimą pakeisti tikru objekto aprašymu.
- `llms.txt:16` suderinti su dabar patvirtinta aptarnavimo zona „Vilnius ir Vilniaus rajonas. Dideliems projektams — visa Lietuva“, jeigu šis bendras didelių projektų pažadas galioja visoms paslaugoms.
- Išlaikyti aiškią `translations.ts:108` kainos apimties logiką: standartinis paruošimas įeina, papildomas gruntas / drenažas atskirai. Konkrečioms kainoms pridėti paskutinės kainų peržiūros datą tik ją patvirtinus.

Po produkcinio paleidimo: GSC patikrinti canonical ir indeksavimą visiems 8 URL; pateikti sitemap; peržiūrėti tikrą migravimo URL sąrašą; GBP patikrinti subjektą / tel / aptarnavimo zoną / darbo laiką; AI platformų citatas matuoti iš užfiksuotų klausimų, datos, vietos, kalbos ir gautų nuorodų. Vienas atsakymas iš vieno pokalbio nėra universali matomumo statistika. SEO / GEO rekomendacijos nežada reitingų ar citatų prieaugio.
