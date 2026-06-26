"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { SERVICE_LINKS } from "@/components/layout/Header";

export function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <footer className="bg-atd-black text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link href="/" className="font-display font-bold text-2xl text-white">
            ATD
          </Link>
          <p className="font-body text-sm text-white/60 mt-3 max-w-xs leading-relaxed">
            {t.footer.tagline}
          </p>
        </div>

        {/* Services */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-white/40 mb-3">
            {t.nav.services}
          </p>
          <ul className="space-y-2">
            {SERVICE_LINKS.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="font-body text-sm text-white/70 hover:text-white transition-colors"
                >
                  {t.nav.services_sub[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-white/40 mb-3">
            {t.nav.contact}
          </p>
          <ul className="space-y-2 font-body text-sm">
            <li>
              <a href="tel:+37065785096" className="text-white/70 hover:text-white transition-colors">
                +370 657 85096
              </a>
            </li>
            <li>
              <a href="mailto:Robertas@atd.lt" className="text-white/70 hover:text-white transition-colors">
                Robertas@atd.lt
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/RoberasATD.LT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.476h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            </li>
            <li className="text-white/50">{t.footer.area}</li>
            <li className="text-white/50">{t.footer.hours}</li>
            <li className="pt-1">
              <Link href="/kontaktai" className="text-white/70 hover:text-white transition-colors">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 font-body text-xs text-white/40">
          © {new Date().getFullYear()} ATD — Aplinkos Tvarkymas. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
