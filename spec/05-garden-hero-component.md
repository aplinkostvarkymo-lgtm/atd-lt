# GardenSceneHero — Detalus Komponento Spec
*Sudėtingiausias komponentas. Kurti pirmą.*

---

## Failo vieta

`src/components/sections/GardenSceneHero.tsx`

---

## Pilnas TypeScript kodas (šablonas)

```typescript
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Hotspot'ų konfigūracija
const HOTSPOTS = [
  {
    id: "gelynai",
    label: "Apželdinimas",
    description: "Augalų parinkimas ir sodinimas pagal projektą.",
    href: "/paslaugos/apzeldinimas",
    // pozicija kaip % nuo kairės ir nuo viršaus
    position: { left: "30%", top: "55%" },
  },
  {
    id: "veja",
    label: "Vejos įrengimas",
    description: "Ruloninė nuo 8 €/m². Sėjama nuo 4 €/m².",
    href: "/paslaugos/veja",
    position: { left: "55%", top: "70%" },
  },
  {
    id: "laistymas",
    label: "Laistymo sistemos",
    description: "Automatinės laistymo sistemos įrengimas.",
    href: "/paslaugos/laistymas",
    position: { left: "42%", top: "45%" },
  },
  {
    id: "sandėliukas",
    label: "Atlikti projektai",
    description: "170+ įgyvendintų projektų Vilniuje.",
    href: "/darbai",
    position: { left: "78%", top: "50%" },
  },
  {
    id: "karutis",
    label: "Kontaktai",
    description: "Nemokama apžiūra. +370 657 85096",
    href: "/kontaktai",
    position: { left: "15%", top: "65%" },
  },
] as const;

// Hotspot komponento tipas
interface HotspotData {
  id: string;
  label: string;
  description: string;
  href: string;
  position: { left: string; top: string };
}

// Vieno hotspot'o komponentas
function Hotspot({ data, isVisible }: { data: HotspotData; isVisible: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      style={{ left: data.position.left, top: data.position.top }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Pulsuojanti točka */}
      <button
        className="relative w-4 h-4 -translate-x-2 -translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => window.location.href = data.href}
        aria-label={data.label}
      >
        {/* Išorinė pulso animacija */}
        <span className="absolute inset-0 rounded-full bg-atd-green opacity-40 hotspot-pulse" />
        {/* Vidinė točka */}
        <span className="absolute inset-1 rounded-full bg-atd-green" />
      </button>

      {/* Glassmorphism kortelė — atsiranda hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 glass rounded-sm p-3 pointer-events-none"
          >
            <p className="font-display font-semibold text-white text-sm">{data.label}</p>
            <p className="font-body text-white/80 text-xs mt-1">{data.description}</p>
            <p className="font-body text-white text-xs mt-2 flex items-center gap-1">
              <span>→</span> Sužinoti daugiau
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Pagrindinis komponentas
export function GardenSceneHero() {
  const shouldReduceMotion = useReducedMotion();
  const [animationState, setAnimationState] = useState<
    "idle" | "doors-opening" | "scene-visible" | "text-visible" | "hotspots-visible"
  >("idle");

  useEffect(() => {
    if (shouldReduceMotion) {
      setAnimationState("hotspots-visible");
      return;
    }

    // Animacijos seka
    const sequence = [
      { state: "doors-opening" as const, delay: 0 },
      { state: "scene-visible" as const, delay: 1400 },
      { state: "text-visible" as const, delay: 1800 },
      { state: "hotspots-visible" as const, delay: 2000 },
    ];

    sequence.forEach(({ state, delay }) => {
      setTimeout(() => setAnimationState(state), delay);
    });
  }, [shouldReduceMotion]);

  const isSceneVisible = ["scene-visible", "text-visible", "hotspots-visible"].includes(animationState);
  const isTextVisible = ["text-visible", "hotspots-visible"].includes(animationState);
  const areHotspotsVisible = animationState === "hotspots-visible";

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">
      {/* Fono nuotrauka */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSceneVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/images/hero-placeholder.jpg"
          alt="Aplinkos tvarkymas Vilniuje — ATD"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Tamsus overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Durų animacija */}
      {!shouldReduceMotion && (
        <>
          {/* Kairė durų pusė */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-black z-10 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: animationState !== "idle" ? 0 : 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "left" }}
          >
            {/* Stiklo efektas ant durų */}
            <div className="absolute inset-0 glass opacity-30" />
            {/* Vertikali durų linija */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />
          </motion.div>

          {/* Dešinė durų pusė */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-black z-10 origin-right"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: animationState !== "idle" ? 0 : 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: "right" }}
          >
            <div className="absolute inset-0 glass opacity-30" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" />
          </motion.div>
        </>
      )}

      {/* Hotspot'ai */}
      <div className="absolute inset-0 z-20 hidden md:block">
        {HOTSPOTS.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            data={hotspot}
            isVisible={areHotspotsVisible}
          />
        ))}
      </div>

      {/* Tekstas ir CTA (bottom-left) */}
      <motion.div
        className="absolute bottom-12 left-8 md:left-12 z-20 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight drop-shadow-lg">
          Aplinkos tvarkymas<br />Vilniuje
        </h1>
        <p className="font-body text-lg md:text-xl text-white/90 mt-3 drop-shadow">
          Veja, apželdinimas, trinkelės.<br />
          Dirbame su projektine dokumentacija.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/kaina"
            className="bg-atd-green text-white font-body font-medium text-sm tracking-wider uppercase px-8 py-4 hover:bg-atd-green-light transition-colors duration-200"
          >
            Gauti preliminarią kainą
          </Link>
          <Link
            href="/darbai"
            className="border border-white text-white font-body font-medium text-sm tracking-wider uppercase px-8 py-4 hover:bg-white hover:text-atd-black transition-colors duration-200"
          >
            Žiūrėti darbus
          </Link>
        </div>
      </motion.div>

      {/* Mobile paslaugų juosta */}
      <div className="absolute bottom-0 left-0 right-0 z-20 md:hidden">
        <div className="flex overflow-x-auto gap-2 p-3 bg-black/60 backdrop-blur-sm">
          {HOTSPOTS.map((hotspot) => (
            <Link
              key={hotspot.id}
              href={hotspot.href}
              className="flex-shrink-0 bg-white/15 border border-white/30 text-white text-xs font-body px-4 py-2 whitespace-nowrap"
            >
              {hotspot.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Skip mygtukas */}
      {!shouldReduceMotion && animationState !== "hotspots-visible" && (
        <button
          className="absolute top-4 right-4 z-30 text-white/60 text-xs font-body hover:text-white transition-colors"
          onClick={() => setAnimationState("hotspots-visible")}
        >
          Praleisti →
        </button>
      )}
    </section>
  );
}
```

---

## Instaliavimo reikalavimai

```bash
# Framer Motion
npm install framer-motion

# Jei dar neinstaliuotas shadcn
npx shadcn@latest init
```

---

## Nuotraukos reikalavimas

`/public/images/hero-placeholder.jpg` — sukurti tamsų 1920x1080 placeholder:
- Gali būti CSS gradientas (žalia → tamsiai žalia)
- Arba atsisiųsti bet kurią royalty-free sodo/parko nuotrauką kaip laikina

Reali Roberto nuotrauka įdedama vėliau — tiesiog pakeičia src="/images/hero-garden.jpg"

---

## Mobile pastabos

- Hotspot'ai `hidden md:block` — desktop tik
- Vietoje jų — `bottom` paslaugų juosta su horizontal scroll
- Hero aukštis mobile: `min-h-[600px]` + `h-screen`
- Tekstas: `text-4xl` mobile, `text-6xl` desktop

---

## Testavimas

1. Desktop: hover kiekvieną hotspot'ą → patikrinti glassmorphism kortelę
2. Mobile: patikrinti paslaugų juostos scroll'inimą
3. `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering) → animacijos turi praleisti
4. Skip mygtuko paspaudimas → iš karto rodyti visa

---

*Grįžti į: 01-homepage-spec.md*
