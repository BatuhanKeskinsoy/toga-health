"use client";
import { mutate } from "swr";
import { setBearerToken } from "@/lib/axios";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  loginService,
  logoutService,
  registerService,
  forgotPasswordService,
  resetPasswordService,
} from "@/lib/utils/auth/authServices";
import Swal from "sweetalert2";

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

      let codeInput: HTMLInputElement | null = null;
      let passwordInput: HTMLInputElement | null = null;
      let passwordConfirmInput: HTMLInputElement | null = null;

      const { isConfirmed, value } = await Swal.fire({
        title: "Şifre Sıfırlama",
        icon: "info",
        html: `
          <p class="mb-2 text-sm">${data.message}</p>
          <input type="number" id="code" class="swal2-input !w-full !mx-0" placeholder="Doğrulama Kodu">
          <input type="password" id="password" class="swal2-input !w-full !mx-0" placeholder="Yeni Şifre">
          <input type="password" id="passwordConfirm" class="swal2-input !w-full !mx-0" placeholder="Yeni Şifre (Tekrar)">
        `,
        didOpen: () => {
          codeInput = document.getElementById(
            "code"
          ) as HTMLInputElement | null;
          passwordInput = document.getElementById(
            "password"
          ) as HTMLInputElement | null;
          passwordConfirmInput = document.getElementById(
            "passwordConfirm"
          ) as HTMLInputElement | null;
        },
        preConfirm: () => {
          const popup = Swal.getPopup();
          if (!popup) return false;

          const codeInput = popup.querySelector<HTMLInputElement>("#code");
          const passwordInput =
            popup.querySelector<HTMLInputElement>("#password");
          const passwordConfirmInput =
            popup.querySelector<HTMLInputElement>("#passwordConfirm");

          const code = codeInput?.value.trim() || "";
          const password = passwordInput?.value.trim() || "";
          const passwordConfirm = passwordConfirmInput?.value.trim() || "";

          if (!code || !password || !passwordConfirm) {
            Swal.showValidationMessage("Tüm alanları doldurun.");
            return false;
          }

          if (password !== passwordConfirm) {
            Swal.showValidationMessage("Şifreler eşleşmiyor.");
            return false;
          }

          return {
            code,
            password,
            password_confirmation: passwordConfirm,
          };
        },
        showCancelButton: true,
        confirmButtonText: "Şifreyi Güncelle",
        cancelButtonText: "Vazgeç",
        focusConfirm: false,
      });

      if (!isConfirmed || !value) {
        console.log("Kullanıcı işlemi iptal etti veya doğrulama başarısız.");
        return;
      }

      const result = await resetPasswordService({
        email,
        code: value.code,
        password: value.password,
        password_confirmation: value.password_confirmation,
      });

      await Swal.fire({
        title: "Şifre Güncellendi!",
        text: result.message,
        icon: "success",
        confirmButtonText: "Tamam",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";
      await Swal.fire({
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
