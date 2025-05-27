import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

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
    //toast.error(err.response?.data?.message || "API Hatası");
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  position: string,
  kvkk_approved: boolean,
  membership_approved: boolean
) {
  try {
    const res = await axios.post(`${baseURL}/auth/register`, {
      name,
      email,
      password,
      position,
      kvkk_approved,
      membership_approved,
    });
    return res;
  } catch (err: any) {
    console.error(err);
    //toast.error(err.response?.data?.message || "API Hatası");
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await axios.post(`${baseURL}/auth/forgot-password`, {
      email,
    });
    return res;
  } catch (err: any) {
    console.error(err);
    //toast.error(err.response?.data?.message || "API Hatası");
  }
}
