import api from "@/lib/axios";

export async function facebookAuthService() {
  const res = await api.get("/auth/social/facebook");
  return res.data;
}

export const facebookAuthCallbackService = async (code: string) => {
  const response = await api.post("/auth/social/facebook/callback", { code });
  return response.data;
};
