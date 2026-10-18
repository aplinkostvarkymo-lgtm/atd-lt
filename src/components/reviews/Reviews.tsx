"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { reviewsCopy } from "@/lib/translations";
import type { PublicReview } from "@/lib/reviews";

export function RatingStars({ rating }: { rating: number }) {
  const { lang } = useLanguage();
  return <span className="review-stars" role="img" aria-label={`${rating} ${reviewsCopy[lang].outOf}`}>
    {[1, 2, 3, 4, 5].map(value => <Star key={value} size={19} aria-hidden="true" fill={value <= rating ? "currentColor" : "none"} />)}
  </span>;
}

export function usePublicReviews() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reviews", { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Reviews unavailable");
      const data = await response.json();
      if (!Array.isArray(data.reviews)) throw new Error("Invalid review response");
      setReviews(data.reviews); setHasMore(Boolean(data.hasMore)); setStatus("ready");
    }).catch(error => { if (error.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [attempt]);
  return { reviews, status, hasMore, retry: () => { setStatus("loading"); setAttempt(value => value + 1); } };
}

export function ReviewEntry({ review, excerpt = false }: { review: PublicReview; excerpt?: boolean }) {
  const { lang } = useLanguage();
  return <article className="review-entry">
    <RatingStars rating={review.rating} />
    <p className={excerpt ? "review-text review-excerpt" : "review-text"}>{review.text}</p>
    <div className="review-byline"><span>{review.name}</span><time dateTime={review.createdAt}>{new Intl.DateTimeFormat(lang === "lt" ? "lt-LT" : "en-GB", { year: "numeric", month: "long", day: "numeric" }).format(new Date(review.createdAt))}</time></div>
  </article>;
}

export function ReviewsTeaser() {
  const { lang } = useLanguage();
  const copy = reviewsCopy[lang];
  const { reviews, status, retry } = usePublicReviews();
  return <section className="reviews-teaser" aria-labelledby="reviews-heading"><div className="reviews-container">
    <div className="reviews-heading"><h2 id="reviews-heading">{copy.title}</h2><Link href="/atsiliepimai#parasyti" className="review-button">{copy.write}</Link></div>
    {status === "loading" && <p role="status">{copy.loading}</p>}
    {status === "error" && <p>{copy.loadError} <button type="button" className="review-text-link" onClick={retry}>{copy.retry}</button></p>}
    {status === "ready" && (reviews.length ? <><div className="reviews-preview-grid">{reviews.slice(0, 3).map(review => <ReviewEntry key={review.id} review={review} excerpt />)}</div><Link className="review-text-link" href="/atsiliepimai">{copy.all}</Link></> : <p className="reviews-empty">{copy.empty}</p>)}
  </div></section>;
}

export function ReviewForm() {
  const { lang } = useLanguage();
  const copy = reviewsCopy[lang];
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "limited">("idle");
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => { if (status === "success") { result.current?.focus({ preventScroll: true }); result.current?.scrollIntoView({ block: "center", behavior: "instant" }); } }, [status]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fields.get("name"), email: fields.get("email"), text: fields.get("text"), rating, lang, company: fields.get("company"), consent: fields.get("consent") === "on" }) });
      const data = await response.json();
      if (!response.ok || !data.success) { setStatus(response.status === 429 ? "limited" : "error"); return; }
      setStatus("success"); form.reset(); setRating(0);
    } catch { setStatus("error"); }
  }
  if (status === "success") return <div ref={result} tabIndex={-1} role="status" className="review-success"><h3>{copy.successTitle}</h3><p>{copy.success}</p></div>;
  return <form className="review-form" onSubmit={submit} aria-busy={status === "sending"}>
    <fieldset className="review-rating-input" disabled={status === "sending"}><legend>{copy.rating}</legend><p>{copy.chooseRating}</p>
      <div className="review-star-options">{[1, 2, 3, 4, 5].map(value => <label key={value}>
        <input type="radio" name="rating" value={value} required checked={rating === value} onChange={() => setRating(value)} aria-label={`${value} ${copy.outOf}`} />
        <Star size={30} aria-hidden="true" fill={value <= rating ? "currentColor" : "none"} /><span className="sr-only">{value}</span>
      </label>)}</div>
    </fieldset>
    <div><label htmlFor="review-name">{copy.name}</label><input id="review-name" name="name" required minLength={2} maxLength={80} autoComplete="given-name" aria-describedby="review-name-hint" disabled={status === "sending"} /><p id="review-name-hint" className="review-hint">{copy.nameHint}</p></div>
    <div><label htmlFor="review-email">{copy.email}</label><input id="review-email" name="email" type="email" autoComplete="email" maxLength={254} spellCheck={false} aria-describedby="review-email-hint" disabled={status === "sending"} /><p id="review-email-hint" className="review-hint">{copy.emailHint}</p></div>
    <div><label htmlFor="review-text">{copy.text}</label><textarea id="review-text" name="text" required minLength={20} maxLength={3000} rows={7} aria-describedby="review-text-hint" disabled={status === "sending"} /><p id="review-text-hint" className="review-hint">{copy.textHint}</p></div>
    <div hidden aria-hidden="true"><label htmlFor="review-company">Company</label><input id="review-company" name="company" tabIndex={-1} autoComplete="off" /></div>
    <label className="review-consent"><input type="checkbox" name="consent" required disabled={status === "sending"} /><span>{copy.consent}</span></label>
    <p className="review-hint">{copy.policy}</p>
    {(status === "error" || status === "limited") && <p role="alert" className="review-error">{status === "limited" ? copy.rateLimit : copy.error}</p>}
    <button className="review-button" type="submit" disabled={status === "sending"}>{status === "sending" ? copy.sending : copy.submit}</button>
  </form>;
}
