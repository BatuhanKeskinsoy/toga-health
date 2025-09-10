import React from "react";
import { Link } from "@/i18n/navigation";
import MarqueeBanner from "@/components/others/MarqueeBanner";
import { getSocialIcon } from "@/lib/functions/getSocialIcon";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";

interface HeaderTopBannerProps {
  generals: GeneralSettingsData;
}

const HeaderTopBanner: React.FC<HeaderTopBannerProps> = ({ generals }) => {
  const scrollingText = generals.default.find(item => item.key === "scrolling_text")?.value || [];
  return (
    <div className="bg-gray-200 w-full">
      <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
        <div className="relative overflow-hidden w-full h-full flex items-center">
          <MarqueeBanner speed={25} messages={scrollingText} />
        </div>
        <div className="flex items-center gap-2 text-xs min-w-max ltr:border-l rtl:border-r border-gray-300 px-2">
          {generals.social_media.map((social: any, key: number) => (
            <Link
              key={key}
              href={social.url}
              className="flex text-lg hover:text-sitePrimary transition-all duration-300"
              target="_blank"
            >
              {getSocialIcon(social.name)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBanner; 