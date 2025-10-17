import { googleAuthService } from "@/lib/services/auth/googleAuth";

export function useGoogleAuth() {
  const handleGoogleAuth = async () => {
    try {
      const data = await googleAuthService();
      console.log(data);
      if (data.success && data.auth_url) {
        // Callback URL'ini frontend callback sayfasına yönlendirecek şekilde değiştir
        const authUrl = new URL(data.auth_url);
        authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
        
        window.location.href = authUrl.toString();
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
    }
  };

  return {
    handleGoogleAuth,
  };
}
