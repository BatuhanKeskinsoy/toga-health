import React from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import CustomButton from "@/components/others/CustomButton";
import { useLanguages } from "@/lib/hooks/lang/useLanguages";

function Lang() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { languages, isLoading } = useLanguages();

  const changeLanguage = (lang: string) => {
    if (lang === locale) return;

    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { locale: lang });
  };

  if (isLoading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="relative flex flex-col gap-3 w-full h-[calc(100dvh-77px)] lg:p-8 p-4 overflow-hidden">
      {languages.map(({ code, name }) => (
        <CustomButton
          key={code}
          title={name}
          leftIcon={<i className="text-xl uppercase font-medium">{code}</i>}
          containerStyles={`flex gap-1.5 border border-gray-200 w-full rounded-lg text-lg relative w-full flex gap-1.5 items-center justify-between p-4 ${
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
