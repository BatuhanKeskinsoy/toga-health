import { defineRouting } from 'next-intl/routing';

// URL çevirileri - Sadece EN ve TR arasında URL çevirisi
export const URL_TRANSLATIONS = {
  // Statik sayfalar
  '/contact': {
    en: '/contact',
    tr: '/iletisim',
    ar: '/contact', // Arapça'da İngilizce URL
    he: '/contact'  // İbranice'de İngilizce URL
  },
  '/aboutus': {
    en: '/aboutus',
    tr: '/hakkimizda',
    ar: '/aboutus', // Arapça'da İngilizce URL
    he: '/aboutus'  // İbranice'de İngilizce URL
  },
  '/profile': {
    en: '/profile',
    tr: '/profil',
    ar: '/profile', // Arapça'da İngilizce URL
    he: '/profile'  // İbranice'de İngilizce URL
  },
  '/diseases': {
    en: '/diseases',
    tr: '/hastaliklar',
    ar: '/diseases',
    he: '/diseases'
  },
  '/branches': {
    en: '/branches',
    tr: '/uzmanlik-alanlari',
    ar: '/branches',
    he: '/branches'
  },
  '/treatments-services': {
    en: '/treatments-services',
    tr: '/tedaviler-hizmetler',
    ar: '/treatments-services',
    he: '/treatments-services'
  },
  '/hospital': {
    en: '/hospital',
    tr: '/hastane',
    ar: '/hospital',
    he: '/hospital'
  },


  // Dinamik route'lar - Sadece EN ve TR arasında URL çevirisi
  '/diseases/[slug]': {
    en: '/diseases/[slug]',
    tr: '/hastaliklar/[slug]',
    ar: '/diseases/[slug]', // Arapça'da İngilizce URL
    he: '/diseases/[slug]'  // İbranice'de İngilizce URL
  },
  '/diseases/[slug]/[country]': {
    en: '/diseases/[slug]/[country]',
    tr: '/hastaliklar/[slug]/[country]',
    ar: '/diseases/[slug]/[country]',
    he: '/diseases/[slug]/[country]'
  },
  '/diseases/[slug]/[country]/[city]': {
    en: '/diseases/[slug]/[country]/[city]',
    tr: '/hastaliklar/[slug]/[country]/[city]',
    ar: '/diseases/[slug]/[country]/[city]',
    he: '/diseases/[slug]/[country]/[city]'
  },
  '/diseases/[slug]/[country]/[city]/[district]': {
    en: '/diseases/[slug]/[country]/[city]/[district]',
    tr: '/hastaliklar/[slug]/[country]/[city]/[district]',
    ar: '/diseases/[slug]/[country]/[city]/[district]',
    he: '/diseases/[slug]/[country]/[city]/[district]'
  },
  '/branches/[slug]': {
    en: '/branches/[slug]',
    tr: '/uzmanlik-alanlari/[slug]',
    ar: '/branches/[slug]', // Arapça'da İngilizce URL
    he: '/branches/[slug]'  // İbranice'de İngilizce URL
  },
  '/treatments-services/[slug]': {
    en: '/treatments-services/[slug]',
    tr: '/tedaviler-hizmetler/[slug]',
    ar: '/treatments-services/[slug]', // Arapça'da İngilizce URL
    he: '/treatments-services/[slug]'  // İbranice'de İngilizce URL
  },
  '/hospital/[...slug]': {
    en: '/hospital/[...slug]',
    tr: '/hastane/[...slug]',
    ar: '/hospital/[...slug]', // Arapça'da İngilizce URL
    he: '/hospital/[...slug]'  // İbranice'de İngilizce URL
  },
  // Doktor için dinamik route
  '/[...slug]': {
    en: '/[...slug]',
    tr: '/[...slug]',
    ar: '/[...slug]',
    he: '/[...slug]'
  },
};

export const routing = defineRouting({
  locales: ['en', 'tr', 'ar', 'he'],
  defaultLocale: 'en',
  // Dil bazlı URL yönlendirmesi - Sadece EN ve TR arasında URL çevirisi
  pathnames: URL_TRANSLATIONS
});