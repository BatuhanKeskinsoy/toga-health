export interface Timezone {
  id: number;
  name: string;
  offset: string;
  abbreviation: string;
  country_code: number | null;
  region: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimezonesResponse {
  status: boolean;
  data: Timezone[];
}
