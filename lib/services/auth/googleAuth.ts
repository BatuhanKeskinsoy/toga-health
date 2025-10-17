import api from "@/lib/axios";

export async function googleAuthService() {
  const res = await api.get("/auth/social/google");
  return res.data;
}