export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbol_position: "before" | "after";
  decimal_places: number;
  exchange_rate: string;
  country_code: number | null;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CurrenciesResponse {
  status: boolean;
  data: Currency[];
}
