import type { Metadata } from "next";
import { DarbaiPage } from "@/components/pages/DarbaiPage";

export const metadata: Metadata = {
  title: "Atlikti darbai | ATD Aplinkos tvarkymas Vilniuje",
  description:
    "ATD atliktų darbų galerija — vejos įrengimas, apželdinimas, trinkelių klojimas, laistymo sistemos Vilniuje. Realūs projektai su nuotraukomis.",
  keywords: [
    "atlikti darbai apželdinimas Vilnius",
    "vejos įrengimo nuotraukos",
    "apželdinimo projektai Vilnius",
    "galerija ATD",
  ],
  openGraph: {
    title: "Atlikti darbai — ATD",
    description: "Realūs ATD projektai Vilniuje. Veja, apželdinimas, trinkelės, laistymas.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/darbai",
  },
  alternates: {
    canonical: "https://atd.lt/darbai",
  },
};

export default function Page() {
  return <DarbaiPage />;
}
