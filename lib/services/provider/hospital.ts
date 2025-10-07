import api from "@/lib/axios";
import { CorporateDetailResponse } from "@/lib/types/providers/providersTypes";

const API_URL = "/corporates";

// Hastane detayını getir
export async function getCorporateDetail(
  slug: string
): Promise<CorporateDetailResponse> {
  try {
    const response = await api.get(`${API_URL}/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Get corporate detail API error:', error);
    throw error;
  }
}
