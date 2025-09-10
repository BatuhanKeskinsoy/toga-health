"use client";
import React, { useEffect, useState } from "react";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";
import HeaderTopBanner from "./HeaderTopBanner";
import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderUserActions from "./HeaderUserActions";
import HeaderLanguageSelector from "./HeaderLanguageSelector";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";

interface HeaderProps {
  generals: GeneralSettingsData;
  translations: {
    Anasayfa: string;
    Hakkimizda: string;
    Iletisim: string;
    GirisYap: string;
  };
}

function Header({ generals, translations }: HeaderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div>
        <div className="bg-gray-200 w-full">
          <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
            <div className="relative overflow-hidden w-full h-full flex items-center">
              <div className="flex gap-8 min-w-max whitespace-nowrap text-xs">
                {generals.default.find(item => item.key === "scrolling_text")?.value?.map((msg: string, index: number) => (
                  <span key={`${msg}-${index}`}>{msg}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <header className="shadow-md shadow-gray-200 bg-white">
          <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto px-4 w-full">
            <div className="flex items-center">
              <span className="text-lg font-bold">{translations.Anasayfa}</span>
            </div>
            <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
              <span className="text-sm">{translations.GirisYap}</span>
              <span className="text-sm uppercase">EN</span>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div>
      <HeaderTopBanner generals={generals} />
      <header className="shadow-md shadow-gray-200 bg-white">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto px-4 w-full">
          <HeaderLogo generals={generals} homeText={translations.Anasayfa} />
          <HeaderNavigation translations={translations} />
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
            <HeaderUserActions translations={translations} />
            <HeaderLanguageSelector />
          </div>
        </div>
        <Sidebar />
      </header>
    </div>
  );
}

export default Header;
