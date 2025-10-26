// Corporate Application bilgileri
export interface CorporateApplication {
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  is_primary: boolean;
  requested_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
}

// Company bilgileri
export interface Company {
  id: number;
  name: string;
  slug: string;
  email: string;
  timezone: string;
  phone_code: string;
  phone_number: string;
  gender: string;
  birth_date: string;
  address: string;
  preferences: {
    privacy: string;
    language: string;
    notifications: boolean;
  };
  register_code: string;
  google_calendar_token: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  last_login_user_agent: string | null;
  user_type: string;
  email_code: string | null;
  email_code_expires_at: string | null;
  sms_code: string | null;
  sms_code_expires_at: string | null;
  is_active: boolean;
  photo: string;
  country: string;
  city: string;
  district: string;
  currency: string;
  rating: number;
  is_admin: number;
  created_at: string;
  updated_at: string;
  age: number;
  country_slug: string;
  city_slug: string;
  district_slug: string;
  hospital: any | null;
  image_url: string;
  unread_message_count: number;
}

// Adres bilgileri
export interface Address {
  id: number;
  address_id: string;
  user_id: number;
  company_id: number | null;
  name: string;
  address: string;
  country: string;
  city: string;
  district: string;
  postal_code: string | null;
  map_location: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  working_days: string[];
  holidays: any | null;
  appointment_duration: number;
  start_time: string | null;
  end_time: string | null;
  home_visit: boolean;
  emergency_available: boolean;
  available_full_time: boolean;
  corporate_application: CorporateApplication | null;
  company: Company | null;
}

// Adres oluşturma için (company_register_code ile başvuru)
export interface CreateAddressWithCompanyRequest {
  company_register_code: string;
}

// Adres oluşturma için (kendi adresi)
export interface CreateAddressRequest {
  name: string;
  address: string;
  country: string;
  city: string;
  district: string;
  postal_code: string;
  map_location: string;
  is_default: boolean;
  is_active: boolean;
}

// Adres güncelleme için
export interface UpdateAddressRequest {
  name: string;
  address: string;
  country: string;
  city: string;
  district: string;
  postal_code: string;
  map_location: string;
  is_default: boolean;
  is_active: boolean;
}

// API Response'ları
export interface UserAddressesResponse {
  success: boolean;
  data: Address[];
  message: string;
}

export interface UserAddressResponse {
  success: boolean;
  data: Address;
  message: string;
}

// Union type - hem company başvurusu hem de kendi adresi için
export type CreateAddressBody = CreateAddressWithCompanyRequest | CreateAddressRequest;
