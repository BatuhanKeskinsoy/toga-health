import { URL_TRANSLATIONS } from "@/i18n/routing";

// Sabit değerler
const LOCALES = ["en", "tr", "ar", "he"];

// Profile alt sayfa çevirileri
const PROFILE_SUB_ROUTE_TRANSLATIONS: Record<string, string> = {
  appointments: "randevularim",
  messages: "mesajlarim", 
  details: "detaylar",
  comments: "yorumlarim",
  addresses: "adreslerim",
  gallery: "galeri",
  doctors: "doktorlar"
};

// Route pattern'leri
const ROUTE_PATTERNS = [
  { pattern: "/diseases/", template: "/diseases/[slug]" },
  { pattern: "/hastaliklar/", template: "/diseases/[slug]" },
  { pattern: "/branches/", template: "/branches/[slug]" },
  { pattern: "/uzmanlik-alanlari/", template: "/branches/[slug]" },
  { pattern: "/treatments-services/", template: "/treatments-services/[slug]" },
  { pattern: "/tedaviler-hizmetler/", template: "/treatments-services/[slug]" },
  { pattern: "/hospital/", template: "/hospital/[...slug]" },
  { pattern: "/hastane/", template: "/hospital/[...slug]" },
];

// Dil bazlı URL oluşturma fonksiyonu
export const getLocalizedUrl = (
  path: string,
  locale: string,
  params?: Record<string, string>
) => {
  const baseUrl = URL_TRANSLATIONS[path]?.[locale] || path;
  
  if (!params) return baseUrl;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    // [...slug] pattern'ini özel olarak işle
    if (key === "slug" && path.includes("[...slug]")) {
      return result.replace("[...slug]", value);
    }
    return result.replace(`[${key}]`, value);
  }, baseUrl);
};

// URL'den slug çıkarma fonksiyonu
export const extractSlugFromUrl = (url: string): string | null => {
  const segments = url.split("/");
  return segments[segments.length - 1] || null;
};

// URL'den locale prefix'lerini temizleme fonksiyonu
const cleanLocalePrefixes = (url: string): string => {
  const urlParts = url.split("/");
  while (urlParts.length > 1 && LOCALES.includes(urlParts[1])) {
    urlParts.splice(1, 1);
  }
  return urlParts.join("/");
};

// Mevcut URL'yi dil bazlı URL'ye çevirme fonksiyonu (server-side)
export const convertUrlToLocalized = (
  currentUrl: string,
  targetLocale: string
): string => {
  const cleanUrl = cleanLocalePrefixes(currentUrl);
  const urlParts = cleanUrl.split("/");

  // Root path kontrolü
  if (cleanUrl === "/" || cleanUrl === "" || (urlParts.length === 2 && LOCALES.includes(urlParts[1]))) {
    return "/";
  }

  // EN <-> TR dinamik route çevirileri
  // /diseases/[slug]/[country]/[city]/[district] gibi path'ler için
  const diseaseMatch = cleanUrl.match(
    /\/(diseases|hastaliklar)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/
  );
  if (diseaseMatch) {
    const [, , slug, country, city, district] = diseaseMatch;
    let base = targetLocale === "tr" ? "/hastaliklar" : "/diseases";
    let url = `${base}/${slug}`;
    if (country) url += `/${country}`;
    if (city) url += `/${city}`;
    if (district) url += `/${district}`;
    return url;
  }

  // URL'den slug'ı çıkar
  const slug = extractSlugFromUrl(cleanUrl);


  // Doktor route'larını kontrol et (tam 4 segment olmalı: specialist/branch/country/city)
  const doctorRouteMatch = cleanUrl.match(
    /^\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/
  );
  if (doctorRouteMatch) {
    const [, specialist_slug, branch_slug, country, city] = doctorRouteMatch;

    // Tam 4 parametre olmalı: specialist_slug/branch_slug/country/city
    if (specialist_slug && branch_slug && country && city) {
      const slugPath = [specialist_slug, branch_slug, country, city];

      const localizedUrl = getLocalizedUrl("/[...slug]", targetLocale, {
        slug: slugPath.join("/"),
      });
      return localizedUrl;
    }
  }

  // Hastane route'larını kontrol et (tam 3 segment olmalı: hospital_slug/country/city)
  const hospitalRouteMatch = cleanUrl.match(
    /^\/(hastane|hospital)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/
  );
  if (hospitalRouteMatch) {
    const [, , hospital_slug, country, city] = hospitalRouteMatch;

    // Tam 3 parametre olmalı: hospital_slug/country/city
    if (hospital_slug && country && city) {
      const slugPath = [hospital_slug, country, city];

      const localizedUrl = getLocalizedUrl(
        "/hospital/[...slug]",
        targetLocale,
        { slug: slugPath.join("/") }
      );
      return localizedUrl;
    }
  }

  // Route pattern kontrolü
  for (const route of ROUTE_PATTERNS) {
    if (cleanUrl.includes(route.pattern) && slug) {
      return getLocalizedUrl(route.template, targetLocale, { slug });
    }
  }

  // Profile alt sayfaları
  const profileSubRoutes = Object.keys(PROFILE_SUB_ROUTE_TRANSLATIONS);

  // Statik route'lar
  const staticRoutes = [
    "/contact", "/aboutus", "/profile",
    "/iletisim", "/hakkimizda", "/profil"
  ];

  // Profile alt sayfalarını dinamik olarak ekle
  profileSubRoutes.forEach((route) => {
    staticRoutes.push(
      `/profile/${route}`,
      `/profil/${PROFILE_SUB_ROUTE_TRANSLATIONS[route]}`
    );
  });
  // Statik route kontrolü
  for (const route of staticRoutes) {
    if (cleanUrl.includes(route)) {
      let template = "";
      
      if (route.includes("contact") || route.includes("iletisim")) {
        template = "/contact";
      } else if (route.includes("aboutus") || route.includes("hakkimizda")) {
        template = "/aboutus";
      } else if (route.includes("profile") || route.includes("profil")) {
        if (route.includes("/profile/") || route.includes("/profil/")) {
          // Profile alt sayfası tespit et
          const profileSubRoute = profileSubRoutes.find(
            (subRoute) =>
              route.includes(`/profile/${subRoute}`) ||
              route.includes(`/profil/${PROFILE_SUB_ROUTE_TRANSLATIONS[subRoute]}`)
          );
          template = profileSubRoute ? `/profile/${profileSubRoute}` : "/profile";
        } else {
          template = "/profile";
        }
      }

      if (template) {
        return getLocalizedUrl(template, targetLocale);
      }
    }
  }

  return cleanUrl;
};