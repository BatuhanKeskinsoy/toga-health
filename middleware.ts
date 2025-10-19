import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { URL_TRANSLATIONS } from "@/i18n/routing";
import { getMiddlewareToken } from "@/lib/utils/cookies";
import { getUserProfile } from "@/lib/services/user/user";

// Dil bazlı URL yönlendirmesi için middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "tr", "ar", "he"],
  defaultLocale: "en",
  pathnames: URL_TRANSLATIONS,
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ana dizin için özel kontrol
  if (pathname === "/") {
    // Cookie'den dil tercihini kontrol et
    const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;

    if (localeCookie && ["en", "tr", "ar", "he"].includes(localeCookie)) {
      // Cookie'de geçerli dil varsa o dile yönlendir
      return NextResponse.redirect(new URL(`/${localeCookie}`, request.url));
    } else {
      // Cookie'de dil yoksa varsayılan dile (en) yönlendir
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  // /refresh izin ver
  if (pathname === "/refresh") {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  }

  // API routes için izin ver
  if (pathname.startsWith("/api") || pathname.startsWith("/auth/google/callback") || pathname.startsWith("/auth/facebook/callback")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  }

  // Panel sayfaları için token kontrolü
  if (pathname.includes("/panel")) {
    const token = getMiddlewareToken(request);
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Profile sayfaları için user kontrolü (hem İngilizce hem Türkçe)
  if (pathname.includes("/profile") || pathname.includes("/profil")) {
    const user = await getUserProfile();
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // next-intl middleware'ini kullan
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|assets/|fonts/|api/).*)",
  ],
};
