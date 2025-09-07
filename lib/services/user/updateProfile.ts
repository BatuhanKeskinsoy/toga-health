import api from "@/lib/axios";

export async function updateProfile(
  name: string,
  email: string,
  phone: string
) {
  const res = await api.post(`/user/profile`, {
    name,
    email,
    phone,
  });
  return res.data;
}
