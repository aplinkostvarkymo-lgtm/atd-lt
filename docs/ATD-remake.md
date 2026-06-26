# ATD-remake — Pradžios taškas
*Versija 1.0 — laukiama atsakymo apie kainų formavimo logiką, kad užbaigtume AI kalkuliatoriaus sekciją*

---

## 1. Projekto esmė

**Tikslas:** Sukurti geriausią aplinkos tvarkymo svetainę Lietuvoje. Ne "modernesnę negu šiandien" — o etaloną, kurį norėtų nukopijuoti konkurentai.

**Kodėl tai įmanoma dabar:** Visi lietuviški konkurentai kala į tą pačią pelkę — sąrašas + telefonas + senų nuotraukų galerija. Nė vienas neturi veikiančio AI kalkuliatoriaus, tikro lead capture funnel, ar LLM optimizavimo. Rinka neapsaugota.

**Pagrindiniai skirtumai nuo konkurentų:**
- Puslapis veikia kaip **sales machine**, ne kaip vizitinė kortelė
- AI kalkuliatorius generuoja realius pasiūlymus — ne tik "skambinkite mums"
- Optimizuotas LLM indeksavimui (AEO + GEO) — AI modeliai žinos ir rekomenduos atd.lt
- Dizainas fotografijų kokybės lygio — rodomas darbas, ne pasakojama apie darbą

---

## 2. Tikslinė auditorija

**Pirminė (70%):** Privati moteris, ~35–55 m., Vilnius ir apylinkės. Turi namą ar kotedžą. Nori sutvarkytos aplinkos, bet neturi laiko ir nenori galvoti apie procesą — nori rezultato. Sprendimą priima emociškai (vizualiai), racionaliai patvirtina (kaina, patikimumas).

**Antrinė (30%):** NT vystytojas, projektų vadovas, architektas. Gauna želdynų projektą iš architekto, ieško rangovų. Jam svarbu: ar gali dirbti su projektine dokumentacija, ar žino ką daro, ar patikimas.

**Dizaino implikacija:** Hero sekcija ir vizualai kalbasi su moterimis. Kalkuliatorius ir projektinės dokumentacijos upload — NT vystytojams. Abu tame pačiame puslapyje, bet skirtingose vietose.

---

## 3. Prioritetinės paslaugos

| Paslauga | Prioritetas | Kalkuliatorius |
|---|---|---|
| Vejos įrengimas | ⭐⭐⭐ | Paprastas (m²) |
| Apželdinimas pagal projektą | ⭐⭐⭐ | AI (PDF+Excel upload) |
| Trinkelių/takų įrengimas | ⭐⭐⭐ | Paprastas (m²) |
| Tvenkinių kasimas | ⭐⭐ | Forma (matmenys) |
| Žemės darbai | ⭐ | Tik paminėti |
| Kitos | — | Tik sąraše |

---

## 4. Sitemap

```
atd.lt/
├── / (Pagrindinis)
├── /paslaugos/
│   ├── /veja              (Vejos įrengimas)
│   ├── /apzeldinimas      (Apželdinimas pagal projektą)
│   ├── /trinkelės         (Trinkelių įrengimas)
│   └── /tvenkiniai        (Tvenkiniai)
├── /darbai                (Portfolio / Before & After)
├── /kaina                 (Kalkuliatoriai)
├── /apie                  (Apie mus)
├── /kontaktai
├── /llms.txt              (LLM indeksavimui)
└── /sitemap.xml
```

---

## 5. Pagrindinio puslapio struktūra (sekcijos)

### 5.1 Hero
- Pilno ekrano vaizdo įrašas arba parallax nuotrauka (prieš/po)
- H1: `Aplinkos tvarkymas Vilniuje — nuo eskizo iki rezultato`
- Subheadline: `Veja, apželdinimas, trinkelės. Dirbame su projektine dokumentacija.`
- Du CTA: `[Gauti preliminarią kainą]` → kalkuliatorius | `[Žiūrėti darbus]` → portfolio
- Statistikos juosta: X+ atliktų projektų · X+ patenkintų klientų · X metų patirtis

### 5.2 Paslaugos (vizualios kortelės)
4 kortelės su hover efektu, kiekviena → sava paslauga. Nuotrauka + pavadinimas + 1 sakinys + rodyklė.

### 5.3 Kaip tai veikia (3 žingsniai)
`Aprašai → Suskaičiuojame → Įgyvendiname`
Vizualus, paprastas. Skirtas moteriškam segmentui — pašalina baimę "ar sudėtinga pradėti".

### 5.4 Kalkuliatoriai (CRITICAL sekcija)
Žr. skirsnį 6.

### 5.5 Portfolio (Before & After)
- Slider arba grid su prieš/po nuotraukomis
- Filtravimas pagal paslaugos tipą
- Kiekvienas projektas: vieta, plotas, trukmė (be kainos)

### 5.6 Atsiliepimai (Social proof)
- Google Reviews embed arba screenshotai
- Nuoroda į FB grupę (3000 sekėjų — tai svarbus socialinis įrodymas)

### 5.7 FAQ + Chatbot (viename bloke)
DUK accordion + chatbot šalia. Žr. skirsnį 7.

### 5.8 CTA bloko pabaiga
`Paruošta pradėti? → [Gauti kainą]`

### 5.9 Footer
Kontaktai, darbo laikas, socialiniai tinklai, schema.org žymėjimas (paslaugų sritis, tipas, kontaktai).

---

## 6. AI Kalkuliatoriai — du režimai

### REŽIMAS A: Mažas projektas (vejos įrengimas, trinkelės)

**Naudotojas:** Namų savininkas, žino plotą arba gali įvesti matmenis.

**UX flow:**
1. Pasirinks paslauga → forma atsidaro inline
2. Įveda: plotas (m²), esamas paviršius (žolė/gruntas/betonas), pageidavimai
3. **Momentinis kainų intervalas** atsiranda puslapyje: `Vejos įrengimas ~X–Y €`
4. CTA: `[Užsakyti apžiūrą]` → mini forma su vardas + tel. + data
5. Automatiškai siunčiamas el. laiškas Robertui + klientui (per Zapier)

**Techniškai:**
- React komponentas su Cursor
- Kainų logika: konfigūruojamas JSON objektas (Robertas pats atnaujina kainas)
- Zapier webhook → Airtable + el. laiškas

### REŽIMAS B: Didelis projektas (apželdinimas pagal projektą)

**Naudotojas:** NT vystytojas, architektas arba privatus klientas su projektu.

**UX flow:**
1. Klientas įkelia PDF (želdynų planas) + Excel (kiekiai)
2. Rodoma: `"Jūsų projektas analizuojamas... ~60 sek."`
3. AI (Claude Sonnet per Anthropic API) nuskaito dokumentus, identifikuoja:
   - Augalų sąrašą su kiekiais
   - Dirvožemio medžiagas su kiekiais
   - Darbo kiekius (m², vnt., m)
4. Sugeneruoja **preliminarų kainų pasiūlymą** (lentelė: pozicija + kiekis + vnt. kaina + suma)
5. **Siunčiama Robertui** → jis peržiūri, koreguoja, patvirtina
6. **Klientas gauna** PDF pasiūlymą el. paštu

**Techniškai:**
- File upload komponentas (Next.js API route)
- Claude API: `claude-sonnet-4-20250514` su PDF + Excel kaip dokumentais
- System prompt: apmokomas pagal Roberto istorinių kainų duomenis (žr. žemiau)
- Zapier: trigger → Airtable įrašas → el. laiškas Robertui su review link → klientui patvirtinimas

**AI kalkuliatoriaus logika — PATVIRTINTA:**

Robertas gauna iš tiekėjų didelius kainų failus (Excel/CSV, dešimtys tūkstančių augalų pozicijų). Kiekvienam projektui jis rankiniu būdu ieško reikiamų augalų tame faile. Jei neranda — teikia užklausą tiekėjui atskirai.

**Sistema veikia taip (3 sluoksniai):**

**1 sluoksnis — Tiekėjų kainų duomenų bazė (Airtable)**
- Robertas įkelia tiekėjų kainų failus į Airtable (vienkartinis setup, periodiškai atnaujinama)
- Lentelė: `Lot. pavadinimas | LT pavadinimas | Kaina € | Tiekėjas | Data`
- Lotyniškai pavadinimai — tai raktas, nes projektuose augalai žymimi lot. vardais (kaip matėme Excel faile)

**2 sluoksnis — Claude kaip matching engine**
Kai klientas įkelia projektą:
1. Claude nuskaito kliento Excel → ištraukia `{Lot. pavadinimas, kiekis, parametrai}`
2. Claude ieško kiekvieno augalo Airtable kainų bazėje (fuzzy match pagal lot. pavadinimą)
3. Grąžina tris kategorijas:
   - ✅ **Rastas** → automatinė kaina × kiekis
   - ⚠️ **Rastas dalinai** (pvz., skirtingas konteineris/dydis) → Claude siūlo artimiausią, pažymi "peržiūrėti"
   - ❌ **Nerastas** → pažymimas raudonai "reikia užklausos tiekėjui"

**3 sluoksnis — Roberto review**
- Robertas gauna el. laišką su nuoroda į review puslapį
- Mato lentelę: ✅ automatinės + ⚠️ siūlomos + ❌ trūkstamos
- Koreguoja kainas, užpildo trūkstamas
- Paspaudžia "Siųsti klientui" → generuojamas PDF pasiūlymas

**Techninis sprendimas:**
```
Klientas įkelia PDF + Excel
    ↓
Next.js API route → Claude Sonnet (dokumentų analizė)
    ↓
Airtable API → augalų kainų paieška
    ↓
Claude → matched/unmatched sąrašas + preliminari suma
    ↓
Airtable → naujas projekto įrašas
    ↓
Zapier → el. laiškas Robertui (review link)
    ↓
Robertas koreguoja → patvirtina
    ↓
Zapier → PDF generavimas → el. laiškas klientui
```

**Kodėl lot. pavadinimai yra stiprybė:** Beveik visi projektuose vartojami lot. pavadinimai (Betula pendula, Acer platanoides ir t.t.) — tai standartizuotas formatas, kurį Claude atpažįsta labai tiksliai net su rašybos klaidomis ar sutrumpinimais. Matching tikslumas bus aukštas.

---

## 7. Chatbot

**Tikslas:** Kvalifikuoti leadus ir atsakyti DUK 24/7. Ne "cute gimmick" — tikras darbo įrankis.

**Sprendimas:** Claude Sonnet per Anthropic API — integruotas tiesiai į svetainę (ne trečia šalis).

**Chatbot moka:**
- Atsakyti į DUK (paslaugos, kainos intervalai, darbo laikas, aptarnavimo rajonas)
- Paklausti klientą: plotas? vieta Vilniuje? biudžeto intervalas? terminas?
- Pagal atsakymus nukreipti į tinkamą kalkuliatorių arba pasiūlyti skambutį
- Lietuvių kalba; gali suprasti ir anglų/rusų (AEO naudai)

**Ko chatbot NEDARO:**
- Nesikalbėja apie konkurentus
- Neduoda tikslių kainų (tik intervalų)
- Neatsako į klausimus ne apie ATD paslaugas

**Techniškai:**
- React chatbot komponentas (Cursor)
- Claude API su system prompt (Roberto paslaugos, kainų intervalai, DUK)
- Pokalbio istorija — localStorage arba Airtable
- Kiekvienas pokalbis, kuriame klientas palieka kontaktus → Airtable + Zapier → Robertui

---

## 8. LLM Optimizavimas (AEO + GEO)

Tai yra didžiausias strateginis pranašumas — **nė vienas lietuvaičių konkurentas to nedaro.**

### 8.1 llms.txt
Failas `/llms.txt` pagrindiniame kataloge — struktūruotas aprašas svetainės turinio LLM modeliams.

```
# ATD — Aplinkos Tvarkymas Vilnius

> Profesionali aplinkos tvarkymo ir apželdinimo įmonė Vilniuje ir Vilniaus rajone. 
> Specializacija: vejos įrengimas, apželdinimas pagal projektą, trinkelių klojimas, tvenkiniai.
> Dirba su architektų želdynų projektais ir projektine dokumentacija (PDF, Excel specifikacijos).

## Paslaugos
- Vejos įrengimas ir priežiūra (Vilnius, Vilniaus rajonas)
- Apželdinimas pagal projektą (augalų pirkimas ir sodinimas)
- Trinkelių ir takų įrengimas
- Tvenkinių kasimas ir įrengimas

## Kontaktai
- Tel: +370 657 85096
- El. p.: Robertas@atd.lt
- Aptarnavimo zona: Vilnius ir Vilniaus rajonas

## Kainų informacija
[Nuoroda į kalkuliatorių]
```

<!-- Šio dokumento kainų pavyzdžiai (čia ir kitur, pvz. "~X–Y €" sekcijoje 3) yra placeholder'iai/planavimo medžiaga.
     Tikras šaltinis kainoms visada: src/lib/translations.ts -->


### 8.2 Schema.org žymėjimas (JSON-LD)
Kiekviename puslapyje:
- `LocalBusiness` su aptarnavimo zona, darbo laiku, kontaktais
- `Service` kiekvienai paslaugai su aprašymu ir kainų intervalais
- `FAQPage` DUK sekcijoje
- `Review` / `AggregateRating` iš Google Reviews

### 8.3 Semantinis turinys
Kiekvienas paslaugos puslapis turi:
- Ilgas, detalus aprašymas lietuviškai (1000–1500 žodžių)
- DUK sekciją su schema.org žymėjimu
- Kainų intervalus (ne "skambinkite" — tikros skaičiaus)
- Aptarnavimo rajonų sąrašą (Vilnius, Vilniaus rajonas, konkretūs mikrorajonai)

### 8.4 Robots.txt
Leidžia visiems AI crawleriams: GPTBot, ClaudeBot, PerplexityBot, Google-Extended.

### 8.5 Canonical + hreflang
Tik LT versija — `hreflang="lt"`. Aiški signalizacija Google ir LLM modeliams.

---

## 9. Techninė architektūra

### Stack
| Komponentas | Technologija | Priežastis |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSG/SSR → SEO + greitis |
| Hosting | Vercel | Tavo stack, automatinis deploy |
| Styling | Tailwind CSS | Greitas, švarus |
| Kalkuliatorius | React + Anthropic API | Claude Sonnet tiesiogiai |
| Chatbot | React + Anthropic API | Tas pats modelis |
| File upload | Next.js API routes | PDF + Excel priėmimas |
| Automatizacija | Zapier | Tavo stack |
| Duomenų bazė | Airtable | Tavo stack — leadai, projektai |
| Versijų kontrolė | GitHub | Tavo stack |
| Shadow dev | Atskira Vercel deployment | Kol sena veikia |

### Shadow režimas
1. Nauja svetainė → `new.atd.lt` (privati Vercel deployment)
2. Testuojama, tobulinama
3. Kai paruošta → DNS perjungimas → `atd.lt` rodo naują
4. Sena išlieka `old.atd.lt` atsarginė

### API Architecture
```
Klientas
  ↓
Next.js API route (/api/calculate)
  ↓
Claude Sonnet API (PDF + Excel parsing + kainų skaičiavimas)
  ↓
Airtable (įrašas)
  ↓
Zapier (trigger)
  ↓
El. laiškas Robertui + klientui
```

---

## 10. Claude Skills, Artifacts, Connectors

### Cursor (kūrimo metu)
- **Claude kaip pair programmer:** Visi komponentai rašomi su Claude in Cursor
- Naudoti `claude-sonnet-4-20250514` — greitis + kokybė
- Kiekvienas komponentas — atskiras Cursor conversation su kontekstu

### Claude Artifacts (svetainėje)
- **AI kalkuliatorius** — React artifact kaip inline komponentas
- **Chatbot** — React artifact su streaming atsakymais
- Abu naudoja `claude-sonnet-4-20250514` per Anthropic API

### Connectors / Integrations
| Įrankis | Naudojimas |
|---|---|
| Zapier | Kalkuliatoriaus submit → Airtable → el. laiškas |
| Airtable | Leadų saugojimas (vardas, tel., paslauga, kaina, statusas) |
| Anthropic API | Kalkuliatorius + chatbot |
| Vercel Analytics | Puslapio analitika |
| Google Search Console | SEO stebėjimas |

### Claude Skills (pridėti į šį projektą)
- `frontend-design` skill — naudoti kuriant vizualius komponentus
- `docx` skill — generuojant PDF pasiūlymus (arba html→pdf)
- `pdf` skill — skaitant kliento įkeltus projektus

---

## 11. Vizualinis dizaino stilius

**Referentai (tavo pasirinkti):**
- **highlandslandscaping.com** — sales engine struktūra, aiški navigacija
- **huntergreen.nyc** — švarus, premium, daug whitespace
- **adamrobinsondesign.com** — portfolio centrinė vieta, vizualus storytelling
- **jml-landscapes.com** — profesionalus, B2B friendly

**ATD dizaino principai:**
- **Spalvos:** Žalia (#2D5016 arba tamsesnė) + balkšva/cream + juoda. Ne ryškiai žalia — tamsiai, brandžiai.
- **Tipografija:** Serif antraštės (Playfair Display arba lygiavertis) + sans-serif tekstas (Inter)
- **Nuotraukos:** Tavo nuotraukos — didelės, drąsios, pilno ekrano. Tai tavo stiprybė.
- **Animacijos:** Subtilios — scroll-triggered fade-in, ne agresyvus. Moteriškai auditorijai — ramumas.
- **Mobile first:** 76% lankytojų moterys → didelė tikimybė, kad naršo iš telefono

---

## 12. Darbų planas (2–3 savaitės)

### Savaitė 1 — Pagrindai
- [ ] Next.js projektas, GitHub repo, Vercel deployment (new.atd.lt)
- [ ] Dizaino sistema: spalvos, tipografija, komponentų biblioteka (Tailwind)
- [ ] Hero sekcija + navigacija
- [ ] Paslaugų kortelės
- [ ] Portfolio/darbų puslapis (nuotraukų galerija)

### Savaitė 2 — Core funkcionalumas
- [ ] Paprastas kalkuliatorius (Režimas A — veja, trinkelės)
- [ ] AI kalkuliatorius (Režimas B — PDF/Excel upload → Claude API)
- [ ] Airtable struktūra: Leads table, Projects table
- [ ] Zapier automation: submit → Airtable → el. laiškas
- [ ] Kontaktų forma

### Savaitė 3 — AI + Optimizavimas
- [ ] Chatbot integravimas (Claude API)
- [ ] llms.txt sukūrimas
- [ ] Schema.org žymėjimas visuose puslapiuose
- [ ] FAQ sekcija su schema.org
- [ ] SEO: meta tags, OpenGraph, sitemap.xml
- [ ] Testavimas mobile
- [ ] DNS perjungimas → atd.lt

---

## 13. Atviri klausimai (reikia atsakymų)

1. **Tiekėjų kainų failai:** Kokiu formatu gauni iš tiekėjų — Excel, CSV, PDF? Ar yra keletas skirtingų tiekėjų su skirtingais formatais? → Lems Airtable import pipeline sudėtingumą
2. **Antkainis:** Ar augalų kaina klientui = tiekėjo kaina × koeficientas (pvz. ×1.3), ar kiekvienas augalas kainuoja skirtingai? Tai svarbu automatinio skaičiavimo tikslumui.
3. **El. pašto sistema:** Kur šiandien eina formos iš atd.lt? Gmail? → Zapier integracijai
4. **Nuotraukų formatas:** Ar nuotraukos jau optimizuotos (WebP), ar reikės konvertuoti?

---

*Failas bus atnaujinamas kai gausite atsakymus į aukščiau pateiktus klausimus.*
