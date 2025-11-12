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
  expert_title: string | null;
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
  user_type: "corporate";
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
  addresses: CorporateAddress[];
  notification_count: number;
  message_count: number;
  user_type_change: any[];
  is_active: boolean;
  gallery: GalleryItem[];
  gallery_pagination: GalleryPagination;
  comments: Comment[];
  comments_count: number;
  comments_pagination: CommentsPagination;
  corporate_info: CorporateDetails;
  doctors: Doctor[] | [];
}

export interface CorporateAddress {
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

export interface GalleryPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
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

export interface CorporateUser {
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
  type: string;
  description: string | null;
  map_location: string | null;
  website: string | null;
  facilities: string[];
  about: string | null;
  is_verified: boolean;
  tax_number: string;
  tax_office: string;
  languages: string[];
  settings: CorporateSettings;
}

export interface CorporateSettings {
  send_reminders: boolean;
  emergency_contact: string;
  allow_cancellation: boolean;
  online_payment_enabled: boolean;
  patient_portal_enabled: boolean;
  max_advance_booking_days: number;
  auto_confirm_appointments: boolean;
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
