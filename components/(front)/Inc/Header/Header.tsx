import React from "react";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import HeaderTopBanner from "./HeaderTopBanner";
import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderUserActions from "./HeaderUserActions";
import HeaderLanguageSelector from "./HeaderLanguageSelector";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";

interface HeaderProps {
  generals: SettingsResponse;
}

function Header({ generals }: HeaderProps) {
  return (
    <>
      <HeaderTopBanner generals={generals} />
      <header className="relative shadow-md shadow-gray-200 bg-white z-20">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto max-lg:px-4 w-full">
          <HeaderLogo generals={generals} />
          <HeaderNavigation generals={generals} />
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
            <HeaderUserActions />
            <HeaderLanguageSelector />
          </div>
        </div>
        <Sidebar />
      </header>
    </>
  );
}

export default Header;
