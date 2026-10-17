import { SERVICE_LINKS } from "./navigation";
import { translations } from "./translations";

export const MAX_LEAD_BYTES = 16384;
export const MAX_LENGTHS = { vardas: 100, telefonas: 30, email: 100, zinute: 2000, paslauga: 100, plotas: 20 } as const;
export type LeadData = { vardas: string; telefonas: string; email?: string; zinute?: string; paslauga?: string; plotas?: string };

export function validateLead(body: unknown): { data: LeadData } | { error: string } | { honeypot: true } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "invalid_body" };
  const input = body as Record<string, unknown>;
  if (typeof input.company === "string" && input.company.trim()) return { honeypot: true };
  const values: Record<string, string> = {};
  for (const [key, max] of Object.entries(MAX_LENGTHS)) {
    if (input[key] != null && typeof input[key] !== "string") return { error: "invalid_field" };
    values[key] = typeof input[key] === "string" ? input[key].trim() : "";
    if (values[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(values[key])) return { error: "invalid_field" };
  }
  const { vardas, telefonas, email, zinute, paslauga, plotas } = values;
  const digits = telefonas.replace(/\D/g, "");
  if (!vardas || !/^[+\d\s().-]+$/.test(telefonas) || digits.length < 7 || digits.length > 15) return { error: "invalid_contact" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "invalid_email" };
  const services = SERVICE_LINKS.map(({ key }) => translations.lt.nav.services_sub[key]);
  if (paslauga && !services.includes(paslauga as typeof services[number])) return { error: "invalid_service" };
  const area = Number(plotas.replace(",", "."));
  if (plotas && (!/^\d+(?:[.,]\d+)?$/.test(plotas) || !Number.isFinite(area) || area <= 0 || area > 10000000)) return { error: "invalid_area" };
  return { data: { vardas, telefonas, email: email || undefined, zinute: zinute || undefined, paslauga: paslauga || undefined, plotas: plotas ? String(area) : undefined } };
}
