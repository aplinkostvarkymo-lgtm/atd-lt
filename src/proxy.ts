import { NextResponse, type NextRequest } from "next/server";
import { PAGE_PATHS, unlocalizedPath } from "@/lib/navigation";
import projects from "@/lib/gallery-projects.json";

const projectPaths = new Set(projects.map(project => `/darbai/${project.id}`));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleanPath = unlocalizedPath(pathname);
  const knownPage = PAGE_PATHS.some(path => path === cleanPath) || projectPaths.has(cleanPath) || cleanPath === "/atsiliepimai/patvirtinti";
  if (!knownPage) {
    const target = request.nextUrl.clone();
    target.pathname = pathname === "/en" || pathname.startsWith("/en/") ? "/en/404" : "/lt/404";
    return NextResponse.rewrite(target, { status: 404, headers: { "X-Robots-Tag": "noindex, follow" } });
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  if (pathname === "/lt" || pathname.startsWith("/lt/")) {
    if (!PAGE_PATHS.some(path => path === unlocalizedPath(pathname)) && !unlocalizedPath(pathname).startsWith("/darbai/")) return NextResponse.next();
    const target = request.nextUrl.clone();
    target.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(target, 308);
  }
  const target = request.nextUrl.clone();
  target.pathname = `/lt${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(target);
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
