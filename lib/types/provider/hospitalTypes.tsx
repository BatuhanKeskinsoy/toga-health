// Corporate/Hospital API Response Types
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
  description: string;
}

// Hastane detay API response için yeni type
export interface HospitalDetailResponse {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  photo: string | null;
  rating: number | null;
  user_type: "corporate";
  location: {
    country: string;
    city: string;
    district: string;
    full_address: string;
    country_slug: string;
    city_slug: string;
    district_slug: string;
  };
  diseases: DiseaseExperience[];
  treatments: Treatment[];
  addresses: any[];
  gallery: GalleryItem[];
  comments: Comment[];
  working_hours: any[];
  holidays: any[];
  comments_count: number;
  corporate_info: CorporateDetails;
  doctors: Doctor[] | [];
}

export interface Doctor {
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

// Comment type
export interface Comment {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

// Comments pagination type
export interface CommentsPagination {
  current_page: string;
  per_page: string;
  total: number;
  last_page: number;
  has_more: boolean;
}

export interface CorporateUser {
  id: number;
  name: string;
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
  user_type: "corporate";
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
  corporate: CorporateDetails | null;
  active_addresses: ActiveAddress[];
  active_services: ActiveService[];
  active_gallery: ActiveGallery[];
  approved_comments: ApprovedComment[];
  comments_count: number;
}

export interface CorporateDetails {
  id: number;
  user_id: number;
  type: string;
  description: string | null;
  location: string | null;
  experience: string;
  review_count: number;
  email: string | null;
  website: string | null;
  branches: string[];
  facilities: string[];
  working_hours: string | null;
  is_available: boolean;
  about: {
    branches: string[];
    facilities: string[];
    description: string;
  } | null;
  profile: {
    branches: string[];
    description: string;
  } | null;
  is_verified: boolean;
  verification_status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tax_number: string;
  tax_office: string;
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
  services_pricing: {
    surgery: number;
    radiology: number;
    laboratory: number;
    examination: number;
    consultation: number;
  };
  appointment_duration: number;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  "24_7_available": boolean;
  working_days: {
    friday: { end: string; start: string } | [];
    monday: { end: string; start: string } | [];
    sunday: { end: string; start: string } | [];
    tuesday: { end: string; start: string } | [];
    saturday: { end: string; start: string } | [];
    thursday: { end: string; start: string } | [];
    wednesday: { end: string; start: string } | [];
  };
  holidays: string[];
  settings: {
    send_reminders: boolean | number;
    emergency_contact: string;
    allow_cancellation: boolean | number;
    online_payment_enabled: boolean | number;
    patient_portal_enabled: boolean | number;
    max_advance_booking_days: number;
    auto_confirm_appointments: boolean | number;
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

// API Response Types
export interface CorporatesListResponse {
  status: boolean;
  data: {
    current_page: number;
    data: CorporateUser[];
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

export interface CorporateDetailResponse {
  status: boolean;
  data: HospitalDetailResponse;
}

// Search/Filter Parameters
export interface CorporatesListParams {
  page?: number;
  per_page?: number;
  type?: string;
  city?: string;
  district?: string;
  country?: string;
  is_available?: boolean;
  emergency_available?: boolean;
  online_consultation?: boolean;
  home_visit?: boolean;
  "24_7_available"?: boolean;
  min_rating?: number;
  max_rating?: number;
  branches?: string[];
  facilities?: string[];
  insurance_accepted?: string[];
  payment_methods?: string[];
  languages?: string[];
  certifications?: string[];
}

// Legacy compatibility (for existing components)
export interface HospitalTypes extends CorporateUser {
  // Legacy fields for backward compatibility
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
}
