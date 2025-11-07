import api from "@/lib/axios";

// Google Calendar OAuth URL'ini almak için
export async function getGoogleCalendarAuthUrl() {
  const res = await api.get("/auth/google-calendar/auth-url");
  return res.data;
}

export const handleGoogleCalendarCallback = async (code: string) => {
  const res = await api.get("/auth/google-calendar/callback", { code });
  return res.data;
};

export const googleCalendarSaveTokenService = async (code: string) => {
  const res = await api.post("/user/google-calendar/token", {
    code,
  });
  return res.data;
};

export const googleCalendarDeleteTokenService = async () => {
  const res = await api.post("/user/google-calendar/disconnect");
  return res.data;
};

export const googleCalendarSyncService = async (code: string) => {
  const res = await api.post("/user/google-calendar/sync-from-calendar", {
    code,
  });
  console.log(res.data);
  return res.data;
};
