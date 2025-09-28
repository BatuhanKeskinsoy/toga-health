import api from "@/lib/axios";
import {
  ProvidersResponse,
  ProvidersParams,
  Provider,
} from "@/lib/types/providers/providersTypes";


// Hastalıkları listele
export async function getTreatments(): Promise<Provider[]> {
  try {
    const response = await api.get("/public/treatments?per_page=99999");
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching treatments:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const getTreatmentProviders = async (
  params: ProvidersParams
): Promise<ProvidersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Query parametrelerini ekle
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.provider_type) queryParams.append('provider_type', params.provider_type);
    if (params.q) queryParams.append('q', params.q);

    const response = await api.get(`/public/treatments/${params.providers_slug}/${params.country}${params.city ? `/${params.city}` : ''}${params.district ? `/${params.district}` : ''}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Get treatment providers API error:", error);
    throw error;
  }
};