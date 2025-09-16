import api from '@/lib/axios';
import { Specialist } from './useSpecialists';

export const getSpecialist = async (slug: string): Promise<{ specialist: Specialist | null; error: string | null }> => {
  if (!slug) {
    return { specialist: null, error: 'Uzman slug\'ı gerekli' };
  }

  try {
    const response = await api.get(`http://localhost:3000/api/specialists/${slug}`);
    
    if (response.data.success) {
      return { specialist: response.data.data, error: null };
    } else {
      return { specialist: null, error: response.data.error || 'Uzman verisi yüklenirken hata oluştu' };
    }
  } catch (err: any) {
    // 404 hatası için özel kontrol
    if (err.response?.status === 404) {
      return { specialist: null, error: 'Uzman bulunamadı' };
    }
    return { specialist: null, error: err.response?.data?.error || 'Uzman verisi yüklenirken hata oluştu' };
  }
}; 