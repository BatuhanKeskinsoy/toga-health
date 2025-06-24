import React from "react";
import { Link } from "@/i18n/navigation";

interface HeaderNavigationProps {
  translations: {
    Anasayfa: string;
    Hakkimizda: string;
    Iletisim: string;
  };
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ translations }) => {
  return (
    <ul className="flex max-lg:hidden justify-center w-full items-center">
      <li>
        <Link
          href={"/"}
          title={translations.Anasayfa}
          className="transition-all duration-300 px-2 hover:text-sitePrimary"
        >
          {translations.Anasayfa}
        </Link>
      </li>
      <li>
        <Link
          href={"/aboutus"}
          title={translations.Hakkimizda}
          className="transition-all duration-300 px-2 hover:text-sitePrimary"
        >
          {translations.Hakkimizda}
        </Link>
      </li>
      <li>
        <Link
          href={"/contact"}
          title={translations.Iletisim}
          className="transition-all duration-300 px-2 hover:text-sitePrimary"
        >
          {translations.Iletisim}
        </Link>
      </li>
    </ul>
  );
};

export default HeaderNavigation; 