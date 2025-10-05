import api from "@/lib/axios";

export interface DoctorProfileData {
  name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  birth_date: string;
  gender: string;
  address: string;
  country: string;
  city: string;
  district: string;
  timezone: string;
  currency: string;
  doctor: {
    type: "specialist" | "general";
    specialty_id: number;
    experience: number;
    description: string;
    map_location: string;
    review_count: number;
    disease_ids: number[];
    treatment_ids: number[];
    service_ids: number[];
    treatments: {
      id: number;
      price: number;
      currency: string;
      experience_years: number;
      notes: string;
      is_primary: boolean;
      is_active: boolean;
    }[];
    services: {
      id: number;
      price: number;
      currency: string;
      duration_minutes: number;
      description: string;
      is_active: boolean;
    }[];
    education: {
      degree: string;
      university: string;
      year: number;
    }[];
    experience_list: {
      position: string;
      hospital: string;
      start_date: string;
      end_date: string | null;
    }[];
    languages: string[];
    certifications: string[];
    consultation_fee: number;
    examination_fee: number;
    appointment_duration: number;
    online_consultation: boolean;
    home_visit: boolean;
    emergency_available: boolean;
    working_days: {
      monday: { open: string; close: string } | { closed: boolean };
      tuesday: { open: string; close: string } | { closed: boolean };
      wednesday: { open: string; close: string } | { closed: boolean };
      thursday: { open: string; close: string } | { closed: boolean };
      friday: { open: string; close: string } | { closed: boolean };
      saturday: { open: string; close: string } | { closed: boolean };
      sunday: { open: string; close: string } | { closed: boolean };
    };
    holidays: string[];
    is_available: boolean;
  };
}

export async function updateDoctorProfile(profileData: DoctorProfileData) {
  const res = await api.post(`/user/profile`, profileData);
  return res.data;
}
