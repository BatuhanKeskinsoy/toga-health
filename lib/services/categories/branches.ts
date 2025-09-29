import api from "@/lib/axios";
import {
  ProvidersResponse,
  ProvidersParams,
  Provider,
} from "@/lib/types/providers/providersTypes";

// Hastalıkları listele
export async function getBranches(): Promise<Provider[]> {
  try {
    const response = await api.get("/public/specialties?per_page=99999");
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching branches:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const getBranchProviders = async (
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

    // URL oluştur - country null ise sadece slug ile
    let url = `/public/specialties/${params.providers_slug}`;
    if (params.country) {
      url += `/${params.country}`;
      if (params.city) {
        url += `/${params.city}`;
        if (params.district) {
          url += `/${params.district}`;
        }
      }
    }
    url += `?${queryParams.toString()}`;

    const response = await api.get(url);
    return response.data;

  } catch (error) {
    console.error("Get branch providers API error:", error);
    throw error;
  }
};