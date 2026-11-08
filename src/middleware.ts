import { NextResponse, type NextRequest } from "next/server";

/** Sends visitors without a language prefix to /en or /pa, based on their browser language. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/^\/(en|pa)(\/|$)/.test(pathname)) return NextResponse.next();
  const prefersPa = (req.headers.get("accept-language") || "").toLowerCase().startsWith("pa");
  const url = req.nextUrl.clone();
  url.pathname = `/${prefersPa ? "pa" : "en"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|og|studio|admin|favicon.ico|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)"],
};
