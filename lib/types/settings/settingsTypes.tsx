export interface SettingItem {
  id: number;
  lang: string;
  key: string;
  value: string | number | boolean | string[] | object | null;
  type: "string" | "integer" | "decimal" | "boolean" | "array" | "json";
  description: string;
  group: string;
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
}

// Helper type for getting specific setting value
export type SettingValue<T = any> = T;