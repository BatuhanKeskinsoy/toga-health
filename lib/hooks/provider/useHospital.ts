import { axios } from '@/lib/axios';
import { Hospital } from './useHospitals';

export const getHospital = async (slug: string): Promise<{ hospital: Hospital | null; error: string | null }> => {
  if (!slug) {
    return { hospital: null, error: 'Hastane slug\'ı gerekli' };
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/hospitals/${slug}`);
    
    if (response.data.success) {
      return { hospital: response.data.data, error: null };
    } else {
      return { hospital: null, error: response.data.error || 'Hastane verisi yüklenirken hata oluştu' };
    }
  } catch (err: any) {
    return { hospital: null, error: err.response?.data?.error || 'Hastane verisi yüklenirken hata oluştu' };
  }
}; 