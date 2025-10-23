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
  // Profile alt sayfaları - profil için yeni linkler eklenecek
  '/profile/appointments': {
    en: '/profile/appointments',
    tr: '/profil/randevularim',
    ar: '/profile/appointments',
    he: '/profile/appointments'
  },
  '/profile/messages': {
    en: '/profile/messages',
    tr: '/profil/mesajlarim',
    ar: '/profile/messages',
    he: '/profile/messages'
  },
  '/profile/messages/[id]': {
    en: '/profile/messages/[id]',
    tr: '/profil/mesajlarim/[id]',
    ar: '/profile/messages/[id]', // Arapça'da İngilizce URL
    he: '/profile/messages/[id]'  // İbranice'de İngilizce URL
  },
  '/profile/comments': {
    en: '/profile/comments',
    tr: '/profil/yorumlarim',
    ar: '/profile/comments',
    he: '/profile/comments'
  },
  '/profile/details': {
    en: '/profile/details',
    tr: '/profil/detaylar',
    ar: '/profile/details',
    he: '/profile/details'
    },
    '/profile/addresses': {
      en: '/profile/addresses',
      tr: '/profil/adreslerim',
      ar: '/profile/addresses',
      he: '/profile/addresses'
    },
    '/profile/gallery': {
      en: '/profile/gallery',
      tr: '/profil/galeri',
      ar: '/profile/gallery',
      he: '/profile/gallery'
    },
    '/profile/doctors': {
      en: '/profile/doctors',
      tr: '/profil/doktorlar',
      ar: '/profile/doctors',
      he: '/profile/doctors'
    },
  // Yeni profile sayfaları buraya eklenecek - profil için yeni linkler eklenecek
  // Örnek:
  // '/profile/settings': {
  //   en: '/profile/settings',
  //   tr: '/profil/ayarlar',
  //   ar: '/profile/settings',
  //   he: '/profile/settings'
  // },
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
  '/branches/[slug]/[country]': {
    en: '/branches/[slug]/[country]',
    tr: '/uzmanlik-alanlari/[slug]/[country]',
    ar: '/branches/[slug]/[country]',
    he: '/branches/[slug]/[country]'
  },
  '/branches/[slug]/[country]/[city]': {
    en: '/branches/[slug]/[country]/[city]',
    tr: '/uzmanlik-alanlari/[slug]/[country]/[city]',
    ar: '/branches/[slug]/[country]/[city]',
    he: '/branches/[slug]/[country]/[city]'
  },
  '/branches/[slug]/[country]/[city]/[district]': {
    en: '/branches/[slug]/[country]/[city]/[district]',
    tr: '/uzmanlik-alanlari/[slug]/[country]/[city]/[district]',
    ar: '/branches/[slug]/[country]/[city]/[district]',
    he: '/branches/[slug]/[country]/[city]/[district]'
  },
  '/treatments-services/[slug]': {
    en: '/treatments-services/[slug]',
    tr: '/tedaviler-hizmetler/[slug]',
    ar: '/treatments-services/[slug]', // Arapça'da İngilizce URL
    he: '/treatments-services/[slug]'  // İbranice'de İngilizce URL
  },
  '/treatments-services/[slug]/[country]': {
    en: '/treatments-services/[slug]/[country]',
    tr: '/tedaviler-hizmetler/[slug]/[country]',
    ar: '/treatments-services/[slug]/[country]',
    he: '/treatments-services/[slug]/[country]'
  },
  '/treatments-services/[slug]/[country]/[city]': {
    en: '/treatments-services/[slug]/[country]/[city]',
    tr: '/tedaviler-hizmetler/[slug]/[country]/[city]',
    ar: '/treatments-services/[slug]/[country]/[city]',
    he: '/treatments-services/[slug]/[country]/[city]'
  },
  '/treatments-services/[slug]/[country]/[city]/[district]': {
    en: '/treatments-services/[slug]/[country]/[city]/[district]',
    tr: '/tedaviler-hizmetler/[slug]/[country]/[city]/[district]',
    ar: '/treatments-services/[slug]/[country]/[city]/[district]',
    he: '/treatments-services/[slug]/[country]/[city]/[district]'
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