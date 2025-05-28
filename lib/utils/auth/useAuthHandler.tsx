"use client";
import { mutate } from "swr";
import { setBearerToken } from "@/lib/axios";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  loginService,
  logoutService,
  registerService,
  forgotPasswordService,
} from "@/lib/utils/auth/authServices";

export function useAuthHandler() {
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const data = await loginService(email, password, rememberMe);
      const { token, user } = data;
      setBearerToken(token);

      mutate("/user/profile", user, false);

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";
      funcSweetAlert({
        title: "Giriş Yapılamadı!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return { success: false };
    }
  };

  const register = async (userData: Parameters<typeof registerService>[0]) => {
    try {
      const data = await registerService(userData);
      funcSweetAlert({
        title: "Kayıt Başarılı!",
        text: data.message,
        icon: "success",
        confirmButtonText: "Tamam",
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errors?.email?.[0] ||
        "Bilinmeyen bir hata oluştu.";
      funcSweetAlert({
        title: "Kayıt Olunamadı!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return { success: false };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const data = await forgotPasswordService(email);
      funcSweetAlert({
        title: "İşlem Başarılı!",
        text: data.message,
        icon: "success",
        confirmButtonText: "Tamam",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";
      funcSweetAlert({
        title: "İşlem Başarısız!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setBearerToken(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

      await mutate("/user/profile", null, { revalidate: false });
    } catch (error: any) {
      console.error("Logout failed:", error?.response || error.message);
    }
  };

  return {
    login,
    register,
    forgotPassword,
    logout,
  };
}
