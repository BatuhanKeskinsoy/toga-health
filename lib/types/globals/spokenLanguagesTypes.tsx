export interface SpokenLanguagesResponse {
  status: boolean;
  data: Record<string, string>; // { "en": "English", "tr": "Turkish", ... }
}

export interface SpokenLanguage {
  code: string;
  name: string;
}