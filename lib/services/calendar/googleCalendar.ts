import api from "@/lib/axios";

// Google Calendar OAuth URL'ini almak için
export async function getGoogleCalendarAuthUrl() {
  console.info("[GoogleCalendar] OAuth URL isteği başlatılıyor");
  const res = await api.get("/auth/google-calendar/auth-url");
  console.info("[GoogleCalendar] OAuth URL yanıtı", {
    status: res.status,
    hasData: Boolean(res.data),
  });
  return res.data;
}

export const handleGoogleCalendarCallback = async (code: string) => {
  console.info("[GoogleCalendar] Callback isteği gönderiliyor", {
    codeLength: code?.length ?? 0,
  });
  const res = await api.get("/auth/google-calendar/callback", { code });
  console.info("[GoogleCalendar] Callback yanıtı", {
    status: res.status,
    hasData: Boolean(res.data),
  });
  return res.data;
};

export const googleCalendarSaveTokenService = async (code: string) => {
  console.info("[GoogleCalendar] Token kaydetme isteği gönderiliyor", {
    codeLength: code?.length ?? 0,
  });
  const res = await api.post("/user/google-calendar/token", {
    code,
  });
  console.info("[GoogleCalendar] Token kaydetme yanıtı", {
    status: res.status,
    hasData: Boolean(res.data),
  });
  return res.data;
};

export const googleCalendarDeleteTokenService = async () => {
  console.info("[GoogleCalendar] Token silme isteği gönderiliyor");
  const res = await api.post("/user/google-calendar/disconnect");
  console.info("[GoogleCalendar] Token silme yanıtı", {
    status: res.status,
    hasData: Boolean(res.data),
  });
  return res.data;
};

export const googleCalendarSyncService = async (code: string) => {
  console.info("[GoogleCalendar] Senkronizasyon isteği gönderiliyor", {
    codeLength: code,
  });
  const res = await api.post("/user/google-calendar/sync-from-calendar", {
    code,
  });
  console.info("[GoogleCalendar] Senkronizasyon yanıtı", {
    status: res.status,
    hasData: Boolean(res.data),
  });
  return res.data;
};
