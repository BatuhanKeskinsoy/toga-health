import api from "@/lib/axios";

interface IndividualProfileData {
  name: string;
  birth_date: string;
  gender: string;
  address: string;
  country: string;
  city: string;
  district: string;
  timezone: string;
  currency: string;
}

export interface DoctorProfileData {
  name: string;
  birth_date: string;
  gender: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
  languages: string[];
  doctor: {
    specialty_id: number;
    settings: any[];
  };
}

export async function updateProfile(profileData: IndividualProfileData) {
  const res = await api.post(`/user/profile`, profileData);
  return res.data;
}

export async function updateDoctorProfile(profileData: DoctorProfileData) {
  const res = await api.post(`/user/profile`, profileData);
  console.log("res", res);
  return res.data;
}