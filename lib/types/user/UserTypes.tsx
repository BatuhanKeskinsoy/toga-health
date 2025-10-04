interface Location {
  country: string;
  city: string;
  district: string;
  address: string;
  full_address: string;
  country_slug: string;
  city_slug: string;
  district_slug: string;
}

interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

interface Specialty {
  id: number;
  name: string;
  slug: string;
}

interface Education {
  degree: string;
  university: string;
  year: number;
}

interface Experience {
  position: string;
  hospital: string;
  start_date: string;
  end_date: string | null;
}

interface WorkingDays {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string } | { closed: boolean };
}

interface Hospital {
  id: number | null;
  name: string | null;
  slug: string | null;
}

interface DoctorInfo {
  id: number;
  type: string;
  specialty: Specialty;
  specialty_id: number;
  rating: number | null;
  experience: string;
  description: string;
  map_location: string;
  review_count: number;
  education: Education[];
  experience_list: Experience[];
  branches: any[];
  is_available: boolean;
  about: string | null;
  license_number: string;
  license_country: string | null;
  license_expiry_date: string | null;
  license_document_path: string | null;
  verification_status: string;
  verification_notes: string | null;
  verification_submitted_at: string | null;
  verification_approved_at: string | null;
  languages: string[];
  certifications: string[];
  insurance_accepted: any[];
  payment_methods: any[];
  consultation_fee: string;
  examination_fee: string;
  appointment_duration: number;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  working_days: WorkingDays;
  holidays: string[];
  settings: any[];
  disease_ids?: number[];
  treatments?: any[];
  services?: any[];
}

interface CorporateInfo {
  id: number;
  type: string;
  experience: string;
  description: string;
  map_location: string;
  website?: string;
  review_count: number;
  disease_ids?: number[];
  treatments?: any[];
  services?: any[];
  branches?: any[];
  facilities?: string[];
  working_days?: WorkingDays;
  languages?: string[];
  certifications?: string[];
  appointment_duration?: number;
  online_consultation?: boolean;
  home_visit?: boolean;
  emergency_available?: boolean;
  "24_7_available"?: boolean;
  holidays?: string[];
  is_available?: boolean;
  is_verified?: boolean;
  consultation_fee?: string;
  examination_fee?: string;
}

export interface UserTypes {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  phone_number: string;
  photo: string | null;
  gender: string | null;
  birth_date: string | null;
  preferences: any | null;
  register_code: string;
  rating: number | null;
  user_type: "individual" | "doctor" | "corporate";
  timezone: string;
  currency: string;
  address: string;
  location: Location;
  diseases: any[];
  treatments: any[];
  services: any[];
  addresses: any[];
  gallery: any[];
  gallery_pagination: Pagination;
  comments: any[];
  comments_count: number;
  comments_pagination: Pagination;
  working_hours: any[];
  holidays: string[];
  notification_count: number;
  message_count: number;
  hospital: Hospital;
  doctor_info?: DoctorInfo;
  corporate?: CorporateInfo;
  corporates: any[];
};