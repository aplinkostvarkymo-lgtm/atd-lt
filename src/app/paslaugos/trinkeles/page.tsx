import type { Metadata } from "next";
import { TrinkelesPas } from "@/components/pages/TrinkelesPas";
import { SchemaOrg } from "@/components/SchemaOrg";
import { trinkelesServiceSchema, trinkelesFaqSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Trinkelių klojimas Vilniuje — Betoninės nuo 40 €/m²",
  description:
    "Profesionalus trinkelių klojimas ir takų įrengimas Vilniuje. Betoninės nuo 40 €/m², " +
    "granito ir klinkerinės nuo 55 €/m², natūralus akmuo nuo 65 €/m². Nemokama apžiūra.",
  keywords: [
    "trinkelių klojimas Vilnius",
    "takai trinkelės Vilnius",
    "trinkelių klojimas kaina",
    "granito trinkelės Vilnius",
    "betoninės trinkelės kaina",
    "takų įrengimas Vilnius",
  ],
  openGraph: {
    title: "Trinkelių klojimas Vilniuje — ATD",
    description: "Betoninės nuo 40 €/m², granito nuo 55 €/m², natūralus akmuo nuo 65 €/m². Pagrindo paruošimas įskaičiuotas.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/paslaugos/trinkeles",
  },
  alternates: {
    canonical: "https://atd.lt/paslaugos/trinkeles",
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={trinkelesServiceSchema} />
      <SchemaOrg schema={trinkelesFaqSchema} />
      <TrinkelesPas />
    </>
  );
}
