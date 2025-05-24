import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'tr', 'ar', 'he'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];

  if (!supportedLocales.includes(locale)) {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:locale*',
};