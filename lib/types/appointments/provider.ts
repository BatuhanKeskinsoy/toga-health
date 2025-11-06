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
  type: "consultation" | "checkup" | "surgery" | "followup" | "other";
  location_type: "office" | "online" | "home";
  location_details: string | null;
  price: string | null;
  currency: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  user: AppointmentUser | null; // Manuel randevu oluşturulduğunda null olabilir
  provider: AppointmentUser; // Provider da user objesi gibi görünüyor
  user_address: AppointmentUserAddress;
  service: AppointmentService | null;
  email?: string | null; // Manuel randevu için email
  phone_number?: string | null; // Manuel randevu için telefon numarası
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
  filters: AppointmentFilters;
  provider_info: ProviderInfo;
}

export interface ProviderAppointmentsResponse {
  status: boolean;
  data: ProviderAppointmentsData;
}

// Randevu Oluşturma Request
export interface CreateAppointmentRequest {
  bookable_type: "doctor" | "corporate";
  bookable_id: number;
  address_service_id?: number; // Adres servis ID'si
  appointment_date: string; // YYYY-MM-DD formatında
  appointment_time: string; // HH:MM formatında
  type: "consultation" | "checkup" | "surgery" | "followup" | "other";
  timezone: string; // Örn: "Europe/Istanbul"
  location_type: "office" | "online" | "home";
  title: string; // Manuel randevu için hasta adı (required)
  description?: string; // Açıklama
  phone_number?: string; // Telefon numarası
  email?: string; // Email
  price?: number; // Fiyat
  currency?: string; // Para birimi
  address_id: string | number; // String (addr-xxx) veya number olabilir
}

// Randevu Oluşturma Response
export interface CreateAppointmentResponse {
  status: boolean;
  message?: string;
  data: Appointment;
}

// Randevu Onaylama Response
export interface ConfirmAppointmentResponse {
  status: boolean;
  message?: string;
  data: Appointment;
}

// Randevu Reddetme Request
export interface RejectAppointmentRequest {
  reason: string;
}

// Randevu Reddetme Response
export interface RejectAppointmentResponse {
  status: boolean;
  message?: string;
  data: Appointment;
}

// Randevu Tamamlandı Request
export interface CompleteAppointmentRequest {
  notes?: string | null;
}

// Randevu Tamamlandı Response
export interface CompleteAppointmentResponse {
  status: boolean;
  message?: string;
  data: Appointment;
}

// Randevu İptal Request
export interface CancelAppointmentRequest {
  cancellation_reason: string;
}

// Randevu İptal Response
export interface CancelAppointmentResponse {
  status: boolean;
  message?: string;
  data: Appointment;
}

