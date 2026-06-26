"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const icons = {
  plant: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 22v-9" />
      <path d="M12 13C12 8 7 5 3 6c1 4 4 7 9 7" />
      <path d="M12 13c0-5 5-8 9-7-1 4-4 7-9 7" />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2c0 0 1.8 3.5 0 5s-5 0-5 0 .5-3.8 2.5-4.5S12 2 12 2z" />
      <path d="M12 22c0 0-1.8-3.5 0-5s5 0 5 0-.5 3.8-2.5 4.5S12 22 12 22z" />
      <path d="M2 12c0 0 3.5-1.8 5 0s0 5 0 5-3.8-.5-4.5-2.5S2 12 2 12z" />
      <path d="M22 12c0 0-3.5 1.8-5 0s0-5 0-5 3.8.5 4.5 2.5S22 12 22 12z" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2L6 10a6 6 0 1 0 12 0L12 2z" />
      <path d="M9.5 14.5a2.5 2.5 0 0 1 2.5-2.5" />
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
    </svg>
  ),
  grass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 20V11" />
      <path d="M12 15c0-4 3.5-7 6-6-1 3-3 5-6 6" />
      <path d="M12 15c0-4-3.5-7-6-6 1 3 3 5 6 6" />
      <path d="M4 20h16" />
    </svg>
  ),
  tile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="4" width="9" height="6" rx="1" />
      <rect x="13" y="4" width="9" height="6" rx="1" />
      <rect x="2" y="13" width="9" height="6" rx="1" />
      <rect x="13" y="13" width="9" height="6" rx="1" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 21h6" />
      <path d="M9 18h6" />
      <path d="M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 5.5V16H9v-1.5C7.5 13.5 6 11.5 6 9a6 6 0 0 1 6-6z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
} as const;

export type IconName = keyof typeof icons;

export interface HotspotData {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  position: { left: string; top: string };
  variant?: "featured";
}

interface HotspotMarkerProps {
  data: HotspotData;
  isVisible: boolean;
  index?: number;
  onOpen?: () => void;
}

export function HotspotMarker({ data, isVisible, index = 0, onOpen }: HotspotMarkerProps) {
  const pulseDelay = index * 0.38;
  const featured = data.variant === "featured";

  const inner = (
    <>
      {/* Icon ring + circle */}
      <div className={`relative ${featured ? "w-14 h-14" : "w-11 h-11"}`}>
        {/* Pulse ring 1 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: featured
              ? "1.5px solid rgba(90, 180, 60, 0.7)"
              : "1px solid rgba(255,255,255,0.45)",
          }}
          animate={{ scale: [1, 2.0], opacity: [0.7, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: pulseDelay,
            ease: "easeOut",
          }}
        />

        {/* Pulse ring 2 — staggered */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: featured
              ? "1.5px solid rgba(90, 180, 60, 0.45)"
              : "1px solid rgba(255,255,255,0.25)",
          }}
          animate={{ scale: [1, featured ? 1.65 : 1.5], opacity: [0.5, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: pulseDelay + 0.85,
            ease: "easeOut",
          }}
        />

        {/* Main glass circle */}
        <motion.div
          className="absolute inset-0 rounded-full flex items-center justify-center text-white"
          style={{
            backgroundColor: featured
              ? "rgba(30, 65, 20, 0.60)"
              : "rgba(10,10,10,0.50)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: featured
              ? "rgba(90, 180, 60, 0.45)"
              : "rgba(255,255,255,0.22)",
          }}
          variants={{
            hovered: {
              backgroundColor: "rgba(52, 92, 52, 0.80)",
              borderColor: "rgba(120, 200, 120, 0.55)",
              scale: 1.18,
              transition: { type: "spring", stiffness: 280, damping: 14 },
            },
          }}
        >
          <motion.div
            variants={{
              hovered: {
                rotate: 14,
                scale: 1.15,
                transition: { type: "spring", stiffness: 380, damping: 10 },
              },
            }}
          >
            {icons[data.icon]}
          </motion.div>
        </motion.div>
      </div>

      {/* Label */}
      <motion.span
        className="font-body text-[11px] font-semibold tracking-wide whitespace-nowrap text-center"
        style={{
          color: featured ? "rgba(160, 230, 120, 0.95)" : "rgba(255,255,255,0.88)",
          textShadow: "0 1px 8px rgba(0,0,0,0.85)",
        }}
        variants={{
          hovered: {
            color: "rgba(255,255,255,1)",
            transition: { duration: 0.15 },
          },
        }}
      >
        {data.label}
      </motion.span>
    </>
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: data.position.left,
        top: data.position.top,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200 }}
      whileHover="hovered"
    >
      {onOpen ? (
        <button
          type="button"
          className="flex flex-col items-center gap-1.5 outline-none cursor-pointer"
          tabIndex={isVisible ? 0 : -1}
          onClick={onOpen}
        >
          {inner}
        </button>
      ) : (
        <Link
          href={data.href}
          className="flex flex-col items-center gap-1.5 outline-none"
          tabIndex={isVisible ? 0 : -1}
        >
          {inner}
        </Link>
      )}
    </motion.div>
  );
}
