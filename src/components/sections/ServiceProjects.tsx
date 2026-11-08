"use client";

import Link from "@/components/ui/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import projects from "@/lib/gallery-projects.json";
import { serviceProjectCopy } from "@/lib/translations";

type Service = keyof typeof serviceProjectCopy.lt.services;

export function ServiceProjects({ service }: { service: Service }) {
  const { lang } = useLanguage();
  const copy = serviceProjectCopy[lang].services[service];
  return (
    <section className="bg-white py-14 md:py-16" aria-labelledby={`${service}-projects-heading`}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 id={`${service}-projects-heading`} className="font-display font-bold text-2xl md:text-3xl text-atd-black">{copy.heading}</h2>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-7 mt-7">
          {copy.items.map(item => {
            const project = projects.find(project => project.id === item.id)!;
            return (
              <li key={item.id} className="border-t border-atd-green/20 pt-5 min-w-0">
                <h3 className="font-display font-semibold text-xl leading-snug text-atd-green">
                  <Link underline href={`/darbai/${item.id}`}>{project.title[lang]}</Link>
                </h3>
                <p className="font-body text-sm text-atd-gray-soft leading-relaxed mt-3 max-w-[65ch]">{item.fact}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
