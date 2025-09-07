import { getServerLocation } from './cookies';

// Server-side'da location bilgilerini almak için utility fonksiyon
export async function getServerLocationData() {
  try {
    const location = await getServerLocation();
    
    if (!location) {
      return {
        country: null,
        city: null,
        district: null
      };
    }

    return {
      country: location.country,
      city: location.city,
      district: location.district
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
