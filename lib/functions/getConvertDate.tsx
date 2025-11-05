export function convertDate(date: Date, locale: string): string {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

// Sadece tarih (gün, ay, yıl)
export function convertDateOnly(date: Date, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Sadece saat (HH:MM)
export function convertTimeOnly(date: Date, locale: string): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
  