import type { Metadata } from "next";
import { TvenkiniaiPas } from "@/components/pages/TvenkiniaiPas";

export const metadata: Metadata = {
  title: "Tvenkinių kasimas ir priežiūra Vilniuje — ATD",
  description:
    "Profesionalus tvenkinių kasimas, valymas ir įžuvinimas Vilniuje ir Vilniaus rajone. " +
    "Nemokama apžiūra. Kainų pasiūlymas per 24–48 val.",
  keywords: [
    "tvenkinių kasimas Vilnius",
    "tvenkinių valymas Vilnius",
    "tvenkinių įrengimas",
    "tvenkinio kasimas kaina",
    "tvenkiniai sodybai",
    "tvenkinio valymas kaina",
  ],
  openGraph: {
    title: "Tvenkinių kasimas ir priežiūra Vilniuje — ATD",
    description: "Tvenkinių kasimas, valymas ir įžuvinimas. Nemokama apžiūra. Kainų pasiūlymas per 24–48 val.",
    locale: "lt_LT",
    type: "website",
    url: "https://atd.lt/paslaugos/tvenkiniai",
  },
  alternates: {
    canonical: "https://atd.lt/paslaugos/tvenkiniai",
  },
};

export default function Page() {
  return <TvenkiniaiPas />;
}
