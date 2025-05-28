import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

export async function loginService(email: string, password: string, rememberMe: boolean) {
  const res = await axios.post(`${baseURL}/auth/login`, {
    email,
    password,
    remember: rememberMe,
  });
  return res.data;
}

export async function registerService(userData: {
  name: string;
  email: string;
  password: string;
  kvkk_approved: boolean;
  membership_approved: boolean;
}) {
  const res = await axios.post(`${baseURL}/auth/register`, userData);
  return res.data;
}

export async function forgotPasswordService(email: string) {
  const res = await axios.post(`${baseURL}/auth/forgot-password`, { email });
  return res.data;
}

export async function logoutService() {
  const res = await axios.post(`${baseURL}/user/logout`);
  return res.data;
}
