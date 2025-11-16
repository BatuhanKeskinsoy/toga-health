import api from "@/lib/axios";
import { CorporateDetailResponse } from "@/lib/types/providers/providersTypes";
import { CorporatesListResponse } from "@/lib/types/provider/corporatesListTypes";

// Tüm hastaneleri/kurumları listele - per_page ile çekilecek kayıt sayısı belirlenir
export async function getCorporates(per_page?: number): Promise<CorporatesListResponse> {
  try {
    const params: Record<string, string | number> = {};
    if (per_page && Number.isFinite(per_page)) {
      params.per_page = per_page;
      params.page = 1;
    }

    const response = await api.get("/corporates", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get corporates API error:", error);
    throw error;
  }
}
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