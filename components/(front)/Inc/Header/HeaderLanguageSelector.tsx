"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import { useGlobalContext } from "@/app/Context/GlobalContext";

const HeaderLanguageSelector: React.FC = () => {
  const { setSidebarStatus, locale } = useGlobalContext();

  return (
    <div className="relative xl:min-w-max rounded-md border border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 transition-all duration-300 group">
      <CustomButton
        title={locale}
        textStyles="text-base xl:text-lg font-medium uppercase"
        containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-betweenxs py-1 px-2 xl:py-2 xl:px-3"
        handleClick={() => setSidebarStatus("Lang")}
      />
    </div>
  );
};

export default HeaderLanguageSelector; 