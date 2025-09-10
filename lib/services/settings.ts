import api from "@/lib/axios";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";

export async function getSettings(): Promise<GeneralSettingsData> {
  
  try {
    const response = await api.get(`/global/settings`);
   
    if (response.data.status) {
      const settings: GeneralSettingsData = response.data.data;
      
      return settings;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching generals:",
      error.response?.data || error.message
    );
   
    throw error;
  }
}

