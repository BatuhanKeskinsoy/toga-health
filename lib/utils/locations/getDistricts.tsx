import { api } from "@/lib/axios";

export async function getDistricts(countrySlug: string, citySlug: string, locale?: string) {
  // Parametre kontrolü
  if (!countrySlug || !citySlug) {
    throw new Error("Country slug ve city slug gerekli");
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
  
  try {
    const response = await api.get(`/public/locations/countries/${countrySlug}/${citySlug}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching districts:",
      error.response?.data || error.message
    );
    throw error;
  }
}
