import Link from "next/link";
import projects from "@/lib/gallery-projects.json";
import { featuredCopy, type Lang } from "@/lib/translations";
import { localizedPath } from "@/lib/navigation";
import { GALLERY_IMAGE_SIZES } from "@/lib/gallery-images";

export function FeaturedProjects({ lang }: { lang: Lang }) {
  const copy = featuredCopy[lang];
  return <section className="featured-projects" aria-labelledby="featured-heading">
    <div className="featured-container">
      <div className="featured-heading"><h2 id="featured-heading">{copy.heading}</h2><Link href={localizedPath("/darbai", lang)}>{copy.all}</Link></div>
      <div className="featured-grid">{copy.items.map(item => {
        const project = projects.find(p => p.id === item.id)!;
        const photo = project.photos[project.cover];
        const image = photo.variants.at(-1)!;
        return <article key={project.id}><Link className="featured-project-link" href={localizedPath(`/darbai/${project.id}`, lang)}>
          <div className="featured-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} srcSet={photo.variants.map(v => `${v.src} ${v.width}w`).join(", ")} sizes={GALLERY_IMAGE_SIZES} width={image.width} height={image.height} alt={photo.alt[lang]} loading="lazy" decoding="async" />
          </div>
          <h3>{project.title[lang]}</h3><p>{item.fact}</p><span className="featured-read">{copy.read}<svg className="cta-arrow" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 10h12m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </Link></article>;
      })}</div>
    </div>
  </section>;
}
