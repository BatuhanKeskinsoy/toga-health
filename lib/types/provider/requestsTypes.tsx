// Doktor istekleri için tip tanımları

export interface CorporateDoctor {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  phone_code: string;
  phone_number: string;
  photo: string;
  gender: string;
  birth_date: string;
  preferences: {
    privacy: string;
    language: string;
    notifications: boolean;
  };
  register_code: string;
  rating: number;
  user_type: string;
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
  diseases: Array<{
    disease_id: number;
    disease_name: string;
    disease_slug: string;
    experience_years: number;
    is_primary: number;
    notes: string;
  }>;
  treatments: Array<{
    treatment_id: number;
    treatment_name: string;
    treatment_slug: string;
    price: string;
    currency: string;
    is_primary: number;
  }>;
  services: Array<any>;
  addresses: Array<any>;
  notification_count: number;
  message_count: number;
  user_type_change: Array<any>;
  is_active: boolean;
  hospital: {
    id: number;
    name: string;
    slug: string;
    country: string;
    country_slug: string;
    city: string;
    city_slug: string;
    district: string;
    district_slug: string;
  };
  doctor_info: {
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
  };
  corporates: Array<{
    id: number;
    name: string;
    photo: string;
    slug: string;
    country: string;
    country_slug: string;
    city: string;
    city_slug: string;
    district: string;
    district_slug: string;
  }>;
}

export interface GetCorporateDoctorsResponse {
  status: boolean;
  data: {
    current_page: number;
    data: CorporateDoctor[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface PendingDoctorRequest {
  id: number;
  doctor_id: number;
  corporate_id: number;
  is_active: boolean;
  is_primary: boolean;
  status: string;
  requested_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  approved_by: number | null;
  rejected_by: number | null;
  corporate: {
    id: number;
    name: string;
    age: number | null;
    country_slug: string | null;
    city_slug: string | null;
    district_slug: string | null;
    rating: number;
    hospital: any | null;
    image_url: string | null;
    unread_message_count: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    photo: string | null;
    slug: string;
    country: {
      id: number;
      ulke_title: string;
      rewrite: string;
      ulke_slug: string;
      alankodu: string;
    };
    city: {
      id: number;
      sehir_title: string;
      ulke_id: number;
      sehir_slug: string;
    } | null;
    district: {
      id: number;
      ilce_title: string;
      sehir_id: number;
      ilce_slug: string;
    } | null;
    age: number | null;
    country_slug: string;
    city_slug: string;
    district_slug: string;
    rating: number;
    hospital: any | null;
    image_url: string | null;
    unread_message_count: number;
    doctor: {
      id: number;
      user_id: number;
      specialty_id: number;
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
    };
  };
}

export interface GetToBeApprovedDoctorsResponse {
  success: boolean;
  data: PendingDoctorRequest[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  };
  message: string;
}

export interface AddDoctorToCorporateRequest {
  doctor_finder: string;
}

export interface AddDoctorToCorporateResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    doctor_id: number;
    corporate_id: number;
    role: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
  };
}
