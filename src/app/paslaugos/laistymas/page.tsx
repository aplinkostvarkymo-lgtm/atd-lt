import type { Metadata } from "next";
import { LaistymasPas } from "@/components/pages/LaistymasPas";
import { SchemaOrg } from "@/components/SchemaOrg";
import { laistymasServiceSchema, laistymasFaqSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Laistymo sistemų įrengimas Vilniuje — Hunter & Rain Bird",
  description:
    "Automatinių laistymo sistemų įrengimas Vilniuje. Hunter ir Rain Bird įranga. " +
    "Pop-up purškikliai, lašelinis ir mikrolaistymas. Nemokamas projektas ir matavimas.",
  keywords: [
    "laistymo sistemos Vilnius",
    "automatinis laistymas Vilnius",
    "laistymo sistema kaina",
    "Hunter Rain Bird Vilnius",
    "lašelinis laistymas Vilnius",
    "laistymo įrengimas sode",
  ],
  openGraph: {
    title: "Laistymo sistemų įrengimas Vilniuje — ATD",
    description: "Hunter ir Rain Bird įranga. Pop-up purškikliai, lašelinis laistymas, mikrolaistymas. Nemokamas projektas.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/paslaugos/laistymas",
  },
  alternates: {
    canonical: "https://atd.lt/paslaugos/laistymas",
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={laistymasServiceSchema} />
      <SchemaOrg schema={laistymasFaqSchema} />
      <LaistymasPas />
    </>
  );
}
