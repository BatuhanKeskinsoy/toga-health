// Locale dosyalarını doğrudan import et (Vercel uyumlu)
import tr from "@/public/locales/tr.json";
import en from "@/public/locales/en.json";
import ar from "@/public/locales/ar.json";
import he from "@/public/locales/he.json";

export const locales = {
  tr,
  en,
  ar,
  he,
};

export type Locale = keyof typeof locales;
