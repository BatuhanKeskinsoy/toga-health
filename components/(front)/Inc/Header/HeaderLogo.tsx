import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  SettingsData,
  SettingsResponse,
} from "@/lib/types/settings/settingsTypes";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface HeaderLogoProps {
  generals?: SettingsResponse | SettingsData;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ generals }) => {
  const locale = useLocale();

  // Extract data from response
  const data =
    (generals as SettingsResponse)?.data || (generals as SettingsData);

  // Safe access to site logo
  const siteLogo = (() => {
    if (!data?.general || !Array.isArray(data.general)) {
      return "/assets/logo/logo.svg"; // Fallback logo
    }
    const setting = data.general.find((item) => item.key === "site_logo");
    return setting?.value ? String(setting.value) : "/assets/logo/logo.svg";
  })();

  const scrollingText = (() => {
    if (!data?.general || !Array.isArray(data.general)) {
      return "/assets/logo/logo.svg"; // Fallback logo
    }
    const scrollingText = data.general.find(
      (item) => item.key === "scrolling_text"
    );
    return scrollingText?.value ? String(scrollingText.value) : "";
  })();

  return (
    <Link
      href={getLocalizedUrl("/", locale)}
      title={"Toga Health"}
      aria-label={"Toga Health"}
      className={`relative flex items-center max-lg:-mt-5 justify-center transition-all duration-300 ${
        scrollingText === null
          ? "lg:min-h-[105px] min-h-[70px] lg:w-[105px] w-[70px] lg:min-w-[105px] min-w-[70px] -mb-10"
          : "lg:min-h-[130px] min-h-[95px] lg:w-[130px] w-[95px] lg:min-w-[130px] min-w-[95px]"
      }`}
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
