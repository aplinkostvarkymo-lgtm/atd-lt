import Link from "@/components/ui/LocalizedLink";
import { TIPS_ARTICLES, tipsCopy } from "@/lib/tips-content";
import { translations, type Lang } from "@/lib/translations";

export function TipsPage({ lang, path }: { lang: Lang; path: string }) {
  const t = tipsCopy[lang];
  const article = TIPS_ARTICLES.find(item => item.path === path);
  return (
    <main id="main-content" tabIndex={-1} className="tips-page bg-white pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <nav aria-label={t.breadcrumb} className="font-body text-sm text-atd-gray-soft flex flex-wrap gap-x-2 gap-y-1 mb-8">
          <Link underline href="/">{translations[lang].common.home}</Link><span aria-hidden="true">/</span>
          {article ? <><Link underline href="/patarimai">{t.heading}</Link><span aria-hidden="true">/</span><span aria-current="page">{article.title[lang]}</span></> : <span aria-current="page">{t.heading}</span>}
        </nav>
        <h1 className="font-display font-bold text-3xl md:text-5xl text-atd-black leading-tight text-balance">{article ? article.title[lang] : t.heading}</h1>
        <p className="font-body text-lg text-atd-black/80 mt-6 leading-relaxed">{article ? article.intro[lang] : t.intro}</p>
        {article ? (
          <article>
            <p className="font-body text-sm text-atd-gray-soft mt-6">{t.publisher}</p>
            {article.sections.map((section, index) => (
              <section key={index} aria-labelledby={`tip-section-${index}`} className="mt-12">
                <h2 id={`tip-section-${index}`} className="font-display font-bold text-2xl md:text-3xl text-atd-black leading-snug">{section.heading[lang]}</h2>
                <p className="font-body text-base text-atd-black/80 mt-4 leading-[1.8]">{section.text[lang]}</p>
                {section.bullets && <ul className="list-disc pl-5 mt-4 space-y-2 font-body text-base text-atd-black/80 leading-relaxed">{section.bullets[lang].map(item => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}
            <aside className="mt-14 pt-8 border-t border-atd-black/15">
              <h2 className="font-display font-bold text-2xl text-atd-black">{t.related}</h2>
              <ul className="space-y-3 mt-5 font-body text-atd-green">
                <li><Link underline href={article.service}>{t.service}</Link></li>
                <li><Link underline href="/darbai">{t.projects}</Link></li>
                <li><Link underline href="/patarimai">{t.all}</Link></li>
              </ul>
            </aside>
          </article>
        ) : (
          <ul className="mt-12 divide-y divide-atd-black/15">
            {TIPS_ARTICLES.map(item => (
              <li key={item.path} className="py-8 first:pt-0">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-atd-black leading-snug"><Link underline href={item.path}>{item.title[lang]}</Link></h2>
                <p className="font-body text-base text-atd-gray-soft mt-3 leading-relaxed">{item.description[lang]}</p>
                <Link arrow href={item.path} className="inline-flex items-center font-body text-sm text-atd-green font-semibold mt-4">{t.read}</Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12">
          <Link arrow href="/kontaktai" className="inline-flex items-center px-6 py-3 bg-atd-green text-white font-body font-semibold text-sm hover:bg-atd-green-light transition-colors">{t.contact}</Link>
        </div>
      </div>
    </main>
  );
}
