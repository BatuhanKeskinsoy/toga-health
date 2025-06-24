import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { siteURL } from "@/constants";

interface HeaderLogoProps {
  generals: GeneralSettings;
  homeText: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ generals, homeText }) => {
  return (
    <Link
      href={"/"}
      title={homeText}
      className="relative lg:min-h-[130px] min-h-[115px] flex items-center justify-center lg:w-[130px] w-[115px] lg:min-w-[130px] min-w-[115px] transition-all duration-300"
    >
      <Image
        src={`${siteURL}/${generals.site_logo}`}
        alt="logo"
        fill
        priority
        sizes="(max-width: 1024px) 115px, 130px"
        className="object-cover bg-white rounded-full shadow-lg"
      />
    </Link>
  );
};

export default HeaderLogo; 