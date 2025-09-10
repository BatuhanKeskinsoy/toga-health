import api from "@/lib/axios";
import { 
  Country, 
  City, 
  District
} from "@/lib/types/locations/locationsTypes";

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await api.get(`/locations/countries`);
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

export async function getCities(countrySlug: string): Promise<{
  country: {
    id: number;
    name: string;
    slug: string;
    code: string;
  };
  cities: City[];
}> {
  if (!countrySlug) {
    throw new Error("Country slug gerekli");
  }

  try {
    const response = await api.get(
      `/locations/countries/${countrySlug}`
    );
    if (response.data.status) {
      const data = response.data.data;
      // Backward compatibility için countrySlug ekle
      const citiesWithCountrySlug = data.cities.map((city: any) => ({
        ...city,
        countrySlug: countrySlug
      }));
      return {
        ...data,
        cities: citiesWithCountrySlug
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching cities:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getDistricts(countrySlug: string, citySlug: string): Promise<{
  country: {
    id: number;
    name: string;
    slug: string;
  };
  city: {
    id: number;
    name: string;
    slug: string;
    country_id: number;
  };
  districts: District[];
}> {
  if (!countrySlug || !citySlug) {
    throw new Error("Country slug ve city slug gerekli");
  }

  try {
    const response = await api.get(
      `/locations/countries/${countrySlug}/${citySlug}`
    );
    if (response.data.status) {
      const data = response.data.data;
      // Backward compatibility için citySlug ekle
      const districtsWithCitySlug = data.districts.map((district: any) => ({
        ...district,
        citySlug: citySlug
      }));
      return {
        ...data,
        districts: districtsWithCitySlug
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching districts:",
      error.response?.data || error.message
    );
    throw error;
  }
}
