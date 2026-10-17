"use client";

import { useEffect, useRef } from "react";

type Step = { title: string; desc: string };

export function ProcessSteps({ steps }: { steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!list || preference.matches || !("IntersectionObserver" in window)) return;

    // Default HTML stays visible without JavaScript. Only enhance after hydration.
    list.dataset.motion = "pending";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      list.dataset.motion = "playing";
      observer.disconnect();
    }, { rootMargin: "0px 0px -48px 0px", threshold: 0.1 });
    observer.observe(list);

    const finish = () => {
      if (preference.matches) {
        delete list.dataset.motion;
        observer.disconnect();
      }
    };
    preference.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", finish);
      delete list.dataset.motion;
    };
  }, []);

  return (
    <ol ref={listRef} className="process-steps grid md:grid-cols-3 gap-8 md:gap-6 relative" role="list">
      {steps.map((step, index) => (
        <li key={step.title} className="process-step relative grid grid-cols-[3rem_1fr] gap-x-4 md:block">
          <span aria-hidden="true" className="process-connector" />
          <span className="process-number relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-atd-green font-display text-lg font-bold text-white md:mb-5">
            {index + 1}
          </span>
          <div className="relative">
            <h3 className="font-display font-bold text-lg text-atd-black">{step.title}</h3>
            <p className="font-body text-sm text-atd-gray-soft mt-2 leading-relaxed">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
