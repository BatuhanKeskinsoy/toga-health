import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

export async function updateProfile(
  name: string,
  email: string,
  phone: string
) {
  const res = await axios.post(`${baseURL}/user/profile`, {
    name,
    email,
    phone,
  });
  return res.data;
}
