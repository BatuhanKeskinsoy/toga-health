import { facebookAuthService } from "@/lib/services/auth/facebookAuth";

export function useFacebookAuth() {
  const handleFacebookAuth = async () => {
    try {
      const data = await facebookAuthService();
      if (data.status && data.data.redirect_url) {
        window.location.href = data.data.redirect_url;
      }
    } catch (error: any) {
      console.error("Facebook auth error:", error);
    }
  };

  return {
    handleFacebookAuth,
  };
}
