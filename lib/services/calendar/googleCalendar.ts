import api from "@/lib/axios";

// Google Calendar OAuth URL'ini almak için
export async function getGoogleCalendarAuthUrl() {
  const res = await api.get("/auth/google-calendar/auth-url");
  return res.data;
}

export const handleGoogleCalendarCallback = async (code: string) => {
  const res = await api.post("/auth/google-calendar/callback", { code });
  return res.data;
};