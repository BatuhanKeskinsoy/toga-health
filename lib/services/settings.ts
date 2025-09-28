import api from "@/lib/axios";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";

export const getSettings = async (): Promise<SettingsResponse> => {
  try {
    const response = await api.get("/public/settings");
    return response.data;
  } catch (error) {
    console.error("Get settings API error:", error);
    throw error;
  }
};