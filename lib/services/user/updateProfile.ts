import api from "@/lib/axios";

// Doctor profile data interface
interface DoctorProfileData {
  // Kişisel Bilgiler
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  country: string | null;
  city: string | null;
  district: string | null;
  
  // Doktor Bilgileri
  type: string;
  specialty_id: string;
  experience: string;
  description: string;
  map_location: string;
  languages: string[];
  certifications: string[];
  consultation_fee: string;
  examination_fee: string;
  appointment_duration: string;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  working_days: string[];
  
  // Çalışma Saatleri
  working_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string } | { closed: boolean };
  };
  
  // Eğitim
  education: Array<{
    degree: string;
    university: string;
    year: string;
  }>;
  
  // Deneyim
  experience_list: Array<{
    position: string;
    hospital: string;
    start_date: string;
    end_date: string;
  }>;
}

// Corporate profile data interface
interface CorporateProfileData {
  // Temel Bilgiler
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string | null;
  city: string | null;
  district: string | null;
  
  // Kurumsal Bilgiler
  type: string;
  experience: string;
  description: string;
  location: string;
  website: string;
  languages: string[];
  certifications: string[];
  facilities: string[];
  
  // Çalışma Saatleri
  working_hours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  
  // Hizmet Ücretleri
  services_pricing: {
    konsultasyon: string;
    muayene: string;
    ameliyat: string;
  };
  
  // Şubeler
  branches: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  
  // Hizmet Seçenekleri
  appointment_duration: string;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  "24_7_available": boolean;
  working_days: string[];
  is_verified: boolean;
}

// Individual profile data interface
interface IndividualProfileData {
  name: string;
  email: string;
  phone: string;
  birth_date?: string;
  gender?: string;
  address?: string;
}

type ProfileData = DoctorProfileData | CorporateProfileData | IndividualProfileData;

export async function updateProfile(
  profileData: ProfileData,
  user_type: 'doctor' | 'corporate' | 'individual'
) {
  // Check if there are any File objects in the data (indicating multipart needed)
  const hasFiles = JSON.stringify(profileData).includes('File');
  
  if (hasFiles) {
    // Use FormData for multipart/form-data
    const formData = new FormData();
    
    // Add user_type
    formData.append('user_type', user_type);
    
    // Add all other fields
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          // Handle arrays
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else if (typeof item === 'object') {
              formData.append(`${key}[${index}]`, JSON.stringify(item));
            } else {
              formData.append(`${key}[${index}]`, item.toString());
            }
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    const res = await api.post(`/user/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } else {
    // Use JSON for regular data
    const res = await api.post(`/user/profile`, {
      ...profileData,
      user_type
    });
    return res.data;
  }
}

// Convenience functions for specific user types
export async function updateDoctorProfile(profileData: DoctorProfileData) {
  return updateProfile(profileData, 'doctor');
}

export async function updateCorporateProfile(profileData: CorporateProfileData) {
  return updateProfile(profileData, 'corporate');
}

export async function updateIndividualProfile(profileData: IndividualProfileData) {
  return updateProfile(profileData, 'individual');
}
