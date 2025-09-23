import api from "@/lib/axios";
import {
  DoctorsListResponse,
  DoctorDetailResponse,
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
): Promise<DoctorDetailResponse> => {
  try {
    const response = await api.get(`${API_URL}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get doctor detail API error:", error);
    throw error;
  }
};

