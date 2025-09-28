import React from "react";
import { SettingsData } from "@/lib/types/settings/settingsTypes";
import { UserTypes } from "@/lib/types/user/UserTypes";
import HeaderTopBanner from "./HeaderTopBanner";
import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderUserActions from "./HeaderUserActions";
import HeaderLanguageSelector from "./HeaderLanguageSelector";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";

interface HeaderProps {
  generals: SettingsData;
  translations: {
    Anasayfa: string;
    Hakkimizda: string;
    Iletisim: string;
    GirisYap: string;
  };
  user?: UserTypes | null;
}

function Header({ generals, translations, user }: HeaderProps) {
  return (
    <>
      <HeaderTopBanner generals={generals} />
      <header className="relative shadow-md shadow-gray-200 bg-white z-20">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto max-lg:px-4 w-full">
          <HeaderLogo generals={generals} homeText={translations.Anasayfa} />
          <HeaderNavigation translations={translations} />
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
            <HeaderUserActions translations={translations} user={user} />
            <HeaderLanguageSelector />
          </div>
        </div>
        <Sidebar />
      </header>
    </>
  );
}

export default Header;
