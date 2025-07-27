import { createAxios } from "@/lib/axios";

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
  
  const axios = createAxios(finalLocale);
  
  try {
    const response = await axios.get(`/public/locations/countries`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching countries:",
      error.response?.data || error.message
    );
    throw error;
  }
}
