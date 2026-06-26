"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { getService, type ServiceBlock, type Lang } from "@/lib/services-content";

/* ── Block renderers ──────────────────────────────────────── */

function ComparisonBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "comparison" }>; lang: Lang }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {block.items.map((item, i) => (
        <div
          key={i}
          className={`p-4 border ${item.highlight ? "border-atd-green bg-atd-green/5" : "border-atd-black/10 bg-white"}`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-body font-semibold text-sm text-atd-black">{item.title[lang]}</p>
            <span className="font-display font-bold text-atd-green text-sm whitespace-nowrap">{item.price}</span>
          </div>
          <ul className="space-y-1">
            {item.bullets[lang].map((b, j) => (
              <li key={j} className="flex items-start gap-1.5 font-body text-xs text-atd-gray-soft">
                <span className="text-atd-green mt-0.5 shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function StepsBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "steps" }>; lang: Lang }) {
  return (
    <div>
      <p className="font-body text-[10px] uppercase tracking-widest text-atd-gray-soft mb-3">{block.heading[lang]}</p>
      <ol className="space-y-3">
        {block.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-atd-green text-white font-body text-xs font-semibold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="font-body font-semibold text-sm text-atd-black">{step.title[lang]}</p>
              <p className="font-body text-xs text-atd-gray-soft mt-0.5 leading-relaxed">{step.desc[lang]}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ListBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "list" }>; lang: Lang }) {
  return (
    <div>
      {block.heading && (
        <p className="font-body text-[10px] uppercase tracking-widest text-atd-gray-soft mb-3">{block.heading[lang]}</p>
      )}
      <ul className="space-y-2">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-sm text-atd-black">
            <span className="text-atd-green font-bold shrink-0 mt-0.5">—</span>
            {item[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MaterialsBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "materials" }>; lang: Lang }) {
  return (
    <div>
      {block.heading && (
        <p className="font-body text-[10px] uppercase tracking-widest text-atd-gray-soft mb-3">{block.heading[lang]}</p>
      )}
      <div className="divide-y divide-atd-black/6 border border-atd-black/10">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-body font-semibold text-sm text-atd-black">{item.name[lang]}</p>
              {item.desc && <p className="font-body text-xs text-atd-gray-soft">{item.desc[lang]}</p>}
            </div>
            <span className="font-display font-bold text-atd-green text-sm whitespace-nowrap">{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStatsBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "mini-stats" }>; lang: Lang }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      {block.items.map((item, i) => (
        <div key={i} className="text-center">
          <p className="font-display font-bold text-3xl text-atd-green">{item.value}</p>
          <p className="font-body text-xs text-atd-gray-soft mt-0.5 leading-tight">{item.label[lang]}</p>
        </div>
      ))}
    </div>
  );
}

function NoteBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "note" }>; lang: Lang }) {
  return (
    <p className="font-body text-xs text-atd-gray-soft border-l-2 border-atd-green/40 pl-3 leading-relaxed italic">
      {block.text[lang]}
    </p>
  );
}

function ContactInfoBlock({ block, lang }: { block: Extract<ServiceBlock, { type: "contact-info" }>; lang: Lang }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <a
          href="tel:+37065785096"
          className="font-display font-bold text-2xl text-atd-green hover:text-atd-green-light transition-colors"
        >
          +370 657 85096
        </a>
      </div>
      <div className="space-y-1.5 text-sm font-body text-atd-black">
        <p>{block.hours[lang]}</p>
        <p className="text-atd-gray-soft">{block.area[lang]}</p>
        <p className="text-atd-gray-soft">{block.response[lang]}</p>
      </div>
    </div>
  );
}

function renderBlock(block: ServiceBlock, lang: Lang, i: number) {
  switch (block.type) {
    case "comparison":   return <ComparisonBlock   key={i} block={block} lang={lang} />;
    case "steps":        return <StepsBlock        key={i} block={block} lang={lang} />;
    case "list":         return <ListBlock         key={i} block={block} lang={lang} />;
    case "materials":    return <MaterialsBlock    key={i} block={block} lang={lang} />;
    case "mini-stats":   return <MiniStatsBlock    key={i} block={block} lang={lang} />;
    case "note":         return <NoteBlock         key={i} block={block} lang={lang} />;
    case "contact-info": return <ContactInfoBlock  key={i} block={block} lang={lang} />;
  }
}

/* ── Main popup ───────────────────────────────────────────── */

interface ServicePopupProps {
  serviceId: string | null;
  onClose: () => void;
}

export function ServicePopup({ serviceId, onClose }: ServicePopupProps) {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (serviceId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [serviceId]);

  // Reset scroll on service change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [serviceId]);

  const service = serviceId ? getService(serviceId) : null;

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[80]"
            onClick={onClose}
          />

          {/* Panel — desktop: centered float; mobile: bottom sheet */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "fixed z-[90] bg-atd-cream flex flex-col overflow-hidden",
              /* desktop */
              "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "md:w-[65vw] md:max-w-[900px] md:h-[65vh] md:max-h-[680px]",
              /* mobile — bottom sheet */
              "max-md:left-0 max-md:right-0 max-md:bottom-0",
              "max-md:h-[85vh] max-md:rounded-t-2xl",
            ].join(" ")}
          >
            {/* Top accent bar */}
            <div className="h-[3px] bg-atd-green shrink-0" />

            {/* Header — fixed */}
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-atd-black/8 shrink-0">
              <div className="min-w-0">
                <h2 className="font-display font-bold text-xl md:text-2xl text-atd-black leading-tight">
                  {service.heading[lang]}
                </h2>
                <p className="font-body text-sm text-atd-gray-soft mt-1">{service.tagline[lang]}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-8 h-8 flex items-center justify-center text-atd-gray-soft hover:text-atd-black transition-colors mt-0.5"
                aria-label={translations[lang].common.close}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Scrollable body — nuotrauka (jei yra) yra šios scroll'inamos srities
                dalis, ne fiksuota virš jos, kad nekeistų mobile bottom-sheet aukščio
                skaičiavimo (panelio aukštis fiksuotas per max-md:h-[85vh] aukščiau). */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {service.image && (
                <div className="relative h-[220px] w-full shrink-0">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt[lang]}
                    fill
                    className="object-cover rounded-t-2xl"
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                </div>
              )}
              <div className="px-6 py-5 space-y-6">
                {service.blocks.map((block, i) => renderBlock(block, lang, i))}
              </div>
            </div>

            {/* Footer CTA — fixed */}
            <div className="shrink-0 px-6 py-4 border-t border-atd-black/8 bg-white/60 backdrop-blur-sm flex items-center gap-4">
              <Link
                href={service.ctaHref}
                onClick={onClose}
                className="inline-flex items-center px-5 py-2.5 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-colors"
              >
                {service.ctaLabel[lang]}
              </Link>
              <a
                href="tel:+37065785096"
                className="font-body text-sm text-atd-gray-soft hover:text-atd-black transition-colors"
              >
                +370 657 85096
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
