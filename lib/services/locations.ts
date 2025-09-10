import api from "@/lib/axios";

export async function getCountries() {
  try {
    const response = await api.get(`/public/locations/countries`);
    if (response.data.status) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching countries:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getCities(countrySlug: string) {
  if (!countrySlug) {
    throw new Error("Country slug gerekli");
  }

  try {
    const response = await api.get(
      `/public/locations/countries/${countrySlug}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching cities:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getDistricts(countrySlug: string, citySlug: string) {
  if (!countrySlug || !citySlug) {
    throw new Error("Country slug ve city slug gerekli");
  }

  try {
    const response = await api.get(
      `/public/locations/countries/${countrySlug}/${citySlug}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching districts:",
      error.response?.data || error.message
    );
    throw error;
  }
}
