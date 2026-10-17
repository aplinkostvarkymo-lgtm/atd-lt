import { notFound } from "next/navigation";
import { GardenSceneHero } from "@/components/sections/GardenSceneHero";
import { StatsBar } from "@/components/sections/StatsBar";
import { VejaPage } from "@/components/pages/VejaPage";
import { ApzeldinimoPas } from "@/components/pages/ApzeldinimoPas";
import { TrinkelesPas } from "@/components/pages/TrinkelesPas";
import { LaistymasPas } from "@/components/pages/LaistymasPas";
import { TvenkiniaiPas } from "@/components/pages/TvenkiniaiPas";
import { KontaktaiPage } from "@/components/pages/KontaktaiPage";
import { DarbaiPage } from "@/components/pages/DarbaiPage";
import { SchemaOrg } from "@/components/SchemaOrg";
import { PAGE_PATHS } from "@/lib/navigation";
import { pageMetadata, type PagePath } from "@/lib/site-metadata";
import { pageSchemas } from "@/lib/schemas";

type Params = Promise<{ lang: string; slug?: string[] }>;
function route({ lang, slug }: Awaited<Params>) {
  const path = (slug?.length ? `/${slug.join("/")}` : "/") as PagePath;
  if ((lang !== "lt" && lang !== "en") || !PAGE_PATHS.includes(path)) notFound();
  return { lang, path } as { lang: "lt" | "en"; path: PagePath };
}
export function generateStaticParams() { return PAGE_PATHS.map(path => ({ slug: path === "/" ? [] : path.slice(1).split("/") })); }
export async function generateMetadata({ params }: { params: Params }) { const { lang, path } = route(await params); return pageMetadata(path, lang); }

export default async function Page({ params }: { params: Params }) {
  const { lang, path } = route(await params);
  const pages = {
    "/": <main id="main-content" tabIndex={-1}><GardenSceneHero /><StatsBar /></main>,
    "/paslaugos/veja": <VejaPage />, "/paslaugos/apzeldinimas": <ApzeldinimoPas />,
    "/paslaugos/trinkeles": <TrinkelesPas />, "/paslaugos/laistymas": <LaistymasPas />,
    "/paslaugos/tvenkiniai": <TvenkiniaiPas />, "/kontaktai": <KontaktaiPage />, "/darbai": <DarbaiPage />,
  };
  return <>{pageSchemas(path, lang).map((schema, index) => <SchemaOrg key={index} schema={schema} />)}{pages[path]}</>;
}
