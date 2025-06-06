import fs from "fs";
import path from "path";
import axios from "axios";
import { baseURL } from "@/constants";

const OUTPUT_DIR = path.join(process.cwd(), "locales");

async function fetchLanguages() {
  const res = await axios.get(`${baseURL}/public/languages`);
  return res.data.data;
}

async function fetchTranslations(code: string) {
  const res = await axios.get(`${baseURL}/public/languages/${code}/translations`);
  return res.data?.data?.translations || {};
}

async function writeLocaleFile(code: string, translations: Record<string, string>) {
  const filePath = path.join(OUTPUT_DIR, `${code}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`✔ ${code}.json dosyası oluşturuldu.`);
}

export async function generateLocaleFiles() {
  try {
    const languages = await fetchLanguages();

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
      console.log("📁 'locales' klasörü oluşturuldu.");
    }

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