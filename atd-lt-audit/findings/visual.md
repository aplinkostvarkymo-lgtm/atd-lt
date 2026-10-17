# Vizualinis, UX ir prieinamumo auditas

2026-10-17. Tikrinta vietinė production versija, Microsoft Edge per Playwright, 1440×900 ir 390×844 CSS px. Papildomi išdėstymo matavimai: 320, 768 ir 1024 px. Tai emuliuota naršyklė, ne fizinio iPhone / Android patikra. Detalūs DOM duomenys: `../browser-data.json`, `../production-checks.json`. Ekrano kopijos: `../screenshots/`.

## Išvada

Esama vizualinė kryptis nuosekli: tamsi žalia, fotografija, Playfair Display ir DM Sans, aiškios kainų ir proceso sekcijos. Perkurti dizaino tapatybės nereikia. Tačiau yra reikšmingų navigacijos, sluoksnių ir klaviatūros naudojimo problemų. Pirmiausia taisyti veikiančio išdėstymo ir prieinamumo trūkumus.

### V01 — P1: „Darbų“ puslapyje navigacija beveik nematoma

`src/components/layout/Header.tsx:35–38,43–47`; `src/components/pages/DarbaiPage.tsx:133`. Kol scrollY ≤ 60, header visur laikomas baltas ir skaidrus. `/darbai` hero fonas yra #F5F0E8. Baltos navigacijos kontrastas su juo **1,13:1** — nesiekia WCAG teksto 4,5:1 ir net didelio teksto 3:1. Logotipas, telefono numeris, kalbų valdiklis ir mobiliojo meniu ikona prastai matomi. Tai matyti `darbai-1440.png`, `darbai-390.png` ir `fresh-mobile-cookie.png`.

**Taisyti:** pradinę header temą parinkti pagal puslapio foną arba naudoti visada kontrastingą header pagrindą. Patikrinti tiesioginį URL atidarymą ir perėjimą tarp skirtingų hero, ne tik scroll būseną.

### V02 — P1: mobilioji fiksuota CTA juosta uždengia homepage paslaugų valdiklius

`src/components/sections/GardenSceneHero.tsx:83,134,166–177`; `src/components/ui/MobileStickyCTA.tsx:17–29`; `src/components/ui/FloatingChat.tsx:13`. Hero užima h-screen, jo paslaugų juosta įdėta į patį apačios kraštą. Fiksuota CTA tame pačiame ekrano krašte turi aukštesnį z-index. 390×844 vaizde CTA viršus yra y=773, jos aukštis 71 px; paslaugų juosta hero apačioje patenka po ja. Root footer padding apsaugo puslapio pabaigą, bet šios vidinės hero juostos neperkelia.

Be to, WhatsApp / Viber grupė y=652–756 sutampa su hero teksto bloku; ekrano kopijoje WhatsApp dengia paantraštės pabaigą. **Poveikis:** mobilus lankytojas nemato ir negali patikimai paliesti dalies pradžios puslapio paslaugų valdiklių. Cookie baneris pirmo apsilankymo metu uždengia dar daugiau apačios elementų; tai dokumentuota kaip būsenų koordinavimo problema, o ne klaidingai priskiriama serverio klaidai.

**Taisyti:** vienas mobiliosios apačios valdiklių išdėstymo modelis, atsižvelgiantis į CTA, safe-area ir consent aukštį; hero turinį dėti virš tikro rezervuoto valdiklių ploto. Išsaugoti esamas nuotraukos žymeklių koordinates desktop'e — ankstesnis sesijos žurnalas aiškiai uždraudžia jų savavališką perstumdymą.

### V03 — P1: desktop paslaugų dropdown nutrūksta ir pele, ir klaviatūra

`src/components/layout/Header.tsx:62–84`. Klaviatūros bandymas: focus → Enter, paslaugų nuorodų atsidariusiame meniu skaičius 0. Pelės bandymas: hover ant mygtuko → judėjimas 6 px žemiau mygtuko į `mt-3` tarpą, meniu užsidaro. Wrapper onMouseLeave įvyksta dar prieš pasiekiant dropdown.

**Taisyti:** realus atidaromas mygtukas su aria-expanded / aria-controls, Escape ir fokuso valdymu; nenutrūkstantis hover plotas iki dropdown. Nereikia atsisakyti hover, bet jis negali būti vienintelis atidarymo būdas. Kodo detalės: C03.

### V04 — P1: overlay sluoksniai nesuteikia pilnos dialogo sąveikos

`src/components/pages/DarbaiPage.tsx:223–267`; `src/components/ui/ServicePopup.tsx:164–179,204–235`; `src/components/layout/Header.tsx:133–198`. Galerijos peržiūra po Escape liko atidaryta; role=dialog skaičius 0; fokusas liko galerijos miniatiūroje už peržiūros. Mobilus meniu po Escape taip pat liko atidarytas. Abiem atvejais body overflow-y liko auto. ServicePopup jau užrakina scroll ir palaiko Escape, bet neturi tinkamo fokuso ciklo bei dialogo semantikos.

**Taisyti:** bendras prieinamas Dialog pagrindas, fonas inert, pradinis fokusas, Tab ciklas ir fokuso grąžinimas. Modalus reikia testuoti atskirai nuo gerai atrodančio jų screenshot. Susijęs kodo radinys C04.

### V05 — P2: reduced motion praleidžia video, bet palieka nuolatinį pulsavimą

`src/components/ui/HotspotMarker.tsx:94–123`; `src/components/sections/GardenSceneHero.tsx:63–68`. Emuliuojant prefers-reduced-motion: reduce, video elemento nėra — tai veikia teisingai. Tačiau po pradinės animacijos naršyklė teberodo **8 veikiančias animacijas**, atitinkančias dviejų žiedų pulsavimą keturiuose hotspot. `repeat: Infinity` neskaito pasirinkimo. Paslaugų įėjimo animacijos taip pat neturi bendro sumažinto judesio režimo.

**Taisyti:** reduced motion režime palikti aiškias statiškas žymas ir būsenų pokyčius, išjungti dekoratyvinį begalinį pulsavimą; nedaryti viską gadinančio globalaus 0.01 ms CSS triuko.

### V06 — P2: trūksta fokuso matomumo ir patogių palietimo plotų

`src/components/ui/HotspotMarker.tsx:200–213` nuima outline be pakaitalo. Mobilus hamburger mygtukas matuojamas **22×16 px** (`Header.tsx:118–127`), close ikona mobiliame meniu 18×18; kalbų mygtukas 46×16. Tai nepatogūs realūs paspaudimo plotai, nors tarp elementų yra tarpų. Neteigiama, kad kiekvienas mažesnis nei 44 px inline link automatiškai pažeidžia WCAG; čia prioritetas pagrindiniams valdikliams.

**Taisyti:** aiškus focus-visible indikatorius, didesnis pagrindinių ikoninių mygtukų interaktyvus plotas (rekomenduojama apie 44×44 px), išlaikant esamą ikonos dydį.

### V07 — P2: WhatsApp teksto kontrastas kontaktų kortelėje per mažas

`src/components/pages/KontaktaiPage.tsx:241–247`. Baltas mažas tekstas ant #25D366 turi **1,98:1** kontrastą. Šį tekstinį mygtuką matyti `kontaktai-1440.png`. Toks pats brand fonas floating ikonoje nėra priežastis visą ikoną vertinti kaip mažo teksto kontrastą; radinys taikomas būtent tekstiniam „WhatsApp“.

**Taisyti:** kontrastingesnis teksto / fono derinys, išlaikant atpažįstamą brand identitetą. Tai spalvų, ne teksto turinio keitimas.

### V08 — P3: galerijos informacija priklauso nuo hover, stokojama projekto konteksto

`src/components/pages/DarbaiPage.tsx:193–199`. Miniatiūrų pavadinimai išstumiami už vaizdo ir rodomi tik group-hover. Telefono naudotojas pradžioje mato tik nuotraukas, o projekto vieta, metai, apimtis ir ATD vaidmuo apskritai nepateikti. Tai mažina galerijos naudą sprendžiant, ar patirtis atitinka lankytojo darbą. Nuotraukų autorystės patvirtinimas yra atskiras svarbesnis SEO-GEO-01 punktas.

**Taisyti:** kompaktiškas matomas projekto pavadinimas / faktai ir focus-visible lygiavertė būsena; turinį pridėti tik patvirtinus faktus. Neišgalvoti darbų datų, lokacijų ar rezultatų.

## Kas veikia ir kokių klaidingų išvadų atmesta

- 16 puslapio ir viewport kombinacijų grąžino 200, visur vienas H1, horizontalaus dokumento overflow nerasta. Papildomi pločiai tikrinami atskirame production-checks.json.
- Galutinėje production ekrano kopijų serijoje visos matomos nuotraukos sėkmingai įkeltos; visos galerijos failų nuorodos egzistuoja.
- Galerijos filtrų seka Veja → Apželdinimas → Trinkelės → Laistymas → Visos baigėsi teisingais 13 elementų, be JS klaidų. Nepranešama apie nepatvirtintą greito filtravimo gedimą.
- DM Sans ir Playfair Display naršyklėje pritaikyti teisingai. Hipotezė apie sugedusius CSS šriftų kintamuosius atmesta.
- Proceso sekcijos be papildomų SVG iliustracijų nuoseklios. Iliustracijų grąžinimas nesiūlomas.
- Tušti plotai pirmose viso puslapio kopijose buvo testavimo artefaktas: scrollTo paveldėjo smooth scroll ir skenavimas nespėjo pasiekti apatinių sekcijų. Production patvirtinimo serijoje skrolinta momentiškai, turinys pasirodė. Tai **nėra** svetainės „dingusių sekcijų“ radinys.
- Google Maps išorinio atvaizdo pilnas veikimas ir fizinio telefono safe-area nepatvirtinti; tuščio iframe šiame audito tinkle nelaikome įrodytu produkciniu gedimu.
- Z-index hierarchija nominaliai teisinga, bet V02 rodo, kad teisingi skaičiai savaime neužtikrina nesikertančio turinio.

## Perspektyvos ir tolesni veiksmai

Pirmą kartą atėjęs savininkas mato aiškias paslaugų kainas, bet pradžios puslapyje per daug priklauso nuo intro ir mažai tikrų projektų faktų. Skubantis telefono lankytojas turi patogią skambučio CTA, tačiau ji uždengia kitus valdiklius. Klaviatūros vartotoją stabdo paslaugų meniu ir modalo fokusas.

Taisymų seka: `$impeccable harden` (dialogai, navigacija, būsenos), `$impeccable adapt` (mobiliosios kolizijos), `$impeccable colorize` (kontrastas), `$impeccable animate` (reduced motion), `$impeccable polish` (galutinis vientisumas). Po taisymų pakartoti tik susijusias patikras. Galima vykdyti kartu ar atskirais darbais.

Prieinamumo kriterijų šaltiniai: [W3C kontrastas](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) ir [W3C modalinio dialogo sąveika](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Logotipo kontrastas nelaikomas vieninteliu norminio teksto pažeidimo pagrindu; V01 įvertinimas remiasi ir tikrais navigacijos tekstais bei valdikliais.
