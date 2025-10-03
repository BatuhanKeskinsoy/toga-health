import api from "@/lib/axios";
import {
  ProvidersResponse,
  ProvidersParams,
  Provider,
} from "@/lib/types/providers/providersTypes";

// Service interface
export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  duration_minutes: number;
}


// Servisleri listele
export async function getServices(): Promise<Service[]> {
  try {
        const response = await api.get("/public/our-services?per_page=99999");
        if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching services:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const getServiceProviders = async (
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
    let url = `/public/our-services/${params.providers_slug}`;
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
    console.error("Get service providers API error:", error);
    throw error;
  }
};