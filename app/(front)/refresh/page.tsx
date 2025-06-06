import { generateLocaleFiles } from "@/lib/utils/Lang/generateLocales";

export default async function Page() {
  await generateLocaleFiles();
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-green-600">
        ✅ Locale dosyaları başarıyla oluşturuldu.
      </h1>
    </div>
  );
}
