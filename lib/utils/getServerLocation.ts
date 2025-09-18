import { getServerLocation } from './cookies';
import { Country, City, District } from '@/lib/types/locations/locationsTypes';

// Server-side'da location bilgilerini almak için utility fonksiyon
export async function getServerLocationData(): Promise<{
  country: Country | null;
  city: City | null;
  district: District | null;
}> {
  try {
    const location = await getServerLocation();
    
    if (!location) {
      return {
        country: null,
        city: null,
        district: null
      };
    }

    // Type'ları locationsTypes ile uyumlu hale getir
    const country: Country | null = location.country ? {
      id: location.country.id,
      name: location.country.name,
      slug: location.country.slug,
      code: '', // Default değer
      rewrite: '' // Default değer
    } : null;

    const city: City | null = location.city ? {
      id: location.city.id,
      name: location.city.name,
      slug: location.city.slug,
      country_id: location.country?.id || 0,
      countrySlug: location.city.countrySlug
    } : null;

    const district: District | null = location.district ? {
      id: location.district.id,
      name: location.district.name,
      slug: location.district.slug,
      city_id: location.city?.id || 0,
      citySlug: location.district.citySlug
    } : null;

    return {
      country,
      city,
      district
    };
  } catch (error) {
    console.error('Server location alma hatası:', error);
    return {
      country: null,
      city: null,
      district: null
    };
  }
}
