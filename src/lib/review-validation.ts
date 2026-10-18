export type ReviewInput = { name: string; email: string; rating: number; text: string; lang: "lt" | "en" };
export const MAX_REVIEW_BYTES = 16384;

export function validateReviewReply(value: unknown): { text: string } | { error: string } {
  if (typeof value !== "string") return { error: "invalid_reply" };
  const text = value.trim();
  if ((text.length > 0 && text.length < 2) || text.length > 1500 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) return { error: "invalid_reply" };
  return { text };
}

export function validateReview(body: unknown): { data: ReviewInput } | { error: string } | { honeypot: true } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "invalid_body" };
  const input = body as Record<string, unknown>;
  if (typeof input.company === "string" && input.company.trim()) return { honeypot: true };
  for (const field of ["name", "email", "text"]) if (input[field] != null && typeof input[field] !== "string") return { error: "invalid_field" };
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const text = String(input.text ?? "").trim();
  if (name.length < 2 || name.length > 80 || text.length < 20 || text.length > 3000 || email.length > 254) return { error: "invalid_field" };
  if ([name, email, text].some(value => /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))) return { error: "invalid_field" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "invalid_email" };
  if (!Number.isInteger(input.rating) || Number(input.rating) < 1 || Number(input.rating) > 5) return { error: "invalid_rating" };
  if (input.consent !== true) return { error: "consent_required" };
  if (input.lang !== "lt" && input.lang !== "en") return { error: "invalid_language" };
  return { data: { name, email, text, rating: Number(input.rating), lang: input.lang } };
}

export async function readReviewJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_REVIEW_BYTES) throw new Error("payload_too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  try {
    let size = 0, text = "";
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REVIEW_BYTES) { await reader.cancel(); throw new Error("payload_too_large"); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}

export function reviewOriginAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
