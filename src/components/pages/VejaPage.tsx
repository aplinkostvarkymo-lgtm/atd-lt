"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

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
    <section className="bg-atd-green pt-20 md:pt-24 pb-12 md:pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-white/50 font-body text-xs mb-8">
          <Link href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-white/60">{t.breadcrumb_services}</span>
          <span>/</span>
          <span className="text-white/90">{t.breadcrumb_current}</span>
        </nav>

        <motion.h1
          className="font-display font-bold text-3xl md:text-5xl text-white leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.hero_heading}
        </motion.h1>

        <motion.p
          className="font-body text-base md:text-lg text-white/75 mt-4 max-w-xl leading-relaxed"
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-colors"
          >
            {t.hero_cta_call}: +370 657 85096
          </a>
          <Link
            href="/kontaktai"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors"
          >
            {t.hero_cta_quote}
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/15 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div className="font-display font-bold text-2xl text-white">{s.value}</div>
              <div className="font-body text-xs text-white/55 mt-0.5 leading-tight">{s.label}</div>
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

/* ── Process ──────────────────────────────────────────────── */

function Process({ t }: { t: VejaT }) {
  const steps: Array<{ n: string; title: string; desc: string; img?: string; imgAlt?: string }> = [
    { n: "1", title: t.step1_title, desc: t.step1_desc },
    { n: "2", title: t.step2_title, desc: t.step2_desc },
    { n: "3", title: t.step3_title, desc: t.step3_desc, img: "/images/veja-process-rulone-1.jpg", imgAlt: t.step3_img_alt },
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
                  {step.img && (
                    <div className="relative aspect-[4/3] mt-4 overflow-hidden">
                      <Image src={step.img} alt={step.imgAlt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
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

        <div className="divide-y divide-atd-black/8">
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
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {t.hero_cta_call}: +370 657 85096
          </a>
          <a
            href="mailto:Robertas@atd.lt"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors"
          >
            {t.cta_email}: Robertas@atd.lt
          </a>
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
