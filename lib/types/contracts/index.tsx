export interface Language {
  code: string;
  name: string;
  flag: string | null;
}

export interface Contract {
  id: number;
  contract_id: string;
  lang_code: string;
  language: Language;
  title: string;
  slug: string;
  type: string;
  type_label: string;
  status: string;
  status_label: string;
  summary: string;
  require_acceptance: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  content?: string;
  terms?: string | null;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ContractListResponse {
  status: boolean;
  message: string;
  data: Contract[];
  language: string;
  pagination: Pagination;
}

export interface ContractDetailResponse {
  status: boolean;
  message: string;
  data: Contract;
  language: string;
}

