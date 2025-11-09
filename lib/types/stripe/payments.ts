export interface AppointmentPaymentData {
  bookable_id: number;
  address_id: string;
  address_service_id: number;
  appointment_date: string;
  appointment_time: string;
  title?: string;
  notes?: string;
  phone_number?: string;
  email?: string;
}

export type StripePaymentMethod = "card";

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  payment_method: StripePaymentMethod;
  appointment_data: AppointmentPaymentData;
}

export interface CreatePaymentIntentData {
  status: boolean;
  payment_id: number;
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  prepaid_appointment: boolean;
}

export interface CreatePaymentIntentResponse {
  status: boolean;
  message?: string;
  data: CreatePaymentIntentData;
}

export interface ConfirmPaymentRequest {
  payment_id: number;
  payment_intent_id: string;
}

export interface ConfirmPaymentData {
  status: "processing" | "requires_action" | "succeeded" | "failed";
  payment_intent_id: string;
  client_secret?: string;
}

export interface ConfirmPaymentResponse {
  status: boolean;
  message?: string;
  data: ConfirmPaymentData;
}

export interface StripePublishableKeyData {
  publishable_key: string;
  currency: string;
  supported_currencies: string[];
}

export interface GetStripePublishableKeyResponse {
  success: boolean;
  data: StripePublishableKeyData;
}


