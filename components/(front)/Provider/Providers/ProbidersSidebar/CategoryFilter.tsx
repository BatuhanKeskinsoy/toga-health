import React from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useTranslations } from "next-intl";
import { AiOutlineClose } from "react-icons/ai";
interface CategoryFilterProps {
  currentCategory: any;
  categoryOptions: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  categoryType: string;
  locale: string;
}

function CategoryFilter({
  currentCategory,
  categoryOptions,
  categoryType,
  locale,
}: CategoryFilterProps) {
  const t = useTranslations();
  const createUrl = (newCategoryType: string) => {
    // Kategori değiştiğinde tüm filtreleri sıfırla (sadece ana sayfaya yönlendir)
    if (newCategoryType === "diseases") {
      return getLocalizedUrl("/diseases", locale);
    } else if (newCategoryType === "branches") {
      return getLocalizedUrl("/branches", locale);
    } else if (newCategoryType === "treatments-services") {
      return getLocalizedUrl("/treatments-services", locale);
    }
    return "/";
  };

  // Kategori filtresini temizle (ana sayfaya yönlendir)
  const clearCategory = () => {
    window.location.href = getLocalizedUrl("/", locale);
  };

  return (
    <CustomSelect
      id="category"
      name="category"
      label={t("Kategori")}
      value={currentCategory}
      options={categoryOptions}
      onChange={(option) => {
        if (option) {
          window.location.href = createUrl(option.slug);
        }
      }}
      placeholder={t("Kategori Seçiniz")}
      disabled={false}
      loading={false}
      className="flex-1"
    />
  );
}

export default CategoryFilter;
