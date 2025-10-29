"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import CustomButton from "@/components/Customs/CustomButton";
import { useLanguages } from "@/lib/hooks/lang/useLanguages";
import { convertUrlToLocalized } from "@/lib/utils/getLocalizedUrl";

function Lang() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const { languages, isLoading } = useLanguages();

  const changeLanguage = async (lang: string) => {
    if (lang === locale) return;

    // Cookie'ye yeni locale'i set et
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;

    const realPathname = typeof window !== 'undefined' ? window.location.pathname : pathname;
    
    // Async convertUrlToLocalized fonksiyonunu await et
    const localizedUrl = await convertUrlToLocalized(realPathname, lang);
    
    const queryString = searchParams.toString();
    const url = queryString ? `${localizedUrl}?${queryString}` : localizedUrl;

    // next-intl router'ı locale değişikliğini doğru şekilde işlemek için locale parametresini geçiyoruz
    router.push(url as any, { locale: lang });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full m-0.5 size-20 border-t-4 border-b-4 border-gray-400 group-hover:border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3 w-full h-[calc(100dvh-77px)] lg:p-8 p-4 overflow-hidden">
      {languages.map(({ code, name }) => (
        <CustomButton
          key={code}
          title={name}
          leftIcon={<i className="text-xl uppercase font-medium">{code}</i>}
          containerStyles={`flex gap-1.5 border border-gray-200 w-full rounded-md text-lg relative w-full flex gap-1.5 items-center justify-between p-4 ${
            code === locale
              ? "bg-sitePrimary text-white"
              : "text-black hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-transparent"
          }`}
          handleClick={() => changeLanguage(code)}
        />
      ))}
    </div>
  );
}

export default Lang;
