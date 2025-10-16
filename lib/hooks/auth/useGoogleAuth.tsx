"use client";
import { setBearerToken } from "@/lib/axios";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { googleAuthService } from "@/lib/services/auth/googleAuth";
import funcParseAxiosError from "@/lib/functions/funcParseAxiosError";
import { useTranslations } from "next-intl";
import { usePusherContext } from "@/lib/context/PusherContext";
import { authWithGoogleCallback } from "@/lib/services/auth/googleAuth";

export function useGoogleAuth() {
  const t = useTranslations();

  const handleGoogleAuth = async (
  ): Promise<{
    success: boolean;
    user?: any;
    token?: string;
  }> => {
    try {
      const data = await googleAuthService();

      if (data.success && data.auth_url) {
        console.log("Google OAuth URL:", data.auth_url);
        const res = await authWithGoogleCallback(data.auth_url);
        console.log("Google auth callback response (res):", res);

        return {
          success: true,
        };
      } else {
        throw new Error(data.message || "Google auth URL alınamadı");
      }
    } catch (error: any) {
      return { success: false };
    }
  };

  return {
    handleGoogleAuth,
  };
}
