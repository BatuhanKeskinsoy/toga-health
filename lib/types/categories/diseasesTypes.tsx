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
}

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
  specialty: Specialty;
  parent: Disease | null;
  children: Disease[];
}

export interface DiseasesResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Disease[];
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
