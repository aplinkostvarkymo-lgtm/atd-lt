"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/navigation";
import { notFoundCopy } from "@/lib/translations";

export function NotFoundContent() {
  const { lang } = useLanguage();
  const copy = notFoundCopy[lang];
  return <main id="main-content" className="not-found-page" tabIndex={-1}><div className="not-found-inner">
    <Link href={localizedPath("/", lang)} className="font-display text-2xl font-bold text-atd-green">ATD</Link>
    <h1>{copy.title}</h1><p>{copy.text}</p>
    <nav className="not-found-links" aria-label={copy.title}><Link href={localizedPath("/", lang)}>{copy.home}</Link><Link href={localizedPath("/darbai", lang)}>{copy.works}</Link><Link href={localizedPath("/kontaktai", lang)}>{copy.contact}</Link></nav>
  </div></main>;
}
