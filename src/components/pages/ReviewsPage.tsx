"use client";

import { useState } from "react";
import Link from "@/components/ui/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { reviewsCopy, translations } from "@/lib/translations";
import { ReviewEntry, ReviewForm, usePublicReviews } from "@/components/reviews/Reviews";

export function ReviewsPage() {
  const { lang } = useLanguage();
  const copy = reviewsCopy[lang];
  const { reviews, status, hasMore, retry } = usePublicReviews();
  const [limit, setLimit] = useState(10);
  const average = reviews.length ? new Intl.NumberFormat(lang === "lt" ? "lt-LT" : "en-GB", { maximumFractionDigits: 1 }).format(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) : null;
  return <main id="main-content" tabIndex={-1} className="reviews-page">
    <section className="reviews-intro"><div className="reviews-container"><nav className="review-breadcrumb" aria-label={copy.nav}><Link href="/">{translations[lang].common.home}</Link><span aria-hidden="true">/</span><span>{copy.nav}</span></nav><h1>{copy.title}</h1><p>{copy.intro}</p><a className="review-button" href="#parasyti">{copy.write}</a></div></section>
    <div className="reviews-container reviews-layout">
      <section aria-labelledby="review-list-heading"><h2 id="review-list-heading">{copy.recent}</h2>
        {status === "loading" && <p role="status">{copy.loading}</p>}
        {status === "error" && <p>{copy.loadError} <button className="review-text-link" type="button" onClick={retry}>{copy.retry}</button></p>}
        {status === "ready" && (reviews.length ? <><p className="review-summary">{!hasMore && <>{copy.average}: {average} / 5 · </>}{copy.count}: {reviews.length}{hasMore ? "+" : ""}</p><div className="reviews-list">{reviews.slice(0, limit).map(review => <ReviewEntry key={review.id} review={review} />)}</div>{limit < reviews.length && <button className="review-text-link" type="button" onClick={() => setLimit(value => value + 10)}>{copy.more}</button>}</> : <p className="reviews-empty">{copy.empty}</p>)}
      </section>
      <section id="parasyti" className="review-write" aria-labelledby="write-review-heading"><h2 id="write-review-heading">{copy.formTitle}</h2><ReviewForm /></section>
    </div>
  </main>;
}
