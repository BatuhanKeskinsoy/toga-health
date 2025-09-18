import React from "react";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";
import { UserTypes } from "@/lib/types/user/UserTypes";
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
  user?: UserTypes | null;
}

function Header({ generals, translations, user }: HeaderProps) {
  return (
    <div>
      <HeaderTopBanner generals={generals} />
      <header className="shadow-md shadow-gray-200 bg-white">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto px-4 w-full">
          <HeaderLogo generals={generals} homeText={translations.Anasayfa} />
          <HeaderNavigation translations={translations} />
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
            <HeaderUserActions translations={translations} user={user} />
            <HeaderLanguageSelector />
          </div>
        </div>
        <Sidebar />
      </header>
    </div>
  );
}

export default Header;
