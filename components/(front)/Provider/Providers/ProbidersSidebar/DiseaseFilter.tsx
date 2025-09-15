
import React from "react";
import CustomSelect from "@/components/others/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getTranslations } from "next-intl/server";

interface DiseaseFilterProps {
  currentDisease: any;
  diseases: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  diseaseSlug?: string;
  locale: string;
}

async function DiseaseFilter({ 
  currentDisease, 
  diseases, 
  diseaseSlug, 
  locale 
}: DiseaseFilterProps) {
  const t = await getTranslations({ locale });
  const createUrl = (newDiseaseSlug: string) => {
    // Mevcut URL'den location bilgilerini al
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const pathWithoutLocale = pathParts.slice(1); // Locale'i çıkar
    
    // Hastalık sayfasındaysa
    if (pathWithoutLocale[0] === 'diseases') {
      let url = `/diseases/${newDiseaseSlug}`;
      
      // Mevcut location bilgilerini koru (ülke, şehir, ilçe)
      if (pathWithoutLocale.length > 2) {
        // Ülke varsa ekle
        if (pathWithoutLocale[2]) {
          url += `/${pathWithoutLocale[2]}`;
          
          // Şehir varsa ekle
          if (pathWithoutLocale[3]) {
            url += `/${pathWithoutLocale[3]}`;
            
            // İlçe varsa ekle
            if (pathWithoutLocale[4]) {
              url += `/${pathWithoutLocale[4]}`;
            }
          }
        }
      }
      
      return getLocalizedUrl(url, locale);
    }
    
    // Diğer sayfalar için sadece hastalık değiştir
    return getLocalizedUrl(`/diseases/${newDiseaseSlug}`, locale);
  };

  return (
    <div className="flex flex-col gap-2">
      <CustomSelect
        id="disease"
        name="disease"
        label={t("Hastalık")}
        value={currentDisease}
        options={diseases}
        onChange={(option) => {
          if (option) {
            window.location.href = createUrl(option.slug);
          }
        }}
        placeholder={t("Hastalık Seçiniz")}
        disabled={false}
        loading={false}
        className="w-full"
      />
    </div>
  );
}

export default DiseaseFilter; 