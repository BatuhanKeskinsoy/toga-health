import { axios } from '@/lib/axios';

export interface Specialist {
  id: string;
  slug: string;
  name: string;
  type: "specialist";
  specialty: string;
  photo: string;
  rating: number;
  experience: string;
  description: string;
  education: string[];
  experienceList: string[];
  specialties: string[];
  isAvailable: boolean;
  addresses: {
    id: string;
    name: string;
    address: string;
    phone: string;
    isDefault: boolean;
    isActive: boolean;
  }[];
}

export const getSpecialists = async (): Promise<{ specialists: Specialist[]; error: string | null }> => {
  try {
    const response = await axios.get('http://localhost:3000/api/specialists');
    
    if (response.data.success) {
      return { specialists: response.data.data, error: null };
    } else {
      return { specialists: [], error: response.data.error || 'Doktor verileri yüklenirken hata oluştu' };
    }
  } catch (err: any) {
    return { specialists: [], error: err.response?.data?.error || 'Doktor verileri yüklenirken hata oluştu' };
  }
}; 