export interface SpecialtyTranslation {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  flag: string | null;
  direction: string;
  is_default: boolean;
  status: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  translations: SpecialtyTranslation[];
  language: Language;
  parent: Specialty | null;
}

export interface SpecialtiesResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Specialty[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
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
