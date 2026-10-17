"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function MobileStickyCTA() {
  const { lang } = useLanguage();
  const t = translations[lang].mobileStickyCTA;
  const pathname = usePathname();

  // No point showing on the contact page itself
  if (pathname === "/kontaktai") return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-sm border-t border-atd-black/10">
      <div className="flex gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href="tel:+37065785096"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-atd-green text-white font-body font-semibold text-sm py-3 transition-all active:scale-[0.97]"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {t.call}
        </a>
        <Link
          href="/kontaktai"
          className="flex-1 inline-flex items-center justify-center border border-atd-black/20 text-atd-black font-body font-medium text-sm py-3 transition-all active:scale-[0.97] hover:bg-atd-cream"
        >
          {t.quote}
        </Link>
      </div>
    </div>
  );
}
