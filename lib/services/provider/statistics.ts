import api from "@/lib/axios";
import type {
  GetCorporateStatisticsParams,
  GetCorporateStatisticsResponse,
  GetDoctorStatisticsParams,
  GetDoctorStatisticsResponse,
} from "@/lib/types/provider/statisticsTypes";

export const getDoctorStatistics = async (
  params: GetDoctorStatisticsParams = {}
): Promise<GetDoctorStatisticsResponse> => {
  const response = await api.get(`/statistics/doctor`, { params });
  return response.data as GetDoctorStatisticsResponse;
};

export const getCorporateStatistics = async (
  params: GetCorporateStatisticsParams = {}
): Promise<GetCorporateStatisticsResponse> => {
  const response = await api.get(`/statistics/corporate`, { params });
  return response.data as GetCorporateStatisticsResponse;
};