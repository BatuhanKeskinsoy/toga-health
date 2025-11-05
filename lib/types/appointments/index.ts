// Working Hours Types
export interface WorkingHour {
  day: string;
  day_name: string;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

// Address Types
export interface Address {
  id: number;
  address_id: string;
  name: string;
  working_hours: WorkingHour[];
  appointment_duration: number;
}

// Doctor Types
export interface Doctor {
  id: number;
  name: string;
}

// Prepayment Info Types
export interface PrepaymentInfo {
  requires_prepayment: boolean;
  prepayment_amount: string;
  prepayment_currency: string;
  prepayment_description: string | null;
  formatted_prepayment: string;
}

// Service Types
export interface BaseService {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  type: "disease" | "treatment";
  service_type: "disease" | "treatment";
  experience_years: number | null;
  notes: string | null;
  service_id: string;
  prepayment_required: boolean;
  prepayment_info: PrepaymentInfo | null;
}

export interface DiseaseService extends BaseService {
  type: "disease";
  service_type: "disease";
}

export interface TreatmentService extends BaseService {
  type: "treatment";
  service_type: "treatment";
  duration: string;
}

export type Service = DiseaseService | TreatmentService;

// Provider Unified Services API Response Types
export interface ProviderUnifiedServicesData {
  doctor: Doctor;
  address: Address;
  services: Service[];
}

export interface ProviderUnifiedServicesResponse {
  success: boolean;
  data: ProviderUnifiedServicesData;
}

// Appointment Slots Types
export interface BookedTimeSlot {
  date: string;
  start_time: string;
  end_time: string;
}

export interface AppointmentSlotsData {
  bookable_type: string;
  bookable_id: string;
  address_id: string;
  all_booked_time_slots: BookedTimeSlot[];
  total_booked_slots: number;
}

export interface AppointmentSlotsResponse {
  status: boolean;
  message: string;
  data: AppointmentSlotsData;
}

// Export Provider Appointments Types
export * from "./provider";
