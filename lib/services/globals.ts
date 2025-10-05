import api from "@/lib/axios";
import { 
  PhoneCodesResponse, 
  LanguagesResponse, 
  TimezonesResponse, 
  CurrenciesResponse 
} from "@/lib/types/globals";

export const getPhoneCodes = async (): Promise<PhoneCodesResponse> => {
  try {
    const response = await api.get("/global/phone-codes");
    return response.data;
  } catch (error) {
    console.error("Get phone codes API error:", error);
    throw error;
  }
};

export const getLanguages = async (): Promise<LanguagesResponse> => {
  try {
    const response = await api.get("/global/languages");
    return response.data;
  } catch (error) {
    console.error("Get languages API error:", error);
    throw error;
  }
};

export const getTimezones = async (): Promise<TimezonesResponse> => {
  try {
    const response = await api.get("/global/timezones");
    return response.data;
  } catch (error) {
    console.error("Get timezones API error:", error);
    throw error;
  }
};

export const getCurrencies = async (): Promise<CurrenciesResponse> => {
  try {
    const response = await api.get("/global/currencies");
    return response.data;
  } catch (error) {
    console.error("Get currencies API error:", error);
    throw error;
  }
};
