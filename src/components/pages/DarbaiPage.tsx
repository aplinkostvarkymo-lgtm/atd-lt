"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import styles from "./DarbaiPage.module.css";

type Category = "all" | "veja" | "apzeldinimas" | "trinkeles" | "laistymas" | "tvenkiniai" | "bendruomene";
type Project = (typeof translations.lt.darbaiPage.projects)[number];
type Photo = Project["photos"][number];

function subscribeFilter(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
const readFilter = () => new URLSearchParams(window.location.search).get("paslauga") ?? "all";
const initialFilter = () => "all";

function PhotoImage({ photo, alt, large = false, eager = false, className }: { photo: Photo; alt: string; large?: boolean; eager?: boolean; className?: string }) {
  const variants = photo.variants;
  const source = variants[large ? variants.length - 1 : 0];
  return (
    // Pre-exported responsive WebP variants retain their original proportions.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={source.src} srcSet={variants.map(v => `${v.src} ${v.width}w`).join(", ")} sizes={large ? "(max-width: 900px) 100vw, 1100px" : "(max-width: 700px) 100vw, 560px"} width={source.width} height={source.height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={className} />
  );
}

export function DarbaiPage() {
  const { lang } = useLanguage();
  const t = translations[lang].darbaiPage;
  const requestedFilter = useSyncExternalStore(subscribeFilter, readFilter, initialFilter);
  const [limit, setLimit] = useState(10);
  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.all }, { key: "apzeldinimas", label: t.category_apzeldinimas },
    { key: "veja", label: t.category_veja }, { key: "trinkeles", label: t.category_trinkeles },
    { key: "laistymas", label: t.category_laistymas }, { key: "tvenkiniai", label: t.category_tvenkiniai },
    { key: "bendruomene", label: t.category_bendruomene },
  ];
  const active: Category = categories.find(c => c.key === requestedFilter)?.key ?? "all";
  const filtered = t.projects.filter(p => active === "all" || p.categories.includes(active));
  function changeFilter(category: Category) {
    const url = new URL(window.location.href);
    if (category === "all") url.searchParams.delete("paslauga");
    else url.searchParams.set("paslauga", category);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setLimit(10);
  }

  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label={t.heading}><Link href="/" underline>{translations[lang].common.home}</Link><span aria-hidden="true">/</span><span>{t.heading}</span></nav>
          <h1>{t.heading}</h1>
          <p>{t.tagline}</p>
        </div>
      </section>
      <section className={styles.work} aria-label={t.heading}>
        <div className={styles.container}>
          <div className={styles.filters} aria-label={t.projectCount}>
            {categories.map(({ key, label }) => <button key={key} type="button" aria-pressed={active === key} onClick={() => changeFilter(key)}>{label}</button>)}
          </div>
          <p className={styles.count} role="status">{t.projectCount}: {filtered.length}</p>
          <div className={styles.grid}>
            {filtered.slice(0, limit).map((project, position) => {
              const cover = project.photos[project.cover];
              return <article key={project.id} className={styles.project}>
                <Link className={styles.openProject} href={`/darbai/${project.id}`}>
                  <span className={styles.cover}><PhotoImage photo={cover} alt={cover.alt[lang]} eager={position < 2} /><span className={styles.openArrow} aria-hidden="true"><ArrowRight size={22} /></span></span>
                  <span className={styles.projectMeta}>{project.collection ? t.collection : project.categories.map(category => categories.find(c => c.key === category)?.label).filter(Boolean).join(" · ")}<span>{project.photos.length} {t.photoCount}</span></span>
                  <h2>{project.title[lang]}</h2>
                  <span className={styles.viewStory}>{t.viewProject}<ArrowRight size={16} aria-hidden="true" /></span>
                </Link>
              </article>;
            })}
          </div>
          {!filtered.length && <p>{t.empty}</p>}
          {limit < filtered.length && <div className={styles.more}><button type="button" onClick={() => setLimit(current => current + 10)}>{t.showMore}<span aria-hidden="true">{Math.min(limit, filtered.length)} / {filtered.length}</span></button></div>}
          <nav className={styles.directory} aria-labelledby="project-directory"><h2 id="project-directory">{t.allProjects}</h2><ul>{t.projects.map(project => <li key={project.id}><Link href={`/darbai/${project.id}`}>{project.title[lang]}</Link></li>)}</ul></nav>
        </div>
      </section>
      <section className={styles.cta}><div className={styles.container}><h2>{t.cta_heading}</h2><p>{t.cta_sub}</p><Link href="/kontaktai" arrow>{t.cta_btn}</Link></div></section>


    </main>
  );
}
