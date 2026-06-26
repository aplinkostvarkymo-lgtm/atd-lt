export type BiLang = { lt: string; en: string };
export type Lang = "lt" | "en";

export interface ComparisonItem {
  title: BiLang;
  price: string;
  highlight?: boolean;
  bullets: { lt: string[]; en: string[] };
}

export interface StepItem {
  title: BiLang;
  desc: BiLang;
}

export interface MaterialItem {
  name: BiLang;
  price: string;
  desc?: BiLang;
}

export type ServiceBlock =
  | { type: "comparison"; items: ComparisonItem[] }
  | { type: "steps"; heading: BiLang; steps: StepItem[] }
  | { type: "list"; heading?: BiLang; items: BiLang[] }
  | { type: "note"; text: BiLang }
  | { type: "contact-info"; hours: BiLang; area: BiLang; response: BiLang }
  | { type: "mini-stats"; items: { value: string; label: BiLang }[] }
  | { type: "materials"; heading?: BiLang; items: MaterialItem[] };

export interface ServicePopupData {
  id: string;
  heading: BiLang;
  tagline: BiLang;
  blocks: ServiceBlock[];
  ctaLabel: BiLang;
  ctaHref: string;
}

export const SERVICES: ServicePopupData[] = [
  /* ── VEJA ──────────────────────────────────────────────── */
  {
    id: "veja",
    heading: { lt: "Vejos įrengimas Vilniuje", en: "Lawn Installation in Vilnius" },
    tagline: { lt: "Ruloninė nuo 8 €/m² · Sėjama nuo 4 €/m²", en: "Roll-out from 8 €/m² · Seeded from 4 €/m²" },
    ctaLabel: { lt: "Gauti kainą", en: "Get a Quote" },
    ctaHref: "#kalkuliatorius",
    blocks: [
      {
        type: "comparison",
        items: [
          {
            title: { lt: "Ruloninė veja", en: "Roll-out lawn" },
            price: "nuo 8 €/m²",
            highlight: true,
            bullets: {
              lt: ["Paruošta iš karto", "Grunto paruošimas įskaičiuotas", "Garantija 30 dienų"],
              en: ["Ready immediately", "Ground prep included", "30-day guarantee"],
            },
          },
          {
            title: { lt: "Sėjama veja", en: "Seeded lawn" },
            price: "nuo 4 €/m²",
            bullets: {
              lt: ["Sudygsta per 3–4 sav.", "Ekonomiška dideliems plotams", "Tinka nuo gegužės"],
              en: ["Grows in 3–4 weeks", "Cost-effective for large areas", "Suitable from May"],
            },
          },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Kaip vyksta", en: "How it works" },
        steps: [
          {
            title: { lt: "Grunto paruošimas", en: "Ground preparation" },
            desc: { lt: "Senoji veja ir šaknys šalinamos, žemė lyginami ir tręšiama", en: "Old lawn and roots removed, ground leveled and fertilized" },
          },
          {
            title: { lt: "Sėjimas arba rolinas", en: "Seeding or turf roll" },
            desc: { lt: "Pagal pasirinktą tipą — dedamas rolininis kilimas arba sėjama", en: "Depending on choice — turf rolls laid or seeds sown evenly" },
          },
          {
            title: { lt: "Pirmas laistymas", en: "First watering" },
            desc: { lt: "Atliekamas iš karto po darbų, pateikiamos priežiūros instrukcijos", en: "Done immediately after works, care instructions provided" },
          },
        ],
      },
      {
        type: "note",
        text: { lt: "Sezonas: gegužė–rugsėjis. Vietos apžiūra nemokama.", en: "Season: May–September. Site visit is free." },
      },
    ],
  },

  /* ── APŽELDINIMAS ───────────────────────────────────────── */
  {
    id: "apzeldinimas",
    heading: { lt: "Teritorijos apželdinimas", en: "Landscape Planting" },
    tagline: { lt: "Kaina pagal projektą — nemokama apžiūra", en: "Priced per project — free site visit" },
    ctaLabel: { lt: "Gauti pasiūlymą", en: "Get a Proposal" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Kas įeina", en: "What's included" },
        items: [
          { lt: "Augalų parinkimas pagal vietą, dirvą ir stilių", en: "Plant selection by location, soil and style" },
          { lt: "Sodinimas su 1 metų garantija", en: "Planting with 1-year guarantee" },
          { lt: "Mulčiavimas ir apsauga nuo piktžolių", en: "Mulching and weed protection" },
          { lt: "Pirmos priežiūros konsultacija", en: "First-care consultation included" },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Procesas", en: "Process" },
        steps: [
          {
            title: { lt: "Apžiūra ir projektas", en: "Site visit and plan" },
            desc: { lt: "Atvykstame nemokamai, aptariame poreikius ir teritoriją", en: "We visit for free, discuss needs and site conditions" },
          },
          {
            title: { lt: "Augalų parinkimas", en: "Plant selection" },
            desc: { lt: "Parenkami augalai pagal klimatą, šviesos kiekį ir stilių", en: "Plants chosen by climate, light conditions and aesthetic" },
          },
          {
            title: { lt: "Sodinimas ir priežiūra", en: "Planting and care" },
            desc: { lt: "Sodinimas pagal suderintą planą su mulčiavimo darbais", en: "Planting per agreed plan including mulching works" },
          },
        ],
      },
      {
        type: "note",
        text: { lt: "Dirbame su architektų želdynų projektais. Kaina pateikiama po apžiūros.", en: "We work with architect-designed planting plans. Price given after site visit." },
      },
    ],
  },

  /* ── LAISTYMAS ──────────────────────────────────────────── */
  {
    id: "laistymas",
    heading: { lt: "Automatinės laistymo sistemos", en: "Automatic Irrigation Systems" },
    tagline: { lt: "Hunter · Rain Bird įranga · Įrengimas ir žieminimas", en: "Hunter · Rain Bird · Installation and winterisation" },
    ctaLabel: { lt: "Gauti pasiūlymą", en: "Get a Proposal" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Sistemos tipai", en: "System types" },
        items: [
          { lt: "Pop-up purškikliai — vejos laistymas (iki 15 m spindulio)", en: "Pop-up sprinklers — lawn irrigation (up to 15 m radius)" },
          { lt: "Lašelinis laistymas — krūmams ir gėlynams", en: "Drip irrigation — shrubs and flowerbeds" },
          { lt: "Mikrolaistymas — terasoms, vazonams, žolelių darželiams", en: "Micro-irrigation — terraces, pots, herb gardens" },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Įrengimas", en: "Installation" },
        steps: [
          {
            title: { lt: "Projektavimas", en: "System design" },
            desc: { lt: "Pagal teritorijos planą apskaičiuojamas slėgis, sektoriai ir šlangų trasa", en: "Pressure, zones and pipe routing calculated from site plan" },
          },
          {
            title: { lt: "Montavimas", en: "Installation" },
            desc: { lt: "Tranšėjos kasamos, vamzdžiai klojami, valdiklis programuojamas", en: "Trenches dug, pipes laid, controller programmed" },
          },
          {
            title: { lt: "Žieminimas", en: "Winterisation" },
            desc: { lt: "Kasmetinė žieminimo paslauga — sistema išpučiama ir paruošiama žiemai", en: "Annual winterisation — system blown out and winterised" },
          },
        ],
      },
      {
        type: "note",
        text: { lt: "Kaina pagal plotą ir sistemos sudėtingumą. Nemokamas matavimas.", en: "Priced by area and system complexity. Free survey." },
      },
    ],
  },

  /* ── DARBAI ─────────────────────────────────────────────── */
  {
    id: "darbai",
    heading: { lt: "170+ atliktų projektų", en: "170+ Completed Projects" },
    tagline: { lt: "Veja, apželdinimas, trinkelės Vilniuje ir rajone", en: "Lawn, planting, paving in Vilnius and surroundings" },
    ctaLabel: { lt: "Žiūrėti galeriją", en: "View Gallery" },
    ctaHref: "/darbai",
    blocks: [
      {
        type: "mini-stats",
        items: [
          { value: "170+", label: { lt: "Atliktų projektų", en: "Projects completed" } },
          { value: "12+",  label: { lt: "Metų patirtis", en: "Years of experience" } },
          { value: "5",    label: { lt: "Paslaugų sritys", en: "Service categories" } },
        ],
      },
      {
        type: "list",
        heading: { lt: "Projektuose", en: "Projects include" },
        items: [
          { lt: "Privačių namų kiemai ir sodai", en: "Private home yards and gardens" },
          { lt: "Komercinių teritorijų apželdinimas", en: "Commercial landscape planting" },
          { lt: "Trinkelių takai ir automobilių aikštelės", en: "Paved paths and car parks" },
          { lt: "Automatinės laistymo sistemos", en: "Automatic irrigation systems" },
        ],
      },
      {
        type: "note",
        text: { lt: "Galerija su filtrais pagal paslaugos tipą. Kiekvienas projektas su aprašymu ir vieta.", en: "Gallery with filters by service type. Each project with description and location." },
      },
    ],
  },

  /* ── TRINKELĖS ──────────────────────────────────────────── */
  {
    id: "trinkelės",
    heading: { lt: "Trinkelių klojimas ir takai", en: "Paving & Paths" },
    tagline: { lt: "40–65 €/m² priklausomai nuo medžiagos", en: "40–65 €/m² depending on material" },
    ctaLabel: { lt: "Gauti kainą", en: "Get a Quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "materials",
        heading: { lt: "Medžiagos", en: "Materials" },
        items: [
          { name: { lt: "Betoninės trinkelės", en: "Concrete paving" }, price: "nuo 40 €/m²", desc: { lt: "Patvarūs, platus spalvų pasirinkimas", en: "Durable, wide colour range" } },
          { name: { lt: "Granito trinkelės", en: "Granite setts" },    price: "nuo 55 €/m²", desc: { lt: "Natūralus akmuo, ilgaamžiai", en: "Natural stone, long-lasting" } },
          { name: { lt: "Klinkerinės trinkelės", en: "Clinker brick" }, price: "nuo 55 €/m²", desc: { lt: "Klasikinis stilius, atsparus šalčiui", en: "Classic style, frost-resistant" } },
          { name: { lt: "Natūralus akmuo", en: "Natural stone" },      price: "nuo 65 €/m²", desc: { lt: "Premium išvaizda, unikali tekstūra", en: "Premium look, unique texture" } },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Technologija", en: "Process" },
        steps: [
          {
            title: { lt: "Grunto ir pagrindo paruošimas", en: "Ground and base preparation" },
            desc: { lt: "Iškasamas griovys, sutankinamas gruntas", en: "Trench dug, subgrade compacted" },
          },
          {
            title: { lt: "Skaldos ir smėlio sluoksniai", en: "Gravel and sand layers" },
            desc: { lt: "Smulki skaldos frakcija + smėlio lova — būtina stabilumui", en: "Fine gravel + sand bed — essential for stability" },
          },
          {
            title: { lt: "Klojimas ir siūlių užpildymas", en: "Laying and joint filling" },
            desc: { lt: "Trinkelės klojamos, siūlės užpildomos ir vibroplokšte sutankinamos", en: "Pavers laid, joints filled and compacted with plate vibrator" },
          },
        ],
      },
    ],
  },

  /* ── PREKYBA AUGALAIS ───────────────────────────────────── */
  {
    id: "prekyba",
    heading: { lt: "Dekoratyvinių augalų prekyba", en: "Ornamental Plant Sales" },
    tagline: { lt: "Parenkame pagal vietą, stilių ir Lietuvos klimatą", en: "Selected for your space, style and Lithuanian climate" },
    ctaLabel: { lt: "Konsultacija", en: "Book a Consultation" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Asortimentas", en: "Assortment" },
        items: [
          { lt: "Lapuočiai ir spygliuočiai medžiai", en: "Deciduous and coniferous trees" },
          { lt: "Dekoratyviniai krūmai ir gyvatvorės", en: "Ornamental shrubs and hedges" },
          { lt: "Daugiamečiai gėlynai", en: "Perennial flowerbeds" },
          { lt: "Sezoniniai augalai (pavasaris, ruduo)", en: "Seasonal plants (spring, autumn)" },
          { lt: "Grunto dangos ir žemės sluoksnio augalai", en: "Ground cover and understory plants" },
        ],
      },
      {
        type: "note",
        text: { lt: "Pristatymas į vietą ir sodinimas — viena paslauga. Konsultacija augalų priežiūrai įskaičiuota.", en: "Delivery and planting — one service. Care consultation included." },
      },
    ],
  },

  /* ── NAUDINGI PATARIMAI ─────────────────────────────────── */
  {
    id: "patarimai",
    heading: { lt: "Sodo priežiūros patarimai", en: "Garden Care Tips" },
    tagline: { lt: "Praktiniai ATD ekspertų patarimai Lietuvos klimatui", en: "Practical ATD expert advice for the Lithuanian climate" },
    ctaLabel: { lt: "Skaityti visus patarimus", en: "Read All Tips" },
    ctaHref: "/patarimai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Populiariausi straipsniai", en: "Popular articles" },
        items: [
          { lt: "Ruloninė vs sėjama veja: kurią pasirinkti?", en: "Roll-out vs seeded lawn: which to choose?" },
          { lt: "Trinkelių klojimas: ką reikia žinoti iš anksto", en: "Paving: what to know before you start" },
          { lt: "Automatinė laistymo sistema: ar verta namuose?", en: "Automatic irrigation: is it worth it at home?" },
          { lt: "10 geriausių augalų šešėliui Lietuvoje", en: "10 best plants for shade in Lithuania" },
          { lt: "Kaip paruošti sodą žiemai", en: "How to prepare your garden for winter" },
        ],
      },
      {
        type: "note",
        text: { lt: "Nauji straipsniai kiekvieną sezoną — praktiniai patarimai iš realių projektų.", en: "New articles every season — practical tips from real projects." },
      },
    ],
  },

  /* ── KONTAKTAI ──────────────────────────────────────────── */
  {
    id: "kontaktai",
    heading: { lt: "Susisiekite su ATD", en: "Contact ATD" },
    tagline: { lt: "Nemokama apžiūra ir konsultacija Vilniuje", en: "Free site visit and consultation in Vilnius" },
    ctaLabel: { lt: "Skambinti dabar", en: "Call Now" },
    ctaHref: "tel:+37065785096",
    blocks: [
      {
        type: "contact-info",
        hours:    { lt: "Pr.–Pt. 8:00–18:00 · Š. 9:00–14:00", en: "Mon–Fri 8:00–18:00 · Sat 9:00–14:00" },
        area:     { lt: "Vilnius · Vilniaus rajonas · Trakai", en: "Vilnius · Vilnius district · Trakai" },
        response: { lt: "Atsakome per 2 val. darbo dienomis", en: "We respond within 2 hours on working days" },
      },
      {
        type: "note",
        text: { lt: "Vietos apžiūra nemokama — atvykstame, įvertiname ir paruošiame pasiūlymą.", en: "Site visit is free — we come, assess and prepare a proposal." },
      },
    ],
  },
];

export function getService(id: string): ServicePopupData | undefined {
  return SERVICES.find((s) => s.id === id);
}
