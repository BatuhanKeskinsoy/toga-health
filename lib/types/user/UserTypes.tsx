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


interface DiseaseExperience {
  disease_id: number;
  disease_name: string;
  disease_slug: string;
  experience_years: number;
  is_primary: number;
  notes: string;
}

interface HospitalDoctor {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  country: string;
  country_slug: string;
  city: string;
  city_slug: string;
  district: string;
  district_slug: string;
  department: string;
  department_slug: string;
  is_primary: number;
  status: string;
}

interface DoctorInfo {
  id: number;
  type: string;
  specialty: Specialty;
  specialty_id: number;
  description: string;
  about: string | null;
  languages: string[];
  settings: any[];
}

interface CorporateInfo {
  id: number;
  type: string;
  description: string;
  map_location: string | null;
  website: string;
  facilities: string[];
  about: string | null;
  is_verified: boolean;
  tax_number: string;
  tax_office: string;
  languages: string[];
  settings: {
    send_reminders: boolean;
    emergency_contact: string;
    allow_cancellation: boolean;
    online_payment_enabled: boolean;
    patient_portal_enabled: boolean;
    max_advance_booking_days: number;
    auto_confirm_appointments: boolean;
  };
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
  gender: string;
  birth_date: string;
  preferences: any | null;
  register_code: string;
  rating: number | null;
  user_type: "individual" | "doctor" | "corporate";
  timezone: string;
  currency: string;
  location: Location;
  diseases: DiseaseExperience[];
  treatments: any[];
  services: any[];
  addresses: any[];
  notification_count: number;
  message_count: number;
  doctor_info?: DoctorInfo;
  corporate_info?: CorporateInfo;
  doctors?: HospitalDoctor[];
};