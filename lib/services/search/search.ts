import api from "@/lib/axios";
import { SearchResponse, SearchParams } from "@/lib/types/search/searchTypes";

export const search = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    // Query parametrelerini oluştur
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.countryId) queryParams.append('countryId', params.countryId);
    if (params.cityId) queryParams.append('cityId', params.cityId);
    if (params.districtId) queryParams.append('districtId', params.districtId);
    if (params.specialtyId) queryParams.append('specialtyId', params.specialtyId);
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await api.get(`/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

// Popüler branşları getir (location seçili, query yok)
export const getPopularBranches = async (params: {
  countryId: string;
  cityId: string;
  districtId: string;
}): Promise<SearchResponse> => {
  return search({
    countryId: params.countryId,
    cityId: params.cityId,
    districtId: params.districtId
  });
};

// Genel arama (query + location)
export const searchWithQuery = async (params: {
  q: string;
  countryId: string;
  cityId: string;
  districtId: string;
  specialtyId?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  per_page?: number;
}): Promise<SearchResponse> => {
  return search(params);
};
