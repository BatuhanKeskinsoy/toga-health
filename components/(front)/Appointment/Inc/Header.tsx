import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { UserTypes } from "@/lib/types/user/UserTypes";
import React from "react";
import HeaderLogo from "../../Inc/Header/HeaderLogo";
import HeaderNavigation from "../../Inc/Header/HeaderNavigation";
import HeaderUserActions from "../../Inc/Header/HeaderUserActions";
import HeaderLanguageSelector from "../../Inc/Header/HeaderLanguageSelector";
import Sidebar from "../../Inc/Sidebar/Sidebar";
import HeaderTopBanner from "../../Inc/Header/HeaderTopBanner";

function Header({
  generals,
  user,
}: {
  generals: SettingsResponse;
  user?: UserTypes;
}) {
  return (
    <>
      {generals.data?.default.find((item) => item.key === "scrolling_text")
        ?.value !== null && <HeaderTopBanner generals={generals} />}
      <header className="relative shadow-md shadow-gray-200 bg-white z-20">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto max-lg:px-4 w-full">
          <HeaderLogo generals={generals} />
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center h-9 lg:h-11">
            <HeaderUserActions />
            <HeaderLanguageSelector />
          </div>
        </div>
        <Sidebar user={user} />
      </header>
    </>
  );
}

export default Header;
