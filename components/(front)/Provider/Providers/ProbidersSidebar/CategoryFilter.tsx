import React from "react";
import CustomSelect from "@/components/others/CustomSelect";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getTranslations } from "next-intl/server";
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

async function CategoryFilter({ 
  currentCategory, 
  categoryOptions, 
  categoryType, 
  locale 
}: CategoryFilterProps) {
  const t = await getTranslations({ locale });
  const createUrl = (newCategoryType: string) => {
    if (newCategoryType === "diseases") {
      return getLocalizedUrl("/diseases", locale);
    } else if (newCategoryType === "branches") {
      return getLocalizedUrl("/branches", locale);
    } else if (newCategoryType === "treatments-services") {
      return getLocalizedUrl("/treatments-services", locale);
    }
    return "/";
  };

  return (
    <div className="flex flex-col gap-2">
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
        className="w-full"
      />
    </div>
  );
}

export default CategoryFilter; 