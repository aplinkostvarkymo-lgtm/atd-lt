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
  const [reply, setReply] = useState("");
  const [replyStatus, setReplyStatus] = useState<"idle" | "saving" | "saved" | "removed" | "error">("idle");
  const unsavedReply = reply.trim() !== (data?.review.reply?.text ?? "");
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch("/api/reviews/moderate", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal }).then(async response => {
      if (response.status === 403 || response.status === 404) { setStatus("invalid"); return; }
      if (!response.ok) throw new Error("Moderation unavailable");
      const result = await response.json();
      setData(result); setReply(result.review.reply?.text ?? ""); setReplyStatus("idle"); setStatus("ready");
    }).catch(error => { if (error.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [token, attempt]);
  async function decide(action: "approve" | "reject") {
    if (!data || !token || status === "saving" || replyStatus === "saving" || (action === "approve" && unsavedReply)) return;
    setStatus("saving");
    try {
      const response = await fetch("/api/reviews/moderate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, action }) });
      if (!response.ok) throw new Error("Moderation failed");
      const result = await response.json();
      setData({ ...data, state: result.state }); setStatus("ready");
    } catch { setStatus("error"); }
  }
  async function saveReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data || !token || status === "saving" || replyStatus === "saving") return;
    setReplyStatus("saving");
    try {
      const response = await fetch("/api/reviews/moderate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, action: "reply", reply }) });
      if (!response.ok) throw new Error("Reply could not be saved");
      const result = await response.json();
      setData({ review: result.review, state: result.state });
      setReply(result.review.reply?.text ?? ""); setReplyStatus(result.review.reply ? "saved" : "removed");
    } catch { setReplyStatus("error"); }
  }
  return <main id="main-content" tabIndex={-1} className="reviews-page review-moderation"><div className="reviews-container">
    <h1>{copy.ownerTitle}</h1><p>{copy.ownerIntro}</p>
    {(!token || status === "invalid") ? <p role="alert" className="review-error">{copy.ownerInvalid}</p> : <>
      {status === "loading" && <p role="status">{copy.loading}</p>}
      {data && <><ReviewEntry review={data.review} />
        {data.state !== "rejected" && <form className="review-reply-form" onSubmit={saveReply} aria-busy={replyStatus === "saving"}>
          <label htmlFor="owner-reply">{copy.replyLabel}</label>
          <textarea id="owner-reply" rows={5} minLength={2} maxLength={1500} value={reply} onChange={event => { setReply(event.target.value); setReplyStatus("idle"); }} placeholder={copy.replyPlaceholder} aria-describedby="owner-reply-hint" disabled={status === "saving" || replyStatus === "saving"} />
          <p id="owner-reply-hint" className="review-hint">{copy.replyHint}</p>
          <button className="review-button" type="submit" disabled={!unsavedReply || replyStatus === "saving" || status === "saving"}>{replyStatus === "saving" ? copy.working : reply.trim() ? copy.saveReply : copy.removeReply}</button>
          {(replyStatus === "saved" || replyStatus === "removed") && <p role="status" className="review-decision">{replyStatus === "saved" ? copy.replySaved : copy.replyRemoved}</p>}
          {replyStatus === "error" && <p role="alert" className="review-error">{copy.replyError}</p>}
          {data.state === "pending" && unsavedReply && <p className="review-hint">{copy.replyUnsaved}</p>}
        </form>}
        {data.state === "pending" ? <div className="review-moderation-actions"><button className="review-button" type="button" disabled={status === "saving" || replyStatus === "saving" || unsavedReply} onClick={() => decide("approve")}>{status === "saving" ? copy.working : copy.approve}</button><button className="review-text-link" type="button" disabled={status === "saving" || replyStatus === "saving"} onClick={() => decide("reject")}>{copy.reject}</button></div> : <p role="status" className="review-decision">{data.state === "approved" ? copy.approved : copy.rejected}</p>}</>}
      {status === "error" && <p role="alert" className="review-error">{copy.ownerError} {!data && <button type="button" className="review-text-link" onClick={() => { setStatus("loading"); setAttempt(value => value + 1); }}>{copy.retry}</button>}</p>}
    </>}
  </div></main>;
}
