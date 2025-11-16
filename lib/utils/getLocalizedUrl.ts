import { URL_TRANSLATIONS } from "@/i18n/routing";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getTreatmentProviders } from "@/lib/services/categories/treatments";
import { getBranchProviders } from "@/lib/services/categories/branches";
import { getDoctorDetail } from "@/lib/services/provider/doctor";
import { getContracts } from "@/lib/services/contracts";

// Sabit değerler
const LOCALES = ["en", "tr", "ar", "he"];

// Profile alt sayfa çevirileri
const PROFILE_SUB_ROUTE_TRANSLATIONS: Record<string, string> = {
  appointments: "randevular",
  messages: "mesajlar", 
  details: "detaylar",
  comments: "yorumlar",
  addresses: "adresler",
  gallery: "galeri",
  doctors: "doktorlar",
  services: "servisler",
  payments: "odemeler"
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
  { pattern: "/contracts/", template: "/contracts/[slug]" },
  { pattern: "/sozlesmeler/", template: "/contracts/[slug]" },
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

// Contract slug'ını hedef dildeki slug'a çevir
// contract_id üzerinden aynı contract'ın farklı dildeki versiyonunu bulur
async function getContractSlugByLocale(
  currentSlug: string,
  targetLocale: string
): Promise<string> {
  try {
    const contractsResponse = await getContracts();
    if (!contractsResponse?.status || !contractsResponse?.data) {
      return currentSlug;
    }

    // Mevcut slug ile contract'ı bul
    // 1) Doğrudan contract.slug eşleşmesi
    // 2) Veya API'den gelen slugs objesi içindeki herhangi bir dildeki slug eşleşmesi
    const currentContract = contractsResponse.data.find(
      (contract) =>
        contract.slug === currentSlug ||
        (contract.slugs &&
          Object.values(contract.slugs).includes(currentSlug))
    );

    if (!currentContract) {
      return currentSlug;
    }

    // 1) API'den gelen slugs objesini kullanarak hedef dildeki slug'ı bul
    if (currentContract.slugs && currentContract.slugs[targetLocale]) {
      return currentContract.slugs[targetLocale];
    }

    // 2) Eski mantık: Aynı contract_id'ye sahip ama target locale'deki ayrı contract kaydını bul
    const targetContract = contractsResponse.data.find(
      (contract: any) =>
        contract.contract_id === currentContract.contract_id &&
        contract.lang_code === targetLocale &&
        contract.is_published &&
        contract.status === "active"
    );

    if (targetContract && targetContract.slug) {
      return targetContract.slug;
    }

    // Hiçbiri bulunamazsa mevcut slug ile devam et
    return currentSlug;
  } catch (error) {
    console.error("Contract slug çevirme hatası:", error);
    return currentSlug;
  }
}

// Kategori slug'ını hedef dildeki slug'a çevir
// API'den gelen translations array'ini kullanarak doğru slug'ı bulur
async function getCategorySlugByLocale(
  currentSlug: string,
  categoryType: "diseases" | "treatments-services" | "branches",
  targetLocale: string
): Promise<string> {
  try {
    // API'den kategori providers bilgisini çekerek translations bilgisini al
    let providersResponse;
    
    try {
      if (categoryType === "diseases") {
        providersResponse = await getDiseaseProviders({
          providers_slug: currentSlug,
          country: "",
          page: 1,
          per_page: 1,
        });
      } else if (categoryType === "treatments-services") {
        providersResponse = await getTreatmentProviders({
          providers_slug: currentSlug,
          country: "",
          page: 1,
          per_page: 1,
        });
      } else if (categoryType === "branches") {
        providersResponse = await getBranchProviders({
          providers_slug: currentSlug,
          country: "",
          page: 1,
          per_page: 1,
        });
      }

      // Information içindeki translations bilgisini kontrol et
      if (providersResponse?.data?.information?.translations) {
        const translations = providersResponse.data.information.translations;
        
        // Hedef dildeki translation'ı bul
        const targetTranslation = translations.find((t: any) => t.lang === targetLocale);
        
        if (targetTranslation && targetTranslation.slug) {
          return targetTranslation.slug;
        }
      }
    } catch (apiError) {
      // API çağrısı başarısız olursa sessizce devam et
      console.warn("Category providers API çağrısı başarısız:", apiError);
    }
    
    // Hiçbir çeviri bulunamazsa, mevcut slug'ı döndür
    return currentSlug;
  } catch (error) {
    console.error("Category slug çevirme hatası:", error);
    return currentSlug;
  }
}

// Mevcut URL'yi dil bazlı URL'ye çevirme fonksiyonu (server-side ve client-side)
export const convertUrlToLocalized = async (
  currentUrl: string,
  targetLocale: string
): Promise<string> => {
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
    // Kategori slug'ını çevir
    const translatedSlug = await getCategorySlugByLocale(slug, "diseases", targetLocale);
    let url = `${base}/${translatedSlug}`;
    if (country) url += `/${country}`;
    if (city) url += `/${city}`;
    if (district) url += `/${district}`;
    return url;
  }

  // /branches/[slug]/[country]/[city]/[district] gibi path'ler için
  const branchesMatch = cleanUrl.match(
    /\/(branches|uzmanlik-alanlari)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/
  );
  if (branchesMatch) {
    const [, , slug, country, city, district] = branchesMatch;
    let base = targetLocale === "tr" ? "/uzmanlik-alanlari" : "/branches";
    // Kategori slug'ını çevir
    const translatedSlug = await getCategorySlugByLocale(slug, "branches", targetLocale);
    let url = `${base}/${translatedSlug}`;
    if (country) url += `/${country}`;
    if (city) url += `/${city}`;
    if (district) url += `/${district}`;
    return url;
  }

  // /treatments-services/[slug]/[country]/[city]/[district] gibi path'ler için
  const treatmentsMatch = cleanUrl.match(
    /\/(treatments-services|tedaviler-hizmetler)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?/
  );
  if (treatmentsMatch) {
    const [, , slug, country, city, district] = treatmentsMatch;
    let base = targetLocale === "tr" ? "/tedaviler-hizmetler" : "/treatments-services";
    // Kategori slug'ını çevir
    const translatedSlug = await getCategorySlugByLocale(slug, "treatments-services", targetLocale);
    let url = `${base}/${translatedSlug}`;
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
      try {
        // Doktor detay API'sini çağırarak specialty translations bilgisini al
        const doctorDetail = await getDoctorDetail(specialist_slug);
        
        let translatedBranchSlug = branch_slug;
        
        // doctor_info.specialty.translations içinden hedef dildeki slug'ı bul
        if (doctorDetail?.data?.doctor_info?.specialty?.translations) {
          const translations = doctorDetail.data.doctor_info.specialty.translations;
          const targetTranslation = translations.find((t: any) => t.lang === targetLocale);
          
          if (targetTranslation && targetTranslation.slug) {
            translatedBranchSlug = targetTranslation.slug;
          }
        }
        
        const slugPath = [specialist_slug, translatedBranchSlug, country, city];

        const localizedUrl = getLocalizedUrl("/[...slug]", targetLocale, {
          slug: slugPath.join("/"),
        });
        return localizedUrl;
      } catch (error) {
        // API çağrısı başarısız olursa, mevcut slug'ları kullan
        console.warn("Doctor detail API çağrısı başarısız, slug çevirisi yapılamadı:", error);
        const slugPath = [specialist_slug, branch_slug, country, city];
        const localizedUrl = getLocalizedUrl("/[...slug]", targetLocale, {
          slug: slugPath.join("/"),
        });
        return localizedUrl;
      }
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

  // Contracts route kontrolü
  // Bu yüzden hem decoded hem encoded halini kontrol ediyoruz.
  const contractsMatch = cleanUrl.match(
    /\/(contracts|sozlesmeler)\/([^\/]+)/
  );
  if (contractsMatch) {
    const [, , contractSlug] = contractsMatch;
    const translatedSlug = await getContractSlugByLocale(contractSlug, targetLocale);
    return getLocalizedUrl("/contracts/[slug]", targetLocale, { slug: translatedSlug });
  }

  // Route pattern kontrolü
  for (const route of ROUTE_PATTERNS) {
    if (cleanUrl.includes(route.pattern) && slug) {
      // Kategori tipini belirle
      let categoryType: "diseases" | "treatments-services" | "branches" | null = null;
      if (route.pattern.includes("diseases") || route.pattern.includes("hastaliklar")) {
        categoryType = "diseases";
      } else if (route.pattern.includes("treatments-services") || route.pattern.includes("tedaviler-hizmetler")) {
        categoryType = "treatments-services";
      } else if (route.pattern.includes("branches") || route.pattern.includes("uzmanlik-alanlari")) {
        categoryType = "branches";
      }
      
      // Eğer kategori tipi belirlendiyse slug'ı çevir
      if (categoryType) {
        const translatedSlug = await getCategorySlugByLocale(slug, categoryType, targetLocale);
        return getLocalizedUrl(route.template, targetLocale, { slug: translatedSlug });
      }
      
      return getLocalizedUrl(route.template, targetLocale, { slug });
    }
  }

  // Profile alt sayfaları için özel kontrol
  const profileSubRoutes = Object.keys(PROFILE_SUB_ROUTE_TRANSLATIONS);
  
  // Profile alt sayfası kontrolü
  for (const subRoute of profileSubRoutes) {
    const enPattern = `/profile/${subRoute}`;
    const trPattern = `/profil/${PROFILE_SUB_ROUTE_TRANSLATIONS[subRoute]}`;
    
    if (cleanUrl === enPattern || cleanUrl === trPattern) {
      return getLocalizedUrl(enPattern, targetLocale);
    }
  }

  // Ana profile sayfası kontrolü
  if (cleanUrl === "/profile" || cleanUrl === "/profil") {
    return getLocalizedUrl("/profile", targetLocale);
  }

  // Diğer statik route'lar
  const staticRoutes = [
    { en: "/contact", tr: "/iletisim" },
    { en: "/aboutus", tr: "/hakkimizda" },
    { en: "/appointment", tr: "/randevu" }
  ];

  for (const route of staticRoutes) {
    if (cleanUrl === route.en || cleanUrl === route.tr) {
      return getLocalizedUrl(route.en, targetLocale);
    }
  }

  return cleanUrl;
};