import api from "@/lib/axios";
import type {
  PaymentsHistoryParams,
  PaymentsHistoryResponse,
} from "@/lib/types/payments/payments";

export const getPaymentsHistory = async (
  params: PaymentsHistoryParams = {}
): Promise<PaymentsHistoryResponse> => {
  const response = await api.get(`/payments/history`, {
    params,
  });
  return response.data as PaymentsHistoryResponse;
};
