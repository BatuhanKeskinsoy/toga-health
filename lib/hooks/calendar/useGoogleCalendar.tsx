import { getGoogleCalendarAuthUrl } from "@/lib/services/calendar/googleCalendar";

export function useGoogleCalendar() {
  const handleGoogleCalendar = async () => {
    try {
      const data = await getGoogleCalendarAuthUrl();
      if (data.status && data.data?.auth_url) {
        window.location.href = data.data.auth_url;
      }
    } catch (error: any) {
      console.error("Google Calendar auth error:", error);
    }
  };

  return {
    handleGoogleCalendar,
  };
}

