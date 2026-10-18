import "./globals.css";
import Link from "next/link";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { notFoundCopy } from "@/lib/translations";

const display = Playfair_Display({ subsets: ["latin", "latin-ext"], weight: ["600"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-body" });
export const metadata = { title: "Puslapio neradome / Page not found | ATD", robots: { index: false, follow: true } };

export default function GlobalNotFound() {
  return <html lang="lt" className={`${display.variable} ${body.variable}`}><body>
    <main className="not-found-page"><div className="not-found-inner"><Link href="/" className="font-display text-2xl font-bold text-atd-green">ATD</Link>
      <h1>{notFoundCopy.lt.title}</h1><p>{notFoundCopy.lt.text}</p>
      <nav className="not-found-links" aria-label={notFoundCopy.lt.title}><Link href="/">{notFoundCopy.lt.home}</Link><Link href="/darbai">{notFoundCopy.lt.works}</Link><Link href="/kontaktai">{notFoundCopy.lt.contact}</Link></nav>
      <section lang="en" className="mt-12"><h2 className="font-display text-2xl">{notFoundCopy.en.title}</h2><p className="mt-3">{notFoundCopy.en.text}</p><nav className="not-found-links" aria-label={notFoundCopy.en.title}><Link href="/en">{notFoundCopy.en.home}</Link><Link href="/en/darbai">{notFoundCopy.en.works}</Link><Link href="/en/kontaktai">{notFoundCopy.en.contact}</Link></nav></section>
    </div></main>
  </body></html>;
}
