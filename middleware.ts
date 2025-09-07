import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { URL_TRANSLATIONS } from '@/i18n/routing';
import { getMiddlewareToken } from '@/lib/utils/cookies';

// Dil bazlı URL yönlendirmesi için middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'tr', 'ar', 'he'],
  defaultLocale: 'en',
  pathnames: URL_TRANSLATIONS
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /refresh izin ver
  if (pathname === "/refresh") {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // API routes için izin ver
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Panel sayfaları için token kontrolü
  if (pathname.includes('/panel')) {
    const token = getMiddlewareToken(request);
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
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
