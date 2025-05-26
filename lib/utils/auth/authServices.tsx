import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";
import { toast } from "react-toastify";

export async function login(
  email: string,
  password: string,
  rememberMe: boolean
) {
  try {
    const res = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
      remember: rememberMe,
    });
    return res;
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "API Hatası");
  }
}
