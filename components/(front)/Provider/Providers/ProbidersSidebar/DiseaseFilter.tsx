
import React from "react";
import CustomSelect from "@/components/others/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useTranslations } from "next-intl";
import { AiOutlineClose } from "react-icons/ai";

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
  currentPath: string;
}

function DiseaseFilter({ 
  currentDisease, 
  diseases, 
  diseaseSlug, 
  locale,
  currentPath
}: DiseaseFilterProps) {
  const t = useTranslations();
  const createUrl = (newDiseaseSlug: string) => {
    // Mevcut URL'den location bilgilerini al
    const pathParts = currentPath.split('/').filter(Boolean);
    const pathWithoutLocale = pathParts.slice(1); // Locale'i çıkar
    
    
    // Hastalık sayfasındaysa (hastaliklar veya diseases)
    if (pathWithoutLocale[0] === 'diseases' || pathWithoutLocale[0] === 'hastaliklar') {
      let url = `/diseases/${newDiseaseSlug}`;
      
      // Mevcut location bilgilerini koru (ülke, şehir, ilçe)
      // pathWithoutLocale[1] = hastalık slug'ı, [2] = ülke, [3] = şehir, [4] = ilçe
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

  // Hastalık filtresini temizle
  const clearDisease = () => {
    // Hastalık temizlendiğinde sadece /diseases'a git (location bilgilerini de sil)
    window.location.href = getLocalizedUrl('/diseases', locale);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
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
          className="flex-1"
        />
        {currentDisease && (
          <button
            onClick={clearDisease}
            className="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            title="Hastalık filtresini temizle"
          >
            <AiOutlineClose className="text-base" />
          </button>
        )}
      </div>
    </div>
  );
}

export default DiseaseFilter; 