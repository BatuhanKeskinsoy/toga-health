// Search API Response Types
export interface SearchFilters {
  countryId: string;
  cityId: string;
  districtId: string;
  specialtyId: string | null;
  minRating: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface SearchPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface SearchCounts {
  specialists: number;
  hospitals: number;
  diseases: number;
  treatments: number;
  popularBranches?: number;
}

export interface SearchResults {
  specialists: Specialist[];
  hospitals: Hospital[];
  hastaliklar: Disease[];
  tedaviHizmetler: Treatment[];
  popularBranches?: PopularBranch[];
}

export interface SearchResponse {
  status: boolean;
  message: string;
  timestamp: string;
  data: {
    query: string;
    filters: SearchFilters;
    results: SearchResults;
    totalCount: number;
    counts: SearchCounts;
    pagination: SearchPagination;
  } | null;
}

// Specialist Types
export interface Specialist {
  id: number;
  name: string;
  type: "specialist";
  branch: string;
  branchSlug: string;
  photo: string;
  rating: string;
  experience: string;
  description: string;
  city: string;
  city_slug: string;
  country: string;
  country_slug: string;
  countryId: string;
  cityId: string;
  districtId: string;
  district: string;
  district_slug: string;
  fullAddress: string;
  slug: string;
  hastaliklar: string[];
  tedaviHizmetler: string[];
}

// Hospital Types
export interface Hospital {
  id: number;
  name: string;
  type: "hospital";
  category: string;
  photo: string;
  rating: string;
  experience: string;
  description: string;
  address: string;
  city: string;
  country: string;
  countryId: string;
  cityId: string;
  districtId: string;
  district: string;
  fullAddress: string;
  phone: string;
  slug: string;
  country_slug: string;
  city_slug: string;
}

// Disease Types
export interface Disease {
  id: number;
  name: string;
  type: "hastalik";
  category: string;
  description: string;
  icd_code: string;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
  slug: string;
  photo: string;
  rating: number;
  experience: string;
}

// Treatment Types
export interface Treatment {
  id: number;
  name: string;
  type: "tedavi";
  category: string;
  description: string;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
  slug: string;
  photo: string;
  rating: number;
  experience: string;
  price_range: string;
}

// Popular Branch Types
export interface PopularBranch {
  name: string;
  slug: string;
  description: string;
}

// Search Hook Types
export interface SearchParams {
  q?: string;
  countryId?: string;
  cityId?: string;
  districtId?: string;
  specialtyId?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  per_page?: number;
}

export interface UseSearchReturn {
  searchResults: SearchResponse | null;
  isLoading: boolean;
  error: string | null;
  search: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
}
