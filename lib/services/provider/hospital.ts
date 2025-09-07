import api from "@/lib/axios";
import { HospitalTypes } from "@/lib/types/provider/hospital";

export async function getHospital(slug: string): Promise<HospitalTypes | null> {
  try {
    const response = await api.get(`'/hospitals/${slug}'`);

    if (response.data.success) {
      return response.data.user;
    } else {
      return response.data.error || "Hastane verisi yüklenirken hata oluştu";
    }
  } catch (error: any) {
    return (
      error.response?.data?.error || "Hastane verisi yüklenirken hata oluştu"
    );
  }
}
