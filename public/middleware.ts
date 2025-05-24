import { NextResponse } from "next/server";

let locales = ["en-US", "nl-NL", "nl"];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: Request): string {
  // Accept-Language başlığını al
  const acceptLanguage = request.headers.get("accept-language");

  // Basitçe ilk eşleşen desteklenen dili döndür
  if (acceptLanguage) {
    const matched = locales.find((locale) => acceptLanguage.includes(locale));
    if (matched) return matched;
  }
}

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next).*)",
  ],
};
