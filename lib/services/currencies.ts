import api from "@/lib/axios";

// Currency interface
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbol_position: "before" | "after";
  decimal_places: number;
  exchange_rate: string;
  country_code: string;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
}

// Currencies list
export async function getCurrencies(): Promise<Currency[]> {
  try {
    const response = await api.get("/global/currencies");
    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error("Error fetching currencies:", error.response?.data || error.message);
    throw error;
  }
}