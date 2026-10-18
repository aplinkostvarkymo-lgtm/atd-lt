import { getModerationReview, moderateReview, verifyModerationToken } from "@/lib/reviews";
import { readReviewJson, reviewOriginAllowed } from "@/lib/review-validation";

const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
const fail = (error: string, status: number) => Response.json({ error }, { status, headers });

export async function GET(request: Request) {
  try {
    const id = verifyModerationToken(request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "");
    if (!id) return fail("invalid_token", 403);
    const result = await getModerationReview(id);
    return result ? Response.json(result, { headers }) : fail("not_found", 404);
  } catch { return fail("temporarily_unavailable", 503); }
}

export async function POST(request: Request) {
  if (!reviewOriginAllowed(request)) return fail("invalid_origin", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return fail("unsupported_content_type", 415);
  try {
    const body = await readReviewJson(request) as { token?: unknown; action?: unknown } | null;
    if (!body || typeof body !== "object" || typeof body.token !== "string" || (body.action !== "approve" && body.action !== "reject")) return fail("invalid_body", 400);
    const id = verifyModerationToken(body.token);
    if (!id) return fail("invalid_token", 403);
    const state = await moderateReview(id, body.action);
    return Response.json({ success: true, state }, { headers });
  } catch { return fail("temporarily_unavailable", 503); }
}
