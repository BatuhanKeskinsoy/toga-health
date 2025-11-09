export type IndividualAppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface IndividualAppointmentUser {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  phone_code: string | null;
  photo: string | null;
  image_url: string | null;
}

export interface IndividualAppointmentProvider {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  phone_code: string | null;
  photo: string | null;
  image_url: string | null;
}

export interface IndividualAppointmentAddress {
  id: number;
  address_id: string;
  name: string;
  address: string;
  city: string | null;
  district: string | null;
  country: string | null;
  postal_code: string | null;
  phone_number: string | null;
}

export interface IndividualAppointmentService {
  id: number;
  service_id: string;
  service_name: string;
  service_type: string;
  price: string | null;
  prepayment_amount?: string | null;
  prepayment_currency?: string | null;
  currency?: string | null;
  formatted_price?: string | null;
}

export interface IndividualAppointment {
  id: number;
  appointment_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  title: string | null;
  description: string | null;
  status: IndividualAppointmentStatus;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  type: string | null;
  location_type: string | null;
  location_details: string | null;
  email: string | null;
  phone_number: string | null;
  price: string | null;
  currency: string | null;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  user: IndividualAppointmentUser;
  provider: IndividualAppointmentProvider;
  user_address: IndividualAppointmentAddress | null;
  service: IndividualAppointmentService | null;
}

export interface IndividualAppointmentStatistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  upcoming: number;
}

export interface IndividualAppointmentFilters {
  status: IndividualAppointmentStatus | null;
  type: string | null;
  date_from: string | null;
  date_to: string | null;
  start: string | null;
  end: string | null;
  provider_id: number | null;
  sort_by: string;
  sort_order: "asc" | "desc";
}

export interface IndividualAppointmentPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface IndividualAppointmentsData {
  appointments: IndividualAppointment[];
  statistics: IndividualAppointmentStatistics;
  filters: IndividualAppointmentFilters;
  user_timezone: string;
  pagination: IndividualAppointmentPagination;
}

export interface IndividualAppointmentsResponse {
  status: boolean;
  data: IndividualAppointmentsData;
}

