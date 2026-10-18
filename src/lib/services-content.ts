export type BiLang = { lt: string; en: string };
export type Lang = "lt" | "en";

export interface ComparisonItem {
  title: BiLang;
  price: BiLang;
  highlight?: boolean;
  bullets: { lt: string[]; en: string[] };
}

export interface StepItem {
  title: BiLang;
  desc: BiLang;
}

export interface MaterialItem {
  name: BiLang;
  price: BiLang;
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
  image?: { src: string; alt: BiLang };
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
    image: {
      src: "/images/veja-mowed-stripes-1.jpg",
      alt: { lt: "Nupjauta dryžuota veja prie administracinio pastato", en: "Mowed striped lawn next to an office building" },
    },
    ctaLabel: { lt: "Gauti kainą", en: "Get a Quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "comparison",
        items: [
          {
            title: { lt: "Ruloninė veja", en: "Roll-out lawn" },
            price: { lt: "nuo 8 €/m²", en: "from 8 €/m²" },
            highlight: true,
            bullets: {
              lt: ["Žalias vaizdas iš karto; naudoti po įsišaknijimo", "Grunto darbai pagal pasiūlymą", "Garantijų sąlygos sutartyje"],
              en: ["Immediate green appearance; use after rooting", "Ground works as quoted", "Warranty terms in the contract"],
            },
          },
          {
            title: { lt: "Sėjama veja", en: "Seeded lawn" },
            price: { lt: "nuo 4 €/m²", en: "from 4 €/m²" },
            bullets: {
              lt: ["Dygimas priklauso nuo sąlygų", "Ekonomiška dideliems plotams", "Tinka nuo gegužės"],
              en: ["Germination depends on conditions", "Cost-effective for large areas", "Suitable from May"],
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
            desc: { lt: "Senoji veja ir šaknys šalinamos, gruntas lyginamas ir paruošiamas", en: "Old lawn and roots removed, ground leveled and fertilized" },
          },
          {
            title: { lt: "Sėja arba ruloninės vejos klojimas", en: "Seeding or turf roll" },
            desc: { lt: "Pagal pasirinktą tipą — klojama ruloninė veja arba sėjama", en: "Depending on choice — turf rolls laid or seeds sown evenly" },
          },
          {
            title: { lt: "Pirmas laistymas", en: "First watering" },
            desc: { lt: "Atliekamas iš karto po darbų, pateikiamos priežiūros instrukcijos", en: "Done immediately after works, care instructions provided" },
          },
        ],
      },
      {
        type: "note",
        text: { lt: "Darbų sezoną, apžiūros kainą ir garantijų sąlygas suderiname individualiai.", en: "The work season, site visit fee and warranty terms are agreed individually." },
      },
    ],
  },

  /* ── APŽELDINIMAS ───────────────────────────────────────── */
  {
    id: "apzeldinimas",
    heading: { lt: "Teritorijos apželdinimas", en: "Landscape Planting" },
    tagline: { lt: "Kaina ir apžiūros sąlygos pagal susitarimą", en: "Project pricing and site visits by agreement" },
    image: {
      src: "/images/apzeldinimas-courtyard-wide-1.jpg",
      alt: { lt: "Daugiabučio kiemo apželdinimas su gėlynu", en: "Apartment courtyard landscaping with flowerbed" },
    },
    ctaLabel: { lt: "Gauti pasiūlymą", en: "Get a Proposal" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Galima darbų apimtis", en: "Available scope of work" },
        items: [
          { lt: "Augalų parinkimas pagal vietą, dirvą ir stilių", en: "Plant selection by location, soil and style" },
          { lt: "Sodinimas pagal suderintą planą", en: "Planting according to the agreed plan" },
          { lt: "Mulčiavimas ir apsauga nuo piktžolių", en: "Mulching and weed protection" },
          { lt: "Priežiūros sąlygų aptarimas", en: "Discussing aftercare arrangements" },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Procesas", en: "Process" },
        steps: [
          {
            title: { lt: "Apžiūra ir projektas", en: "Site visit and plan" },
            desc: { lt: "Aptariame poreikius; apžiūros ir projektavimo apimtį bei kainą suderiname individualiai", en: "We discuss your needs; visit and design scope and fees are agreed individually" },
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
    image: {
      src: "/images/laistymas-sprinkler-action-1.jpg",
      alt: { lt: "Veikianti automatinė laistymo sistema", en: "Automatic irrigation system in action" },
    },
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
            desc: { lt: "Įvertiname vandens šaltinio duomenis, numatome sektorius ir vamzdžių trasas", en: "We assess water-source data and plan zones and pipe routes" },
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
        text: { lt: "Matavimo, projektavimo ir įrengimo apimtį bei kainą suderiname individualiai.", en: "Survey, design and installation scope and fees are agreed individually." },
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
        text: { lt: "Galerija su filtrais pagal paslaugos tipą. Projektai su aprašymais ir darbų eiga.", en: "Gallery with filters by service type. Projects with descriptions and work sequences." },
      },
    ],
  },

  /* ── TRINKELĖS ──────────────────────────────────────────── */
  {
    id: "trinkelės",
    heading: { lt: "Trinkelių klojimas ir takai", en: "Paving & Paths" },
    tagline: { lt: "Nuo 40 €/m²; galutinė kaina pagal darbų apimtį", en: "From 40 €/m²; final price based on the scope of work" },
    image: {
      src: "/images/trinkeles-plaza-1.jpg",
      alt: { lt: "Trinkelių aikštė prie pastato", en: "Paved plaza next to a building" },
    },
    ctaLabel: { lt: "Gauti kainą", en: "Get a Quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "materials",
        heading: { lt: "Medžiagos", en: "Materials" },
        items: [
          { name: { lt: "Betoninės trinkelės", en: "Concrete paving" }, price: { lt: "nuo 40 €/m²", en: "from 40 €/m²" }, desc: { lt: "Patvarios, platus spalvų pasirinkimas", en: "Durable, wide colour range" } },
          { name: { lt: "Granito trinkelės", en: "Granite setts" },    price: { lt: "nuo 55 €/m²", en: "from 55 €/m²" }, desc: { lt: "Natūralus akmuo, ilgaamžės", en: "Natural stone, long-lasting" } },
          { name: { lt: "Klinkerinės trinkelės", en: "Clinker brick" }, price: { lt: "nuo 55 €/m²", en: "from 55 €/m²" }, desc: { lt: "Klasikinis stilius, atsparus šalčiui", en: "Classic style, frost-resistant" } },
          { name: { lt: "Natūralus akmuo", en: "Natural stone" },      price: { lt: "nuo 65 €/m²", en: "from 65 €/m²" }, desc: { lt: "Premium išvaizda, unikali tekstūra", en: "Premium look, unique texture" } },
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
        text: { lt: "Augalų tiekimo, pristatymo, sodinimo ir priežiūros konsultacijų apimtį bei kainą suderiname individualiai.", en: "Plant supply, delivery, planting and care advice scope and fees are agreed individually." },
      },
    ],
  },

  /* ── NAUDINGI PATARIMAI ─────────────────────────────────── */
  {
    id: "patarimai",
    heading: { lt: "Naudinga informacija", en: "Useful Information" },
    tagline: { lt: "Pasiruoškite sklypo ir tvenkinio darbams", en: "Prepare for landscaping and pond work" },
    ctaLabel: { lt: "Skaityti visus patarimus", en: "Read All Guides" },
    ctaHref: "/patarimai",
    blocks: [{ type: "list", heading: { lt: "Straipsniai", en: "Guides" }, items: [
      { lt: "Kaip suplanuoti aplinkos tvarkymo darbus?", en: "How to plan a landscaping project" },
      { lt: "Tvenkinio kasimas: ką aptarti prieš pradedant?", en: "Planning pond excavation: questions to ask first" },
    ] }],
  },

  /* ── KONTAKTAI ──────────────────────────────────────────── */
  {
    id: "kontaktai",
    heading: { lt: "Susisiekite su ATD", en: "Contact ATD" },
    tagline: { lt: "Nemokama pirminė konsultacija; apžiūra pagal susitarimą", en: "Free initial consultation; site visits by agreement" },
    ctaLabel: { lt: "Skambinti dabar", en: "Call Now" },
    ctaHref: "tel:+37065785096",
    blocks: [
      {
        type: "contact-info",
        hours:    { lt: "Pr.–Pt. 8:00–18:00 · Š. 9:00–14:00", en: "Mon–Fri 8:00–18:00 · Sat 9:00–14:00" },
        area:     { lt: "Vilnius ir Vilniaus rajonas", en: "Vilnius and Vilnius district" },
        response: { lt: "Pasiūlymo pateikimo terminą suderiname individualiai.", en: "The quotation timeline is agreed individually." },
      },
      {
        type: "note",
        text: { lt: "Nemokama tik pirminė konsultacija. Apžiūros, matavimo ir projektavimo sąlygas aptariame iš anksto.", en: "Only the initial consultation is free. Site visit, survey and design terms are agreed in advance." },
      },
    ],
  },
];

export function getService(id: string): ServicePopupData | undefined {
  return SERVICES.find((s) => s.id === id);
}
