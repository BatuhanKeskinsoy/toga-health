export interface PaymentsHistoryParams {
  page?: number;
  per_page?: number;
}

export interface PaymentAppointmentData {
  bookable_id?: number;
  bookable_type?: string;
  provider_type?: string;
  address_id?: string;
  adres_id?: number;
  address_service_id?: number;
  appointment_date?: string;
  appointment_time?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  title?: string;
  description?: string | null;
  type?: string | null;
  location_type?: string | null;
  location_details?: string | null;
  phone_number?: string | null;
  email?: string | null;
  price?: string | null;
  currency?: string | null;
  notes?: string | null;
  patient_notes?: string | null;
  add_to_google_calendar?: boolean;
  timezone?: string | null;
  meet_location?: string | null;
  privacy_accepted?: boolean | null;
  terms_accepted?: boolean | null;
  service_name?: string | null;
  service_type?: string | null;
  [key: string]: unknown;
}

export interface PaymentMetadata {
  payment_method?: string;
  requested_amount?: number;
  requested_currency?: string;
  prepaid_appointment?: boolean;
  appointment_data?: PaymentAppointmentData;
  appointment_type?: string | null;
  provider_id?: number | null;
  provider_type?: string | null;
  bookable_type?: string | null;
  prepayment_amount?: number | null;
  prepayment_currency?: string | null;
  appointment_id?: number | null;
  appointment_created?: boolean;
  appointment_created_at?: string | null;
  [key: string]: unknown;
}

export interface PaymentPersonSummary {
  id?: number;
  user_id?: number;
  name?: string;
  slug?: string | null;
  email?: string | null;
  timezone?: string | null;
  phone_code?: string | null;
  phone_number?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  address?: string | null;
  register_code?: string | null;
  country?: string | null;
  city?: string | null;
  district?: string | null;
  currency?: string | null;
  rating?: number | null;
  expert_title?: string | null;
  [key: string]: unknown;
}

export interface PaymentRefund {
  id: number;
  payment_id: number;
  user_id: number | null;
  amount: string;
  currency: string;
  reason: string | null;
  stripe_refund_id: string | null;
  status: string;
  processed_at: string | null;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  formatted_amount?: string | null;
  status_text?: string | null;
}

export interface PaymentAppointment {
  id: number | null;
  appointment_id?: string | null;
  user_id?: number | null;
  provider_id?: number | null;
  adres_id?: number | null;
  address_service_id?: number | null;
  appointment_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  cancellation_reason?: string | null;
  confirmed_at?: string | null;
  cancelled_at?: string | null;
  type?: string | null;
  location_type?: string | null;
  location_details?: string | null;
  phone_number?: string | null;
  email?: string | null;
  google_event_id?: string | null;
  google_calendar_id?: string | null;
  google_calendar_link?: string | null;
  external_calendar_type?: string | null;
  external_event_id?: string | null;
  price?: string | null;
  currency?: string | null;
  is_paid?: boolean | null;
  reminder_sent?: boolean | null;
  reminder_sent_at?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  provider?: PaymentPersonSummary | null;
  user?: PaymentPersonSummary | null;
  [key: string]: unknown;
}

export interface PaymentItem {
  id: number;
  user_id: number | null;
  appointment_id: number | null;
  amount: string;
  currency: string;
  payment_method: string;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  status: string;
  transaction_id: string | null;
  description: string | null;
  metadata?: PaymentMetadata | null;
  refunded_at?: string | null;
  refund_amount?: string | null;
  refund_reason?: string | null;
  processed_at?: string | null;
  failed_at?: string | null;
  failure_reason?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  formatted_amount?: string | null;
  formatted_refund_amount?: string | null;
  status_text?: string | null;
  payment_method_text?: string | null;
  is_refunded?: boolean;
  is_failed?: boolean;
  is_pending?: boolean;
  is_successful?: boolean;
  appointment?: PaymentAppointment | null;
  refunds?: PaymentRefund[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaymentsPagination<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaymentsHistoryStatistics {
  total_payments: number;
  total_amount: string;
  successful_payments: number;
  failed_payments: number;
  refunded_payments: number;
  pending_payments: number;
  [key: string]: number | string;
}

export interface PaymentsHistoryData {
  status: boolean;
  payments: PaymentsPagination<PaymentItem>;
  statistics: PaymentsHistoryStatistics;
}

export interface PaymentsHistoryResponse {
  status: boolean;
  message: string;
  data: PaymentsHistoryData;
}

