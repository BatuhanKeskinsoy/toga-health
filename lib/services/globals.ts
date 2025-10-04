import api from "@/lib/axios";
import { PhoneCodesResponse } from "@/lib/types/globals/phoneCodesTypes";

export const getPhoneCodes = async (): Promise<PhoneCodesResponse> => {
  try {
    const response = await api.get("/global/phone-codes");
    return response.data;
  } catch (error) {
    console.error("Get phone codes API error:", error);
    throw error;
  }
};