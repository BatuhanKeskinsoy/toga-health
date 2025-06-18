import { axios } from "@/lib/axios";

export async function updateProfile(
  name: string,
  email: string,
  phone: string
) {
  const res = await axios.post(`/user/profile`, {
    name,
    email,
    phone,
  });
  return res.data;
}
