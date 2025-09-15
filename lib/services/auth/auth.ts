import api, { csrf } from "@/lib/axios";

export async function loginService(
  email: string,
  password: string,
  rememberMe: boolean
) {
  const res = await api.post(`/auth/login`, {
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
  password_confirmation: string;
  phone: string;
  user_type: string;
}) {
  const res = await api.post(`/auth/register`, userData);
  return res.data;
}

export async function forgotPasswordService(email: string) {
  const res = await api.post(`/auth/forgot-password`, { email });
  return res.data;
}

export const resetPasswordService = async ({
  email,
  code,
  password,
  password_confirmation,
}: {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await api.post("/auth/reset-password", {
    email,
    code,
    password,
    password_confirmation,
  });

  return response.data;
};

export async function logoutService() {
  const res = await api.post(`/user/logout`);
  return res.data;
}
