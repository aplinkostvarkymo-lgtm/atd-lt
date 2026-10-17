"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/translations";

export function ClientProviders({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  return <LanguageProvider lang={lang}><MotionConfig reducedMotion="user">{children}</MotionConfig></LanguageProvider>;
}
