"use client";
import { setBearerToken } from "@/lib/axios";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { googleAuthService, GoogleAuthResponse, GoogleAuthRequest } from "@/lib/services/auth/googleAuth";
import funcParseAxiosError from "@/lib/functions/funcParseAxiosError";
import { useTranslations } from "next-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

export function useGoogleAuth() {
  const t = useTranslations();
  const { refetchNotifications, updateServerUser } = usePusherContext();

  const handleGoogleAuth = async (
    credential: string, 
    userType: "individual" | "doctor" | "corporate" = "individual",
    additionalData?: Partial<GoogleAuthRequest>
  ): Promise<{ success: boolean; isNewUser?: boolean }> => {
    try {
      const userData: GoogleAuthRequest = {
        user_type: userType,
        google_credential: credential,
        ...additionalData
      };

      const data = await googleAuthService(userData);
      
      if (data.success && data.data) {
        const { token, user, is_new_user } = data.data;
        setBearerToken(token, true);

        // User state'ini güncelle
        updateServerUser(user);

        // Cookie'nin güncellenmesi için kısa bir delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Notifications'ı yenile
        refetchNotifications(user.id);

        // Başarı mesajı göster
        funcSweetAlert({
          title: is_new_user ? t("Kayıt Başarılı") : t("Giriş Başarılı"),
          text: data.message,
          icon: "success",
          confirmButtonText: t("Tamam"),
        });

        return { 
          success: true, 
          isNewUser: is_new_user || false 
        };
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (error: any) {
      funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: funcParseAxiosError(error),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
      return { success: false };
    }
  };

  const googleLogin = async (credential: string) => {
    return handleGoogleAuth(credential, "individual");
  };

  const googleRegister = async (credential: string, userType: "individual" | "doctor" | "corporate" = "individual", additionalData?: Partial<GoogleAuthRequest>) => {
    return handleGoogleAuth(credential, userType, additionalData);
  };

  return {
    googleLogin,
    googleRegister,
    handleGoogleAuth,
  };
}
