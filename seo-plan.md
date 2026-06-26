# ATD.lt — SEO Strateginis Planas
*Versija 1.0 · 2026-06-11 · Lokalus verslas, Vilnius*

---

## 1. Kontekstas ir tikslai

**Verslas:** ATD — aplinkos tvarkymo paslaugos Vilniuje  
**Auditorija:** Vilniaus privatūs namų savininkai, NT valdytojai, biurų parkai  
**Pagrindinis tikslas:** Top-3 pozicijos „Google" Vilniaus rinkoje pagrindinėms paslaugų paieškoms  
**KPI:** organinis srautas, skambučiai iš paieškos, užklausų formos

---

## 2. Konkurentų žvalgyba (Vilnius)

| Konkurentas | Stiprybės | Silpnybės |
|---|---|---|
| tvarkyba.lt | Senas domenas, daug puslapių | Lėtas, senas dizainas |
| aplinkos-tvarkymas.lt | Vietinės citatos | Mažai turinio, nėra blog'o |
| sodinta.lt | Augalų prekyba stipri | Nesispecializuoja apželdinime |
| sodo-pasaulis.lt | E-commerce augalai | Nėra paslaugų puslapių |
| zalumos.lt | Geras GBP profilis | Silpnas techninis SEO |

**Galimybė:** Niekas iš konkurentų neturi modernios, greitos Next.js svetainės su struktūruotais duomenimis. ATD gali dominuoti techniškai ir turinio kokybe.

---

## 3. Raktažodžių strategija

### Pagrindinis klasteris — Vilnius + paslauga

| Puslapis | Pagrindinis raktažodis (LT) | Papildomi raktažodžiai | Mėn. paieškos* |
|---|---|---|---|
| `/` | aplinkos tvarkymas Vilnius | aplinkos tvarkymo įmonė Vilnius, sodų priežiūra Vilnius | ~500 |
| `/paslaugos/apzeldinimas` | apželdinimas Vilnius | teritorijos apželdinimas, augalų sodinimas Vilnius | ~300 |
| `/paslaugos/veja` | vejos įrengimas Vilnius | ruloninė veja Vilnius, vejų sėjimas kaina | ~400 |
| `/paslaugos/laistymas` | laistymo sistemos Vilnius | automatinė laistymo sistema, lauko laistymas kaina | ~250 |
| `/paslaugos/trinkelės` | trinkelių klojimas Vilnius | takai sode, trinkelės kaina Vilnius | ~350 |
| `/paslaugos/prekyba-augalais` | augalų prekyba Vilnius | sodo augalai Vilnius, dekoratyviniai augalai | ~200 |
| `/darbai` | apželdinimo darbai nuotraukos | sodų projektai Vilnius, aplinkos tvarkymo darbai | ~150 |
| `/patarimai` | sodo priežiūra patarimai | kaip įrengti veją, augalų sodinimas kada | ~600 |
| `/kontaktai` | aplinkos tvarkymas kontaktai | ATD Vilnius, apželdinimo įmonė kontaktai | — |

*\*Apytiksliai, be DataForSEO duomenų — tikslinti po integracijos*

### Ilgosios uodegos raktažodžiai (blog/patarimai)

- „ruloninė veja kaina Vilnius"
- „kaip pasirinkti augalus šešėliui"
- „trinkelių klojimas kaina m2"
- „automatinė laistymo sistema namuose"
- „apželdinimas po statybų"
- „vejų priežiūra rudenį"

---

## 4. Svetainės architektūra

```
atd.lt/
├── /                          ← Homepage (pagrindinis)
├── /paslaugos/
│   ├── /apzeldinimas          ← Apželdinimas
│   ├── /veja                  ← Vejos įrengimas
│   ├── /laistymas             ← Laistymo sistemos
│   ├── /trinkelės             ← Takai, trinkelės
│   └── /prekyba-augalais      ← Prekyba augalais
├── /darbai                    ← Atlikti darbai (portfolio)
├── /patarimai                 ← Naudingi patarimai (blog)
│   └── /patarimai/[slug]      ← Atskiri straipsniai
├── /kontaktai                 ← Kontaktai
├── /apie                      ← Apie mus (sukurti vėliau)
└── /kaina                     ← Kainų skaičiuoklė (sukurti vėliau)
```

### Vidiniai nuorodos srautai

```
Homepage → visos paslaugos (hotspot'ai)
Kiekviena paslauga → /kontaktai + /darbai
/darbai → susijusios paslaugos
/patarimai/[slug] → susijusi paslauga
/kontaktai → /kaina (CTA)
```

---

## 5. Puslapių planai

---

### 5.1 Homepage `/`

**Tikslas:** Vilniaus aplinkos tvarkymo paieškų pagrindinė pozicija

**Title tag:** `Aplinkos tvarkymas Vilniuje | Veja, apželdinimas, trinkelės – ATD`  
**Meta description:** `ATD – Vilniaus aplinkos tvarkymo specialistai. Vejos įrengimas nuo 8 €/m², apželdinimas, laistymo sistemos, trinkelės. 170+ projektų. Nemokama apžiūra.`  
**H1:** `Apželdinimo ir aplinkos tvarkymo paslaugos Vilniuje`

**Schema:**
```json
{
  "@type": "LocalBusiness",
  "name": "ATD — Aplinkos tvarkymas",
  "url": "https://atd.lt",
  "telephone": "+37065785096",
  "address": { "@type": "PostalAddress", "addressLocality": "Vilnius", "addressCountry": "LT" },
  "areaServed": ["Vilnius", "Vilniaus rajonas"],
  "openingHours": "Mo-Fr 08:00-18:00",
  "priceRange": "€€",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "47" }
}
```

**Sekcijų prioritetai:**
1. GardenSceneHero — video intro + hotspot'ai
2. StatsBar — „170+ projektų", „8 €/m²", „Nemokama apžiūra"
3. ServicesAccordion — visos paslaugos su kainomis
4. BeforeAfterSlider — prieš/po nuotraukos
5. Testimonials — Google atsiliepimai
6. FAQ — 5 dažniausiai klausiami klausimai
7. FinalCTA — forma + tel. numeris

---

### 5.2 Apželdinimas `/paslaugos/apzeldinimas`

**Title tag:** `Apželdinimas Vilniuje | Augalų sodinimas pagal projektą – ATD`  
**Meta description:** `Teritorijos apželdinimas Vilniuje – augalų parinkimas, sodinimas, priežiūra. Dirbame pagal projektinę dokumentaciją. Gauti pasiūlymą →`  
**H1:** `Teritorijos apželdinimas Vilniuje`

**Turinio blokai:**
- Kas įeina į apželdinimą (augalų parinkimas, sodinimas, mulčiavimas)
- Apželdinimo etapai (projektas → parinkimas → sodinimas → priežiūra)
- Augalų tipai (medžiai, krūmai, daugiamečiai, sezoniniai)
- Kainodara (€/m² arba €/projektas)
- 3-5 nuotraukos iš atlikti darbų
- FAQ: „Kada geriausia sodinti?", „Kiek laiko trunka apželdinimas?"
- CTA: nemokama apžiūra forma

**Schema:** `Service` + `LocalBusiness`  
**Vidinės nuorodos:** → /darbai, → /patarimai (sodinimo patarimai), → /kontaktai

---

### 5.3 Vejos įrengimas `/paslaugos/veja`

**Title tag:** `Vejos įrengimas Vilniuje | Ruloninė nuo 8 €/m² – ATD`  
**Meta description:** `Ruloninė veja nuo 8 €/m², sėjama nuo 4 €/m². Grunto paruošimas, laistymo sistema, garantija. Vilnius ir rajonas. Skaičiuoklė →`  
**H1:** `Vejos įrengimas Vilniuje — ruloninė ir sėjama`

**Turinio blokai:**
- Ruloninė vs sėjama veja (palyginimo lentelė)
- Proceso etapai (grunto paruošimas → sėjimas/rolinas → pirmos priežiūros instrukkcijos)
- Kainų lentelė (m², grunto paruošimas, priežiūros pasiūlymas)
- Skaičiuoklė (plotas × kaina) — susieti su `/kaina`
- Sezonas: kada įrengti (balandis–rugsėjis)
- Nuotraukos: prieš/po
- FAQ: „Kiek laiko auga ruloninė veja?", „Kada galima vaikščioti?"

**Schema:** `Service`, kaina range  
**Vidinės nuorodos:** → /paslaugos/laistymas (rekomenduojama kartu), → /darbai

---

### 5.4 Laistymo sistemos `/paslaugos/laistymas`

**Title tag:** `Automatinės laistymo sistemos Vilniuje | Įrengimas – ATD`  
**Meta description:** `Automatinės laistymo sistemos įrengimas Vilniuje. Hunter, Rain Bird įranga. Programuojamas laikmatis, drėgmės jutiklis. Kaina pagal plotą →`  
**H1:** `Automatinės laistymo sistemos įrengimas Vilniuje`

**Turinio blokai:**
- Sistemos tipai (pop-up purškikliai, lašelinis laistymas, mikrolaistymas)
- Įrengiamo proceso žingsniai
- Naudojama įranga (Hunter / Rain Bird — brandai veikia SEO)
- Priežiūra: žieminimo paslauga
- Kaina: nuo X € (100 m² sodui)
- FAQ: „Ar verta automatinė sistema?", „Kiek sunaudoja vandens?"

**Schema:** `Service`  
**Vidinės nuorodos:** → /paslaugos/veja (kompleksas), → /patarimai (laistymo patarimai)

---

### 5.5 Takai, trinkelės `/paslaugos/trinkelės`

**Title tag:** `Trinkelių klojimas Vilniuje | Takai, aikštelės nuo 25 €/m² – ATD`  
**Meta description:** `Trinkelių klojimas Vilniuje – takai, automobilių aikštelės, terasos. Betono, natūralaus akmens trinkelės. Nuo 25 €/m². Gauti kainą →`  
**H1:** `Trinkelių klojimas ir takai Vilniuje`

**Turinio blokai:**
- Trinkelių tipai (betoninės, granito, klinkerinės, natūralus akmuo)
- Pagrindo paruošimas (skaldos sluoksniai, smėlio lova)
- Kainodara: kaina/m² pagal trinkelių tipą
- Projektų galerija
- FAQ: „Koks trinkelių tarnavimo laikas?", „Ar reikia leidimo takams?"

**Schema:** `Service`  
**Vidinės nuorodos:** → /darbai, → /kontaktai

---

### 5.6 Prekyba augalais `/paslaugos/prekyba-augalais`

**Title tag:** `Augalų prekyba Vilniuje | Dekoratyviniai augalai sodui – ATD`  
**Meta description:** `Sodo augalai Vilniuje — medžiai, krūmai, daugiamečiai gėlės. Parenkame pagal vietą ir stilių. Pristatymas ir sodinimas. Žiūrėti asortimentą →`  
**H1:** `Dekoratyvinių augalų prekyba Vilniuje`

**Turinio blokai:**
- Augalų kategorijos (spygliuočiai, lapuočiai, krūmai, daugiamečiai, sezoniniai)
- Augalų parinkimo konsultacija
- Pristatymas ir sodinimas
- Sezoniniai augalai (pavasaris, ruduo — raktažodžiai)
- Dažniausi klausimai apie augalų priežiūrą

**Schema:** `Service` + `Product` (jei bus konkretūs augalai su kainomis)  
**Vidinės nuorodos:** → /paslaugos/apzeldinimas, → /patarimai

---

### 5.7 Atlikti darbai `/darbai`

**Title tag:** `Atlikti darbai | Aplinkos tvarkymo projektai Vilniuje – ATD`  
**Meta description:** `170+ įgyvendintų sodų ir teritorijų tvarkymo projektų Vilniuje. Veja, apželdinimas, trinkelės, laistymo sistemos. Žiūrėti darbus →`  
**H1:** `Atlikti aplinkos tvarkymo darbai`

**Turinio blokai:**
- Galerija su filtrais (pagal paslaugos tipą)
- Kiekvienas projektas: nuotrauka + trumpas aprašymas + naudotos paslaugos
- Statistika: 170+ projektų, metai patirties
- Klientų atsiliepimai prie projektų

**Schema:** `ImageGallery`, `LocalBusiness`  
**Vidinės nuorodos:** → susijusios paslaugos (kiekvieno projekto kortelėje)

**SEO pastaba:** kiekvienas projektas ateityje gali tapti atskiru `/darbai/[slug]` puslapiu su ilguoju raktažodžiu (pvz. „vejos įrengimas Žirmūnuose").

---

### 5.8 Naudingi patarimai `/patarimai`

**Title tag:** `Sodo priežiūros patarimai | ATD ekspertų blogas`  
**Meta description:** `Praktiniai patarimai apie vejų priežiūrą, apželdinimą, laistymo sistemas. ATD specialistų rekomendacijos Lietuvos klimatui.`  
**H1:** `Naudingi patarimai sodo ir teritorijos priežiūrai`

**Pirmi 10 straipsnių (prioriteto tvarka):**

| # | Pavadinimas | Raktažodis | Ilgoji uodega |
|---|---|---|---|
| 1 | Kaip pasirinkti vejų tipą: ruloninė vs sėjama | ruloninė veja vs sėjama | „kuri veja geriau" |
| 2 | Trinkelių klojimas: ką reikia žinoti prieš pradedant | trinkelių klojimas pats | „trinkelės namai" |
| 3 | Automatinė laistymo sistema: ar verta? | automatinė laistymo sistema namai | „laistymo sistema kaina" |
| 4 | 10 geriausių augalų šešėliui Lietuvoje | augalai šešėliui | „kas auga šešėlyje" |
| 5 | Kaip paruošti sodą žiemai | sodo žieminimas | „sodo priežiūra ruduo" |
| 6 | Vejos priežiūra: kaip ir kada šienauti | veja priežiūra | „kada šienauti veją" |
| 7 | Apželdinimas po statybų: nuo kur pradėti | apželdinimas po statybų | — |
| 8 | Granito vs betoninės trinkelės: palyginimas | granito trinkelės | „trinkelių tipai" |
| 9 | Kiek kainuoja sodo įrengimas Vilniuje | sodo įrengimas kaina | „aplinkos tvarkymas kaina" |
| 10 | Laistymo sistemos žieminimas: žingsnis po žingsnio | laistymo sistemos žieminimas | — |

**Schema:** `Article`, `BlogPosting`, `BreadcrumbList`

---

### 5.9 Kontaktai `/kontaktai`

**Title tag:** `Kontaktai | ATD Aplinkos tvarkymas Vilniuje`  
**Meta description:** `Susisiekite su ATD — nemokama apžiūra ir konsultacija. Tel. +370 657 85096. Dirbame Vilniuje ir rajone. Atsakome per 2 val.`  
**H1:** `Susisiekite su ATD`

**Turinio blokai:**
- Kontaktų forma (vardas, tel., paslauga, plotas, žinutė)
- Telefono numeris (click-to-call)
- Darbo laikas
- Google Maps įdėjimas
- Aptarnaujamas rajonas: Vilnius, Vilniaus rajonas, Trakai

**Schema:** `ContactPage` + `LocalBusiness` su `geo` koordinatėmis

---

## 6. Techninė SEO bazė

### Prioritetai (jau Next.js)

| Elementas | Statusas | Veiksmas |
|---|---|---|
| `next/image` su WebP | ✅ Konfigūruota | — |
| `generateMetadata()` | ⬜ Reikia | Kiekvienas `/paslaugos/[slug]` puslapis |
| `robots.txt` | ⬜ Reikia | Sukurti `public/robots.txt` |
| `sitemap.xml` | ⬜ Reikia | `app/sitemap.ts` (Next.js built-in) |
| Structured data | ⬜ Reikia | JSON-LD per `<script>` layout arba puslapyje |
| `hreflang` | ⬜ Vėliau | Jei bus anglų versija |
| Core Web Vitals | ⬜ Reikia | LCP < 2.5s, CLS < 0.1, FID < 100ms |
| Open Graph / Twitter | ⬜ Reikia | `opengraph-image.tsx` kiekvienam puslapiui |

### `robots.txt` (minimalus)

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://atd.lt/sitemap.xml
```

### `sitemap.ts` struktūra

```typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://atd.lt', changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://atd.lt/paslaugos/apzeldinimas', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://atd.lt/paslaugos/veja', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://atd.lt/paslaugos/laistymas', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://atd.lt/paslaugos/trinkelės', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://atd.lt/paslaugos/prekyba-augalais', changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://atd.lt/darbai', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://atd.lt/patarimai', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://atd.lt/kontaktai', changeFrequency: 'monthly', priority: 0.6 },
  ];
}
```

---

## 7. Schema planas (kiekvienas puslapis)

| Puslapis | Schema tipai |
|---|---|
| `/` | `LocalBusiness`, `Organization`, `AggregateRating` |
| `/paslaugos/*` | `Service`, `LocalBusiness`, `BreadcrumbList` |
| `/darbai` | `ImageGallery`, `LocalBusiness` |
| `/patarimai/[slug]` | `Article`, `BlogPosting`, `BreadcrumbList`, `FAQPage` |
| `/kontaktai` | `ContactPage`, `LocalBusiness` |

---

## 8. GEO / AI paieška

Chatbot'ai (ChatGPT, Perplexity) vis dažniau naudojami vietinių paslaugų paieškai.

**Veiksmai:**
- [ ] Aiškiai aprašyti paslaugų geografiją: „Dirbame Vilniuje, Vilniaus rajone, Trakuose"
- [ ] Pridėti kainų diapazonus prie kiekvienos paslaugos (AI cituoja konkrečius skaičius)
- [ ] `LocalBusiness` schema su `geo`, `areaServed`, `openingHours`
- [ ] Patekti į "best of Vilnius landscaping" straipsnius
- [ ] Google Business Profile užpildyti 100% su nuotraukomis ir atsiliepimais
- [ ] `llms.txt` failas (AI crawlers)

```
# llms.txt (public/llms.txt)
# ATD — aplinkos tvarkymas Vilniuje
ATD teikia šias paslaugas Vilniuje: apželdinimas, vejos įrengimas (ruloninė nuo 8 €/m²),
automatinės laistymo sistemos, trinkelių klojimas (nuo 25 €/m²), augalų prekyba.
170+ įgyvendinti projektai. Tel: +370 657 85096.
```

---

## 9. Įgyvendinimo planas (4 fazės)

### Fazė 1 — Techninė bazė (1–2 savaitės)

- [ ] `robots.txt` ir `sitemap.ts`
- [ ] `generateMetadata()` homepage ir visoms paslaugoms
- [ ] `LocalBusiness` JSON-LD schema `layout.tsx`
- [ ] Open Graph nuotraukos (1200×630) kiekvienam puslapiui
- [ ] Google Analytics 4 + Search Console registracija
- [ ] Google Business Profile: užpildyti ir patikrinti

### Fazė 2 — Puslapių turinys (2–6 savaitės)

Prioriteto tvarka:
1. `/paslaugos/veja` — didžiausias paieškos tūris
2. `/paslaugos/apzeldinimas`
3. `/paslaugos/trinkelės`
4. `/darbai` — galerija su 20+ projektų
5. `/paslaugos/laistymas`
6. `/paslaugos/prekyba-augalais`
7. `/kontaktai` — pilna forma + žemėlapis

### Fazė 3 — Turinio plėtra (6–12 savaitės)

- [ ] Pirmi 5 `/patarimai` straipsniai
- [ ] `BeforeAfterSlider` ant kiekvieno paslaugos puslapio
- [ ] Atsiliepimų sekcija (Google Reviews embed arba rankinis)
- [ ] Kainų skaičiuoklė `/kaina`
- [ ] FAQ schema kiekvienam paslaugų puslapiui

### Fazė 4 — Autoritetas (3–6 mėnesiai)

- [ ] Straipsniai vietiniuose portaluose (lrytas.lt, delfi.lt tematiniai)
- [ ] Partnerystė su NT agentūromis (nuorodos)
- [ ] Video turinys (YouTube → embed į puslapius)
- [ ] Apie mus puslapis su komandos nuotraukomis (E-E-A-T)
- [ ] Kasmetinis sodo patarimai PDF (link bait)

---

## 10. KPI tikslai

| Metrika | Dabar | 3 mėn. | 6 mėn. | 12 mėn. |
|---|---|---|---|---|
| Organinis srautas/mėn | ~0 | 200 | 800 | 2 500 |
| Indeksuoti puslapiai | 1 | 9 | 20 | 40+ |
| Top-10 raktažodžiai | 0 | 5 | 20 | 60 |
| GBP spaudimų/mėn | — | 150 | 400 | 1 000 |
| Organinės užklausos/mėn | 0 | 3 | 15 | 50 |
| Core Web Vitals LCP | — | < 2.5s | < 2.0s | < 1.8s |

---

## 11. Sekantys puslapiai kurti (po šių 9)

Pagal prioritetą:

| Puslapis | Raktažodis | Tikslas |
|---|---|---|
| `/apie` | aplinkos tvarkymo įmonė Vilnius | E-E-A-T: komanda, patirtis, nuotraukos |
| `/kaina` | aplinkos tvarkymas kaina | Skaičiuoklė + kainų lentelė |
| `/paslaugos/priežiūra` | sodo priežiūra Vilnius | Sezoninė sutartinė priežiūra |
| `/paslaugos/sniego-valymas` | sniego valymas Vilnius | Sezoninis srautas (spalis–kovas) |
| `/vilnius/[rajonas]` | apželdinimas Žirmūnuose | Lokalios pozicijos rajone |
| `/darbai/[slug]` | konkretus projektas | Long-tail per projektų puslapius |

---

*Planas peržiūrimas kas 3 mėnesius. Raktažodžių tūriai tikrinami per DataForSEO arba Ahrefs.*
