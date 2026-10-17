# Našumas: išmatuota, bet ne gamybinių CWV išvada

2026-10-17. Production build, vietinis `next start` localhost:3100. Edge 155.0.4283.45, 390×844, emuliuotas mobilus režimas, 150 ms latency, 200 000 B/s download (~1,6 Mbps), CPU 4× lėtinimas, išjungta naršyklės cache. Po load stebėta dar 14 s. Po vieną bandymą dviem route'ams. Žali įrodymai `../production-checks.json`.

| Matavimas | `/` | `/paslaugos/veja` |
|---|---:|---:|
| FCP | 1,528 s | 1,072 s |
| LCP stebėtas kandidatas | 1,528 s, A elementas | 1,840 s, hero IMG |
| Pradinių layout-shift be recent input suma | 0 | 0 |
| Stebėtų longtask trukmių suma | 116 ms | 125 ms |
| Resource Timing transferSize suma | 517 215 B | 500 372 B |
| Pagrindinio hero teksto bloko opacity stebėjimo pabaigoje | **0** | 1 |

**Homepage LCP skaičius nepatvirtina geros vartotojo patirties:** pagrindinis tekstas bandymo pabaigoje dar buvo nematomas, todėl LCP užfiksavo mažą A elementą, o ne realią pagrindinę žinutę. Intro / autoplay / mobiliojo tinklo atsparumo problema sutampa su SEO-GEO-02; priežastis šiame konkrečiame emuliuotame bandyme toliau neizoliuota. Negalima paskelbti, kad „homepage LCP puikus“, ignoruojant opacity=0. Taisyti matomo pradinio turinio logiką prieš laikant LCP optimizaciją baigta.

Vejos hero vienkartinis vietinis LCP geras, bet tai nėra CrUX p75 ir ne visa svetainė. INP nematuotas: vartotojų sąveikos / realios srauto imties nėra. Aukščiau pateikta layout-shift suma nėra sertifikuotas viso seanso CWV vertinimas. Lighthouse balai nebuvo gauti; čia pateikti tiesioginiai naršyklės Performance API matavimai, ne Lighthouse imitacija.

Resource Timing ne visada parodo pilną media range užklausų kainą; homepage transferSize sumos negalima laikyti viso video failo dydžiu. Disko originalas `public/videos/hero.mp4` yra **5 061 225 B**, pagrindinio PNG **2 309 627 B**. Vaizdai siunčiami per Next Image optimizatorių: šiuose mobiliuose bandymuose hero WebP išteklius buvo apie 40–50 KB. Todėl didelis originalus JPG savaime dar nėra didelio faktinio mobiliojo atsisiuntimo įrodymas.

## Rekomendacijos

1. Pirmame HTML rodyti tikrą žinutę, CTA ir statistikos reikšmes. Intro neturi būti būtina sąlyga naudotis puslapiu.
2. Po to įvertinti, ar 5 MB intro nauda pateisina jo kainą; mažinti video, parinkti tinkamą poster ir netrukdyti prioritetiniam hero turiniui. Tai produkto sprendimas, ne automatinis video pašalinimas.
3. Išlaikyti Next Image sizes, dimensijas ir esamą optimizavimą. `priority` Next 16 dokumentacijoje deprekuotas `preload` naudai; tai priežiūros darbas, ne šio build gedimas.
4. Prieš production paleidimą pamatuoti realaus deploy Lighthouse / PageSpeed, o atsiradus duomenims CrUX / GSC. Pirmiausia gauti teisingai matomą hero, tik po to vertinti jo metrikų pagerėjimą.

Serverio TTFB šiame bandyme buvo 4–5 ms, nes serveris tame pačiame kompiuteryje. Šio skaičiaus neperkelti į išvadas apie Vercel ar vartotojus Lietuvoje.
