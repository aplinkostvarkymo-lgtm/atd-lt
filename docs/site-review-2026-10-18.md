# ATD svetainės peržiūra — 2026-10-18

Peržiūrėtos lietuviška ir angliška versijos. Svetainė ir nuotraukų portfolio vizualiai tinkami pristatyti ATD darbus užsakovams. Stipriausias pasitikėjimo pagrindas — tikrų objektų darbų eiga, savininko patvirtinti kiekiai, sudėtingų darbų paaiškinimai ir kitų rangovų atsakomybių atskyrimas.

## Pataisyta

- Nemokama tik pirminė konsultacija. Apžiūros, matavimo ir projektavimo apimtis bei kaina derinamos individualiai.
- Garantijų trukmė ir pasiūlymų pateikimo terminai nustatomi konkrečiame pasiūlyme arba sutartyje. Pašalinti ankstesni bendri 1 metų, 30 dienų ir 24–48 valandų pažadai.
- Medžių ir krūmų nemokamo keitimo būtina sąlyga — ATD pati teikia nuolatinę objekto priežiūrą. Taikymo sąlygos nustatomos pasiūlyme arba sutartyje. Vien tiekimas ar sodinimas šio įsipareigojimo nesukuria.
- Sąlygos suderintos matomuose LT/EN tekstuose, paslaugų langeliuose, metaduomenyse, DUK / paslaugų JSON-LD ir llms.txt. Kainos „nuo“ struktūriniuose duomenyse pateikiamos kaip minimalus vieneto tarifas, o ne fiksuota viso užsakymo kaina.
- Pašalinti nepagrįsti bendri pažadai apie nedelsiamą ruloninės vejos naudojimą, vieną visiems sklypams tinkamą dangos pagrindą ir universalų žuvų žiemojimą. Konkretūs sprendiniai priklauso nuo objekto.
- Sutvarkyta galerijos nuoroda paslaugų lange, keli vertimo / gramatikos netikslumai ir vidinę atranką aprašantys portfolio sakiniai.
- Pašalintas mobilių plaukiojančių pokalbių mygtukų persidengimas su turiniu. Telefonas ir pasiūlymo mygtukas lieka mobilioje juostoje; WhatsApp / Viber nuorodos yra kontaktų puslapyje.
- Laistymo ir tvenkinių puslapiai turi pagrindinio turinio sritį ir veikiantį „Pereiti prie turinio“ taikinį.
- Pagrindinio puslapio sumažinto judesio nuostata nuskaitoma po suderinto pradinio atvaizdavimo: pašalinta React hidratacijos klaida. Durų vaizdas, vaizdo failas, 2× greitis ir hotspotų koordinatės išlaikyti.
- Pagerintas paslaugų įžangų ir poraštės antrinio teksto kontrastas bei trumpų mobilių rodiklių išdėstymas.

Savininkas patvirtino 170+ projektų, 12+ metų patirtį, paskelbtus vejos ir dangų tarifus bei „Udenhout Trees“ pavadinimo naudojimą. Šie faktai išlaikyti.

## Patikros

- Production build: sėkmingai sugeneruotos 88 Next.js išvestys; TypeScript ir pakeistų šaltinių ESLint praėjo.
- Visos 84 sitemap nuorodos grąžina 200 vietinėje production versijoje, turi vieną H1, atitinkamą kalbą, canonical, kalbų alternates ir išparsintus JSON-LD.
- Patikrintos visos 84 unikalios rastos vidinės nuorodos ir 298 HTML naudojami paveikslų URL; neveikiančių nerasta. Neegzistuojančio projekto adresas grąžina tikrą 404.
- Atskirai patikrinti visi 62 projekto puslapiai: aprašai bei nuotraukos yra serverio HTML, galerija susieta su visomis istorijomis, sitemap turi 84 URL.
- Pirminė vizualinė peržiūra: 48 LT/EN kombinacijos 1440 ir 390 px pločiu, visi 11 pagrindinių maršrutų ir vienas išsamus projektas. Sugedusių nuotraukų ar horizontalaus dokumento perslinkimo nerasta.
- Po pataisymų: 32 tikslinės kombinacijos, įskaitant 320 px mobilų plotį ir pagrindinį puslapį su abiem judesio nuostatomis. Hidratacijos klaidų nėra, įprastu režimu patvirtintas 2× vaizdo greitis; sumažinto judesio režimu vaizdo elementas nerodomas. Patvirtinta vizualiai penkiuose peržiūros lapuose.
- Formos: LT/EN validacija, imituoti sėkmės ir klaidos atsakymai, reikšmių išlaikymas, fokusas, meniu, galerijos klaviatūra ir slapukų pasirinkimas patikrinti. Po paskelbimo savininko leista vienintelė tikra užklausa „ATD TESTAS 2026-10-18“ grąžino HTTP 200 / success; serverio kode sėkmė grąžinama tik po Airtable išsaugojimo. Tuo metu svetainė parodė padėką. Tikras el. laiško gavimas dar laukia gavėjo patvirtinimo.
- Po šio bandymo nustatyta papildoma darbalaukio sąsajos klaida: susitraukus formai sėkmės tekstas galėjo atsidurti už fiksuoto meniu. Tekstas dabar fokusuojamas ir parodomas matomos srities centre. Pakartotinė patikra naudoja tik imituotus atsakymus; antro tikro pateikimo nebuvo.

## Iki pagrindinio domeno paleidimo

Savininko sprendimu Vercel lieka peržiūrai, o atd.lt bus perkeltas vėliau. Todėl visos naujos svetainės kalbų ir projektų peržiūros dabar turi noindex, follow. Canonical, hreflang ir sitemap paruošti būsimam atd.lt. Dabartinis atd.lt serveris dar teikia seną turinį arba 500 klaidas; tai nėra atliktas domeno perkėlimas. Paleidimo veiksmai: [domain-launch.md](domain-launch.md).

Pradinę patikrą Vercel vėliau ribojo 403 Security Checkpoint atsakymais automatinei naršyklei; apsauga neapeita. Tai neįrodo įprastų lankytojų blokavimo. Tikri Search Console indeksavimo, Core Web Vitals ir AI citavimo rezultatai nematuoti, todėl bendras „SEO balas“ nepriskiriamas.

Nuotraukų portfolio baigtas; šis etapas neapėmė visų pirminiuose aplankuose likusių MP4 apdorojimo. Peržiūros metu neaptikta kitų publikavimą blokuojančių svetainės klaidų, tačiau patikros nėra visų įrenginių ar būsimų išorinių paslaugų veikimo garantija.
