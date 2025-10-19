import { googleAuthService } from "@/lib/services/auth/googleAuth";

export function useGoogleAuth() {
  const handleGoogleAuth = async () => {
    try {
      const data = await googleAuthService();
        if (data.success && data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
    }
  };

  return {
    handleGoogleAuth,
  };
}
