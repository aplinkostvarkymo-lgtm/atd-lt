import { NextResponse, type NextRequest } from "next/server";
import { PAGE_PATHS, unlocalizedPath } from "@/lib/navigation";
import projects from "@/lib/gallery-projects.json";
import { retiredWebsiteMessage } from "@/lib/translations";

const projectPaths = new Set(projects.map(project => `/darbai/${project.id}`));

export function proxy(request: NextRequest) {
  // The owner retired this old test shop. Keep it crawlable so search engines
  // can observe removal; never expose the live site's pages or APIs on this host.
  const hostname = (request.headers.get("host") || request.nextUrl.host).split(":")[0].toLowerCase();
  if (hostname === "news.atd.lt") {
    if (request.nextUrl.pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nAllow: /\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return new NextResponse(`${retiredWebsiteMessage.lt}\n\n${retiredWebsiteMessage.en}\n`, {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
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

export const config = { matcher: [
  "/((?!api|_next|.*\\..*).*)",
  { source: "/:path*", has: [{ type: "host", value: "news\\.atd\\.lt" }] },
] };
