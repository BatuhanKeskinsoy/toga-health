import api from "@/lib/axios";
import { CorporateDetailResponse } from "@/lib/types/providers/providersTypes";

// Hastane detayını getir
export async function getCorporateDetail(
  slug: string
): Promise<CorporateDetailResponse> {
  try {
    const response = await api.get(`/corporates/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get corporate detail API error:", error);
    throw error;
  }
}