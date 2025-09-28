
import React from "react";
import CustomSelect from "@/components/others/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useTranslations } from "next-intl";
import { AiOutlineClose } from "react-icons/ai";
import CustomButton from "@/components/others/CustomButton";

interface BranchesFilterProps {
  currentBranch: any;
  branches: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  branchSlug?: string;
  locale: string;
  currentPath: string;
}

function BranchesFilter({ 
  currentBranch, 
  branches, 
  locale,
  currentPath
}: BranchesFilterProps) {
  const t = useTranslations();
  const createUrl = (newBranchSlug: string) => {
    // Mevcut URL'den location bilgilerini al
    const pathParts = currentPath.split('/').filter(Boolean);
    const pathWithoutLocale = pathParts.slice(1); // Locale'i çıkar
    
    
    // Branşlar sayfasındaysa (branşlar veya branches)
    if (pathWithoutLocale[0] === 'branches' || pathWithoutLocale[0] === 'branşlar') {
      let url = `/branches/${newBranchSlug}`;
      
      // Mevcut location bilgilerini koru (ülke, şehir, ilçe)
      // pathWithoutLocale[1] = branşlar slug'ı, [2] = ülke, [3] = şehir, [4] = ilçe
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
    
    // Diğer sayfalar için sadece branşlar değiştir
    return getLocalizedUrl(`/branches/${newBranchSlug}`, locale);
  };

  // Branşlar filtresini temizle
  const clearBranch = () => {
    // Branşlar temizlendiğinde sadece /branches'a git (location bilgilerini de sil)
    window.location.href = getLocalizedUrl('/branches', locale);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <CustomSelect
          id="branch"
          name="branch"
          label={t("Branşlar")}
          value={currentBranch}
          options={branches}
          onChange={(option) => {
            if (option) {
              window.location.href = createUrl(option.slug);
            }
          }}
          placeholder={t("Branş Seçiniz")}
          disabled={false}
          loading={false}
          className="flex-1"
        />
        {currentBranch && (
          <CustomButton
            handleClick={clearBranch}
            leftIcon={<AiOutlineClose className="text-base" />}
            containerStyles="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export default BranchesFilter; 