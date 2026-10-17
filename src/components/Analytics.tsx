"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useCookieConsent } from "@/lib/cookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  const consent = useCookieConsent();
  const accepted = consent === "accepted";

  useEffect(() => {
    if (!GA_ID || consent === undefined) return;
    const gaWindow = window as unknown as Record<string, unknown>;
    gaWindow[`ga-disable-${GA_ID}`] = !accepted;
    const gtag = gaWindow.gtag as ((...args: unknown[]) => void) | undefined;
    gtag?.("consent", "update", { analytics_storage: accepted ? "granted" : "denied" });
    if (!accepted) {
      // Disable an already-loaded tag as well as preventing future script mounts.
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!name.startsWith("_ga")) continue;
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        const parts = location.hostname.split(".");
        for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}`;
      }
    }
  }, [accepted, consent]);

  if (!GA_ID || !accepted) return null;

  return <GoogleAnalytics gaId={GA_ID} />;
}
