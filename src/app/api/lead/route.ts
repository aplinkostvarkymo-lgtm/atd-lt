import { CONTACT_EMAIL } from "@/lib/contact";
import { after } from "next/server";
import { saveLead } from "@/lib/airtable";
import { validateLead, MAX_LEAD_BYTES, type LeadData } from "@/lib/lead-validation";
import { limitLead } from "@/lib/lead-rate-limit";

async function sendEmailNotification(data: LeadData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("Lead saved; RESEND_API_KEY is not configured."); return; }
  const text = [
    `Vardas: ${data.vardas}`, `Telefonas: ${data.telefonas}`,
    data.email && `El. paštas: ${data.email}`, data.paslauga && `Paslauga: ${data.paslauga}`,
    data.plotas && `Plotas: ${data.plotas} m²`, data.zinute && `Žinutė:\n${data.zinute}`,
  ].filter(Boolean).join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM ?? "ATD svetainė <noreply@atd.lt>", to: [CONTACT_EMAIL], subject: `Nauja užklausa iš atd.lt — ${data.vardas.replace(/[\r\n]/g, " ")}`, text }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend HTTP ${response.status}`);
}

export async function POST(request: Request) {
  const failure = (error: string, status = 400, headers?: HeadersInit) => Response.json({ success: false, error }, { status, headers });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return failure("unsupported_content_type", 415);
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > MAX_LEAD_BYTES) return failure("payload_too_large", 413);
  let body: unknown;
  const reader = request.body?.getReader();
  if (!reader) return failure("invalid_body");
  try {
    let bytes = 0;
    let text = "";
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_LEAD_BYTES) { await reader.cancel(); return failure("payload_too_large", 413); }
      text += decoder.decode(value, { stream: true });
    }
    body = JSON.parse(text + decoder.decode());
  } catch { return failure("invalid_json"); }
  finally { reader.releaseLock(); }

  const validation = validateLead(body);
  if ("honeypot" in validation) return Response.json({ success: true });
  if ("error" in validation) return failure(validation.error);
  try {
    const limit = await limitLead(request);
    if (!limit.allowed) return failure("rate_limited", 429, { "Retry-After": String(limit.retryAfter) });
  } catch (error) {
    console.error("Lead rate limiter unavailable:", error);
    return failure("temporarily_unavailable", 503);
  }
  try { await saveLead(validation.data); }
  catch (error) { console.error("Lead storage failed:", error); return failure("storage_unavailable", 502); }
  after(async () => {
    try { await sendEmailNotification(validation.data); }
    catch (error) { console.error("Lead email notification failed:", error); }
  });
  return Response.json({ success: true });
}
