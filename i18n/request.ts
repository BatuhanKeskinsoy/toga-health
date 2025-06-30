import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import fs from "fs";
import path from "path";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  let messages = {};
  
  try {
    // Locale dosyasını fs ile oku
    const filePath = path.join(process.cwd(), "public", "locales", `${locale}.json`);
    
    // Dosyanın var olup olmadığını kontrol et
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      messages = JSON.parse(fileContent);
    } else {
      console.warn(`⚠️ Locale dosyası bulunamadı: ${locale}.json. Varsayılan değerler kullanılıyor.`);
    }
  } catch (error) {
    // Dosya bulunamazsa boş obje kullan
    console.warn(`⚠️ Locale dosyası okuma hatası: ${error}. Varsayılan değerler kullanılıyor.`);
    messages = {};
  }

  return {
    locale,
    messages,
  };
});
