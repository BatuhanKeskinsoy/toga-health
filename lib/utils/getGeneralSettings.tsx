import api from "@/lib/axios";

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
  
  try {
    const response = await api.get(`/global/settings`);
    if (response.data.success) {
      return response.data.data;
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
