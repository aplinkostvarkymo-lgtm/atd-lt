"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

type T = { [K in keyof typeof translations.lt.laistymasPas]: string };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0"
      animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */

function Hero({ t }: { t: T }) {
  const stats = [
    { value: t.hero_stat1, label: t.hero_stat1_label },
    { value: t.hero_stat2, label: t.hero_stat2_label },
    { value: t.hero_stat3, label: t.hero_stat3_label },
  ];
  return (
    <section className="bg-atd-green pt-20 md:pt-24 pb-12 md:pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <nav className="flex items-center gap-1.5 text-white/50 font-body text-xs mb-8">
          <Link href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-white/60">{t.breadcrumb_services}</span>
          <span>/</span>
          <span className="text-white/90">{t.breadcrumb_current}</span>
        </nav>
        <motion.h1 className="font-display font-bold text-3xl md:text-5xl text-white leading-tight"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {t.hero_heading}
        </motion.h1>
        <motion.p className="font-body text-base md:text-lg text-white/75 mt-4 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {t.hero_tagline}
        </motion.p>
        <motion.div className="flex flex-wrap gap-3 mt-8"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}>
          <a href="tel:+37065785096"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-colors">
            {t.hero_cta_call}: +370 657 85096
          </a>
          <Link href="/kontaktai"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors">
            {t.hero_cta_quote}
          </Link>
        </motion.div>
        <motion.div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/15 max-w-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
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

/* ── System types ─────────────────────────────────────────── */

function Systems({ t }: { t: T }) {
  const systems = [
    {
      name: t.sys1_name,
      sub: t.sys1_sub,
      desc: t.sys1_desc,
      best: t.sys1_best,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C12 2 4 8 4 14a8 8 0 0016 0C20 8 12 2 12 2z" />
          <path d="M12 14v4M9 16l3 2 3-2" />
        </svg>
      ),
    },
    {
      name: t.sys2_name,
      sub: t.sys2_sub,
      desc: t.sys2_desc,
      best: t.sys2_best,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
      ),
    },
    {
      name: t.sys3_name,
      sub: t.sys3_sub,
      desc: t.sys3_desc,
      best: t.sys3_best,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="13" rx="1" />
          <path d="M8 8V5a4 4 0 018 0v3" />
          <path d="M12 13v3" />
        </svg>
      ),
    },
  ];
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-10" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.systems_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2 text-sm">{t.systems_sub}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {systems.map((sys, i) => (
            <motion.div key={i}
              className="border border-atd-black/8 p-6 flex flex-col gap-4"
              {...fadeUp(i * 0.08)}>
              <div className="text-atd-green">{sys.icon}</div>
              <div>
                <div className="font-display font-bold text-lg text-atd-black leading-tight">{sys.name}</div>
                <div className="font-body text-xs text-atd-green mt-0.5">{sys.sub}</div>
              </div>
              <p className="font-body text-sm text-atd-gray-soft leading-relaxed flex-1">{sys.desc}</p>
              <div className="pt-3 border-t border-atd-black/6">
                <span className="font-body text-xs text-atd-gray-soft">{t.best_label} </span>
                <span className="font-body text-xs text-atd-black">{sys.best}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Process ──────────────────────────────────────────────── */

function Process({ t }: { t: T }) {
  const steps = [
    { title: t.step1_title, desc: t.step1_desc },
    { title: t.step2_title, desc: t.step2_desc },
    { title: t.step3_title, desc: t.step3_desc },
  ];
  return (
    <section className="bg-atd-cream py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-10" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.process_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2 text-sm">{t.process_sub}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-6 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-atd-green/20" />
          {steps.map((step, i) => (
            <motion.div key={i} className="relative" {...fadeUp(i * 0.1)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-atd-green text-white font-display font-bold text-base flex items-center justify-center shrink-0 relative z-10">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-lg text-atd-black">{step.title}</h3>
              </div>
              <p className="font-body text-sm text-atd-gray-soft leading-relaxed pl-[3.25rem]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */

function FAQ({ t }: { t: T }) {
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
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black mb-8" {...fadeUp()}>
          {t.faq_heading}
        </motion.h2>
        <div className="divide-y divide-atd-black/8">
          {items.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}>
              <button
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-body font-medium text-sm text-atd-black leading-snug">{item.q}</span>
                <span className="text-atd-gray-soft shrink-0">
                  <ChevronIcon open={open === i} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm text-atd-gray-soft leading-relaxed pb-4">{item.a}</p>
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

function CTA({ t }: { t: T }) {
  return (
    <section className="bg-atd-green py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2 className="font-display font-bold text-2xl md:text-3xl text-white" {...fadeUp()}>
          {t.cta_heading}
        </motion.h2>
        <motion.p className="font-body text-white/70 mt-3 text-base max-w-md mx-auto" {...fadeUp(0.08)}>
          {t.cta_sub}
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-3 mt-8" {...fadeUp(0.14)}>
          <a href="tel:+37065785096"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-colors">
            {t.cta_call}: +370 657 85096
          </a>
          <a href="mailto:Robertas@atd.lt"
            className="inline-flex items-center px-7 py-3.5 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors">
            {t.cta_email}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export function LaistymasPas() {
  const { lang } = useLanguage();
  const t = translations[lang].laistymasPas as T;
  return (
    <>
      <Hero t={t} />
      <Systems t={t} />
      <Process t={t} />
      <FAQ t={t} />
      <CTA t={t} />
    </>
  );
}
