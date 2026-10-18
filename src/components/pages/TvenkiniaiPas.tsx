"use client";

import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/contact";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { FacebookLink } from "@/components/ui/FacebookLink";

type T = { [K in keyof typeof translations.lt.tvenkiniaiPas]: string };

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
    <section className="relative bg-atd-green pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/projects/tvenkiniai/tvenkiniu-kasimas-11-tvenkinio-bendras-vaizdas-1600.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-atd-black/70" />
      </div>
      <div className="relative max-w-5xl mx-auto px-6">
        <nav className="flex items-center gap-1.5 text-white/85 font-body text-xs mb-8">
          <Link underline href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-white/85">{t.breadcrumb_services}</span>
          <span>/</span>
          <span className="text-white/90">{t.breadcrumb_current}</span>
        </nav>
        <motion.h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {t.hero_heading}
        </motion.h1>
        <motion.p className="font-body text-base md:text-lg text-white/80 mt-5 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {t.hero_tagline}
        </motion.p>
        <motion.div className="flex flex-wrap gap-3 mt-8"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}>
          <a href="tel:+37065785096"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]">
            {t.hero_cta_call}: +370 657 85096
          </a>
          <Link arrow href="/kontaktai"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]">
            {t.hero_cta_quote}
          </Link>
        </motion.div>
        <motion.div className="grid grid-cols-3 gap-6 mt-12 max-w-sm"
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

/* ── Services ─────────────────────────────────────────────── */

function Services({ t }: { t: T }) {
  const items = [
    {
      name: t.svc1_name,
      desc: t.svc1_desc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c0 0-8-4-8-10a8 8 0 0116 0c0 6-8 10-8 10z" />
          <path d="M12 8v4M10 10h4" />
        </svg>
      ),
    },
    {
      name: t.svc2_name,
      desc: t.svc2_desc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: t.svc3_name,
      desc: t.svc3_desc,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c0 0 4-6 10-6s10 6 10 6-4 6-10 6-10-6-10-6z" />
          <path d="M8 12c1-2 2-3 4-3s3 1 4 3" />
        </svg>
      ),
    },
  ];
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="mb-10" {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black">{t.services_heading}</h2>
          <p className="font-body text-atd-gray-soft mt-2 text-sm">{t.services_sub}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((svc, i) => (
            <motion.div key={i}
              className="bg-atd-cream/60 p-6 flex flex-col gap-4"
              {...fadeUp(i * 0.08)}>
              <div className="text-atd-green">{svc.icon}</div>
              <div className="font-display font-bold text-lg text-atd-black leading-tight">{svc.name}</div>
              <p className="font-body text-sm text-atd-gray-soft leading-relaxed flex-1">{svc.desc}</p>
              <div className="pt-3 border-t border-atd-black/6">
                <span className="font-body text-xs text-atd-gray-soft italic">{t.price_note}</span>
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
        <ProcessSteps steps={steps} />
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
  ];
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black mb-8" {...fadeUp()}>
          {t.faq_heading}
        </motion.h2>
        <div className="space-y-1">
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
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]">
            {t.cta_call}: +370 657 85096
          </a>
          <a href={CONTACT_EMAIL_HREF}
            className="inline-flex items-center px-7 py-3.5 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]">
            {t.cta_email}: {CONTACT_EMAIL}
          </a>
          <FacebookLink />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export function TvenkiniaiPas() {
  const { lang } = useLanguage();
  const t = translations[lang].tvenkiniaiPas as T;
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero t={t} />
      <Services t={t} />
      <Process t={t} />
      <FAQ t={t} />
      <CTA t={t} />
    </main>
  );
}
