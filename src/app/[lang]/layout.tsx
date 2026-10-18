import { Playfair_Display, DM_Sans } from "next/font/google";
import "../globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { notFound } from "next/navigation";
import { translations } from "@/lib/translations";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchemaOrg } from "@/components/SchemaOrg";
import { businessSchema } from "@/lib/schemas";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { MobileStickyCTA } from "@/components/ui/MobileStickyCTA";
import { FloatingChat } from "@/components/ui/FloatingChat";
import { SITE_ROBOTS } from "@/lib/site-metadata";

export const metadata = { robots: SITE_ROBOTS };

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

export function generateStaticParams() { return [{ lang: "lt" }, { lang: "en" }]; }
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" as const };

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "lt" && lang !== "en") notFound();
  return (
    <html
      lang={lang}
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        <SchemaOrg schema={businessSchema(lang)} />
        <ClientProviders lang={lang}>
          <a href="#main-content" className="skip-content">{translations[lang].common.skipContent}</a>
          <Header />
          <div className="site-content">
            {children}
            <Footer />
          </div>
          <CookieConsent />
          <MobileStickyCTA />
          <FloatingChat />
        </ClientProviders>
        <Analytics />
        <noscript><style>{`[style*="opacity:0"], [style*="opacity: 0"] { opacity:1 !important; transform:none !important; } .garden-hero video, .hero-skip, .hero-hotspots { display:none !important; } .hero-image, .hero-copy { opacity:1 !important; transform:none !important; }`}</style></noscript>
      </body>
    </html>
  );
}
