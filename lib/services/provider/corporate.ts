import api, { axios } from "@/lib/axios";
import { CorporateDetailResponse } from "@/lib/types/providers/providersTypes";
import { CorporatesListResponse } from "@/lib/types/provider/corporatesListTypes";
import { baseURL } from "@/constants";

// Tüm hastaneleri/kurumları listele - per_page ile çekilecek kayıt sayısı belirlenir
export const getCorporates = async (
  limit: number,
  page: number = 1
): Promise<CorporatesListResponse> => {
  try {
    const params: Record<string, string | number> = { limit, page };

    const response = await axios.get(`${baseURL}/corporates`, {
      params,
    });
    return response.data as CorporatesListResponse;
  } catch (error) {
    console.error("Get corporates API error:", error);
    throw error;
  }
};
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