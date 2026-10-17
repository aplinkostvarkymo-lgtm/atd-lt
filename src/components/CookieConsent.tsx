"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { getStoredConsent, setStoredConsent } from "@/lib/cookieConsent";

export function CookieConsent() {
  const { lang } = useLanguage();
  const t = translations[lang].cookieConsent;
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  const handleChoice = (value: "accepted" | "rejected") => {
    setStoredConsent(value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
          animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-0 inset-x-0 z-50 bg-atd-black text-white/90 px-6 py-4"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
