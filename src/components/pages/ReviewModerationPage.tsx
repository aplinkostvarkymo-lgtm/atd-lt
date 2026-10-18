"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { reviewsCopy } from "@/lib/translations";
import { ReviewEntry } from "@/components/reviews/Reviews";
import type { PublicReview, ReviewState } from "@/lib/reviews";

function subscribeHash(callback: () => void) { window.addEventListener("hashchange", callback); return () => window.removeEventListener("hashchange", callback); }
const readToken = () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
const serverToken = () => "";

export function ReviewModerationPage() {
  const { lang } = useLanguage();
  const copy = reviewsCopy[lang];
  const token = useSyncExternalStore(subscribeHash, readToken, serverToken);
  const [data, setData] = useState<{ review: PublicReview; state: ReviewState } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "invalid" | "error" | "saving">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch("/api/reviews/moderate", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal }).then(async response => {
      if (response.status === 403 || response.status === 404) { setStatus("invalid"); return; }
      if (!response.ok) throw new Error("Moderation unavailable");
      setData(await response.json()); setStatus("ready");
    }).catch(error => { if (error.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [token, attempt]);
  async function decide(action: "approve" | "reject") {
    if (!data || !token) return;
    setStatus("saving");
    try {
      const response = await fetch("/api/reviews/moderate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, action }) });
      if (!response.ok) throw new Error("Moderation failed");
      const result = await response.json();
      setData({ ...data, state: result.state }); setStatus("ready");
    } catch { setStatus("error"); }
  }
  return <main id="main-content" tabIndex={-1} className="reviews-page review-moderation"><div className="reviews-container">
    <h1>{copy.ownerTitle}</h1><p>{copy.ownerIntro}</p>
    {(!token || status === "invalid") ? <p role="alert" className="review-error">{copy.ownerInvalid}</p> : <>
      {status === "loading" && <p role="status">{copy.loading}</p>}
      {data && <><ReviewEntry review={data.review} />{data.state === "pending" ? <div className="review-moderation-actions"><button className="review-button" type="button" disabled={status === "saving"} onClick={() => decide("approve")}>{status === "saving" ? copy.working : copy.approve}</button><button className="review-text-link" type="button" disabled={status === "saving"} onClick={() => decide("reject")}>{copy.reject}</button></div> : <p role="status" className="review-decision">{data.state === "approved" ? copy.approved : copy.rejected}</p>}</>}
      {status === "error" && <p role="alert" className="review-error">{copy.ownerError} {!data && <button type="button" className="review-text-link" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>{copy.retry}</button>}</p>}
    </>}
  </div></main>;
}
