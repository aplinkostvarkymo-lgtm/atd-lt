"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

type T = { [K in keyof typeof translations.lt.kontaktaiPage]: string };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const SERVICE_OPTIONS = ["apzeldinimas", "veja", "laistymas", "trinkelės"] as const;

/* ── Hero ─────────────────────────────────────────────────── */

function Hero({ t }: { t: T }) {
  return (
    <section className="bg-atd-green pt-20 md:pt-24 pb-12 md:pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <nav className="flex items-center gap-1.5 text-white/50 font-body text-xs mb-8">
          <Link href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
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
            +370 657 85096
          </a>
          <a
            href="mailto:Robertas@atd.lt"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors"
          >
            Robertas@atd.lt
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Form + contact info ──────────────────────────────────── */

function FormSection({ t }: { t: T }) {
  const { lang } = useLanguage();
  const services_sub = translations[lang].nav.services_sub;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    const serviceKey = data.get("service");
    const paslauga =
      typeof serviceKey === "string" && serviceKey
        ? translations.lt.nav.services_sub[serviceKey as keyof typeof translations.lt.nav.services_sub]
        : undefined;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vardas: data.get("name"),
          telefonas: data.get("phone"),
          email: data.get("email"),
          paslauga,
          plotas: data.get("area"),
          zinute: data.get("message"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) throw new Error("request failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Form */}
        <motion.div {...fadeUp()}>
          <h2 className="font-display font-bold text-2xl text-atd-black mb-6">{t.form_heading}</h2>

          {status === "success" ? (
            <p className="font-body text-sm text-atd-green">{t.form_success}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot — botams skirtas spąstas, žmonėms nematomas ir nepasiekiamas.
                  Off-screen (ne display:none, ne type="hidden"), aria-hidden + tabIndex=-1,
                  kad screen reader'iai ir Tab navigacija jį praleistų. */}
              <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="company">Įmonė</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_name}</label>
                <input id="name" name="name" type="text" required
                  className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_phone}</label>
                  <input id="phone" name="phone" type="tel" required
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_email}</label>
                  <input id="email" name="email" type="email"
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_service}</label>
                  <select id="service" name="service" defaultValue=""
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green">
                    <option value="" disabled>{t.form_service_placeholder}</option>
                    {SERVICE_OPTIONS.map((key) => (
                      <option key={key} value={key}>{services_sub[key]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="area" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_area}</label>
                  <input id="area" name="area" type="number" min="0"
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_message}</label>
                <textarea id="message" name="message" rows={4}
                  className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green resize-none" />
              </div>

              {status === "error" && (
                <p className="font-body text-sm text-red-600">{t.form_error}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center px-6 py-3 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? t.form_sending : t.form_submit}
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact info */}
        <motion.div className="bg-atd-cream p-6 md:p-8 self-start" {...fadeUp(0.12)}>
          <div className="space-y-4">
            <a href="tel:+37065785096" className="block font-display font-bold text-2xl text-atd-green hover:text-atd-green-light transition-colors">
              +370 657 85096
            </a>
            <a href="mailto:Robertas@atd.lt" className="block font-body text-sm text-atd-black hover:text-atd-green transition-colors">
              Robertas@atd.lt
            </a>
            <div className="pt-4 border-t border-atd-black/8 space-y-1.5 font-body text-sm">
              <p className="text-atd-black">{t.hours}</p>
              <p className="text-atd-gray-soft">{t.area}</p>
              <p className="text-atd-gray-soft">{t.response}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Export ───────────────────────────────────────────────── */

export function KontaktaiPage() {
  const { lang } = useLanguage();
  const t = translations[lang].kontaktaiPage;

  return (
    <main>
      <Hero t={t} />
      <FormSection t={t} />
    </main>
  );
}
