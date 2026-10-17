import { NextResponse, type NextRequest } from "next/server";
import { PAGE_PATHS, unlocalizedPath } from "@/lib/navigation";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  if (pathname === "/lt" || pathname.startsWith("/lt/")) {
    if (!PAGE_PATHS.some(path => path === unlocalizedPath(pathname))) return NextResponse.next();
    const target = request.nextUrl.clone();
    target.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(target, 308);
  }
  const target = request.nextUrl.clone();
  target.pathname = `/lt${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(target);
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
