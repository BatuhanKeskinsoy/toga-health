// Provider Services Types

// Pivot interface for provider-disease relation
export interface ProviderDiseasePivot {
  provider_id: number;
  disease_id: number;
  provider_type: string;
  notes: string | null;
  is_primary: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

// Disease interface
export interface Disease {
  id: number;
  name: string;
  slug: string;
  description: string;
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
  pivot: ProviderDiseasePivot;
}

// Provider Diseases Response
export interface GetProviderDiseasesResponse {
  success: boolean;
  data: Disease[];
  message: string;
}

// Update Provider Diseases Request
export interface UpdateProviderDiseasesRequest {
  disease_ids: number[];
}

// Pivot interface for provider-treatment relation
export interface ProviderTreatmentPivot {
  provider_id: number;
  treatment_id: number;
  provider_type: string;
  notes: string;
  price: string;
  currency: string;
  is_primary: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

// Treatment interface
export interface Treatment {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number | null;
  specialty_id: number;
  icd_code: string | null;
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
  pivot: ProviderTreatmentPivot;
}

// Provider Treatments Response
export interface GetProviderTreatmentsResponse {
  success: boolean;
  data: Treatment[];
  message: string;
}

// Update Provider Treatments Request
export interface UpdateProviderTreatmentsRequest {
  treatments: Array<{
    id: number;
    price?: number;
    currency?: string;
    is_primary?: boolean;
    is_active?: boolean;
  }>;
}

// Provider Disease at Address Response
export interface GetProviderDiseasesAtAddressResponse {
  success: boolean;
  data: {
    address: AddressAtService;
    diseases: DiseaseAtAddress[];
  };
  message: string;
}

// Disease at Address Service
export interface DiseaseAtAddress {
  id: number;
  service_id: string;
  user_address_id: number;
  disease_id: number;
  treatment_id: number | null;
  service_type: string;
  price: string;
  prepayment_amount: string | null;
  prepayment_currency: string | null;
  requires_prepayment: boolean;
  prepayment_description: string | null;
  currency: string;
  description: string | null;
  notes: string | null;
  is_active: boolean;
  is_primary: boolean;
  experience_years: number | null;
  working_hours: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
  disease: Disease;
  user_address: AddressAtService;
}

// Provider Treatment at Address Response
export interface GetProviderTreatmentsAtAddressResponse {
  success: boolean;
  data: {
    address: AddressAtService;
    treatments: TreatmentAtAddress[];
  };
  message: string;
}

// Treatment at Address Service
export interface TreatmentAtAddress {
  id: number;
  service_id: string;
  user_address_id: number;
  disease_id: number | null;
  treatment_id: number;
  service_type: string;
  price: string;
  prepayment_amount: string | null;
  prepayment_currency: string | null;
  requires_prepayment: boolean;
  prepayment_description: string | null;
  currency: string;
  description: string | null;
  notes: string | null;
  is_active: boolean;
  is_primary: boolean;
  experience_years: number | null;
  working_hours: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
  treatment: Treatment;
  user_address: AddressAtService;
}

// Disease Address Detail
export interface DiseaseAddressDetail {
  address_id: number;
  price: number;
  currency: string;
  is_active: boolean;
}

// Disease with Addresses
export interface DiseaseWithAddresses {
  disease_id: number;
  addresses: DiseaseAddressDetail[];
}

// Add Provider Diseases at Address Request
export interface AddProviderDiseasesAtAddressRequest {
  diseases: DiseaseWithAddresses[];
}

// Treatment Address Detail
export interface TreatmentAddressDetail {
  address_id: number;
  price: number;
  currency: string;
  is_active: boolean;
}

// Treatment with Addresses
export interface TreatmentWithAddresses {
  treatment_id: number;
  addresses: TreatmentAddressDetail[];
}

// Add Provider Treatments at Address Request
export interface AddProviderTreatmentsAtAddressRequest {
  treatments: TreatmentWithAddresses[];
}

// Update Provider Services at Address Request
export interface UpdateProviderServicesAtAddressRequest {
  price: number;
  currency: string;
  is_active: boolean;
}

// Address interface for services response
export interface AddressAtService {
  id: number;
  address_id: string;
  user_id: number;
  company_id: number | null;
  name: string;
  address: string;
  map_location: string;
  country: string;
  city: string;
  district: string;
  postal_code: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  working_days: string[];
  holidays: any | null;
  appointment_duration: number;
  start_time: string;
  end_time: string;
  home_visit: boolean;
  emergency_available: boolean;
  available_full_time: boolean;
}

