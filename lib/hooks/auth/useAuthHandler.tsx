"use client";
import { setBearerToken } from "@/lib/axios";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  loginService,
  logoutService,
  registerService,
  forgotPasswordService,
  resetPasswordService,
} from "@/lib/services/auth/auth";
import Swal from "sweetalert2";
import funcParseAxiosError from "@/lib/functions/funcParseAxiosError";
import { useTranslations } from "next-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

export function useAuthHandler() {
  const t = useTranslations();
  const { refetchNotifications, updateServerUser } = usePusherContext();
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const data = await loginService(email, password, rememberMe);
      const { data: responseData } = data;
      const { token, user } = responseData;
      setBearerToken(token, rememberMe);

      // User state'ini güncelle
      updateServerUser(user);

      // Cookie'nin güncellenmesi için kısa bir delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Notifications'ı yenile
      refetchNotifications(user.id);
      
      return { success: true };
    } catch (error: any) {
      funcSweetAlert({
        title: t("Giriş Yapılamadı"),
        text: funcParseAxiosError(error),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
      return { success: false };
    }
  };

  const register = async (userData: Parameters<typeof registerService>[0]) => {
    try {
      const data = await registerService(userData);
      funcSweetAlert({
        title: t("Kayıt Başarılı"),
        text: data.message,
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
      return { success: true };
    } catch (error: any) {
      funcSweetAlert({
        title: t("Kayıt Olunamadı"),
        text: funcParseAxiosError(error),
        icon: "error",
        confirmButtonText: t("Tamam"),
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
        title: t("Şifre Sıfırlama"),
        icon: "info",
        html: `
          <p class="mb-2 text-sm">${data.message}</p>
          <input type="number" id="code" class="swal2-input !w-full !mx-0" placeholder="${t("Doğrulama Kodu")}">
          <input type="password" id="password" class="swal2-input !w-full !mx-0" placeholder="${t("Yeni Şifre")}">
          <input type="password" id="passwordConfirm" class="swal2-input !w-full !mx-0" placeholder="${t("Yeni Şifre (Tekrar)")}">
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
            Swal.showValidationMessage(t("Tüm alanları doldurun"));
            return false;
          }

          if (password !== passwordConfirm) {
            Swal.showValidationMessage(t("Şifreler eşleşmiyor"));
            return false;
          }

          return {
            code,
            password,
            password_confirmation: passwordConfirm,
          };
        },
        showCancelButton: true,
        confirmButtonText: t("Şifreyi Güncelle"),
        cancelButtonText: t("Vazgeç"),
        focusConfirm: false,
      });

      if (!isConfirmed || !value) {
        return;
      }

      const result = await resetPasswordService({
        email,
        code: value.code,
        password: value.password,
        password_confirmation: value.password_confirmation,
      });

      await Swal.fire({
        title: t("Şifre Güncellendi"),
        text: result.message,
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      await Swal.fire({
        title: t("İşlem Başarısız"),
        text: funcParseAxiosError(error),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setBearerToken(null);

      // User state'ini temizle
      updateServerUser(null);
    } catch (error: any) {
      console.error("Logout failed:", error?.response || error.message);
      // Hata olsa bile client state'i temizle
      updateServerUser(null);
    }
  };

  return {
    login,
    register,
    forgotPassword,
    logout,
  };
}
