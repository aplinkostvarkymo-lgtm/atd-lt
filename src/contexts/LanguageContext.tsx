"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { localizedPath } from "@/lib/navigation";
import type { Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "lt",
  setLang: () => {},
});

export function LanguageProvider({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("atd-lang", lang); } catch { /* URL remains usable without storage. */ }
  }, [lang]);
  const setLang = (newLang: Lang) => {
    try { localStorage.setItem("atd-lang", newLang); } catch { /* URLs work without storage. */ }
    router.push(localizedPath(pathname, newLang) + window.location.search + window.location.hash);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
