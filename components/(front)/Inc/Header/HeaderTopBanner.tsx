import React from "react";
import { Link } from "@/i18n/navigation";
import MarqueeBanner from "@/components/others/MarqueeBanner";
import { getSocialIcon } from "@/lib/functions/getSocialIcon";
import { SettingsData, SettingsResponse } from "@/lib/types/settings/settingsTypes";

interface HeaderTopBannerProps {
  generals?: SettingsResponse | SettingsData;
}

const HeaderTopBanner: React.FC<HeaderTopBannerProps> = ({ generals }) => {
  // Extract data from response
  const data = (generals as SettingsResponse)?.data || (generals as SettingsData);

  // Safe access to scrolling text - Return null if no data
  const scrollingText = (() => {
    if (!data?.default || !Array.isArray(data.default)) {
      return null;
    }
    const setting = data.default.find(item => item.key === "scrolling_text");
    
    if (setting?.value) {
      // Handle both array and json types
      if (Array.isArray(setting.value)) {
        return setting.value.length > 0 ? setting.value : null;
      }
      
      // If it's a string (json), try to parse it
      if (typeof setting.value === 'string') {
        try {
          const parsed = JSON.parse(setting.value);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch (e) {
          console.error('Error parsing scrolling_text:', e);
          return null;
        }
      }
    }
    
    return null;
  })();

  // Safe access to social media - Return null if no data
  const socialMedia = (() => {
    if (!data?.social_media || !Array.isArray(data.social_media)) {
      return null;
    }
    
    const filteredSocials = data.social_media.filter(social => social.value);
    return filteredSocials.length > 0 ? filteredSocials : null;
  })();

  // Don't render if no scrolling text and no social media
  if (!scrollingText && !socialMedia) {
    return null;
  }

  return (
    <div className="bg-gray-200 w-full">
      <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
        <div className="w-[110px] lg:w-[90px] h-full"></div>
        {scrollingText && (
          <div className="relative overflow-hidden w-full h-full flex items-center">
            <MarqueeBanner speed={25} messages={scrollingText} />
          </div>
        )}
        {!scrollingText && <div className="flex-1"></div>}
        {socialMedia && (
          <div className="flex items-center gap-2 text-xs min-w-max ltr:border-l rtl:border-r border-gray-300 px-2">
            {socialMedia.map((social, key) => (
              <Link
                key={key}
                href={String(social.value)}
                className="flex text-lg hover:text-sitePrimary transition-all duration-300"
                target="_blank"
              >
                {getSocialIcon(social.key)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTopBanner; 