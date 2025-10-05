import api from "@/lib/axios";
import { PhoneCodesResponse } from "@/lib/types/globals/phoneCodesTypes";
import { LanguagesResponse } from "@/lib/types/globals/languagesTypes";

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