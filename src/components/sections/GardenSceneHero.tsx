"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HotspotMarker, type HotspotData } from "@/components/ui/HotspotMarker";
import { ServicePopup } from "@/components/ui/ServicePopup";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import type { IconName } from "@/components/ui/HotspotMarker";

/* "prekyba" (/paslaugos/prekyba-augalais), "darbai" (/darbai), "patarimai" (/patarimai)
   ir "kontaktai" (/kontaktai) hotspot'ai pašalinti — šių puslapių kol kas nėra */
/* Pozicijos sąmoningai laikomos virš ~39% top ir/arba toliau nuo kairės teksto bloko
   (bottom-[8%] left-[6%] max-w-xl Hero tekstas) — žr. GardenSceneHero komentarą žemiau
   dėl kolizijos su H1 antraste, ištaisytos 2026-06-26 */
const HOTSPOT_CONFIG: Array<Omit<HotspotData, "label"> & { labelKey: keyof typeof translations.lt.hotspots }> = [
  {
    id: "apzeldinimas",
    labelKey: "apzeldinimas",
    href: "/paslaugos/apzeldinimas",
    icon: "flower" as IconName,
    position: { left: "22%", top: "30%" },
  },
  {
    id: "laistymas",
    labelKey: "laistymas",
    href: "/paslaugos/laistymas",
    icon: "water" as IconName,
    position: { left: "44%", top: "38%" },
  },
  {
    id: "veja",
    labelKey: "veja",
    href: "/paslaugos/veja",
    icon: "grass" as IconName,
    position: { left: "60%", top: "42%" },
  },
  {
    id: "trinkelės",
    labelKey: "trinkelės",
    href: "/paslaugos/trinkeles",
    icon: "tile" as IconName,
    position: { left: "72%", top: "55%" },
  },
];

export function GardenSceneHero() {
  const shouldReduceMotion = useReducedMotion();
  const [showImage, setShowImage] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  const HOTSPOTS: HotspotData[] = HOTSPOT_CONFIG.map(({ labelKey, ...rest }) => ({
    ...rest,
    label: t.hotspots[labelKey],
  }));

  useEffect(() => {
    if (shouldReduceMotion === true) {
      setShowImage(true);
      setShowHotspots(true);
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2;
  }, []);

  useEffect(() => {
    if (!showImage) return;
    const timer = setTimeout(() => setShowHotspots(true), 700);
    return () => clearTimeout(timer);
  }, [showImage]);

  const revealImage = () => setShowImage(true);

  return (
    <>
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">

        {/* Video intro */}
        {!shouldReduceMotion && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showImage ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            autoPlay
            muted
            playsInline
            onEnded={revealImage}
            onError={revealImage}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Background image */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${showImage ? "opacity-100" : "opacity-0"}`}>
          <Image
            src="/images/main_one.png"
            alt={t.hero.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Hotspots — desktop only */}
        <div className="absolute inset-0 z-10 hidden md:block">
          {HOTSPOTS.map((hotspot, i) => (
            <HotspotMarker
              key={hotspot.id}
              data={hotspot}
              isVisible={showHotspots}
              index={i}
              onOpen={() => setActiveService(hotspot.id)}
            />
          ))}
        </div>

        {/* Main text */}
        <motion.div
          className="absolute bottom-[8%] left-[6%] z-10 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showImage ? 1 : 0, y: showImage ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1
            className="font-display font-bold text-white leading-tight"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            <span className="text-4xl md:text-5xl lg:text-[3.5rem]">
              {t.hero.heading}
            </span>
          </h1>
          <p
            className="font-body text-lg md:text-xl text-white/90 mt-3"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {t.hero.subheading}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/kontaktai"
              className="inline-flex items-center px-6 py-3 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-colors"
            >
              {t.hero.cta_price}
            </Link>
            {/* "Žiūrėti darbus" (/darbai) CTA pašalintas — puslapio kol kas nėra */}
          </div>
          <a
            href="tel:+37065785096"
            className="inline-flex items-center gap-2 mt-4 font-body text-sm text-white/65 hover:text-white transition-colors"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {t.hero.phone}
          </a>
        </motion.div>

        {/* Mobile service strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="flex overflow-x-auto gap-2 p-3 bg-black/60 backdrop-blur-sm scrollbar-none">
            {HOTSPOTS.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => setActiveService(hotspot.id)}
                className="flex-shrink-0 bg-white/15 border border-white/30 text-white text-xs font-body px-4 py-2 whitespace-nowrap"
              >
                {hotspot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skip button — below header, only during video */}
        {!shouldReduceMotion && !showImage && (
          <div className="absolute top-20 right-4 z-[60]">
            <button
              className="font-body text-xs text-white/60 hover:text-white transition-colors"
              onClick={revealImage}
            >
              {t.hero.skip}
            </button>
          </div>
        )}

      </section>

      {/* Service popup — rendered outside <section> to escape stacking context */}
      <ServicePopup
        serviceId={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
