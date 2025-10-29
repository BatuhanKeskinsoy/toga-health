
import React from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useTranslations } from "next-intl";
import { AiOutlineClose } from "react-icons/ai";
import CustomButton from "@/components/Customs/CustomButton";

interface TreatmentsFilterProps {
  currentTreatmentService: any;
  treatmentsServices: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  treatmentServiceSlug?: string;
  locale: string;
  currentPath: string;
}

function TreatmentsFilter({ 
  currentTreatmentService, 
  treatmentsServices, 
  locale,
  currentPath
}: TreatmentsFilterProps) {
  const t = useTranslations();
  const createUrl = (newTreatmentServiceSlug: string) => {
    // Mevcut URL'den location bilgilerini al
    const pathParts = currentPath.split('/').filter(Boolean);
    const pathWithoutLocale = pathParts.slice(1); // Locale'i çıkar
    
    
    // Tedaviler ve Hizmetler sayfasındaysa (tedaviler veya treatments-services)
    if (pathWithoutLocale[0] === 'treatments-services' || pathWithoutLocale[0] === 'tedaviler-hizmetler') {
      let url = `/treatments-services/${newTreatmentServiceSlug}`;
      
      // Mevcut location bilgilerini koru (ülke, şehir, ilçe)
      // pathWithoutLocale[1] = tedaviler veya treatments-services slug'ı, [2] = ülke, [3] = şehir, [4] = ilçe
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
    
    // Diğer sayfalar için sadece tedaviler veya treatments-services değiştir
    return getLocalizedUrl(`/treatments-services/${newTreatmentServiceSlug}`, locale);
  };

  // Tedaviler veya treatments-services filtresini temizle
  const clearTreatmentService = () => {
    // Tedaviler veya treatments-services temizlendiğinde sadece /treatments-services'a git (location bilgilerini de sil)
    window.location.href = getLocalizedUrl('/treatments-services', locale);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <CustomSelect
          id="treatmentService"
          name="treatmentService"
          label={t("Tedaviler ve Hizmetler")}
          value={currentTreatmentService}
          options={treatmentsServices}
          onChange={(option) => {
            if (option) {
              window.location.href = createUrl(option.slug);
            }
          }}
          placeholder={t("Tedavi Seçiniz")}
          disabled={false}
          loading={false}
          className="flex-1"
        />
          {currentTreatmentService && (
          <CustomButton
            handleClick={clearTreatmentService}
            leftIcon={<AiOutlineClose className="text-base" />}
            containerStyles="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export default TreatmentsFilter; 