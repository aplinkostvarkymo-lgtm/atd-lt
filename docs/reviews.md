# Klientų atsiliepimai

Klientams siųsti `https://new.atd.lt/atsiliepimai#parasyti` (EN: `/en/atsiliepimai#parasyti`). Po pagrindinio domeno paleidimo naudoti `https://atd.lt/atsiliepimai#parasyti`.

## Kas matoma svetainėje

- 1–5 žvaigždutės, viešas vardas, tekstas ir pateikimo data. Iš anksto įvertinimas nepasirinktas.
- El. paštas neprivalomas ir niekada neviešinamas. Nuotraukų įkėlimo nėra.
- Visi pateikimai pirmiausia laukia savininko sprendimo. Įvertinimas ir tekstas nekeičiami. Vienodai priimami visi įvertinimai; moderavimo paskirtis – ryšys su ATD darbais, šlamštas ir privatūs duomenys.
- Pradžioje rodomi trys naujausi patvirtinti atsiliepimai. Atskirame puslapyje yra visi, po 10 su „Rodyti daugiau“.
- Kortelėje rodomi vardo inicialai, vardas, data, žvaigždutės ir kliento tekstas. ATD atsakymas pateikiamas atskirai, šviesiai žaliame plote; klientų portretai neimituojami.
- Kol patvirtintų įrašų nėra, nėra išgalvoto vidurkio, skaičiaus ar pavyzdinių klientų. Review/AggregateRating struktūriniai duomenys nepridėti.

## Savininko veiksmai

1. Pranešimas ateina į `aplinkostvarkymo@gmail.com`, iš esamo Resend patvirtinto techninio siuntėjo.
2. Atidaryti privačią nuorodą laiške. Vien jos atidarymas nieko nepaskelbia.
3. Jei norite padėkoti, laukelyje „Jūsų atsakymas klientui“ parašyti asmeninį atsakymą ir paspausti „Išsaugoti atsakymą“. Iki 1500 simbolių. Laukiančio atsiliepimo atsakymas taip pat lieka neviešas. Kliento tekstas ir įvertinimas nekeičiami.
4. Perskaityti tekstą ir pasirinkti „Patvirtinti ir paskelbti“ arba „Atmesti“. Nuoroda galioja 30 dienų, jos klientams nesiųsti. Prieš patvirtinant būtina išsaugoti pradėtą rašyti atsakymą.
5. Patvirtintas atsiliepimas ir atsakymas pasirodo po viešo sąrašo podėlio atsinaujinimo (30 s + iki 30 s stale-while-revalidate). Jau atvertą puslapį atnaujinti.

Per tą pačią galiojančią laiško nuorodą galima parašyti atsakymą ir jau patvirtintam atsiliepimui, jį redaguoti arba pašalinti (ištrinti tekstą ir paspausti „Pašalinti atsakymą“). Tai pakeičia tik ATD atsakymą; patvirtinimo sprendimas ir kliento turinys lieka tie patys. Atsakymas savarankiškai svetainėje rodomas, klientui atskiro el. laiško nesiunčiama. Automatinės padėkos nesukuriamos.

Pirmas sprendimas užbaigia įrašo moderavimą; pakartotinė nuoroda rodo esamą sprendimą. Vėlesniam pašalinimui prireiktų administratoriaus pakeitimo saugykloje. Tai apsaugo nuo seno laiško pakartotinio netyčinio veiksmo.

## Saugykla ir prieiga

Savininkas leido naudoti esamą Airtable `Leads` lentelę. Atsiliepimai turi tikslų `Šaltinis = atd.lt - atsiliepimas`. `Žinutė` saugo version=1 JSON su vardu, tekstu, įvertinimu, būsena `pending|approved|rejected`, createdAt, lang ir consent=true. Neprivalomas Email saugomas atskirame privačiame lauke. `Statusas = Naujas` yra bendras Leads laukas ir **nevaldo** atsiliepimo viešinimo.

Viešas GET skaito tik šio šaltinio patvirtintus įrašus, prašo tik Šaltinis ir Žinutė, pakartotinai validuoja juos ir grąžina tik id/name/rating/text/createdAt bei pasirenkamą reply su tik text/updatedAt. Atsakymas saugomas tame pačiame Žinutė JSON; senesni įrašai be reply lieka tinkami. Kiti Leads klientai ar kontaktai į viešą API nepatenka. Iki 1000 patvirtintų įrašų; pasiekus ribą rodomas skaičius su „+“, nepilnos imties vidurkis nerodomas.

Naudojami esami `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `RESEND_API_KEY`, `RESEND_FROM` ir esamas rate limiter (atskira `review` kvota). Naujos privalomos aplinkos reikšmės nereikia. Pasirinktinai `REVIEWS_MODERATION_SECRET` leidžia atskirti nuorodų pasirašymo raktą; kol jo nėra, iš Airtable rakto HMAC būdu išvedamas atskiras domeno raktas. Pakeitus raktą senos nuorodos nebegalios. Slapti raktai ir nuorodų tokenai nekeliami į Git.

Moderavimo tokenas yra URL fragmente, todėl nesiunčiamas puslapio užklausos URL ar referrer. Privati peržiūra jį perduoda API Authorization antraštėje; sprendimo POST – JSON kūne. HMAC parašas, galiojimo laikas ir šaltinis tikrinami serveryje. Privatus puslapis/API turi noindex, nofollow, no-referrer; API no-store. Analitika šiame puslapyje išjungta. Jis nepatenka į meniu ar sitemap.

Pateikimo API turi dydžio ir laukų ribas, sutikimo patikrą, same-origin patikrą, honeypot ir pateikimų dažnio ribojimą. Pending įrašas saugomas prieš sėkmės atsakymą. Pranešimas siunčiamas Next `after()`; laiško siuntimo klaida nepanaikina jau gauto atsiliepimo. Jei laiškas neateina, tikrinti Resend/Vercel klaidą „Review saved but moderation email failed“ ir tik šio šaltinio laukiančius Airtable įrašus. Administratoriui galima sugeneruoti naują `moderationToken(id)` su esama serverio aplinka, nesukuriant antro atsiliepimo ir nekeičiant teksto. Viešinti apeinant savininko sprendimą nereikia.

## Patikra

`npm run test:reviews` vykdo devynis atmintyje imituotus backend/saugumo testus, be tikro tinklo, laiškų ar klientų duomenų. Tikrinama validacija, ribos, pending/approved/rejected, privatūs laukai, nuorodų klastojimas/galiojimas, GET be rašymo, nekeičiami tekstas/įvertinimas, pakartotinis sprendimas ir kvota. Atsakymui papildomai tikrinamas autentiškumas, dydžio ir teksto ribos, pending privatumas, publikavimas tik po patvirtinimo, redagavimas, pašalinimas ir negalėjimas pateikti ATD atsakymo per viešą kliento formą.

Vidiniai naršyklės scenarijai ir screenshotai yra `atd-lt-audit/reviews`, jie nepublikuojami. Savininkas atskirai leido **vieną** aiškiai pažymėtą realų neviešą testą po paskelbimo: pateikimas → Airtable pending → Gmail → privati peržiūra → atmetimas. Testo niekada nepatvirtinti viešinimui. Tikro testo scenarijus prieš POST diske įrašo attempted=true ir neleidžia pakartoti neaiškaus rezultato.

2026-10-19 testas atliktas po `5c2dceaf` deploy (Vercel success): vienas POST per tikrą svetainės formą, HTTP200 ir padėka. Žyma `ATD-REVIEW-TEST-20261019-5c2dceaf`. Pending būsena patikrinta serverio API; Gmail laiškas rastas INBOX, siuntėjas onboarding@resend.dev, gavėjas aplinkostvarkymo@gmail.com. Privačioje peržiūroje pasirinkta „Atmesti“, patikrinta išsaugota rejected būsena ir nepakitęs originalus tekstas/įvertinimas. Viešoje API testo nebuvo nei prieš, nei po atmetimo. Ši vienkartinė autorizacija panaudota; naujo tikro pateikimo be naujo leidimo nedaryti.
