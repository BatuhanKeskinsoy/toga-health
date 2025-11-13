import api from "@/lib/axios";
import type {
  GetCorporateStatisticsParams,
  GetCorporateStatisticsResponse,
  GetDoctorStatisticsParams,
  GetDoctorStatisticsResponse,
} from "@/lib/types/provider/statisticsTypes";

const sanitizeParams = <T extends Record<string, unknown>>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

export const getDoctorStatistics = async (
  params: GetDoctorStatisticsParams = {}
): Promise<GetDoctorStatisticsResponse> => {
  const response = await api.get(`/statistics/doctor`, {
    params: sanitizeParams(params),
  });
  return response.data as GetDoctorStatisticsResponse;
};

export const getCorporateStatistics = async (
  params: GetCorporateStatisticsParams = {}
): Promise<GetCorporateStatisticsResponse> => {
  const response = await api.get(`/statistics/corporate`, {
    params: sanitizeParams(params),
  });
  return response.data as GetCorporateStatisticsResponse;
};

export const getDoctorPaymentStatistics =
  async (): Promise<> => {
    const response = await api.get(`/payments/statistics`);
    return response.data;
  };
