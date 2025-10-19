import { facebookAuthService } from "@/lib/services/auth/facebookAuth";

export function useFacebookAuth() {
  const handleFacebookAuth = async () => {
    try {
      const data = await facebookAuthService();
      console.log(data);
      if (data.success && data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error: any) {
      console.error("Facebook auth error:", error);
    }
  };

  return {
    handleFacebookAuth,
  };
}
