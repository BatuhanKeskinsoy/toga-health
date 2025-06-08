import fs from "fs";
import path from "path";
import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

const OUTPUT_DIR = path.join(process.cwd(), "public", "locales");

async function fetchLanguages() {
  const res = await axios.get(`${baseURL}/public/languages`);
  return res.data.data;
}

async function fetchTranslations(code: string) {
  const res = await axios.get(`${baseURL}/public/languages/${code}/translations`);
  return res.data?.data?.translations || {};
}

async function ensureLocaleDirExists() {
  try {
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
    console.log("📁 'lib/locales' klasörü hazır.");
  } catch (err) {
    throw new Error("Klasör oluşturulurken hata oluştu: " + err);
  }
}

async function writeLocaleFile(code: string, translations: Record<string, string>) {
  const filePath = path.join(OUTPUT_DIR, `${code}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`✔ ${code}.json dosyası oluşturuldu.`);
}

export async function generateLocaleFiles() {
  try {
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
  }
}
