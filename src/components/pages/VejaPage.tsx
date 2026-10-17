"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { FacebookLink } from "@/components/ui/FacebookLink";

type VejaT = { [K in keyof typeof translations.lt.vejaPage]: string };

/* ── Motion helpers ───────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

/* ── Icons ────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      className="w-4 h-4 shrink-0"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */

function Hero({ t }: { t: VejaT }) {
  const stats = [
    { value: t.hero_stat1, label: t.hero_stat1_label },
    { value: t.hero_stat2, label: t.hero_stat2_label },
    { value: t.hero_stat3, label: t.hero_stat3_label },
  ];

  return (
    <section className="relative bg-atd-green pt-20 md:pt-24 pb-14 md:pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/veja-mowed-stripes-1.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-atd-black/60" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-white/50 font-body text-xs mb-8">
          <Link href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-white/60">{t.breadcrumb_services}</span>
          <span>/</span>
          <span className="text-white/90">{t.breadcrumb_current}</span>
        </nav>

        <motion.h1
          className="font-display font-bold text-4xl md:text-6xl text-white leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.hero_heading}
        </motion.h1>

        <motion.p
          className="font-body text-base md:text-lg text-white/80 mt-5 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t.hero_tagline}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <a
            href="tel:+37065785096"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]"
          >
            {t.hero_cta_call}: +370 657 85096
          </a>
          <Link
            href="/kontaktai"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]"
          >
            {t.hero_cta_quote}
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6 mt-12 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div className="font-display font-bold text-2xl text-white">{s.value}</div>
              <div className="font-body text-xs text-white/60 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Types comparison ─────────────────────────────────────── */

function Types({ t }: { t: VejaT }) {
  const type1Pros = [t.type1_pro1, t.type1_pro2, t.type1_pro3];
  const type2Pros = [t.type2_pro1, t.type2_pro2, t.type2_pro3];

  return (
    <section className="bg-atd-cream py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-10" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.types_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2">{t.types_sub}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Ruloninė — featured */}
          <motion.div
            className="bg-white border-2 border-atd-green relative flex flex-col"
            {...fadeUp(0.1)}
          >
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-atd-green text-white font-body text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                {t.type1_tag}
              </span>
            </div>
            <div className="p-6 pb-5 border-b border-atd-green/15">
              <h3 className="font-display font-bold text-xl text-atd-black">{t.type1_name}</h3>
              <p className="font-display font-bold text-2xl text-atd-green mt-1">{t.type1_price}</p>
              <p className="font-body text-sm text-atd-gray-soft mt-3 leading-relaxed">{t.type1_desc}</p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2.5">
                {type1Pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-atd-black">
                    <span className="text-atd-green mt-0.5"><CheckIcon /></span>
                    {pro}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-atd-black/8">
                <span className="font-body text-xs text-atd-gray-soft">{t.types_best_label} </span>
                <span className="font-body text-xs text-atd-black font-medium">{t.type1_best}</span>
              </div>
            </div>
          </motion.div>

          {/* Sėjama */}
          <motion.div
            className="bg-white border border-atd-black/10 flex flex-col"
            {...fadeUp(0.18)}
          >
            <div className="p-6 pb-5 border-b border-atd-black/8">
              <h3 className="font-display font-bold text-xl text-atd-black">{t.type2_name}</h3>
              <p className="font-display font-bold text-2xl text-atd-green mt-1">{t.type2_price}</p>
              <p className="font-body text-sm text-atd-gray-soft mt-3 leading-relaxed">{t.type2_desc}</p>
            </div>
            <div className="p-6 flex-1">
              <ul className="space-y-2.5">
                {type2Pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-atd-black">
                    <span className="text-atd-green mt-0.5"><CheckIcon /></span>
                    {pro}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-atd-black/8">
                <span className="font-body text-xs text-atd-gray-soft">{t.types_best_label} </span>
                <span className="font-body text-xs text-atd-black font-medium">{t.type2_best}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Step illustrations ───────────────────────────────────── */

function IllustrationSiteVisit() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="240" fill="#EDEAE2"/>
      <circle cx="160" cy="118" r="76" fill="#2D5016" opacity="0.07"/>
      {/* House silhouette */}
      <g opacity="0.45">
        <rect x="34" y="144" width="62" height="50" stroke="#2D5016" strokeWidth="2"/>
        <polygon points="28,146 65,112 102,146" stroke="#2D5016" strokeWidth="2"/>
        <rect x="48" y="163" width="16" height="31" stroke="#2D5016" strokeWidth="1.5"/>
      </g>
      {/* Dashed line to clipboard */}
      <path d="M98 168 Q118 162 118 138" stroke="#2D5016" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.35"/>
      {/* Clipboard — floats */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 0,-6; 0,0" dur="3.5s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1"/>
        <rect x="114" y="66" width="92" height="116" rx="6" fill="white" stroke="#2D5016" strokeWidth="2.5"/>
        <rect x="137" y="56" width="46" height="18" rx="4" fill="#2D5016"/>
        <line x1="128" y1="102" x2="196" y2="102" stroke="#2D5016" strokeWidth="1.5" opacity="0.28"/>
        <line x1="128" y1="116" x2="196" y2="116" stroke="#2D5016" strokeWidth="1.5" opacity="0.28"/>
        <line x1="128" y1="130" x2="185" y2="130" stroke="#2D5016" strokeWidth="1.5" opacity="0.28"/>
        <path d="M129 154 L144 170 L172 144" stroke="#2D5016" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      {/* Location pin */}
      <g transform="translate(65,115)">
        <path d="M0-13 C6-13 11-7 11,0 C11,7 0,18 0,18 C0,18-11,7-11,0 C-11,-7-6,-13 0,-13Z" fill="#2D5016" opacity="0.75"/>
        <circle cx="0" cy="0" r="4" fill="white"/>
      </g>
      <rect y="218" width="320" height="22" fill="#2D5016" opacity="0.05"/>
    </svg>
  );
}

function IllustrationGroundPrep() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky */}
      <rect width="320" height="240" fill="#EDEAE2"/>
      {/* Ground layers */}
      <path d="M0 148 Q80 140 160 144 Q240 148 320 142 L320 240 L0 240Z" fill="#A08868"/>
      <path d="M0 170 Q80 163 160 167 Q240 171 320 164 L320 240 L0 240Z" fill="#856A50"/>
      <rect y="195" width="320" height="45" fill="#6B5438"/>
      {/* Soil texture pebbles */}
      <ellipse cx="55" cy="162" rx="9" ry="5" fill="#8B7055" opacity="0.7"/>
      <ellipse cx="108" cy="158" rx="6" ry="4" fill="#8B7055" opacity="0.65"/>
      <ellipse cx="200" cy="163" rx="8" ry="5" fill="#7A6045" opacity="0.7"/>
      <ellipse cx="255" cy="157" rx="7" ry="4" fill="#7A6045" opacity="0.6"/>
      <ellipse cx="290" cy="165" rx="5" ry="3" fill="#8B7055" opacity="0.55"/>
      {/* Rake — swings left/right */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="-6,160,95; 6,160,95; -6,160,95" dur="2.8s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1"/>
        {/* Handle */}
        <line x1="160" y1="52" x2="160" y2="148" stroke="#8B6535" strokeWidth="9" strokeLinecap="round"/>
        <line x1="160" y1="52" x2="160" y2="148" stroke="#A07840" strokeWidth="6" strokeLinecap="round"/>
        {/* Head */}
        <line x1="110" y1="148" x2="210" y2="148" stroke="#2D5016" strokeWidth="7" strokeLinecap="round"/>
        {/* Tines */}
        {[118, 133, 148, 163, 178, 193, 208].map((x, i) => (
          <line key={i} x1={x} y1="148" x2={x - 4} y2="170" stroke="#2D5016" strokeWidth="3.5" strokeLinecap="round"/>
        ))}
      </g>
    </svg>
  );
}

function IllustrationTurfLaying() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="320" height="240" fill="#EDEAE2"/>
      {/* Bare soil right side */}
      <rect x="160" y="128" width="160" height="112" fill="#A08868"/>
      <rect x="160" y="160" width="160" height="80" fill="#8B7055"/>
      {/* Turf left side */}
      <rect x="0" y="128" width="160" height="112" fill="#3A6618"/>
      {/* Grass blades */}
      {[8,20,32,44,56,68,80,92,104,116,128,140,152].map((x) => (
        <g key={x}>
          <path d={`M${x} 128 Q${x+4} 116 ${x+8} 128`} stroke="#4a8a20" strokeWidth="2" strokeLinecap="round"/>
          <path d={`M${x+4} 128 Q${x+7} 119 ${x+12} 128`} stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        </g>
      ))}
      {/* Seam */}
      <line x1="160" y1="128" x2="160" y2="240" stroke="#1a3009" strokeWidth="2" opacity="0.4"/>
      {/* Roll — gentle rotate */}
      <g>
        <animateTransform attributeName="transform" type="rotate"
          values="0,160,128; 8,160,128; 0,160,128" dur="4s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1"/>
        <circle cx="160" cy="128" r="30" fill="#3A6618" stroke="#2D5016" strokeWidth="2.5"/>
        <circle cx="160" cy="128" r="20" fill="none" stroke="#2D5016" strokeWidth="1.5" opacity="0.45"/>
        <circle cx="160" cy="128" r="10" fill="none" stroke="#2D5016" strokeWidth="1.5" opacity="0.35"/>
        <circle cx="160" cy="128" r="3" fill="#2D5016" opacity="0.6"/>
        {/* Grass on roll top */}
        {[-10,-2,6,14].map((x) => (
          <path key={x} d={`M${160+x} 98 Q${163+x} 89 ${167+x} 98`} stroke="#4a8a20" strokeWidth="2" strokeLinecap="round"/>
        ))}
      </g>
    </svg>
  );
}

/* ── Process ──────────────────────────────────────────────── */

function Process({ t }: { t: VejaT }) {
  const steps = [
    { n: "1", title: t.step1_title, desc: t.step1_desc, Illus: IllustrationSiteVisit },
    { n: "2", title: t.step2_title, desc: t.step2_desc, Illus: IllustrationGroundPrep },
    { n: "3", title: t.step3_title, desc: t.step3_desc, Illus: IllustrationTurfLaying },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-12" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.process_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2">{t.process_sub}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-6 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-atd-green/20" />

          {steps.map((step, i) => (
            <motion.div key={i} className="relative" {...fadeUp(i * 0.12)}>
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-0">
                <div className="shrink-0 w-12 h-12 rounded-full bg-atd-green flex items-center justify-center text-white font-display font-bold text-lg relative z-10">
                  {step.n}
                </div>
                <div className="md:mt-5">
                  <h3 className="font-display font-bold text-lg text-atd-black">{step.title}</h3>
                  <p className="font-body text-sm text-atd-gray-soft mt-2 leading-relaxed">{step.desc}</p>
                  <div className="aspect-[4/3] mt-4 overflow-hidden">
                    <step.Illus />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Results gallery ──────────────────────────────────────── */

function Results({ t }: { t: VejaT }) {
  const photos = [
    { src: "/images/veja-mowed-stripes-1.jpg", alt: t.results_alt1 },
    { src: "/images/veja-mowed-stripes-2.jpg", alt: t.results_alt2 },
    { src: "/images/veja-lakeside-large-1.jpg", alt: t.results_alt3 },
  ];

  return (
    <section className="bg-atd-cream py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-10" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.results_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2">{t.results_sub}</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {photos.map((p, i) => (
            <motion.div key={i} className="relative aspect-[4/3] overflow-hidden" {...fadeUp(i * 0.1)}>
              <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */

function FAQ({ t }: { t: VejaT }) {
  const [open, setOpen] = useState<number | null>(null);

  const items = [
    { q: t.faq_q1, a: t.faq_a1 },
    { q: t.faq_q2, a: t.faq_a2 },
    { q: t.faq_q3, a: t.faq_a3 },
    { q: t.faq_q4, a: t.faq_a4 },
    { q: t.faq_q5, a: t.faq_a5 },
    { q: t.faq_q6, a: t.faq_a6 },
  ];

  return (
    <section className="bg-atd-cream py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          className="font-display font-bold text-2xl md:text-3xl text-atd-black mb-8"
          {...fadeUp()}
        >
          {t.faq_heading}
        </motion.h2>

        <div className="space-y-1">
          {items.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-body font-semibold text-sm md:text-base text-atd-black leading-snug">
                  {item.q}
                </span>
                <span className={`transition-colors ${open === i ? "text-atd-green" : "text-atd-gray-soft"}`}>
                  <ChevronIcon open={open === i} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm text-atd-gray-soft leading-relaxed pb-5">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────── */

function CTA({ t }: { t: VejaT }) {
  return (
    <section className="bg-atd-green py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
            {t.cta_heading}
          </h2>
          <p className="font-body text-white/70 mt-3 text-sm md:text-base max-w-md mx-auto">
            {t.cta_sub}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          {...fadeUp(0.12)}
        >
          <a
            href="tel:+37065785096"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {t.hero_cta_call}: +370 657 85096
          </a>
          <a
            href="mailto:Robertas@atd.lt"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]"
          >
            {t.cta_email}: Robertas@atd.lt
          </a>
          <FacebookLink />
        </motion.div>

        <motion.p
          className="font-body text-xs text-white/40 mt-8"
          {...fadeUp(0.2)}
        >
          {t.cta_season}
        </motion.p>
      </div>
    </section>
  );
}

/* ── Main export ──────────────────────────────────────────── */

export function VejaPage() {
  const { lang } = useLanguage();
  const t = translations[lang].vejaPage;

  return (
    <main>
      <Hero t={t} />
      <Types t={t} />
      <Process t={t} />
      <Results t={t} />
      <FAQ t={t} />
      <CTA t={t} />
    </main>
  );
}
