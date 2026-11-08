"use client";

// Adapted from 0xuser64bit / Mizu Image Compare (MIT).
// Source and full license: THIRD_PARTY_NOTICES.md.
import { useId, useRef, useState } from "react";
import type { GalleryProject } from "@/lib/gallery-seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { comparisonCopy } from "@/lib/translations";
import Link from "@/components/ui/LocalizedLink";

type Photo = GalleryProject["photos"][number];

export function ProjectComparison({ before, after }: { before: Photo; after: Photo }) {
  const { lang } = useLanguage();
  const copy = comparisonCopy[lang];
  const [position, setPosition] = useState(50);
  const [failed, setFailed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const id = useId();
  const update = (x: number) => {
    const bounds = stage.current?.getBoundingClientRect();
    if (bounds?.width) setPosition(Math.round(Math.max(0, Math.min(100, (x - bounds.left) / bounds.width * 100))));
  };
  const detectFailure = (image: HTMLImageElement | null) => {
    if (image?.complete && !image.naturalWidth) image.decode().catch(() => setFailed(true));
  };

  return <section className="project-comparison" aria-labelledby={`${id}-heading`}>
    <div className="comparison-container">
      <div className="comparison-copy">
        <h2 id={`${id}-heading`}>{copy.heading}</h2>
        <p>{copy.text}</p>
        <Link arrow href="/darbai/individualus-namas" className="comparison-project-link">{copy.link}</Link>
      </div>
      <figure className="comparison-figure">
        <div ref={stage} className="comparison-stage"
          onPointerDown={event => {
            if (event.button !== 0 || failed) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            slider.current?.focus({ preventScroll: true });
            update(event.clientX);
          }}
          onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event.clientX); }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        >
          {failed ? <p className="comparison-unavailable" role="status">{copy.unavailable}</p> : <>
            {[before, after].map((photo, index) => {
              const image = photo.variants.at(-1)!;
              // eslint-disable-next-line @next/next/no-img-element -- Responsive local gallery variants.
              return <img key={index} ref={detectFailure} src={image.src}
                srcSet={photo.variants.map(variant => `${variant.src} ${variant.width}w`).join(", ")}
                sizes="(max-width: 700px) calc(100vw - 48px), 440px"
                width={image.width} height={image.height} alt={photo.alt[lang]}
                loading="lazy" decoding="async" draggable={false}
                className={index === 1 ? "comparison-after" : undefined}
                style={index === 1 ? { clipPath: `inset(0 0 0 ${position}%)` } : undefined}
                onError={() => setFailed(true)} />;
            })}
            <span className="comparison-label comparison-label-before" style={{ opacity: position > 25 ? 1 : 0 }}>{copy.before}</span>
            <span className="comparison-label comparison-label-after" style={{ opacity: position < 75 ? 1 : 0 }}>{copy.after}</span>
            <span className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 8-4 4 4 4m8-8 4 4-4 4M4 12h16" /></svg>
            </span></span>
          </>}
        </div>
        <figcaption>{copy.caption}</figcaption>
        <label className="sr-only" htmlFor={id}>{copy.control}</label>
        <input ref={slider} id={id} className="comparison-range" type="range" min="0" max="100" value={position} disabled={failed}
          aria-describedby={`${id}-help`} aria-valuetext={`${position}% ${copy.before.toLowerCase()}, ${100 - position}% ${copy.after.toLowerCase()}`}
          onChange={event => setPosition(Number(event.target.value))} />
        <p id={`${id}-help`} className="comparison-help">{copy.instruction}</p>
      </figure>
    </div>
  </section>;
}
