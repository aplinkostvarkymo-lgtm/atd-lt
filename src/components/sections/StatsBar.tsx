"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

function useVisibleOnce(ref: React.RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isVisible = () => {
      const { top, bottom } = el.getBoundingClientRect();
      return top < window.innerHeight && bottom > 0;
    };

    if (isVisible()) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setVisible(true); cleanup(); }
      },
      { threshold: 0 }
    );
    io.observe(el);

    // Polling fallback — catches scroll in envs where IO doesn't fire
    const timer = setInterval(() => {
      if (isVisible()) { setVisible(true); cleanup(); }
    }, 150);

    const cleanup = () => { io.disconnect(); clearInterval(timer); };
    return cleanup;
  // ref is stable — intentionally omitting from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return visible;
}

function useCountUp(target: number, inView: boolean, skip: boolean): number {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (skip) { setCount(target); return; }
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, skip, target]);

  return count;
}

export function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const inView = useVisibleOnce(ref);
  const shouldReduceMotion = useReducedMotion();
  const skip = shouldReduceMotion === true;
  const { lang } = useLanguage();
  const t = translations[lang].statsbar;

  const count1 = useCountUp(170, inView, skip);
  const count2 = useCountUp(12, inView, skip);

  return (
    <section ref={ref} className="bg-atd-cream border-t border-atd-black/5">
      <div className="max-w-5xl mx-auto px-6 py-6 md:py-10 grid grid-cols-3">

        <motion.div
          className="text-center px-3 md:px-10 border-r border-atd-black/10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="font-display font-bold text-[2rem] md:text-[2.75rem] text-atd-green tabular-nums leading-none">
            {count1}+
          </div>
          <div className="font-body text-[11px] md:text-sm text-atd-black/60 mt-2 leading-snug">
            {t.stat1_label}
          </div>
        </motion.div>

        <motion.div
          className="text-center px-3 md:px-10 border-r border-atd-black/10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <div className="font-display font-bold text-[2rem] md:text-[2.75rem] text-atd-green tabular-nums leading-none">
            {count2}+
          </div>
          <div className="font-body text-[11px] md:text-sm text-atd-black/60 mt-2 leading-snug">
            {t.stat2_label}
          </div>
        </motion.div>

        <motion.div
          className="text-center px-3 md:px-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <div className="font-display font-bold text-[2rem] md:text-[2.75rem] text-atd-green leading-none">
            {t.stat3_value}
          </div>
          <div className="font-body text-[11px] md:text-sm text-atd-black/60 mt-2 leading-snug">
            {t.stat3_label}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
