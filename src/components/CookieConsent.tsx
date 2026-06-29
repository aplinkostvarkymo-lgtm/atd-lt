"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { getStoredConsent, setStoredConsent } from "@/lib/cookieConsent";

export function CookieConsent() {
  const { lang } = useLanguage();
  const t = translations[lang].cookieConsent;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  const handleChoice = (value: "accepted" | "rejected") => {
    setStoredConsent(value);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-atd-black text-white/90 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <p className="font-body text-sm leading-relaxed flex-1">{t.message}</p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice("rejected")}
            className="px-5 py-2.5 border border-white/25 text-white font-body font-medium text-sm hover:bg-white/10 transition-colors"
          >
            {t.reject}
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="px-5 py-2.5 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-colors"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
