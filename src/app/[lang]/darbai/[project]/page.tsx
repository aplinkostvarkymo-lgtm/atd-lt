import Link from "next/link";
import { notFound } from "next/navigation";
import { SchemaOrg } from "@/components/SchemaOrg";
import { projects, projectMetadata, projectPath, projectSchemas } from "@/lib/gallery-seo";
import { localizedPath } from "@/lib/navigation";
import { translations, type Lang } from "@/lib/translations";
import styles from "./project.module.css";

type Params = Promise<{ lang: string; project: string }>;
function resolve(params: Awaited<Params>) {
  if (params.lang !== "lt" && params.lang !== "en") notFound();
  const project = projects.find(p => p.id === params.project);
  if (!project) notFound();
  return { project, lang: params.lang as Lang };
}
export function generateStaticParams() { return projects.map(p => ({ project: p.id })); }
export async function generateMetadata({ params }: { params: Params }) { const { project, lang } = resolve(await params); return projectMetadata(project, lang); }

export default async function ProjectPage({ params }: { params: Params }) {
  const { project, lang } = resolve(await params);
  const t = translations[lang].darbaiPage;
  const services = [
    { key: "apzeldinimas", href: "/paslaugos/apzeldinimas", label: t.category_apzeldinimas },
    { key: "veja", href: "/paslaugos/veja", label: t.category_veja },
    { key: "trinkeles", href: "/paslaugos/trinkeles", label: t.category_trinkeles },
    { key: "laistymas", href: "/paslaugos/laistymas", label: t.category_laistymas },
    { key: "tvenkiniai", href: "/paslaugos/tvenkiniai", label: t.category_tvenkiniai },
  ].filter(service => project.categories.includes(service.key));
  const related = projects.filter(p => p.id !== project.id && p.categories.some(c => project.categories.includes(c))).slice(0, 3);
  return <>
    {projectSchemas(project, lang).map((schema, i) => <SchemaOrg key={i} schema={schema} />)}
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <article className={styles.container}>
        <nav className={styles.breadcrumb} aria-label={t.heading}><Link href={localizedPath("/", lang)}>{translations[lang].common.home}</Link><span aria-hidden="true">/</span><Link href={localizedPath("/darbai", lang)}>{t.heading}</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title[lang]}</span></nav>
        <header className={styles.intro}>
          <h1>{project.title[lang]}</h1>
          <p className={styles.credit}>ATD — MB ATD.LT</p>
          {project.collection && <p className={styles.collection}>{t.collection}</p>}
          <p className={styles.description}>{project.description[lang]}</p>
          {project.scope && <p className={styles.scope}>{project.scope[lang]}</p>}
          {services.length > 0 && <ul className={styles.services}>{services.map(service => <li key={service.key}><Link href={localizedPath(service.href, lang)}>{service.label}</Link></li>)}</ul>}
        </header>
        <section id="photos" aria-labelledby="photo-heading" className={styles.photos}>
          <h2 id="photo-heading">{project.categories.includes("bendruomene") ? t.eventPhotos : t.projectPhotos}</h2>
          <div className={styles.grid}>{project.photos.map((photo, i) => { const largest = photo.variants.at(-1)!; return <figure key={photo.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={largest.src} srcSet={photo.variants.map(v => `${v.src} ${v.width}w`).join(", ")} sizes="(max-width: 700px) 100vw, 560px" width={largest.width} height={largest.height} alt={photo.alt[lang]} loading={i < 2 ? "eager" : "lazy"} decoding="async" />
            <figcaption><span>{i + 1} / {project.photos.length}</span>{photo.alt[lang]}</figcaption>
          </figure>; })}</div>
        </section>
        {related.length > 0 && <aside className={styles.related}><h2>{t.relatedProjects}</h2><ul>{related.map(p => <li key={p.id}><Link href={localizedPath(projectPath(p.id), lang)}>{p.title[lang]}</Link></li>)}</ul></aside>}
        <div className={styles.actions}><Link href={localizedPath("/darbai", lang)}>{t.allProjects}</Link><Link href={localizedPath("/kontaktai", lang)}>{t.cta_btn}</Link></div>
      </article>
    </main>
  </>;
}
