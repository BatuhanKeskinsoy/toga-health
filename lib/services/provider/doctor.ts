import api from "@/lib/axios";
import { DoctorDetailResponse } from "@/lib/types/providers/providersTypes";

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

