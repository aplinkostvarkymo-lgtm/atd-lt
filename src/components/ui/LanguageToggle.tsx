"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath } from "@/lib/navigation";

export function LanguageToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang } = useLanguage();
  const pathname = usePathname();

  const active   = variant === "dark" ? "text-atd-black font-semibold" : "text-white font-semibold";
  const inactive = variant === "dark" ? "text-atd-black/65 font-normal" : "text-white font-normal";
  const divider  = variant === "dark" ? "text-atd-black/20" : "text-white/30";

  return (
    <Link
      href={localizedPath(pathname, lang === "lt" ? "en" : "lt")}
      hrefLang={lang === "lt" ? "en" : "lt"}
      aria-label={lang === "lt" ? "Switch to English" : "Perjungti į lietuvių"}
      className="inline-flex items-center justify-center min-h-11 min-w-14 font-body text-xs font-medium tracking-widest uppercase transition-colors"
    >
      <span className={lang === "lt" ? active : inactive}>LT</span>
      <span className={`mx-1 ${divider}`}>/</span>
      <span className={lang === "en" ? active : inactive}>EN</span>
    </Link>
  );
}
