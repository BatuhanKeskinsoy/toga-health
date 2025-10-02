export interface SettingItem {
  id: number;
  lang: string;
  key: string;
  value: string | null;
  type: "string" | "integer" | "decimal" | "boolean" | "array" | "json";
  description: string;
  group: string;
}

export interface PopularDisease {
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
  doctors_count: number;
}

export interface PopularTreatment {
  id: number;
  name: string;
  slug: string;
  description: string;
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
  doctors_count: number;
}

export interface PopularSpecialty {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  doctors_count: number;
}

export interface SettingsData {
  general: SettingItem[];
  appointment: SettingItem[];
  notification: SettingItem[];
  payment: SettingItem[];
  security: SettingItem[];
  api: SettingItem[];
  auth: SettingItem[];
  social_media: SettingItem[];
  default: SettingItem[];
}

export interface SettingsResponse {
  status: boolean;
  message: string;
  data: SettingsData;
  populer_diseases: PopularDisease[];
  populer_treatments: PopularTreatment[];
  populer_specialties: PopularSpecialty[];
}

// Helper type for getting specific setting value
export type SettingValue<T = any> = T;