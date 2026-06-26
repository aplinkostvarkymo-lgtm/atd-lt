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
