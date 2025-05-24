import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr', 'ar', 'he'],
  defaultLocale: 'en',
  localeDetection: false,
});