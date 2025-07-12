import { axios } from '@/lib/axios';
import { Specialist } from './useSpecialists';

export const getSpecialist = async (slug: string): Promise<{ specialist: Specialist | null; error: string | null }> => {
  if (!slug) {
    return { specialist: null, error: 'Doktor slug\'ı gerekli' };
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/specialists/${slug}`);
    
    if (response.data.success) {
      return { specialist: response.data.data, error: null };
    } else {
      return { specialist: null, error: response.data.error || 'Doktor verisi yüklenirken hata oluştu' };
    }
  } catch (err: any) {
    return { specialist: null, error: err.response?.data?.error || 'Doktor verisi yüklenirken hata oluştu' };
  }
}; 