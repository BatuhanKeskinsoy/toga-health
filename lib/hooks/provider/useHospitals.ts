import api from '@/lib/axios';
import { Specialist } from './useSpecialists';

export interface Hospital {
  id: string;
  slug: string;
  name: string;
  type: "hospital";
  photo: string;
  rating: number;
  experience: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  reviewCount: number;
  branches: string[];
  facilities: string[];
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  isAvailable: boolean;
  addresses: {
    id: string;
    name: string;
    address: string;
    isDefault: boolean;
    isActive: boolean;
  }[];
  specialists?: Specialist[];
}

export const getHospitals = async (): Promise<{ hospitals: Hospital[]; error: string | null }> => {
  try {
    const response = await api.get('http://localhost:3000/api/hospitals');
    
    if (response.data.success) {
      return { hospitals: response.data.data, error: null };
    } else {
      return { hospitals: [], error: response.data.error || 'Hastane verileri yüklenirken hata oluştu' };
    }
  } catch (err: any) {
    return { hospitals: [], error: err.response?.data?.error || 'Hastane verileri yüklenirken hata oluştu' };
  }
}; 