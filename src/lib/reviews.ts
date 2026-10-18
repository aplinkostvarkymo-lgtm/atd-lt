import { createHmac, timingSafeEqual } from "node:crypto";
import type { ReviewInput } from "./review-validation";

export type ReviewReply = { text: string; updatedAt: string };
export type PublicReview = { id: string; name: string; rating: number; text: string; createdAt: string; reply?: ReviewReply };
export type ReviewState = "pending" | "approved" | "rejected";
type StoredReview = Omit<PublicReview, "id"> & { version: 1; moderation: ReviewState; lang: "lt" | "en"; consent: true };
type AirtableRecord = { id: string; fields: Record<string, unknown> };
export const REVIEW_SOURCE = "atd.lt - atsiliepimas";

function credentials() {
  const key = process.env.AIRTABLE_API_KEY, base = process.env.AIRTABLE_BASE_ID;
  if (!key || !base) throw new Error("Review storage is not configured");
  return { key, endpoint: `https://api.airtable.com/v0/${base}/Leads` };
}
async function storageFetch(suffix: string, init?: RequestInit) {
  const { key, endpoint } = credentials();
  const response = await fetch(endpoint + suffix, { ...init, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, signal: AbortSignal.timeout(10000), cache: "no-store" });
  if (!response.ok) throw new Error(`Review storage HTTP ${response.status}`);
  return response.json();
}
function decodeRecord(record: AirtableRecord): StoredReview | null {
  if (record.fields["Šaltinis"] !== REVIEW_SOURCE || typeof record.fields["Žinutė"] !== "string") return null;
  try {
    const data = JSON.parse(record.fields["Žinutė"]) as StoredReview;
    if (data.version !== 1 || data.consent !== true || !["pending", "approved", "rejected"].includes(data.moderation)) return null;
    if (typeof data.name !== "string" || data.name.length < 2 || data.name.length > 80 || typeof data.text !== "string" || data.text.length < 20 || data.text.length > 3000) return null;
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5 || !Number.isFinite(Date.parse(data.createdAt))) return null;
    return data;
  } catch { return null; }
}
function publicFields(id: string, data: StoredReview): PublicReview {
  const result: PublicReview = { id, name: data.name, rating: data.rating, text: data.text, createdAt: data.createdAt };
  const reply = data.reply;
  if (reply && typeof reply.text === "string" && reply.text.trim().length >= 2 && reply.text.length <= 1500 && Number.isFinite(Date.parse(reply.updatedAt))) {
    result.reply = { text: reply.text, updatedAt: reply.updatedAt };
  }
  return result;
}

export async function saveReview(input: ReviewInput): Promise<string> {
  const data: StoredReview = { version: 1, name: input.name, text: input.text, rating: input.rating, moderation: "pending", createdAt: new Date().toISOString(), lang: input.lang, consent: true };
  const fields: Record<string, string> = { "Vardas": input.name, "Šaltinis": REVIEW_SOURCE, "Statusas": "Naujas", "Data": data.createdAt, "Žinutė": JSON.stringify(data) };
  if (input.email) fields.Email = input.email;
  const record = await storageFetch("", { method: "POST", body: JSON.stringify({ fields, typecast: true }) }) as AirtableRecord;
  if (!/^rec[A-Za-z0-9]{14}$/.test(record.id)) throw new Error("Invalid review storage response");
  return record.id;
}

export async function getPublicReviews(): Promise<{ reviews: PublicReview[]; hasMore: boolean }> {
  const reviews: PublicReview[] = [];
  let offset: string | undefined;
  for (let page = 0; page < 10; page++) {
    const params = new URLSearchParams({ filterByFormula: `AND({Šaltinis}="${REVIEW_SOURCE}",FIND('"moderation":"approved"',{Žinutė})>0)`, pageSize: "100", "sort[0][field]": "Data", "sort[0][direction]": "desc" });
    for (const field of ["Šaltinis", "Žinutė"]) params.append("fields[]", field);
    if (offset) params.set("offset", offset);
    const result = await storageFetch("?" + params) as { records: AirtableRecord[]; offset?: string };
    if (!Array.isArray(result.records)) throw new Error("Invalid review list response");
    for (const record of result.records) {
      const data = decodeRecord(record);
      if (data?.moderation === "approved") reviews.push(publicFields(record.id, data));
    }
    offset = result.offset;
    if (!offset) break;
  }
  return { reviews, hasMore: Boolean(offset) };
}

function signingKey() {
  const secret = process.env.REVIEWS_MODERATION_SECRET ?? process.env.AIRTABLE_API_KEY;
  if (!secret) throw new Error("Review moderation is not configured");
  return createHmac("sha256", secret).update("atd:review-moderation:v1").digest();
}
export function moderationToken(id: string, now = Date.now()): string {
  const payload = `${id}.${Math.floor(now / 1000) + 30 * 86400}`;
  return payload + "." + createHmac("sha256", signingKey()).update(payload).digest("base64url");
}
export function verifyModerationToken(token: string, now = Date.now()): string | null {
  const match = /^(rec[A-Za-z0-9]{14})\.(\d{10,11})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match || Number(match[2]) < Math.floor(now / 1000)) return null;
  const expected = createHmac("sha256", signingKey()).update(`${match[1]}.${match[2]}`).digest();
  const supplied = Buffer.from(match[3], "base64url");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected) ? match[1] : null;
}
export async function getModerationReview(id: string): Promise<{ review: PublicReview; state: ReviewState } | null> {
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) return null;
  const record = await storageFetch("/" + id) as AirtableRecord;
  const data = decodeRecord(record);
  return data ? { review: publicFields(record.id, data), state: data.moderation } : null;
}
export async function moderateReview(id: string, action: "approve" | "reject"): Promise<ReviewState> {
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) throw new Error("Invalid review id");
  const record = await storageFetch("/" + id) as AirtableRecord;
  const data = decodeRecord(record);
  if (!data) throw new Error("Review not found");
  if (data.moderation !== "pending") return data.moderation;
  const state = action === "approve" ? "approved" : "rejected";
  // Preserve the submitted name, rating and text; moderation changes only visibility.
  await storageFetch("/" + id, { method: "PATCH", body: JSON.stringify({ fields: { "Žinutė": JSON.stringify({ ...data, moderation: state }) } }) });
  return state;
}

export async function saveReviewReply(id: string, text: string): Promise<{ review: PublicReview; state: ReviewState } | null> {
  if (!/^rec[A-Za-z0-9]{14}$/.test(id)) throw new Error("Invalid review id");
  const record = await storageFetch("/" + id) as AirtableRecord;
  const data = decodeRecord(record);
  if (!data || data.moderation === "rejected") return null;
  const updated = { ...data };
  if (text) updated.reply = { text, updatedAt: new Date().toISOString() };
  else delete updated.reply;
  await storageFetch("/" + id, { method: "PATCH", body: JSON.stringify({ fields: { "Žinutė": JSON.stringify(updated) } }) });
  return { review: publicFields(record.id, updated), state: updated.moderation };
}
