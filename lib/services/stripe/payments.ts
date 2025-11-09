import api from "@/lib/axios";
import type {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  GetStripePublishableKeyResponse,
} from "@/lib/types/stripe/payments";

export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  const response = await api.post("/payments/initiate", data);
  return response.data as CreatePaymentIntentResponse;
};

export const confirmPayment = async (
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  const response = await api.post("/payments/confirm", data);
  return response.data as ConfirmPaymentResponse;
};

export const getStripePublishableKey = async (): Promise<GetStripePublishableKeyResponse> => {
  const response = await api.get("/stripe/public-key");
  return response.data as GetStripePublishableKeyResponse;
};

