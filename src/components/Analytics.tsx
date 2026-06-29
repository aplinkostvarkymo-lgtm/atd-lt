"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { COOKIE_CONSENT_EVENT, getStoredConsent } from "@/lib/cookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(getStoredConsent() === "accepted");

    const handleChange = (e: Event) => {
      const value = (e as CustomEvent<"accepted" | "rejected">).detail;
      setAccepted(value === "accepted");
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleChange);
  }, []);

  if (!GA_ID || !accepted) return null;

  return <GoogleAnalytics gaId={GA_ID} />;
}
