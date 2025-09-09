export interface SettingItem {
  id: number;
  lang: string;
  key: string;
  value: any;
  type: string;
  description: string;
  group: string;
}

export interface GeneralSettingsData {
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

export interface GeneralSettings {
  app_name: string;
  app_description: string;
  default_language: string;
  default_timezone: string;
  default_currency: string;
  default_country: string;
  email: string;
  phone: string;
  site_logo: string;
  site_online: boolean;
  address: string;
  address_iframe: string | null;
  scrolling_text: string[];
  social_media: Array<{
    name: string;
    url: string;
  }>;
}

export interface GeneralSettingsResponse {
  status: boolean;
  message: string;
  data: GeneralSettingsData;
}
