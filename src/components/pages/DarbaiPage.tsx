"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

type Category = "all" | "veja" | "apzeldinimas" | "trinkeles" | "laistymas";

interface GalleryItem {
  id: number;
  src: string;
  category: Category;
  alt: { lt: string; en: string };
  title: { lt: string; en: string };
}

const ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: "/images/veja-mowed-stripes-1.jpg",
    category: "veja",
    alt: { lt: "Ruloninė veja — lygūs žali dryžiai", en: "Roll-on lawn — neat green stripes" },
    title: { lt: "Ruloninė veja su dryžiais", en: "Striped roll-on lawn" },
  },
  {
    id: 2,
    src: "/images/veja-mowed-stripes-2.jpg",
    category: "veja",
    alt: { lt: "Prižiūrėta veja verslo teritorijoje", en: "Maintained lawn at business premises" },
    title: { lt: "Veja verslo teritorijoje", en: "Business property lawn" },
  },
  {
    id: 3,
    src: "/images/veja-lakeside-large-1.jpg",
    category: "veja",
    alt: { lt: "Platus vejos plotas prie vandens", en: "Large lawn area by the water" },
    title: { lt: "Didelio ploto veja prie ežero", en: "Large lawn by the lake" },
  },
  {
    id: 4,
    src: "/images/veja-process-rulone-1.jpg",
    category: "veja",
    alt: { lt: "Ruloninės vejos klojimo procesas", en: "Roll-on lawn laying process" },
    title: { lt: "Ruloninės vejos klojimas", en: "Roll-on lawn installation" },
  },
  {
    id: 5,
    src: "/images/apzeldinimas-courtyard-wide-1.jpg",
    category: "apzeldinimas",
    alt: { lt: "Apželdintas kiemas su augalais", en: "Landscaped courtyard with plants" },
    title: { lt: "Kiemo apželdinimas", en: "Courtyard landscaping" },
  },
  {
    id: 6,
    src: "/images/apzeldinimas-traku-vokes-dvaras-1.jpg",
    category: "apzeldinimas",
    alt: { lt: "Trakų Vokės dvaro teritorija — apželdinimas", en: "Trakai Vokė manor grounds landscaping" },
    title: { lt: "Trakų Vokės dvaro apželdinimas", en: "Trakai Vokė manor landscaping" },
  },
  {
    id: 7,
    src: "/images/apzeldinimas-nt-projektas-1.jpg",
    category: "apzeldinimas",
    alt: { lt: "NT projekto apželdinimas pagal projektą", en: "Real estate project landscaping by design" },
    title: { lt: "NT projekto teritorija", en: "Real estate project grounds" },
  },
  {
    id: 8,
    src: "/images/apzeldinimas-park-path-statue-1.jpg",
    category: "apzeldinimas",
    alt: { lt: "Parko takelio ir skulptūros apželdinimas", en: "Park path and sculpture landscaping" },
    title: { lt: "Parko apželdinimas su takais", en: "Park landscaping with paths" },
  },
  {
    id: 9,
    src: "/images/apzeldinimas-closeup-flowers-1.jpg",
    category: "apzeldinimas",
    alt: { lt: "Gėlių sodinimas iš arti", en: "Flower planting close-up" },
    title: { lt: "Gėlių sodinimas", en: "Flower planting" },
  },
  {
    id: 10,
    src: "/images/apzeldinimas-closeup-flowers-2.jpg",
    category: "apzeldinimas",
    alt: { lt: "Dekoratyviniai augalai ir gėlės", en: "Decorative plants and flowers" },
    title: { lt: "Dekoratyviniai augalai", en: "Decorative plants" },
  },
  {
    id: 11,
    src: "/images/trinkeles-plaza-1.jpg",
    category: "trinkeles",
    alt: { lt: "Trinkelių klojimas — plaza", en: "Paving — plaza" },
    title: { lt: "Trinkelių klojimas, plaza", en: "Paving project, plaza" },
  },
  {
    id: 12,
    src: "/images/laistymas-sprinkler-action-1.jpg",
    category: "laistymas",
    alt: { lt: "Automatinė laistymo sistema veikimo metu", en: "Automatic irrigation system in action" },
    title: { lt: "Automatinė laistymo sistema", en: "Automatic irrigation system" },
  },
  {
    id: 13,
    src: "/images/apzeldinimas-public-irrigation-1.jpg",
    category: "laistymas",
    alt: { lt: "Laistymo sistema viešoje erdvėje", en: "Irrigation system in public space" },
    title: { lt: "Viešos erdvės laistymas", en: "Public space irrigation" },
  },
];

export function DarbaiPage() {
  const { lang } = useLanguage();
  const t = translations[lang].darbaiPage;
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.all },
    { key: "veja", label: t.category_veja },
    { key: "apzeldinimas", label: t.category_apzeldinimas },
    { key: "trinkeles", label: t.category_trinkeles },
    { key: "laistymas", label: t.category_laistymas },
  ];

  const filtered = active === "all" ? ITEMS : ITEMS.filter((i) => i.category === active);

  return (
    <main>
      {/* Hero */}
      <section className="bg-atd-cream pt-24 md:pt-28 pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center gap-1.5 text-atd-gray-soft font-body text-xs mb-6">
            <Link href="/" className="hover:text-atd-black transition-colors">
              {lang === "lt" ? "Pagrindinis" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-atd-black">{t.heading}</span>
          </nav>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-atd-black leading-tight">{t.heading}</h1>
          <p className="font-body text-base text-atd-gray-soft mt-3">{t.tagline}</p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-b border-atd-black/8 sticky top-[60px] z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {categories.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`shrink-0 px-4 py-1.5 font-body text-sm transition-all ${
                  active === key
                    ? "bg-atd-green text-white"
                    : "text-atd-gray-soft hover:text-atd-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-[4/3] overflow-hidden bg-atd-cream text-left w-full"
                  aria-label={item.title[lang]}
                >
                  <Image
                    src={item.src}
                    alt={item.alt[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-atd-black/0 group-hover:bg-atd-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-body text-xs text-white font-medium">{item.title[lang]}</p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          <p className="font-body text-xs text-atd-gray-soft text-center mt-10">{t.more_soon}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-atd-green py-12 md:py-16 text-center">
        <div className="max-w-lg mx-auto px-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">{t.cta_heading}</h2>
          <p className="font-body text-white/75 mt-3 mb-7">{t.cta_sub}</p>
          <Link
            href="/kontaktai"
            className="inline-flex items-center px-8 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]"
          >
            {t.cta_btn}
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 z-[80]"
              onClick={() => setLightbox(null)}
            />
            <motion.div
              key="lb"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-4 md:inset-12 z-[90] flex flex-col items-center justify-center"
              onClick={() => setLightbox(null)}
            >
              <div className="relative w-full h-full max-w-4xl mx-auto">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt[lang]}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-xs text-white/70 text-center px-4">
                {lightbox.title[lang]}
              </p>
              <button
                className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
                onClick={() => setLightbox(null)}
                aria-label="Uždaryti"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
