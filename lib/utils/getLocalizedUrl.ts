import { URL_TRANSLATIONS } from '@/i18n/routing';

// Dil bazlı URL oluşturma fonksiyonu
export const getLocalizedUrl = (path: string, locale: string, params?: Record<string, string>) => {
  const baseUrl = URL_TRANSLATIONS[path]?.[locale] || path;
  let result = baseUrl;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // [...slug] pattern'ini özel olarak işle
      if (key === 'slug' && path.includes('[...slug]')) {
        result = result.replace('[...slug]', value);
      } else {
        result = result.replace(`[${key}]`, value);
      }
    });
  }
  return result;
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
  
  // Root path kontrolü - eğer temizlenmiş URL sadece "/" ise veya boşsa
  // Veya eğer orijinal URL sadece bir locale prefix ise (örn: /en, /tr)
  if (cleanUrl === '/' || cleanUrl === '' || 
      (urlParts.length === 2 && locales.includes(urlParts[1]))) {
    // Root path için sadece / döndür, next-intl locale prefix'i ekleyecek
    return '/';
  }
  
  // EN <-> TR dinamik route çevirileri
  // /diseases/[slug]/[country]/[city]/[district] gibi path'ler için
  const diseaseMatch = cleanUrl.match(/\/(diseases|hastaliklar)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/);
  if (diseaseMatch) {
    const [, , slug, country, city, district] = diseaseMatch;
    let base = targetLocale === 'tr' ? '/hastaliklar' : '/diseases';
    let url = `${base}/${slug}`;
    if (country) url += `/${country}`;
    if (city) url += `/${city}`;
    if (district) url += `/${district}`;
    return url;
  }

  // URL'den slug'ı çıkar
  const slug = extractSlugFromUrl(cleanUrl);
  
  // URL pattern'ini belirle - Sadece EN ve TR arasında URL çevirisi
  let pathPattern = '';
  
  // Tüm dinamik route'ları kontrol et
  const routePatterns = [
    { pattern: '/diseases/', template: '/diseases/[slug]' },
    { pattern: '/hastaliklar/', template: '/diseases/[slug]' },
    { pattern: '/branches/', template: '/branches/[slug]' },
    { pattern: '/uzmanlik-alanlari/', template: '/branches/[slug]' },
    { pattern: '/treatments-services/', template: '/treatments-services/[slug]' },
    { pattern: '/tedaviler-hizmetler/', template: '/treatments-services/[slug]' },
    { pattern: '/hospital/', template: '/hospital/[...slug]' },
    { pattern: '/hastane/', template: '/hospital/[...slug]' }
  ];
  
  // Doktor route'larını kontrol et (tam 4 segment olmalı: specialist/branch/country/city)
  const doctorRouteMatch = cleanUrl.match(/^\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);
  if (doctorRouteMatch) {
    const [, specialist_slug, branch_slug, country, city] = doctorRouteMatch;
    
    // Tam 4 parametre olmalı: specialist_slug/branch_slug/country/city
    if (specialist_slug && branch_slug && country && city) {
      const slugPath = [specialist_slug, branch_slug, country, city];
      
      const localizedUrl = getLocalizedUrl(
        "/[...slug]",
        targetLocale,
        { slug: slugPath.join('/') }
      );
      return localizedUrl;
    }
  }

  // Hastane route'larını kontrol et (tam 3 segment olmalı: hospital_slug/country/city)
  const hospitalRouteMatch = cleanUrl.match(/^\/(hastane|hospital)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);
  if (hospitalRouteMatch) {
    const [, , hospital_slug, country, city] = hospitalRouteMatch;
    
    // Tam 3 parametre olmalı: hospital_slug/country/city
    if (hospital_slug && country && city) {
      const slugPath = [hospital_slug, country, city];
      
      const localizedUrl = getLocalizedUrl(
        "/hospital/[...slug]",
        targetLocale,
        { slug: slugPath.join('/') }
      );
      return localizedUrl;
    }
  }
  
  for (const route of routePatterns) {
    if (cleanUrl.includes(route.pattern)) {
      pathPattern = route.template;
      break;
    }
  }
  
  if (pathPattern && slug) {
    const localizedUrl = getLocalizedUrl(pathPattern, targetLocale, { slug });
    return localizedUrl;
  }
  
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
  
  return cleanUrl;
}; 