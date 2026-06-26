"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const SERVICE_LINKS = [
  { href: "/paslaugos/apzeldinimas", key: "apzeldinimas" },
  { href: "/paslaugos/veja",         key: "veja" },
  { href: "/paslaugos/laistymas",    key: "laistymas" },
  { href: "/paslaugos/trinkeles",    key: "trinkelės" },
  /* "/paslaugos/prekyba-augalais" puslapio kol kas nėra — nuoroda pašalinta */
] as const;

type ServiceKey = typeof SERVICE_LINKS[number]["key"];

export function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = scrolled
    ? "text-atd-black hover:text-atd-green"
    : "text-white hover:text-white/70";
  const logoColor = scrolled ? "text-atd-green" : "text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-atd-black/8 py-3 md:py-4"
            : "py-5 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">

          {/* Logo */}
          <Link
            href="/"
            className={`font-display font-bold text-2xl tracking-tight transition-colors duration-300 shrink-0 ${logoColor}`}
          >
            ATD
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 ml-6">
            {/* Paslaugos dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className={`font-body text-sm font-medium transition-colors flex items-center gap-1.5 ${link}`}>
                {t.services}
                <svg
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                  className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-atd-black/8 shadow-lg py-1.5"
                  >
                    {SERVICE_LINKS.map(({ href, key }) => (
                      <Link
                        key={key}
                        href={href}
                        className="block px-4 py-2.5 font-body text-sm text-atd-black hover:bg-atd-cream hover:text-atd-green transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        {t.services_sub[key as ServiceKey]}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* /darbai, /patarimai, /kontaktai puslapių kol kas nėra — nuorodos pašalintos */}
          </nav>

          {/* Right: phone + LT/EN + hamburger */}
          <div className="flex items-center gap-4 ml-auto">
            <a
              href="tel:+37065785096"
              className={`hidden md:inline font-body text-sm font-medium transition-colors ${link}`}
            >
              +370 657 85096
            </a>
            <LanguageToggle variant={scrolled ? "dark" : "light"} />
            <button
              className={`md:hidden transition-colors ${scrolled ? "text-atd-black" : "text-white"}`}
              onClick={() => setMobileOpen(true)}
              aria-label={t.menu_open}
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M1 1H21M1 8H21M1 15H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[min(320px,100vw)] bg-white z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-atd-black/8">
                <span className="font-display font-bold text-xl text-atd-green">ATD</span>
                <button onClick={() => setMobileOpen(false)} aria-label={t.menu_close} className="text-atd-black">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-6 py-5 overflow-y-auto">
                <p className="font-body text-[10px] uppercase tracking-widest text-atd-gray-soft mb-3">
                  {t.services}
                </p>
                <div className="flex flex-col">
                  {SERVICE_LINKS.map(({ href, key }) => (
                    <Link
                      key={key}
                      href={href}
                      className="font-body text-[0.9375rem] text-atd-black py-3 border-b border-atd-black/6 hover:text-atd-green transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t.services_sub[key as ServiceKey]}
                    </Link>
                  ))}
                </div>
                {/* /darbai, /patarimai, /kontaktai puslapių kol kas nėra — nuorodos pašalintos */}
              </nav>

              <div className="px-6 py-5 border-t border-atd-black/8 flex items-center justify-between">
                <a href="tel:+37065785096" className="font-body text-sm text-atd-green font-medium">
                  +370 657 85096
                </a>
                <LanguageToggle variant="dark" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
