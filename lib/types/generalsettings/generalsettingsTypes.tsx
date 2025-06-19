export interface VerificationSettings {
  require_email_verification: boolean;
  require_phone_verification: boolean;
  email_verification_expiry: number;
  phone_verification_expiry: number;
}

export interface SocialMedia {
  name: string;
  url: string;
}

export interface GeneralSettings {
  verification_settings: VerificationSettings;
  email: string;
  phone: string;
  site_logo: string;
  site_online: number;
  social_media: SocialMedia[];
  address: string;
  address_iframe: string;
  scrolling_text: string[];
}

export interface GeneralSettingsResponse {
  status: boolean;
  message: string;
  data: GeneralSettings;
}
