"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { COOKIE_SETTINGS_EVENT, setStoredConsent, useCookieConsent } from "@/lib/cookieConsent";

export function CookieConsent() {
  const { lang } = useLanguage();
  const t = translations[lang].cookieConsent;
  const consent = useCookieConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const visible = consent === null || settingsOpen;
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const open = () => { returnFocus.current = document.activeElement as HTMLElement; setSettingsOpen(true); };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);
  useEffect(() => { if (settingsOpen) panelRef.current?.focus(); }, [settingsOpen]);

  useEffect(() => {
    if (visible) document.body.dataset.cookieBanner = "visible";
    else delete document.body.dataset.cookieBanner;
    return () => { delete document.body.dataset.cookieBanner; };
  }, [visible]);

  const handleChoice = (value: "accepted" | "rejected") => {
    setStoredConsent(value);
    setSettingsOpen(false);
    if (settingsOpen) returnFocus.current?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="region"
          aria-label={t.title}
          initial={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
          animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-0 inset-x-0 z-[75] bg-atd-black text-white/90 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
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
