import { URL_TRANSLATIONS } from '@/i18n/routing';

// Dil bazlı URL oluşturma fonksiyonu
export const getLocalizedUrl = (path: string, locale: string, slug?: string) => {
  const baseUrl = URL_TRANSLATIONS[path]?.[locale] || path;
  
  if (slug && baseUrl.includes('[slug]')) {
    // [slug] placeholder'ını gerçek slug ile değiştir
    const result = baseUrl.replace('[slug]', slug);
    return result;
  }
  
  return baseUrl;
};

// URL'den slug çıkarma fonksiyonu
export const extractSlugFromUrl = (url: string): string | null => {
  const segments = url.split('/');
  return segments[segments.length - 1] || null;
};

// Mevcut URL'yi dil bazlı URL'ye çevirme fonksiyonu (server-side)
export const convertUrlToLocalized = (currentUrl: string, targetLocale: string): string => {
  // Tüm locale prefix'lerini kaldır (örn: /tr/ar/diseases/slug -> /diseases/slug)
  let cleanUrl = currentUrl;
  const urlParts = currentUrl.split('/');
  const locales = ['en', 'tr', 'ar', 'he'];
  
  // Tüm locale prefix'lerini kaldır
  while (urlParts.length > 1 && locales.includes(urlParts[1])) {
    urlParts.splice(1, 1);
  }
  
  cleanUrl = urlParts.join('/');
  
  // URL'den slug'ı çıkar
  const slug = extractSlugFromUrl(cleanUrl);
  
  // URL pattern'ini belirle - Sadece EN ve TR arasında URL çevirisi
  let pathPattern = '';
  
  // Tüm dinamik route'ları kontrol et
  const routePatterns = [
    { pattern: '/diseases/', template: '/diseases/[slug]' },
    { pattern: '/hastaliklar/', template: '/diseases/[slug]' },
    { pattern: '/specialties/', template: '/specialties/[slug]' },
    { pattern: '/uzmanlik-alanlari/', template: '/specialties/[slug]' },
    { pattern: '/treatments-services/', template: '/treatments-services/[slug]' },
    { pattern: '/tedaviler-hizmetler/', template: '/treatments-services/[slug]' },
    { pattern: '/hospital/', template: '/hospital/[slug]' },
    { pattern: '/hastane/', template: '/hospital/[slug]' }
  ];
  
  for (const route of routePatterns) {
    if (cleanUrl.includes(route.pattern)) {
      pathPattern = route.template;
      break;
    }
  }
  
  if (pathPattern && slug) {
    const localizedUrl = getLocalizedUrl(pathPattern, targetLocale, slug);
    return localizedUrl;
  }
  
  // Eğer dinamik route değilse, statik route'ları kontrol et
  const staticRoutes = [
    '/contact', '/aboutus',  '/profile',
    '/iletisim', '/hakkimizda', '/profil'
  ];
  for (const route of staticRoutes) {
    if (cleanUrl.includes(route)) {
      // Statik route için template'i belirle
      let template = '';
      if (route.includes('contact') || route.includes('iletisim')) {
        template = '/contact';
      } else if (route.includes('aboutus') || route.includes('hakkimizda')) {
        template = '/aboutus';
      } else if (route.includes('profile') || route.includes('profil')) {
        template = '/profile';
      }
      
      if (template) {
        const localizedUrl = getLocalizedUrl(template, targetLocale);
        return localizedUrl;
      }
    }
  }
  
  // Eğer hiçbir pattern eşleşmezse, orijinal URL'yi döndür
  return currentUrl;
}; 