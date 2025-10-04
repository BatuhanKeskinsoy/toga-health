import api from "@/lib/axios";
import { UserTypes } from "@/lib/types/user/UserTypes";

export async function updateProfile(profileData: UserTypes) {
  const res = await api.post(`/user/profile`, profileData);
  return res.data;
}
