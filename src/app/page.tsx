import type { Metadata } from "next";
import { GardenSceneHero } from "@/components/sections/GardenSceneHero";
import { StatsBar } from "@/components/sections/StatsBar";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://atd.lt",
  },
};

export default function Home() {
  return (
    <main>
      <GardenSceneHero />
      <StatsBar />
    </main>
  );
}
