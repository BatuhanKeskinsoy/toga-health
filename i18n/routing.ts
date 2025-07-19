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
  // Dinamik route'lar - Sadece EN ve TR arasında URL çevirisi
  '/diseases/[slug]': {
    en: '/diseases/[slug]',
    tr: '/hastaliklar/[slug]',
    ar: '/diseases/[slug]', // Arapça'da İngilizce URL
    he: '/diseases/[slug]'  // İbranice'de İngilizce URL
  },
  '/specialties/[slug]': {
    en: '/specialties/[slug]',
    tr: '/uzmanlik-alanlari/[slug]',
    ar: '/specialties/[slug]', // Arapça'da İngilizce URL
    he: '/specialties/[slug]'  // İbranice'de İngilizce URL
  },
  '/treatments-services/[slug]': {
    en: '/treatments-services/[slug]',
    tr: '/tedaviler-hizmetler/[slug]',
    ar: '/treatments-services/[slug]', // Arapça'da İngilizce URL
    he: '/treatments-services/[slug]'  // İbranice'de İngilizce URL
  },
  '/hospital/[slug]': {
    en: '/hospital/[slug]',
    tr: '/hastane/[slug]',
    ar: '/hospital/[slug]', // Arapça'da İngilizce URL
    he: '/hospital/[slug]'  // İbranice'de İngilizce URL
  }
};

export const routing = defineRouting({
  locales: ['en', 'tr', 'ar', 'he'],
  defaultLocale: 'en',
  // Dil bazlı URL yönlendirmesi - Sadece EN ve TR arasında URL çevirisi
  pathnames: URL_TRANSLATIONS
});