import type { Metadata } from "next";
import { ApzeldinimoPas } from "@/components/pages/ApzeldinimoPas";
import { SchemaOrg } from "@/components/SchemaOrg";
import { apzeldinimosServiceSchema, apzeldinimsFaqSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Teritorijos apželdinimas Vilniuje — Augalų sodinimas",
  description:
    "Profesionalus teritorijų apželdinimas Vilniuje. Augalų parinkimas ir sodinimas su 1 metų garantija. " +
    "Dirbame su architektų želdynų projektais. Nemokama apžiūra.",
  keywords: [
    "apželdinimas Vilnius",
    "teritorijos apželdinimas",
    "augalų sodinimas Vilnius",
    "želdynų įrengimas Vilnius",
    "apželdinimo paslaugos Vilnius",
    "kraštovaizdžio apželdinimas",
  ],
  openGraph: {
    title: "Teritorijos apželdinimas Vilniuje — ATD",
    description: "Augalų parinkimas, sodinimas su 1 metų garantija. Dirbame su architektų želdynų projektais. Nemokama apžiūra.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/paslaugos/apzeldinimas",
  },
  alternates: {
    canonical: "https://atd.lt/paslaugos/apzeldinimas",
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={apzeldinimosServiceSchema} />
      <SchemaOrg schema={apzeldinimsFaqSchema} />
      <ApzeldinimoPas />
    </>
  );
}
