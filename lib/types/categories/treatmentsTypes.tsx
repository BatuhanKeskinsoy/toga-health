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

export interface Treatment {
  id: number;
  name: string;
  slug: string;
  description: string;
  lang_code: string;
  parent_id: number | null;
  specialty_id: number;
  diseases: any[]; // Disease array'i için ayrı type tanımlanabilir
  procedures: string[];
  contraindications: string[];
  side_effects: string[];
  duration: string;
  cost_range: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  specialty: Specialty;
  parent: Treatment | null;
  children: Treatment[];
}

export interface TreatmentsResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Treatment[];
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
