import api from "@/lib/axios";

export async function googleAuthService() {
  const res = await api.get("/auth/social/google");
  return res.data;
}

export const googleAuthCallbackService = async (code: string) => {
  const res = await api.get("/auth/social/google/callback", { code });
  return res.data;
};

export const googleCalendarSyncService = async (code: string) => {
  const res = await api.post("/user/google-calendar/sync-from-calendar", { code });
  console.log("googleCalendarSyncService", res.data);
  return res.data;
};
