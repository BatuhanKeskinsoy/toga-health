import api from "@/lib/axios";
import { DoctorDetailResponse } from "@/lib/types/providers/providersTypes";
import { DoctorsListResponse } from "@/lib/types/provider/doctorsListTypes";
import axios from "axios";

// Tüm doktorları listele - backend limit parametresini kullanır
export const getDoctors = async (
  limit: number,
): Promise<DoctorsListResponse> => {
  try {
    const params: Record<string, string | number> = { limit };
    const response = await axios.get("https://samsunev.com/api/v1/doctors", { params });
    return response.data as DoctorsListResponse;
  } catch (error) {
    console.error("Get doctors API error:", error);
    throw error;
  }
};

export const getDoctorDetail = async (
  slug: string
): Promise<DoctorDetailResponse> => {
  try {
    const response = await api.get(`/doctors/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get doctor detail API error:", error);
    throw error;
  }
};