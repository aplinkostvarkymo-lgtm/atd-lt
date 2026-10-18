import { createHash } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map<string, { count: number; reset: number }>();

/** Per-process fallback; configure Redis credentials for a limit shared by serverless instances. */
export async function limitLead(request: Request, scope: "lead" | "review" = "lead"): Promise<{ allowed: boolean; retryAfter: number }> {
  const address = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  const key = `atd:${scope}:` + createHash("sha256").update(address.split(",")[0].trim()).digest("hex");
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    // Atomic increment + expiry across workers. Refuse the write if the configured limiter fails.
    const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('PTTL',KEYS[1])}";
    const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", script, "1", key, String(WINDOW_MS)]), signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!res.ok) throw new Error(`Rate limiter HTTP ${res.status}`);
    const result = await res.json() as { result?: [number, number] };
    if (!result.result || result.result.length !== 2) throw new Error("Invalid rate limiter response");
    return { allowed: result.result[0] <= MAX_REQUESTS, retryAfter: Math.max(1, Math.ceil(result.result[1] / 1000)) };
  }
  const now = Date.now();
  for (const [bucketKey, bucket] of buckets) if (bucket.reset <= now) buckets.delete(bucketKey);
  if (buckets.size >= 10000 && !buckets.has(key)) return { allowed: false, retryAfter: 600 };
  const bucket = buckets.get(key) ?? { count: 0, reset: now + WINDOW_MS };
  bucket.count++;
  buckets.set(key, bucket);
  return { allowed: bucket.count <= MAX_REQUESTS, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
}
