import { getBranches, getDiseases, getTreatments } from "@/lib/services/categories";
import { getCountries } from "@/lib/services/locations";
import { Country } from "@/lib/types/locations/locationsTypes";

export interface DiseasesLayoutData {
  diseases: Array<{ id: number; name: string; slug: string }>;
  countries: Country[];
  providersTitle: string;
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
  locale: string;
  slug: string;
}

export interface TreatmentsLayoutData {
  treatments: Array<{ id: number; name: string; slug: string }>;
  countries: Country[];
  providersTitle: string;
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
  locale: string;
  slug: string;
}

export interface BranchesLayoutData {
  branches: Array<{ id: number; name: string; slug: string }>;
  countries: Country[];
  providersTitle: string;
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
  locale: string;
  slug: string;
}

// Cache için global değişken
let cachedData: { [key: string]: DiseasesLayoutData | TreatmentsLayoutData | BranchesLayoutData } = {};

// Cache temizleme fonksiyonu
export function clearProvidersLayoutCache(): void {
  cachedData = {};
}

// Server-side cookie okuma fonksiyonu
async function getServerProviderFilters(): Promise<{
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
} | null> {
  try {
    if (typeof window !== 'undefined') {
      return null;
    }
    
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    const sortByCookie = cookieStore.get('provider_sort_by')?.value;
    const sortOrderCookie = cookieStore.get('provider_sort_order')?.value;
    const providerTypeCookie = cookieStore.get('provider_type')?.value;
    
    return {
      sortBy: (sortByCookie as 'rating' | 'name' | 'created_at') || 'created_at',
      sortOrder: (sortOrderCookie as 'asc' | 'desc') || 'desc',
      providerType: providerTypeCookie as 'corporate' | 'doctor' | null || null
    };
  } catch (error) {
    console.error('Server provider filters alma hatası:', error);
    return null;
  }
}

export async function getDiseasesLayoutData(
  locale: string, 
  slug: string
): Promise<DiseasesLayoutData> {
  const cacheKey = `${locale}-${slug}`;

  // Ortak verileri çek
  const [diseases, countriesData, cookieFilters] = await Promise.all([
    getDiseases(),
    getCountries(),
    getServerProviderFilters(),
  ]);

  const countries: Country[] = countriesData || [];
  
  // Hastalık bilgisini al
  const diseaseObj = diseases.find((d) => d.slug === slug);
  const providersTitle = diseaseObj ? diseaseObj.name : slug;
  
  // Cookie filtrelerini al
  const sortBy = cookieFilters?.sortBy || 'created_at';
  const sortOrder = cookieFilters?.sortOrder || 'desc';
  const providerType = cookieFilters?.providerType || null;

  const result = {
    diseases,
    countries,
    providersTitle,
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

export async function getBranchesLayoutData(
  locale: string, 
  slug: string
): Promise<BranchesLayoutData> {
  const cacheKey = `${locale}-${slug}`;

  // Ortak verileri çek
  const [branches, countriesData, cookieFilters] = await Promise.all([
    getBranches(),
    getCountries(),
    getServerProviderFilters(),
  ]);

  const countries: Country[] = countriesData || [];
  
  // Hastalık bilgisini al
  const branchesObj = branches.find((d) => d.slug === slug);
  const providersTitle = branchesObj ? branchesObj.name : slug;
  
  // Cookie filtrelerini al
  const sortBy = cookieFilters?.sortBy || 'created_at';
  const sortOrder = cookieFilters?.sortOrder || 'desc';
  const providerType = cookieFilters?.providerType || null;

  const result = {
    branches,
    countries,
    providersTitle,
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

export async function getTreatmentsLayoutData(
  locale: string, 
  slug: string
): Promise<TreatmentsLayoutData> {
  const cacheKey = `${locale}-${slug}`;

  // Ortak verileri çek
  const [treatments, countriesData, cookieFilters] = await Promise.all([
    getTreatments(),
    getCountries(),
    getServerProviderFilters(),
  ]);

  const countries: Country[] = countriesData || [];
  
  // Tedaviler ve Hizmetler bilgisini al
  const treatmentObj = treatments.find((d) => d.slug === slug);
  const providersTitle = treatmentObj ? treatmentObj.name : slug;
  
  // Cookie filtrelerini al
  const sortBy = cookieFilters?.sortBy || 'created_at';
  const sortOrder = cookieFilters?.sortOrder || 'desc';
  const providerType = cookieFilters?.providerType || null;

  const result = {
    treatments,
    countries,
    providersTitle,
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