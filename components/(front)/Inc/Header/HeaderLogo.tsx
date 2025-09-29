import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SettingsData, SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface HeaderLogoProps {
  generals?: SettingsResponse | SettingsData;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ generals }) => {
  const locale = useLocale();

  // Extract data from response
  const data = (generals as SettingsResponse)?.data || (generals as SettingsData);

  // Safe access to site logo
  const siteLogo = (() => {
    if (!data?.general || !Array.isArray(data.general)) {
      return "/assets/logo/logo.svg"; // Fallback logo
    }
    const setting = data.general.find(item => item.key === "site_logo");
    return setting?.value ? String(setting.value) : "/assets/logo/logo.svg";
  })();

  return (
    <Link
      href={getLocalizedUrl('/', locale)}
      title={"Toga Health"}
      aria-label={"Toga Health"}
      className="relative lg:min-h-[130px] min-h-[95px] flex items-center max-lg:-mt-5 justify-center lg:w-[130px] w-[95px] lg:min-w-[130px] min-w-[95px] transition-all duration-300"
    >
      <Image
        src={siteLogo}
        alt="logo"
        fill
        priority
        sizes="(max-width: 1024px) 95px, 130px"
        className="object-cover bg-white rounded-full shadow-lg"
      />
    </Link>
  );
};

export default HeaderLogo; 