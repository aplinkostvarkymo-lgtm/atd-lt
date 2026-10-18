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
    heading: { lt: "Vejos įrengimas Vilniuje", en: "Lawn installation in Vilnius" },
    tagline: { lt: "Ruloninė nuo 8 €/m² · Sėjama nuo 4 €/m²", en: "Turf from 8 €/m² · Seeded lawn from 4 €/m²" },
    image: {
      src: "/images/veja-mowed-stripes-1.jpg",
      alt: { lt: "Nupjauta dryžuota veja prie administracinio pastato", en: "Mowed striped lawn next to an office building" },
    },
    ctaLabel: { lt: "Gauti kainą", en: "Get a quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "comparison",
        items: [
          {
            title: { lt: "Ruloninė veja", en: "Turf" },
            price: { lt: "nuo 8 €/m²", en: "from 8 €/m²" },
            highlight: true,
            bullets: {
              lt: ["Žalia iš karto, naudoti galima įsišaknijus", "Grunto darbai pagal pasiūlymą", "Garantijų sąlygos sutartyje"],
              en: ["Green straight away; allow it to root before use", "Ground preparation listed in your quote", "Warranty terms in the contract"],
            },
          },
          {
            title: { lt: "Sėjama veja", en: "Seeded lawn" },
            price: { lt: "nuo 4 €/m²", en: "from 4 €/m²" },
            bullets: {
              lt: ["Dygimas priklauso nuo sąlygų", "Ekonomiška dideliems plotams", "Sėjos laiką parenkame pagal orus"],
              en: ["Germination depends on conditions", "Cost-effective for large areas", "Sowing timed to suit the weather"],
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
            desc: { lt: "Pašaliname seną veją ir šaknis, išlyginame ir paruošiame gruntą", en: "We remove the old lawn and roots, then level and prepare the soil" },
          },
          {
            title: { lt: "Sėja arba ruloninės vejos klojimas", en: "Sowing or laying turf" },
            desc: { lt: "Klojame ruloninę veją arba sėjame pasirinktą žolių mišinį", en: "We lay turf or sow the chosen grass mix" },
          },
          {
            title: { lt: "Pirmas laistymas", en: "First watering" },
            desc: { lt: "Palaistome naują veją ir paaiškiname, kaip ją prižiūrėti", en: "We water the new lawn and explain how to look after it" },
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
    heading: { lt: "Teritorijos apželdinimas", en: "Landscape planting" },
    tagline: { lt: "Kaina ir apžiūros sąlygos pagal susitarimą", en: "Project pricing and site visits by agreement" },
    image: {
      src: "/images/apzeldinimas-courtyard-wide-1.jpg",
      alt: { lt: "Daugiabučio kiemo apželdinimas su gėlynu", en: "Apartment courtyard landscaping with flowerbed" },
    },
    ctaLabel: { lt: "Gauti pasiūlymą", en: "Get a quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Kokius darbus atliekame", en: "What we do" },
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
            desc: { lt: "Aptariame, ko norite. Dėl apžiūros ir plano parengimo kainos susitariame iš anksto", en: "We discuss what you want and agree the visit and design fees in advance" },
          },
          {
            title: { lt: "Augalų parinkimas", en: "Plant selection" },
            desc: { lt: "Augalus parenkame pagal klimatą, šviesą ir norimą vaizdą", en: "We choose plants for the climate, light and look you want" },
          },
          {
            title: { lt: "Sodinimas ir priežiūra", en: "Planting and care" },
            desc: { lt: "Sodiname ir mulčiuojame pagal sutartą planą", en: "We plant and mulch to the agreed plan" },
          },
        ],
      },
      {
        type: "note",
        text: { lt: "Dirbame pagal architektų želdynų planus. Kainą apskaičiuojame peržiūrėję projektą arba apžiūrėję sklypą.", en: "We work from architects’ planting plans and prepare a quote after reviewing the design or visiting the site." },
      },
    ],
  },

  /* ── LAISTYMAS ──────────────────────────────────────────── */
  {
    id: "laistymas",
    heading: { lt: "Automatinės laistymo sistemos", en: "Automatic irrigation systems" },
    tagline: { lt: "Hunter · Rain Bird įranga · Įrengimas ir nuorinimas", en: "Hunter · Rain Bird · Installation and system blowout" },
    image: {
      src: "/images/laistymas-sprinkler-action-1.jpg",
      alt: { lt: "Veikianti automatinė laistymo sistema", en: "Automatic irrigation system in action" },
    },
    ctaLabel: { lt: "Gauti pasiūlymą", en: "Get a quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Sistemos tipai", en: "System types" },
        items: [
          { lt: "Iššokantys purkštuvai vejai", en: "Pop-up sprinklers for lawns" },
          { lt: "Lašelinis laistymas krūmams ir gėlynams", en: "Drip irrigation for shrubs and flower beds" },
          { lt: "Mikrolaistymas terasoms, vazonams ir žolelių darželiams", en: "Micro-irrigation for terraces, pots and herb gardens" },
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
            desc: { lt: "Iškasame tranšėjas, paklojame vamzdžius ir suprogramuojame valdiklį", en: "We dig trenches, lay pipes and programme the controller" },
          },
          {
            title: { lt: "Nuorinimas", en: "System blowout" },
            desc: { lt: "Prieš žiemą iš sistemos išpučiame vandenį. Paslaugą užsakote atskirai", en: "We blow the water out of the system before winter. This service is booked separately" },
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
    heading: { lt: "170+ atliktų projektų", en: "170+ completed projects" },
    tagline: { lt: "Veja, apželdinimas, trinkelės Vilniuje ir rajone", en: "Lawn, planting, paving in Vilnius and surroundings" },
    ctaLabel: { lt: "Žiūrėti galeriją", en: "View gallery" },
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
        text: { lt: "Peržiūrėkite mūsų darbus ir skaitykite, kaip juos atlikome.", en: "See our work and read how we carried it out." },
      },
    ],
  },

  /* ── TRINKELĖS ──────────────────────────────────────────── */
  {
    id: "trinkelės",
    heading: { lt: "Trinkelių klojimas ir takai", en: "Paths and paving" },
    tagline: { lt: "Nuo 40 €/m²; galutinė kaina pagal darbų apimtį", en: "From 40 €/m²; final price based on the scope of work" },
    image: {
      src: "/images/trinkeles-plaza-1.jpg",
      alt: { lt: "Trinkelių aikštė prie pastato", en: "Paved plaza next to a building" },
    },
    ctaLabel: { lt: "Gauti kainą", en: "Get a quote" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "materials",
        heading: { lt: "Medžiagos", en: "Materials" },
        items: [
          { name: { lt: "Betoninės trinkelės", en: "Concrete paving" }, price: { lt: "nuo 40 €/m²", en: "from 40 €/m²" }, desc: { lt: "Patvarios, platus spalvų pasirinkimas", en: "Durable, wide colour range" } },
          { name: { lt: "Granito trinkelės", en: "Granite setts" },    price: { lt: "nuo 55 €/m²", en: "from 55 €/m²" }, desc: { lt: "Natūralus akmuo, ilgaamžės", en: "Natural stone, long-lasting" } },
          { name: { lt: "Klinkerinės trinkelės", en: "Clay pavers" }, price: { lt: "nuo 55 €/m²", en: "from 55 €/m²" }, desc: { lt: "Šalčiui atsparios molio trinkelės", en: "Frost-resistant clay pavers" } },
          { name: { lt: "Natūralus akmuo", en: "Natural stone" },      price: { lt: "nuo 65 €/m²", en: "from 65 €/m²" }, desc: { lt: "Skirtingų tekstūrų natūralus akmuo", en: "Natural stone in a range of textures" } },
        ],
      },
      {
        type: "steps",
        heading: { lt: "Technologija", en: "Process" },
        steps: [
          {
            title: { lt: "Grunto ir pagrindo paruošimas", en: "Ground and base preparation" },
            desc: { lt: "Paruošiame vietą dangai ir sutankiname gruntą", en: "We excavate the paving area and compact the ground" },
          },
          {
            title: { lt: "Skaldos ir smėlio sluoksniai", en: "Gravel and sand layers" },
            desc: { lt: "Pagrindo sluoksnius parenkame pagal gruntą ir dangos apkrovą", en: "We select the base layers for the soil and expected loads" },
          },
          {
            title: { lt: "Klojimas ir siūlių užpildymas", en: "Laying and joint filling" },
            desc: { lt: "Paklojame trinkeles, užpildome siūles ir dangą sutankiname vibroplokšte", en: "We lay the pavers, fill the joints and compact the surface with a plate compactor" },
          },
        ],
      },
    ],
  },

  /* ── PREKYBA AUGALAIS ───────────────────────────────────── */
  {
    id: "prekyba",
    heading: { lt: "Dekoratyvinių augalų prekyba", en: "Ornamental plants" },
    tagline: { lt: "Parenkame pagal vietą, stilių ir Lietuvos klimatą", en: "Selected for your space, style and Lithuanian climate" },
    ctaLabel: { lt: "Konsultacija", en: "Book a consultation" },
    ctaHref: "/kontaktai",
    blocks: [
      {
        type: "list",
        heading: { lt: "Asortimentas", en: "Plant range" },
        items: [
          { lt: "Lapuočiai ir spygliuočiai medžiai", en: "Deciduous and coniferous trees" },
          { lt: "Dekoratyviniai krūmai ir gyvatvorės", en: "Ornamental shrubs and hedges" },
          { lt: "Daugiamečiai gėlynai", en: "Perennial flowerbeds" },
          { lt: "Sezoniniai augalai (pavasaris, ruduo)", en: "Seasonal plants (spring, autumn)" },
          { lt: "Žemę dengiantys ir po medžiais augantys augalai", en: "Ground cover and understory plants" },
        ],
      },
      {
        type: "note",
        text: { lt: "Sutariame, kokius augalus atvešime, ar juos sodinsime ir kokių priežiūros konsultacijų reikės. Visų paslaugų kainas aptariame iš anksto.", en: "We agree which plants to deliver, whether we will plant them and what care advice you need. We discuss all service fees in advance." },
      },
    ],
  },

  /* ── NAUDINGI PATARIMAI ─────────────────────────────────── */
  {
    id: "patarimai",
    heading: { lt: "Naudinga informacija", en: "Useful information" },
    tagline: { lt: "Pasiruoškite sklypo ir tvenkinio darbams", en: "Prepare for landscaping and pond work" },
    ctaLabel: { lt: "Skaityti visus patarimus", en: "Read all guides" },
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
    ctaLabel: { lt: "Skambinti dabar", en: "Call now" },
    ctaHref: "tel:+37065785096",
    blocks: [
      {
        type: "contact-info",
        hours:    { lt: "Pr.–Pt. 8:00–18:00 · Š. 9:00–14:00", en: "Mon–Fri 8:00–18:00 · Sat 9:00–14:00" },
        area:     { lt: "Vilnius ir Vilniaus rajonas", en: "Vilnius and Vilnius district" },
        response: { lt: "Aptarę darbus susitarsime, kada pateiksime pasiūlymą.", en: "After discussing the job, we agree when to send your quote." },
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
