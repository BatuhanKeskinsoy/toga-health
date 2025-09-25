import api from "@/lib/axios";
import {
  DoctorsListResponse,
  DoctorDetailResponseWrapper,
  DoctorsListParams,
  DoctorUser,
  SpecialistTypes,
} from "@/lib/types/provider/doctorTypes";

const API_URL = "/doctors";

export const getDoctors = async (
  params?: DoctorsListParams
): Promise<DoctorsListResponse> => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Get doctors API error:", error);
    throw error;
  }
};

export const getDoctorDetail = async (
  slug: string
): Promise<DoctorDetailResponseWrapper> => {
  try {
    // Tüm yorumları çekmek için büyük bir per_page değeri gönder
    const response = await api.get(`${API_URL}/${slug}?comments_per_page=1000`);
    return response.data;
  } catch (error) {
    console.error("Get doctor detail API error:", error);
    throw error;
  }
};

