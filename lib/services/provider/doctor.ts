import api from "@/lib/axios";
import { DoctorDetailResponse } from "@/lib/types/providers/providersTypes";
import { DoctorsListResponse } from "@/lib/types/provider/doctorsListTypes";
import axios from "axios";
import { baseURL } from "@/constants";

// Tüm doktorları listele - backend limit ve page parametrelerini kullanır
export const getDoctors = async (
  limit: number,
  page: number = 1
): Promise<DoctorsListResponse> => {
  try {
    const params: Record<string, string | number> = { limit, page };

    const response = await axios.get(`${baseURL}/doctors`, {
      params,
    });
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