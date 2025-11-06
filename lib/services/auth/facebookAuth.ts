import api from "@/lib/axios";

export async function facebookAuthService() {
  const res = await api.get("/auth/social/facebook");
  return res.data;
}

export const facebookAuthCallbackService = async (code: string) => {
  const res = await api.get("/auth/social/facebook/callback", { code });
  return res.data;
};
