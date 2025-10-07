import { nodeENV } from "@/constants";
import { api } from "@/lib/axios";
import { getLanguages } from "@/lib/services/globals";

export async function fetchLanguages() {
  // Server-side için özel axios instance kullan
  const res = await getLanguages();
  return res.data;
}

async function fetchTranslations(code: string) {
  // Server-side için özel axios instance kullan
  const res = await api.get(`/public/languages/${code}/translations`);
  return res.data?.data?.translations || {};
}

export async function generateLocaleFiles() {
  // Vercel'de fs kullanımı yasak, sadece development'ta çalışır
  if (nodeENV === 'production') {
    console.warn("⚠️ Bu komut production'da çalıştırılamaz. File system kullanımı yasak.");
    return;
  }

  try {
    // Development ortamında çalışacak kod
    const fs = await import('fs');
    const path = await import('path');
    
    const OUTPUT_DIR = path.join(process.cwd(), "public", "locales");

    async function ensureLocaleDirExists() {
      try {
        await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
        console.log("📁 'public/locales' klasörü hazır.");
      } catch (err) {
        throw new Error("Klasör oluşturulurken hata oluştu: " + err);
      }
    }

    async function writeLocaleFile(code: string, translations: Record<string, string>) {
      const filePath = path.join(OUTPUT_DIR, `${code}.json`);
      await fs.promises.writeFile(filePath, JSON.stringify(translations, null, 2), "utf-8");
      console.log(`✔ ${code}.json dosyası oluşturuldu.`);
    }

    await ensureLocaleDirExists();

    const languages = await fetchLanguages();

    for (const lang of languages) {
      if (!lang.code) continue;

      const translations = await fetchTranslations(lang.code);
      await writeLocaleFile(lang.code, translations);
    }

    console.log("✅ Tüm locale dosyaları başarıyla oluşturuldu.");
  } catch (err) {
    console.error("❌ Hata oluştu:", err);
    throw err; // Hatayı yukarı fırlat
  }
}
