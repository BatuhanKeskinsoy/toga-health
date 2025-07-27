import { createAxios } from "@/lib/axios";

export async function getCities(countrySlug: string, locale?: string) {
  // Parametre kontrolü
  if (!countrySlug) {
    throw new Error("Country slug gerekli");
  }
  
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
    const response = await axios.get(`/public/locations/countries/${countrySlug}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching cities:",
      error.response?.data || error.message
    );
    throw error;
  }
}
