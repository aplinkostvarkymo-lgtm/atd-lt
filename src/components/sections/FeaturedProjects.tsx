import Link from "next/link";
import projects from "@/lib/gallery-projects.json";
import { featuredCopy, type Lang } from "@/lib/translations";
import { localizedPath } from "@/lib/navigation";

export function FeaturedProjects({ lang }: { lang: Lang }) {
  const copy = featuredCopy[lang];
  return <section className="featured-projects" aria-labelledby="featured-heading">
    <div className="featured-container">
      <div className="featured-heading"><h2 id="featured-heading">{copy.heading}</h2><Link href={localizedPath("/darbai", lang)}>{copy.all}</Link></div>
      <div className="featured-grid">{copy.items.map(item => {
        const project = projects.find(p => p.id === item.id)!;
        const photo = project.photos[project.cover];
        const image = photo.variants.at(-1)!;
        return <article key={project.id}><Link href={localizedPath(`/darbai/${project.id}`, lang)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} srcSet={photo.variants.map(v => `${v.src} ${v.width}w`).join(", ")} sizes="(max-width: 700px) 100vw, 560px" width={image.width} height={image.height} alt={photo.alt[lang]} loading="lazy" decoding="async" />
          <h3>{project.title[lang]}</h3><p>{item.fact}</p><span>{copy.read}<span aria-hidden="true"> →</span></span>
        </Link></article>;
      })}</div>
    </div>
  </section>;
}
