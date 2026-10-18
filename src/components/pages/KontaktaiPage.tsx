"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICE_LINKS } from "@/lib/navigation";
import { translations } from "@/lib/translations";

type T = { [K in keyof typeof translations.lt.kontaktaiPage]: string };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const SERVICE_OPTIONS = SERVICE_LINKS.map(({ key }) => key);

/* ── Hero ─────────────────────────────────────────────────── */

function Hero({ t }: { t: T }) {
  return (
    <section className="relative bg-atd-green pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/veja-mowed-stripes-1.jpg"
        alt=""
        fill
        className="object-cover object-center"
        preload
        sizes="100vw"
      />
      {/* Dark green overlay so text stays readable */}
      <div className="absolute inset-0 bg-atd-green/85" />

      <div className="relative max-w-5xl mx-auto px-6">
        <nav className="flex items-center gap-1.5 text-white/85 font-body text-xs mb-8">
          <Link underline href="/" className="hover:text-white/80 transition-colors">{t.breadcrumb_home}</Link>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-atd-green font-body font-semibold text-sm hover:bg-atd-cream transition-all active:scale-[0.97]"
          >
            +370 657 85096
          </a>
          <a
            href="mailto:Robertas@atd.lt"
            className="inline-flex items-center px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]"
          >
            Robertas@atd.lt
          </a>
          <a
            href="https://wa.me/37065785096"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/50 text-white font-body font-medium text-sm hover:bg-white/10 transition-all active:scale-[0.97]"
          >
            {t.whatsapp_label}
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
  const [rateLimited, setRateLimited] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (status !== "success") return;
    const message = statusRef.current;
    message?.focus({ preventScroll: true });
    message?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setRateLimited(false);

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
        signal: AbortSignal.timeout(20000),
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

      if (res.status === 429) setRateLimited(true);
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

          <p ref={statusRef} role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} className="font-body text-sm text-atd-green">{status === "success" ? t.form_success : status === "loading" ? t.form_sending : ""}</p>
          {status !== "success" && (
            <form onSubmit={handleSubmit} aria-busy={status === "loading"} className="space-y-4">
              {/* Honeypot */}
              <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="company">Įmonė</label>
                <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="name" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_name}</label>
                <input id="name" name="name" type="text" autoComplete="name" maxLength={100} required
                  className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_phone}</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} minLength={7} required
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_email}</label>
                  <input id="email" name="email" type="email" autoComplete="email" maxLength={100}
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
                  <input id="area" name="area" type="number" min="1" max="10000000"
                    className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-body text-xs text-atd-gray-soft mb-1.5">{t.form_message}</label>
                <textarea id="message" name="message" rows={4} maxLength={2000}
                  className="w-full border border-atd-black/15 px-3.5 py-2.5 font-body text-sm text-atd-black focus:outline-none focus:border-atd-green resize-none" />
              </div>

              {status === "error" && (
                <p role="alert" className="font-body text-sm text-red-700">{rateLimited ? t.form_rate_limit : t.form_error}</p>
              )}

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileTap={status !== "loading" ? { scale: 0.97 } : undefined}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center px-6 py-3 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? t.form_sending : t.form_submit}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Contact info */}
        <motion.div className="bg-atd-cream p-6 md:p-8 self-start" {...fadeUp(0.12)}>
          <div className="space-y-4">
            <a href="tel:+37065785096" className="block font-display font-bold text-2xl text-atd-green hover:text-atd-green-light transition-colors">
              +370 657 85096
            </a>
            <p className="font-body text-sm text-atd-black">MB „ATD.LT“ · {t.contact_person}</p>
            <a href="mailto:Robertas@atd.lt" className="block font-body text-sm text-atd-black hover:text-atd-green transition-colors">
              Robertas@atd.lt
            </a>
            {/* WhatsApp + Viber */}
            <div className="flex gap-3 pt-1">
              <a
                href="https://wa.me/37065785096"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white px-3 py-1.5 rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#0B7738" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="viber://chat?number=%2B37065785096"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white px-3 py-1.5 rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#7360F2" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                  <path d="M11.398.002C8.576.06 2.67.687.988 6.143.25 8.228.01 10.254 0 12.008c-.01 1.754.21 3.76.988 5.859C2.672 23.323 8.58 23.95 11.4 24h.202c2.819-.05 8.728-.677 10.41-6.133.737-2.085.977-4.105.988-5.859.01-1.754-.21-3.76-.988-5.865C20.332.689 14.422.062 11.601.002h-.203zm.088 1.889h.131c2.36.044 7.476.577 8.882 5.106.658 1.86.873 3.654.863 5.11-.01 1.456-.215 3.251-.863 5.11-1.406 4.529-6.522 5.062-8.882 5.106h-.131c-2.36-.044-7.476-.577-8.882-5.106C1.985 15.257 1.77 13.463 1.78 12.007c.01-1.456.215-3.25.826-5.11C4.01 2.368 9.126 1.935 11.486 1.891zM9.122 4.507c-.246 0-.502.14-.639.384-.35.631-.952 1.78-.952 1.78s-.14.245-.089.5c.051.256.447.832.447.832s1.16 1.556 2.632 2.814c1.472 1.258 2.97 2.017 2.97 2.017l.764.412s.41.262.695.16c.285-.101 1.235-1.08 1.235-1.08s.17-.193.275-.318c.105-.125.136-.295.019-.478-.536-.825-1.195-1.52-1.195-1.52s-.428-.41-.686-.352c-.258.059-.5.294-.5.294L13.48 9.951s-.17.16-.354.122c-.184-.038-.53-.266-.53-.266S11.25 9.05 10.27 7.98c-.98-1.07-1.653-2.024-1.653-2.024s-.22-.343-.264-.528c-.043-.185.103-.363.103-.363l.295-.328s.232-.228.29-.488c.058-.26-.066-.56-.066-.56L8.15 5.09S8.031 4.7 7.951 4.6c-.08-.1-.28-.093-.28-.093h-.549zm6.752.34c-.143-.007-.317.008-.513.053a.415.415 0 00-.311.509.421.421 0 00.505.316c1.72-.408 3.274.98 3.26 2.61 0 .233.188.42.421.42a.421.421 0 00.422-.42c.018-2.18-1.94-3.977-3.784-3.488zm-.354 1.69c-.072-.002-.15.01-.23.036a.422.422 0 00-.26.534.418.418 0 00.527.264c.805-.268 1.636.426 1.628 1.218 0 .234.188.42.42.42a.42.42 0 00.422-.42c.012-1.297-1.1-2.099-2.507-2.052zm-.44 1.614a.625.625 0 00-.627.623.626.626 0 00.627.624.625.625 0 00.625-.624.624.624 0 00-.625-.623z" />
                </svg>
                Viber
              </a>
            </div>
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

/* ── Map ──────────────────────────────────────────────────── */

function MapSection({ t }: { t: T }) {
  return (
    <section className="bg-atd-cream py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp()}>
          <p className="font-body text-[10px] uppercase tracking-widest text-atd-gray-soft mb-2">{t.map_sub}</p>
          <h2 className="font-display font-bold text-2xl text-atd-black mb-6">{t.map_heading}</h2>
        </motion.div>
        <motion.div
          className="overflow-hidden border border-atd-black/8"
          style={{ aspectRatio: "16/7" }}
          {...fadeUp(0.1)}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d71384.33938567886!2d25.165756134765625!3d54.6872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd93fb5c6408f5%3A0x400d18c70e9dc40!2sVilnius%2C+Lithuania!5e0!3m2!1slt!2slt!4v1700000000000!5m2!1slt!2slt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t.map_title}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */

function FaqSection({ t }: { t: T }) {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [1, 2, 3, 4, 5].map((i) => ({
    q: t[`faq_q${i}` as keyof typeof t],
    a: t[`faq_a${i}` as keyof typeof t],
  }));

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          className="font-display font-bold text-2xl text-atd-black mb-8"
          {...fadeUp()}
        >
          {t.faq_heading}
        </motion.h2>
        <div className="divide-y divide-atd-black/8">
          {faqs.map(({ q, a }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.06)}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="font-body font-medium text-sm md:text-base text-atd-black">{q}</span>
                <svg
                  viewBox="0 0 10 6"
                  fill="none"
                  className={`w-3 h-3 shrink-0 text-atd-gray-soft transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="font-body text-sm text-atd-gray-soft pb-4 leading-relaxed max-w-2xl">{a}</p>
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

/* ── Export ───────────────────────────────────────────────── */

export function KontaktaiPage() {
  const { lang } = useLanguage();
  const t = translations[lang].kontaktaiPage;

  return (
    <main id="main-content" tabIndex={-1}>
      <Hero t={t} />
      <FormSection t={t} />
      <MapSection t={t} />
      <FaqSection t={t} />
    </main>
  );
}
