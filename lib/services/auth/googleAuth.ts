import api from "@/lib/axios";

export async function googleAuthService() {
  const res = await api.get("/auth/social/google");
  return res.data;
}

export const googleAuthCallbackService = async (code: string) => {
  const response = await api.post("/auth/social/google/callback", { code });
  return response.data;
};