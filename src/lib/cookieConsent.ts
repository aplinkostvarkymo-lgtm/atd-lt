import { useSyncExternalStore } from "react";

export const COOKIE_CONSENT_KEY = "atd-cookie-consent";
export const COOKIE_CONSENT_EVENT = "atd-cookie-consent-change";
export const COOKIE_SETTINGS_EVENT = "atd-cookie-settings-open";

export type ConsentValue = "accepted" | "rejected";
let memoryConsent: ConsentValue | null = null;

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch { return memoryConsent; }
}

export function setStoredConsent(value: ConsentValue) {
  memoryConsent = value;
  try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch { /* Keep session choice without persistent storage. */ }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

function subscribe(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(COOKIE_CONSENT_EVENT, callback); window.removeEventListener("storage", callback); };
}
const serverSnapshot = () => undefined;
export function useCookieConsent() { return useSyncExternalStore(subscribe, getStoredConsent, serverSnapshot); }
export function openCookieSettings() { window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT)); }
