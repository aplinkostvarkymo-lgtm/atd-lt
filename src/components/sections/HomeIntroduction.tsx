import Link from "@/components/ui/LocalizedLink";
import { SERVICE_LINKS } from "@/lib/navigation";
import { translations, homeIntroCopy, type Lang } from "@/lib/translations";

export function HomeIntroduction({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const copy = homeIntroCopy[lang];
  return (
    <section className="bg-atd-cream py-16 md:py-20" aria-labelledby="home-services-heading">
      <div className="max-w-5xl mx-auto px-6">
        <h2 id="home-services-heading" className="font-display font-bold text-2xl md:text-3xl text-atd-black max-w-2xl">{copy.title}</h2>
        <p className="font-body text-base text-atd-black/80 leading-relaxed mt-5 max-w-2xl">{copy.text}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 mt-7 font-body font-medium text-atd-green">
          {SERVICE_LINKS.map(service => <li key={service.key}><Link underline href={service.href}>{t.nav.services_sub[service.key]}</Link></li>)}
        </ul>
        <Link underline href="/patarimai" className="inline-block mt-8 font-body text-sm text-atd-green">{copy.guides}</Link>
      </div>
    </section>
  );
}
