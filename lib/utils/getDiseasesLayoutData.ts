import { getDiseases } from "@/lib/services/categories";
import { getCountries } from "@/lib/services/locations";
import { getServerProviderFilters } from "@/lib/utils/cookies";
import { Country } from "@/lib/types/locations/locationsTypes";

export interface DiseasesLayoutData {
  diseases: Array<{ id: number; name: string; slug: string }>;
  countries: Country[];
  diseaseTitle: string;
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
  locale: string;
  slug: string;
}

// Cache için global değişken
let cachedData: { [key: string]: DiseasesLayoutData } = {};

export async function getDiseasesLayoutData(
  locale: string, 
  slug: string
): Promise<DiseasesLayoutData> {
  const cacheKey = `${locale}-${slug}`;
  
  // Cache'den kontrol et
  if (cachedData[cacheKey]) {
    return cachedData[cacheKey];
  }

  // Ortak verileri çek
  const [diseases, countriesData, cookieFilters] = await Promise.all([
    getDiseases(),
    getCountries(),
    getServerProviderFilters(),
  ]);

  const countries: Country[] = countriesData || [];
  
  // Hastalık bilgisini al
  const diseaseObj = diseases.find((d) => d.slug === slug);
  const diseaseTitle = diseaseObj ? diseaseObj.name : slug;
  
  // Cookie filtrelerini al
  const sortBy = cookieFilters?.sortBy || 'created_at';
  const sortOrder = cookieFilters?.sortOrder || 'desc';
  const providerType = cookieFilters?.providerType || null;

  const result = {
    diseases,
    countries,
    diseaseTitle,
    sortBy,
    sortOrder,
    providerType,
    locale,
    slug,
  };

  // Cache'e kaydet
  cachedData[cacheKey] = result;
  
  return result;
}
