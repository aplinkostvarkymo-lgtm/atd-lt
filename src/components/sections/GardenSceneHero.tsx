"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion, useReducedMotion } from "framer-motion";
import { HotspotMarker, type HotspotData } from "@/components/ui/HotspotMarker";
import { ServicePopup } from "@/components/ui/ServicePopup";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import type { IconName } from "@/components/ui/HotspotMarker";

/* Keep the four original desktop coordinates aligned with the photographed garden.
   Mobile copy and service controls reserve space above the fixed contact bar. */
const HOTSPOT_CONFIG: Array<Omit<HotspotData, "label"> & { labelKey: keyof typeof translations.lt.hotspots }> = [
  {
    id: "apzeldinimas",
    labelKey: "apzeldinimas",
    href: "/paslaugos/apzeldinimas",
    icon: "flower" as IconName,
    position: { left: "30%", top: "52%" },
  },
  {
    id: "laistymas",
    labelKey: "laistymas",
    href: "/paslaugos/laistymas",
    icon: "water" as IconName,
    position: { left: "48%", top: "45%" },
  },
  {
    id: "veja",
    labelKey: "veja",
    href: "/paslaugos/veja",
    icon: "grass" as IconName,
    position: { left: "50%", top: "57%" },
  },
  {
    id: "trinkelės",
    labelKey: "trinkelės",
    href: "/paslaugos/trinkeles",
    icon: "tile" as IconName,
    position: { left: "65%", top: "60%" },
  },
];

export function GardenSceneHero() {
  const shouldReduceMotion = useReducedMotion();
  const [videoFinished, setVideoFinished] = useState(false);
  const showImage = videoFinished || shouldReduceMotion === true;
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
    const video = videoRef.current;
    if (!video || shouldReduceMotion) return;
    video.playbackRate = 2;
    // Preserve the doors sequence; only recover if playback never starts or stalls.
    let fallback = window.setTimeout(() => setVideoFinished(true), 10000);
    const progress = () => {
      window.clearTimeout(fallback);
      fallback = window.setTimeout(() => setVideoFinished(true), 10000);
    };
    video.addEventListener("timeupdate", progress);
    video.play().catch(() => setVideoFinished(true));
    return () => { window.clearTimeout(fallback); video.removeEventListener("timeupdate", progress); };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!showImage) return;
    const timer = setTimeout(() => setShowHotspots(true), 700);
    return () => clearTimeout(timer);
  }, [showImage]);

  const revealImage = () => setVideoFinished(true);

  return (
    <>
      <section className="garden-hero relative w-full overflow-hidden bg-black">

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
        <div className={`hero-image absolute inset-0 transition-opacity duration-700 ${showImage ? "opacity-100" : "opacity-0"}`}>
          <Image
            src="/images/main_one.png"
            alt={t.hero.imageAlt}
            fill
            preload
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        </div>

        {/* Hotspots — desktop only */}
        <div className="hero-hotspots absolute inset-0 z-10 hidden md:block">
          {HOTSPOTS.map((hotspot, i) => (
            <HotspotMarker
              key={hotspot.id}
              data={hotspot}
              isVisible={showHotspots || shouldReduceMotion === true}
              index={i}
              onOpen={() => setActiveService(hotspot.id)}
            />
          ))}
        </div>

        {/* Desktop composition is preserved; mobile copy clears the service strip. */}
        <motion.div
          className="hero-copy absolute bottom-[5.5rem] md:bottom-[2%] left-[6%] right-[6%] md:right-auto md:left-[21%] z-10 max-w-xl"
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
              arrow href="/kontaktai"
              className="inline-flex items-center px-6 py-3 bg-atd-green text-white font-body font-medium text-sm hover:bg-atd-green-light transition-all active:scale-[0.97]"
            >
              {t.hero.cta_price}
            </Link>
          </div>
          {/* Telefono eilutė po CTA pašalinta — telefonas akcentuojamas header'yje */}
        </motion.div>

        {/* Mobile service strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 md:hidden">
          <div className="flex overflow-x-auto gap-2 p-3 bg-black/60 backdrop-blur-sm scrollbar-none">
            {HOTSPOTS.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => setActiveService(hotspot.id)}
                className="flex-shrink-0 bg-white/15 border border-white/30 text-white text-xs font-body px-4 py-3 whitespace-nowrap"
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
              className="hero-skip font-body text-sm text-white bg-black/60 px-3 min-h-11 hover:bg-black/80 transition-colors"
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
