import api from "@/lib/axios";

export async function getCountries(locale?: string) {
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
    const response = await api.get(`/public/locations/countries`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching countries:",
      error.response?.data || error.message
    );
    throw error;
  }
}
