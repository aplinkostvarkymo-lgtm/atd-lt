"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { pavingPriceCopy } from "@/lib/translations";

export function PavingPriceBreakdown() {
  const { lang } = useLanguage();
  const copy = pavingPriceCopy[lang];
  return (
    <div className="mt-10 border-t border-atd-green/20 pt-8" aria-labelledby="paving-price-heading">
      <h3 id="paving-price-heading" className="font-display font-bold text-xl md:text-2xl text-atd-black">{copy.heading}</h3>
      <p className="font-body text-sm text-atd-gray-soft leading-relaxed mt-3 max-w-[65ch]">{copy.intro}</p>
      <dl className="mt-5 max-w-2xl font-body text-sm text-atd-black">
        {copy.items.map(item => (
          <div key={item.label} className="flex justify-between gap-5 border-b border-atd-green/15 py-3">
            <dt className="leading-relaxed">{item.label}</dt>
            <dd className="font-semibold tabular-nums whitespace-nowrap">{item.price}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-5 py-4 font-semibold">
          <dt>{copy.totalLabel}</dt><dd className="tabular-nums whitespace-nowrap">{copy.total}</dd>
        </div>
      </dl>
      <p className="font-body text-sm text-atd-black leading-relaxed max-w-[65ch]">{copy.conditions}</p>
      <p className="font-body text-sm text-atd-gray-soft leading-relaxed mt-4 max-w-[65ch]">{copy.footpaths}</p>
      <p className="font-body text-sm text-atd-gray-soft leading-relaxed mt-3 max-w-[65ch]">{copy.extras}</p>
    </div>
  );
}
