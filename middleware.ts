import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /refresh izin ver
  if (pathname === "/refresh") {
    return NextResponse.next();
  }

  // İlk segment bir locale gibi görünüyor mu?
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  // Eğer path zaten bir dil kodu içeriyorsa müdahale etme
  if (maybeLocale.length === 2) {
    return NextResponse.next();
  }

  // Değilse /en prefix'i ekle
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|assets/|fonts/|api/).*)",
  ],
};
