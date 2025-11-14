export interface ExpertTitle {
  id: number;
  lang_code: string;
  code: string;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ExpertTitlesResponse {
  status: boolean;
  data: ExpertTitle[];
}

