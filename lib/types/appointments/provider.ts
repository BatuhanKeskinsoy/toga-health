// Provider Appointments Types
export interface AppointmentUser {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  phone_code: string;
  photo: string | null;
  image_url: string | null;
}

export interface AppointmentUserAddress {
  id: number;
  address_id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  country: string;
  postal_code: string | null;
  phone_number: string | null;
}

export interface AppointmentService {
  id: number;
  service_id: string;
  service_name: string;
  service_type: "disease" | "treatment";
  price: string;
  prepayment_amount: string | null;
  prepayment_currency: string;
  currency: string;
  formatted_price: string;
}

export interface Appointment {
  id: number;
  appointment_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  title: string;
  description: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "checkup" | "followup" | "consultation" | string;
  location_type: "office" | "online";
  location_details: string | null;
  price: string | null;
  currency: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  user: AppointmentUser;
  provider: AppointmentUser; // Provider da user objesi gibi görünüyor
  user_address: AppointmentUserAddress;
  service: AppointmentService | null;
}

export interface AppointmentStatistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  today: number;
  upcoming: number;
}

export interface AppointmentFilters {
  status: string | null;
  type: string | null;
  date_from: string | null;
  date_to: string | null;
  address_ids: number[];
  view_type: "today" | "week" | "month" | "all";
  sort_by: string;
  sort_order: "asc" | "desc";
}

export interface ProviderInfo {
  type: "doctor" | "corporate";
  name: string;
  provider_id: number;
  doctor_id: number | null;
  address_ids: number[];
}

export interface ProviderAppointmentsData {
  appointments: Appointment[];
  statistics: AppointmentStatistics;
  today_appointments: Appointment[];
  upcoming_appointments: Appointment[];
  filters: AppointmentFilters;
  provider_info: ProviderInfo;
}

export interface ProviderAppointmentsResponse {
  status: boolean;
  data: ProviderAppointmentsData;
}

