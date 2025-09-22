import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";
import { siteURL } from "@/constants";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface HeaderLogoProps {
  generals: GeneralSettingsData;
  homeText: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ generals, homeText }) => {
  const locale = useLocale();

  return (
    <Link
      href={getLocalizedUrl('/', locale)}
      title={homeText}
      className="relative lg:min-h-[130px] min-h-[95px] flex items-center max-lg:-mt-5 justify-center lg:w-[130px] w-[95px] lg:min-w-[130px] min-w-[95px] transition-all duration-300"
    >
      <Image
        src={generals.general.find(item => item.key === "site_logo")?.value || ""}
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