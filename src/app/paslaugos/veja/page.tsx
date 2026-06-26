import type { Metadata } from "next";
import { VejaPage } from "@/components/pages/VejaPage";
import { SchemaOrg } from "@/components/SchemaOrg";
import { vejaServiceSchema, vejaFaqSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Vejos įrengimas Vilniuje — Ruloninė nuo 8 €/m²",
  description:
    "Profesionalus vejos įrengimas Vilniuje. Ruloninė veja nuo 8 €/m², sėjama veja nuo 4 €/m². " +
    "Grunto paruošimas įskaičiuotas. Nemokama apžiūra. 170+ atliktų projektų.",
  keywords: [
    "vejos įrengimas Vilnius",
    "ruloninė veja Vilnius",
    "vejos įrengimas kaina",
    "vejų sėjimas kaina",
    "ruloninė veja kaina",
    "sėjama veja Vilnius",
    "vejos įrengimas",
  ],
  openGraph: {
    title: "Vejos įrengimas Vilniuje — ATD",
    description: "Ruloninė veja nuo 8 €/m², sėjama nuo 4 €/m². Grunto paruošimas įskaičiuotas. Nemokama apžiūra.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/paslaugos/veja",
  },
  alternates: {
    canonical: "https://atd.lt/paslaugos/veja",
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={vejaServiceSchema} />
      <SchemaOrg schema={vejaFaqSchema} />
      <VejaPage />
    </>
  );
}
