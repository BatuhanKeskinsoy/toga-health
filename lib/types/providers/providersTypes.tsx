// Hastalık bilgileri
export interface Information {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Konum bilgileri
export interface Location {
  country: string;
  city?: string;
  district?: string;
}

// Hastalık deneyimi
export interface DiseaseExperience {
  disease_id: number;
  disease_name: string;
  disease_slug: string;
  experience_years: number;
  is_primary: number;
  notes: string;
}

// Tedavi bilgileri
export interface Treatment {
  treatment_id: number;
  treatment_name: string;
  treatment_slug: string;
  price: string;
  currency: string;
  is_primary: number;
}

// Konum detayları
export interface ProviderLocation {
  country: string;
  city: string;
  district: string;
  address: string;
  full_address: string;
  country_slug: string;
  city_slug: string;
  district_slug: string;
}

// Kurumsal bilgiler
export interface CorporateInfo {
  id: number;
  type: string;
  description: string | null;
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

// Doktor bilgileri
export interface DoctorInfo {
  id: number;
  type: string;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
  specialty_id: number;
  description: string;
  about: string | null;
  languages: string[];
  settings: {
    send_reminders: boolean;
    allow_cancellation: boolean;
    max_advance_booking_days: number;
    auto_confirm_appointments: boolean;
  };
}

// Yorum bilgileri
export interface Comment {
  id: number;
  rating: number;
  user: {
    id: number;
    name: string;
    photo: string | null;
  };
  comment: string;
  created_at: string;
}

// Sayfalama bilgileri
export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

// Galeri sayfalama
export interface GalleryPagination extends Pagination {}

// Yorum sayfalama
export interface CommentsPagination extends Pagination {}

// Hastane doktoru
export interface HospitalDoctor {
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

// Hastalık bazlı provider - Union type olarak tanımla
export type Provider = DoctorProvider | CorporateProvider;

// Doktor provider
export interface DoctorProvider {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  phone_code: string;
  phone_number: string;
  photo: string | null;
  gender: string;
  birth_date: string;
  preferences: {
    privacy: string;
    language: string;
    notifications: boolean;
  };
  register_code: string;
  rating: number;
  user_type: "doctor";
  timezone: string;
  currency: string;
  location: ProviderLocation;
  diseases: DiseaseExperience[];
  treatments: Treatment[];
  services: any[];
  addresses: any[];
  notification_count: number;
  message_count: number;
  gallery: any[];
  gallery_pagination: GalleryPagination;
  comments: Comment[];
  comments_count: number;
  comments_pagination: CommentsPagination;
  hospital: any[];
  doctor_info: DoctorInfo;
  corporates: any[];
}

// Kurumsal provider
export interface CorporateProvider {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  phone_code: string;
  phone_number: string;
  photo: string | null;
  gender: string;
  birth_date: string;
  preferences: {
    privacy: string;
    language: string;
    notifications: boolean;
  };
  register_code: string;
  rating: number;
  user_type: "corporate";
  timezone: string;
  currency: string;
  location: ProviderLocation;
  diseases: DiseaseExperience[];
  treatments: Treatment[];
  services: any[];
  addresses: any[];
  notification_count: number;
  message_count: number;
  gallery: any[];
  gallery_pagination: GalleryPagination;
  comments: Comment[];
  comments_count: number;
  comments_pagination: CommentsPagination;
  corporate_info: CorporateInfo;
  doctors: HospitalDoctor[];
}

// Sayfalama bilgileri
export interface ProvidersPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

// Özet bilgileri
export interface Summary {
  total_doctors: number;
  total_corporates: number;
  total_providers: number;
}

// Provider listesi
export interface ProvidersData {
  data: Provider[];
  pagination: ProvidersPagination;
  summary: Summary;
}

// API response
export interface ProvidersResponse {
  status: boolean;
  data: {
    information: Information;
    location: Location;
    providers: ProvidersData;
  };
}

// API parametreleri
export interface ProvidersParams {
  providers_slug: string;
  country: string;
  city?: string;
  district?: string;
  page?: number;
  per_page?: number;
  sort_by?: "rating" | "name" | "created_at";
  sort_order?: "asc" | "desc";
  provider_type?: "corporate" | "doctor";
  q?: string; // search parametresi
}

// Doktor detay API response
export interface DoctorDetailResponse {
  status: boolean;
  data: DoctorProvider;
}

// Hastane detay API response
export interface CorporateDetailResponse {
  status: boolean;
  data: CorporateProvider;
}
