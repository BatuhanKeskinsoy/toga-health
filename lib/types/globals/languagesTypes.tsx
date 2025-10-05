export interface Language {
  id: number;
  name: string;
  code: string;
  flag: string | null;
  direction: "ltr" | "rtl";
  is_default: boolean;
  status: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LanguagesResponse {
  status: boolean;
  data: Language[];
}
