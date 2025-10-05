import api from "@/lib/axios";

interface IndividualProfileData {
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
}

export async function updateProfile(profileData: IndividualProfileData) {
  const res = await api.post(`/user/profile`, profileData);
  return res.data;
}
