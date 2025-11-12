import { DiseaseExperience, Treatment } from "../providers/providersTypes";

export interface ApprovedComment {
  id: number;
  comment_id: number | null;
  user_id: number;
  answer_id: number;
  author: string;
  rating: number | null;
  comment_date: string;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  type: "image" | "video";
  image_url: string;
  description: string | null;
}
// Doktor detay API response için yeni type
export interface DoctorDetailResponse {
  id: number;
  name: string;
  slug: string;
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
  user_type: "doctor";
  timezone: string;
  currency: string;
  location: {
    country: string;
    city: string;
    district: string;
    address: string;
    full_address: string;
    country_slug: string;
    city_slug: string;
    district_slug: string;
  };
  diseases: DiseaseExperience[];
  treatments: Treatment[];
  services: any[];
  addresses: Address[];
  notification_count: number;
  message_count: number;
  user_type_change: any[];
  is_active: boolean;
  gallery: GalleryItem[];
  gallery_pagination: GalleryPagination;
  comments: Comment[];
  comments_count: number;
  comments_pagination: CommentsPagination;
  hospital: any[];
  doctor_info: DoctorInfo;
  corporates: Corporate[];
}

export interface Address {
  address_id: string;
  name: string;
  address: string;
  country: string;
  city: string;
  district: string;
  postal_code: string | null;
  is_default: boolean;
  is_active: boolean;
}

export interface Corporate {
  id: number;
  name: string;
  photo: string | null;
  slug: string;
  country: string;
  country_slug: string;
  city: string;
  city_slug: string;
  district: string;
  district_slug: string;
  status: string;
  requested_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

export interface GalleryPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

// Comment Reply type
export interface CommentReply {
  id: number;
  comment_id: string;
  author: string;
  user: {
    id: number;
    name: string;
    photo: string;
    user_type: string;
  };
  comment: string;
  comment_date: string;
  created_at: string;
  is_verified: boolean;
}

// Comment type
export interface Comment {
  id: number;
  comment_id: string | null;
  rating: number;
  author: string;
  user: {
    id: number;
    name: string;
    photo: string | null;
    user_type: string | null;
  };
  comment: string;
  comment_date: string;
  created_at: string;
  is_verified: boolean;
  has_reply: boolean;
  reply: CommentReply | null;
}

// Comments pagination type
export interface CommentsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface SpecialtyTranslation {
  id: number;
  lang: string;
  name: string;
  slug: string;
}

// Specialty info type
export interface SpecialtyInfo {
  specialty_id: number;
  specialty_name: string;
  specialty_slug: string;
  specialty_description: string;
  specialty_lang_code: string;
}

export interface DoctorInfo {
  id: number;
  type: "specialist" | "general" | "surgeon";
  specialty: {
    id: number;
    name: string;
    slug: string;
    translations: SpecialtyTranslation[];
  };
  specialty_id: number;
  description: string | null;
  about: string | null;
  languages: string[];
  settings: any[];
}

export interface ProviderDisease {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  lang_code: string;
  parent_id: number | null;
  specialty_id: number;
  symptoms: string[];
  causes: string[];
  risk_factors: string[];
  prevention: string[];
  icd_code: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  pivot: {
    provider_id: number;
    disease_id: number;
    provider_type: string;
    experience_years: number;
    notes: string;
    is_primary: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
}

export interface ProviderTreatment {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  lang_code: string;
  parent_id: number | null;
  specialty_id: number;
  diseases: string[];
  procedures: string[];
  contraindications: string[];
  side_effects: string[];
  duration: string;
  cost_range: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  pivot: {
    provider_id: number;
    treatment_id: number;
    provider_type: string;
    experience_years: number;
    notes: string;
    price: string;
    currency: string;
    is_primary: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
}

export interface DoctorUser {
  id: number;
  name: string;
  expert_title: string | null;
  slug: string;
  email: string;
  timezone: string;
  phone_code: string;
  phone_number: string;
  gender: string | null;
  birth_date: string | null;
  address: string | null;
  preferences: any | null;
  register_code: string;
  google_calendar_token: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  last_login_user_agent: string | null;
  user_type: "doctor";
  hospital: {
    id: number | null;
    name: string | null;
    slug: string | null;
    country?: string;
    country_slug?: string;
    city?: string;
    city_slug?: string;
    district?: string;
    district_slug?: string;
  };
  email_code: string | null;
  email_code_expires_at: string | null;
  sms_code: string | null;
  sms_code_expires_at: string | null;
  is_active: boolean;
  photo: string | null;
  country: string;
  city: string;
  district: string;
  currency: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  age: number | null;
  doctor: DoctorDetails | null;
  active_addresses: ActiveAddress[];
  active_services: ActiveService[];
  provider_diseases: ProviderDisease[];
  provider_treatments: ProviderTreatment[];
  active_gallery: ActiveGallery[];
  active_corporates: any[];
  approved_comments: ApprovedComment[];
  comments_count: number;
}

export interface DoctorDetails {
  id: number;
  user_id: number;
  description: string | null;
  type: "specialist" | "general" | "surgeon";
  experience: string;
  location: string | null;
  review_count: number;
  rating: number | null;
  education: string[];
  experience_list: string[];
  branches: string[];
  is_available: boolean;
  verification_status: string;
  about: {
    education?: string[];
    experience?: string[];
    branches?: string[];
    description?: string;
  } | null;
  profile: {
    branches?: string[];
    description?: string;
  } | null;
  created_at: string;
  updated_at: string;
  specialty_id: number;
  license_number: string;
  license_country: string;
  license_expiry_date: string;
  license_document_path: string | null;
  verification_notes: string | null;
  verification_submitted_at: string | null;
  verification_approved_at: string | null;
  languages: string[];
  certifications: string[];
  insurance_accepted: string[];
  payment_methods: string[];
  consultation_fee: string;
  examination_fee: string;
  appointment_duration: number;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  working_days: {
    friday: { end: string; start: string } | null;
    monday: { end: string; start: string } | null;
    sunday: { end: string; start: string } | null;
    tuesday: { end: string; start: string } | null;
    saturday: { end: string; start: string } | null;
    thursday: { end: string; start: string } | null;
    wednesday: { end: string; start: string } | null;
  };
  holidays: string[];
  settings: {
    send_reminders: boolean | number;
    allow_cancellation: boolean | number;
    max_advance_booking_days: number;
    auto_confirm_appointments: boolean | number;
  };
  specialty: {
    id: number;
    name: string;
    slug: string;
    description: string;
    lang_code: string;
    parent_id: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ActiveAddress {
  id: number;
  address_id: string;
  user_id: number;
  name: string;
  address: string;
  country: string | null;
  city: string | null;
  district: string | null;
  postal_code: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActiveService {
  id: number;
  user_id: number;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ActiveGallery {
  id: number;
  gallery_id: string;
  user_id: number;
  title: string;
  image: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DoctorsListResponse {
  status: boolean;
  data: {
    current_page: number;
    data: DoctorUser[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface DoctorDetailResponseWrapper {
  status: boolean;
  data: DoctorDetailResponse;
}

export interface DoctorsListParams {
  page?: number;
  per_page?: number;
  specialty_id?: number;
  city?: string;
  district?: string;
  search?: string;
}

// Legacy compatibility for existing components
export interface SpecialistTypes {
  id: number;
  slug: string;
  name: string;
  type: string;
  photo: string;
  rating: number | null;
  experience: string;
  description: string;
  address: string;
  phone: string;
  location: string;
  reviewCount: number;
  email: string;
  website: string;
  branches: string[];
  facilities: string[];
  workingHours: {
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;
  };
  isAvailable: boolean;
  addresses: {
    id: number;
    name: string;
    address: string;
    isDefault: boolean;
    isActive: boolean;
  }[];
  about: {
    description: string;
    facilities: string[];
    branches: string[];
  };
  profile: {
    description: string;
    branches: string[];
  };
  services: {
    title: string;
    description: string;
  }[];
  gallery: {
    id: number;
    title: string;
    image: string;
    description: string;
  }[];
  comments: {
    id: number;
    rating: number | null;
    user: {
      id: number;
      name: string;
      photo: string;
    };
    comment: string;
    created_at: Date | string;
  }[];
  specialty: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
  education: string[];
  experience_list: string[];
  certifications: string[];
  languages: string[];
  insurance_accepted: string[];
  payment_methods: string[];
  consultation_fee: string;
  examination_fee: string;
  appointment_duration: number;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
}
