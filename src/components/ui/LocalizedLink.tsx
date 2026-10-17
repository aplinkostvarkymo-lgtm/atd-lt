"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/navigation";

type Props = ComponentProps<typeof NextLink> & { underline?: boolean; arrow?: boolean };

export default function LocalizedLink({ href, children, className, underline, arrow, ...props }: Props) {
  const { lang } = useLanguage();
  return (
    <NextLink {...props} className={[className, arrow && "cta-link gap-2"].filter(Boolean).join(" ")} href={typeof href === "string" ? localizedPath(href, lang) : href}>
      {underline ? <span className="link-underline">{children}</span> : children}
      {arrow && (
        <svg className="cta-arrow h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M3.5 10h12m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </NextLink>
  );
}
