import { after } from "next/server";
import { CONTACT_EMAIL } from "@/lib/contact";
import { getPublicReviews, moderationToken, saveReview } from "@/lib/reviews";
import { readReviewJson, reviewOriginAllowed, validateReview, type ReviewInput } from "@/lib/review-validation";
import { limitLead } from "@/lib/lead-rate-limit";
import { SITE_INDEXABLE, SITE_URL, SOCIAL_MEDIA_URL } from "@/lib/site-metadata";

export async function GET() {
  try {
    return Response.json(await getPublicReviews(), { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } });
  } catch {
    console.error("Public review storage unavailable");
    return Response.json({ error: "temporarily_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

async function notifyOwner(id: string, data: ReviewInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Review email is not configured");
  const url = new URL("/atsiliepimai/patvirtinti", SITE_INDEXABLE ? SITE_URL : SOCIAL_MEDIA_URL);
  url.hash = new URLSearchParams({ token: moderationToken(id) }).toString();
  const text = [
    "Naujas atsiliepimas laukia Jūsų patvirtinimo. Jis dar neviešinamas.",
    `Vardas: ${data.name}`, `Įvertinimas: ${data.rating} / 5`,
    data.email ? `El. paštas (neviešinamas): ${data.email}` : "", data.text,
    "Peržiūrėti, parašyti atsakymą klientui ir patvirtinti arba atmesti:", url.toString(),
    "Ši privati nuoroda galioja 30 dienų. Jos neatiduokite klientams. Vien nuorodos atidarymas nieko nepaskelbia.",
  ].filter(Boolean).join("\n\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM ?? "ATD svetainė <noreply@atd.lt>", to: [CONTACT_EMAIL], subject: `Atsiliepimas laukia patvirtinimo: ${data.name.replace(/[\r\n]/g, " ")}`, text }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Review email HTTP ${response.status}`);
}

export async function POST(request: Request) {
  const fail = (error: string, status = 400, headers?: HeadersInit) => Response.json({ success: false, error }, { status, headers });
  if (!reviewOriginAllowed(request)) return fail("invalid_origin", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return fail("unsupported_content_type", 415);
  let body: unknown;
  try { body = await readReviewJson(request); }
  catch (error) { return fail(error instanceof Error && error.message === "payload_too_large" ? "payload_too_large" : "invalid_body", error instanceof Error && error.message === "payload_too_large" ? 413 : 400); }
  const validation = validateReview(body);
  if ("honeypot" in validation) return Response.json({ success: true });
  if ("error" in validation) return fail(validation.error);
  // A moderation email is required for this workflow; do not accept an unreachable queue.
  if (!process.env.RESEND_API_KEY) return fail("temporarily_unavailable", 503);
  try {
    const limit = await limitLead(request, "review");
    if (!limit.allowed) return fail("rate_limited", 429, { "Retry-After": String(limit.retryAfter) });
  } catch { return fail("temporarily_unavailable", 503); }
  try {
    const id = await saveReview(validation.data);
    after(async () => { try { await notifyOwner(id, validation.data); } catch { console.error("Review saved but moderation email failed"); } });
    return Response.json({ success: true });
  } catch { console.error("Review storage failed"); return fail("storage_unavailable", 502); }
}
