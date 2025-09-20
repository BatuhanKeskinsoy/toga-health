import api from "@/lib/axios";
import {
  DiseaseProvidersResponse,
  DiseaseProvidersParams,
  Disease,
} from "@/lib/types/categories/diseasesTypes";

const API_URL = "/public/diseases";

// Hastalıkları listele
export async function getDiseases(): Promise<Disease[]> {
  try {
    const response = await api.get(`${API_URL}?per_page=9999`);
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching diseases:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const getDiseaseProviders = async (
  params: DiseaseProvidersParams
): Promise<DiseaseProvidersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Sadece page ve per_page parametrelerini query string'e ekle
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await api.get(`${API_URL}/${params.disease_slug}/${params.country}${params.city ? `/${params.city}` : ''}${params.district ? `/${params.district}` : ''}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Get disease providers API error:", error);
    throw error;
  }
};