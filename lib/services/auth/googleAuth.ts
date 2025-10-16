import api from "@/lib/axios";

export async function googleAuthService() {
  const res = await api.get("/auth/social/google");
  return res.data;
}

export async function authWithGoogleCallback(auth_url: string) {
  const res = await api.post(auth_url);
  return res.data;
}
