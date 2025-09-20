// Hastalık bilgileri
export interface Disease {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Konum bilgileri
export interface DiseaseLocation {
  country: string;
  city?: string;
  district?: string;
}

// Hastalık deneyimi
export interface DiseaseExperience {
  disease_id: number;
  disease_name: string;
  experience_years: number;
  is_primary: number;
  notes: string;
}

// Tedavi bilgileri
export interface Treatment {
  treatment_id: number;
  treatment_name: string;
  price: string;
  currency: string;
  is_primary: number;
}

// Konum detayları
export interface ProviderLocation {
  country: string;
  city: string;
  district: string;
  full_address: string;
}

// Kurumsal bilgiler
export interface CorporateInfo {
  id: number;
  type: string;
  description: string | null;
  website: string;
  is_verified: boolean;
  facilities: string[];
  working_hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  } | null;
}

// Doktor bilgileri
export interface DoctorInfo {
  id: number;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
  experience: string;
  hospital: string;
  description: string;
  online_consultation: boolean;
  home_visit: boolean;
  consultation_fee: string;
  examination_fee: string;
}

// Kurumsal bağlantılar
export interface CorporateConnection {
  id: number;
  name: string;
  slug: string;
  position: string;
  department: string;
  is_primary: number;
}

// Hastalık bazlı provider - Union type olarak tanımla
export type DiseaseProvider = DiseaseDoctorProvider | DiseaseCorporateProvider;

// Doktor provider
export interface DiseaseDoctorProvider {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  photo: string | null;
  rating: string;
  user_type: "doctor";
  location: ProviderLocation;
  disease_experience: DiseaseExperience[];
  treatments: Treatment[];
  addresses: any[];
  gallery: any[];
  comments: any[];
  doctor_info: DoctorInfo;
  corporates: CorporateConnection[];
}

// Kurumsal provider
export interface DiseaseCorporateProvider {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  photo: string | null;
  rating: string;
  user_type: "corporate";
  location: ProviderLocation;
  disease_experience: DiseaseExperience[];
  treatments: Treatment[];
  addresses: any[];
  gallery: any[];
  comments: any[];
  corporate_info: CorporateInfo;
}

// Sayfalama bilgileri
export interface DiseasePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

// Özet bilgileri
export interface DiseaseSummary {
  total_doctors: number;
  total_corporates: number;
  total_providers: number;
}

// Provider listesi
export interface DiseaseProvidersData {
  data: DiseaseProvider[];
  pagination: DiseasePagination;
  summary: DiseaseSummary;
}

// API response
export interface DiseaseProvidersResponse {
  status: boolean;
  data: {
    disease: Disease;
    location: DiseaseLocation;
    providers: DiseaseProvidersData;
  };
}

// API parametreleri
export interface DiseaseProvidersParams {
  disease_slug: string;
  country: string;
  city?: string;
  district?: string;
  page?: number;
  per_page?: number;
}