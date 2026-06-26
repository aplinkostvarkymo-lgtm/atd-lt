import type { Metadata } from "next";
import { KontaktaiPage } from "@/components/pages/KontaktaiPage";
import { SchemaOrg } from "@/components/SchemaOrg";
import { localBusinessSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Kontaktai | ATD Aplinkos tvarkymas Vilniuje",
  description:
    "Susisiekite su ATD — nemokama apžiūra ir konsultacija. Tel. +370 657 85096. " +
    "Dirbame Vilniuje ir rajone. Kainų pasiūlymas per 24–48 val.",
  keywords: [
    "ATD kontaktai",
    "aplinkos tvarkymas kontaktai Vilnius",
    "apželdinimo įmonė kontaktai",
  ],
  openGraph: {
    title: "Kontaktai — ATD",
    description: "Nemokama apžiūra ir konsultacija. Tel. +370 657 85096. Kainų pasiūlymas per 24–48 val.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/kontaktai",
  },
  alternates: {
    canonical: "https://atd.lt/kontaktai",
  },
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={localBusinessSchema} />
      <KontaktaiPage />
    </>
  );
}
