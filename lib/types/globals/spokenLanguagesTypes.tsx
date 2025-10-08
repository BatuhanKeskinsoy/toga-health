export interface SpokenLanguagesResponse {
  status: boolean;
  data: Record<string, string>;
}

export interface SpokenLanguage {
  code: string;
  name: string;
}