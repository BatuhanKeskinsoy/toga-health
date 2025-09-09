import api from "@/lib/axios";
import { GeneralSettings, GeneralSettingsData } from "@/lib/types/generalsettings/generalsettingsTypes";

export async function getGeneralSettings(locale?: string): Promise<GeneralSettings> {
  // Eğer locale parametresi verilmişse onu kullan, yoksa server-side detection yap
  let finalLocale = locale;
  
  if (!finalLocale) {
    try {
      const { getLocale } = await import("next-intl/server");
      finalLocale = await getLocale();
    } catch (error) {
      finalLocale = "en";
    }
  }
  
  try {
    const response = await api.get(`/global/settings`);
   
    if (response.data.status) {
      const rawData: GeneralSettingsData = response.data.data;
      
      // API'den gelen gruplu veriyi düzleştir
      const processedData: GeneralSettings = {
        app_name: rawData.general.find(item => item.key === "app_name")?.value || "",
        app_description: rawData.general.find(item => item.key === "app_description")?.value || "",
        default_language: rawData.general.find(item => item.key === "default_language")?.value || "tr",
        default_timezone: rawData.general.find(item => item.key === "default_timezone")?.value || "Europe/Istanbul",
        default_currency: rawData.general.find(item => item.key === "default_currency")?.value || "TRY",
        default_country: rawData.general.find(item => item.key === "default_country")?.value || "TR",
        email: rawData.general.find(item => item.key === "email")?.value || "",
        phone: rawData.general.find(item => item.key === "phone")?.value || "",
        site_logo: rawData.general.find(item => item.key === "site_logo")?.value || "",
        site_online: rawData.general.find(item => item.key === "site_online")?.value || false,
        address: rawData.default.find(item => item.key === "address")?.value || "",
        address_iframe: rawData.default.find(item => item.key === "address_iframe")?.value || null,
        scrolling_text: rawData.default.find(item => item.key === "scrolling_text")?.value || [],
        social_media: rawData.social_media.map(item => ({
          name: item.key,
          url: item.value
        }))
      };
      
      return processedData;
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
