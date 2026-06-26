import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchemaOrg } from "@/components/SchemaOrg";
import { localBusinessSchema } from "@/lib/schemas";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATD — Aplinkos tvarkymas Vilniuje | Veja, apželdinimas, trinkelės",
  description:
    "Profesionalus aplinkos tvarkymas Vilniuje. Vejos įrengimas nuo 8 €/m². " +
    "Apželdinimas, trinkelių klojimas, laistymo sistemos. Nemokama apžiūra.",
  keywords: [
    "aplinkos tvarkymas Vilnius",
    "vejos įrengimas",
    "apželdinimas",
    "trinkelės Vilnius",
    "laistymo sistemos",
  ],
  openGraph: {
    title: "ATD — Aplinkos tvarkymas Vilniuje",
    description: "Veja, apželdinimas, trinkelės. Dirbame su projektine dokumentacija.",
    locale: "lt_LT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="lt"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        <SchemaOrg schema={localBusinessSchema} />
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
