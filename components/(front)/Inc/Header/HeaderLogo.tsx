import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { siteURL } from "@/constants";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface HeaderLogoProps {
  generals: GeneralSettings;
  homeText: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ generals, homeText }) => {
  const locale = useLocale();

  return (
    <Link
      href={getLocalizedUrl('/', locale)}
      title={homeText}
      className="relative lg:min-h-[110px] min-h-[90px] flex items-center justify-center lg:w-[110px] w-[90px] lg:min-w-[110px] min-w-[90px] transition-all duration-300"
    >
      <Image
        src={`${siteURL}/${generals.site_logo}`}
        alt="logo"
        fill
        priority
        sizes="(max-width: 1024px) 90px, 110px"
        className="object-cover bg-white rounded-full shadow-lg"
      />
    </Link>
  );
};

export default HeaderLogo; 