"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useLanguage();

  const active   = variant === "dark" ? "text-atd-black"    : "text-white";
  const inactive = variant === "dark" ? "text-atd-black/30" : "text-white/35";
  const divider  = variant === "dark" ? "text-atd-black/20" : "text-white/30";

  return (
    <button
      onClick={() => setLang(lang === "lt" ? "en" : "lt")}
      aria-label={lang === "lt" ? "Switch to English" : "Perjungti į lietuvių"}
      className="font-body text-xs font-medium tracking-widest uppercase transition-colors"
    >
      <span className={lang === "lt" ? active : inactive}>LT</span>
      <span className={`mx-1 ${divider}`}>/</span>
      <span className={lang === "en" ? active : inactive}>EN</span>
    </button>
  );
}
