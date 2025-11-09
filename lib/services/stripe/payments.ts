import { api } from "@/lib/axios";

export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  await api.post(`/payments/initiate`, data);
};

export const confirmPayment = async (
  data: ConfirmPaymentRequest
): Promise<ConfirmPaymentResponse> => {
  await api.post(`/payments/confirm`, data);
};



export const getStripePublishableKey = async (
): Promise<GetStripePublishableKeyResponse> => {
  await api.get(`/stripe/public-key`);
};

