import { createAxios } from "@/lib/axios";

export async function getGeneralSettings(locale?: string) {
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
  
  const axios = createAxios(finalLocale);
  
  try {
    const response = await axios.get(`/public/settings`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching generals:",
      error.response?.data || error.message
    );
    throw error;
  }
}
