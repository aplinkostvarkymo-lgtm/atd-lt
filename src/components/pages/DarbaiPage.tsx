"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { Modal } from "@/components/ui/Modal";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import styles from "./DarbaiPage.module.css";

type Category = "all" | "veja" | "apzeldinimas" | "trinkeles" | "laistymas" | "tvenkiniai" | "bendruomene";
type Project = (typeof translations.lt.darbaiPage.projects)[number];
type Photo = Project["photos"][number];

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
  const [active, setActive] = useState<Category>("all");
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Project | null>(null);
  const [index, setIndex] = useState(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t.all }, { key: "apzeldinimas", label: t.category_apzeldinimas },
    { key: "veja", label: t.category_veja }, { key: "trinkeles", label: t.category_trinkeles },
    { key: "laistymas", label: t.category_laistymas }, { key: "tvenkiniai", label: t.category_tvenkiniai },
    { key: "bendruomene", label: t.category_bendruomene },
  ];
  const filtered = t.projects.filter(p => active === "all" || p.categories.includes(active));
  const photo = selected?.photos[index];
  useEffect(() => {
    thumbs.current?.querySelector<HTMLElement>(`[data-photo-index="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }, [index]);
  function step(direction: number) {
    if (selected) setIndex(current => (current + direction + selected.photos.length) % selected.photos.length);
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
            {categories.map(({ key, label }) => <button key={key} type="button" aria-pressed={active === key} onClick={() => { setActive(key); setLimit(10); }}>{label}</button>)}
          </div>
          <p className={styles.count} role="status">{t.projectCount}: {filtered.length}</p>
          <div className={styles.grid}>
            {filtered.slice(0, limit).map((project, position) => {
              const cover = project.photos[project.cover];
              return <article key={project.id} className={styles.project}>
                <button type="button" className={styles.openProject} onClick={() => { setSelected(project); setIndex(0); }} aria-label={`${t.viewProject}: ${project.title[lang]}`}>
                  <span className={styles.cover}><PhotoImage photo={cover} alt={cover.alt[lang]} eager={position < 2} /><span className={styles.openArrow} aria-hidden="true"><ArrowRight size={22} /></span></span>
                  <span className={styles.projectMeta}>{project.collection ? t.collection : project.categories.map(category => categories.find(c => c.key === category)?.label).filter(Boolean).join(" · ")}<span>{project.photos.length} {t.photoCount}</span></span>
                  <h2>{project.title[lang]}</h2>
                  <span className={styles.viewStory}>{t.viewProject}<ArrowRight size={16} aria-hidden="true" /></span>
                </button>
                <Link className={styles.projectLink} href={`/darbai/${project.id}`}>{project.categories.includes("bendruomene") ? t.eventStory : t.fullStory}</Link>
              </article>;
            })}
          </div>
          {!filtered.length && <p>{t.empty}</p>}
          {limit < filtered.length && <div className={styles.more}><button type="button" onClick={() => setLimit(current => current + 10)}>{t.showMore}<span aria-hidden="true">{Math.min(limit, filtered.length)} / {filtered.length}</span></button></div>}
          <nav className={styles.directory} aria-labelledby="project-directory"><h2 id="project-directory">{t.allProjects}</h2><ul>{t.projects.map(project => <li key={project.id}><Link href={`/darbai/${project.id}`}>{project.title[lang]}</Link></li>)}</ul></nav>
        </div>
      </section>
      <section className={styles.cta}><div className={styles.container}><h2>{t.cta_heading}</h2><p>{t.cta_sub}</p><Link href="/kontaktai" arrow>{t.cta_btn}</Link></div></section>

      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected?.title[lang] ?? t.heading}>
        {selected && photo && <div className={styles.viewer} onKeyDown={event => {
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
        }}>
          <header className={styles.viewerHeader}><h2>{selected.title[lang]}</h2><button type="button" autoFocus onClick={() => setSelected(null)} aria-label={translations[lang].common.close}><X size={24} /></button></header>
          <div className={styles.viewerScroll}>
            <figure className={styles.figure}>
              <div className={styles.photoStage}><PhotoImage key={photo.variants[0].src} photo={photo} alt={photo.alt[lang]} large eager />
                {selected.photos.length > 1 && <><button type="button" className={styles.previous} onClick={() => step(-1)} aria-label={t.previous}><ArrowLeft size={24} /></button><button type="button" className={styles.next} onClick={() => step(1)} aria-label={t.next}><ArrowRight size={24} /></button></>}
              </div>
              <figcaption aria-live="polite"><span>{t.photo} {index + 1} / {selected.photos.length}</span><span>{photo.alt[lang]}</span></figcaption>
            </figure>
            <div ref={thumbs} className={styles.thumbnails} aria-label={t.photoCount}>
              {selected.photos.map((item, number) => <button key={item.id} data-photo-index={number} type="button" aria-label={`${t.photo} ${number + 1}: ${item.alt[lang]}`} aria-pressed={index === number} onClick={() => setIndex(number)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.variants[0].src} width={item.variants[0].width} height={item.variants[0].height} alt="" loading="lazy" decoding="async" />
                <span>{number + 1}</span>
              </button>)}
            </div>
            <div className={styles.story}><h3>{selected.categories.includes("bendruomene") ? t.eventDetails : t.projectDetails}</h3>{selected.collection && <p className={styles.collection}>{t.collection}</p>}<p>{selected.description[lang]}</p>{selected.scope && <p className={styles.scope}>{selected.scope[lang]}</p>}<Link className={styles.storyLink} href={`/darbai/${selected.id}`} onClick={() => setSelected(null)}>{selected.categories.includes("bendruomene") ? t.eventStory : t.fullStory}</Link></div>
          </div>
        </div>}
      </Modal>
    </main>
  );
}
