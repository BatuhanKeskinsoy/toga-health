import React from "react";
import { Link } from "@/i18n/navigation";
import MarqueeBanner from "@/components/others/MarqueeBanner";
import { getSocialIcon } from "@/lib/functions/getSocialIcon";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";

interface HeaderTopBannerProps {
  generals: GeneralSettings;
}

const HeaderTopBanner: React.FC<HeaderTopBannerProps> = ({ generals }) => {
  return (
    <div className="bg-gray-200 w-full">
      <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
        <div className="lg:w-[65px] lg:min-w-[65px] w-[55px] min-w-[55px]" />
        <div className="relative overflow-hidden w-full h-full flex items-center">
          <MarqueeBanner speed={25} messages={generals.scrolling_text} />
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