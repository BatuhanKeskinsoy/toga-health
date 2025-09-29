import React from "react";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface HeaderNavigationProps {
  translations: {
    Anasayfa: string;
    Hakkimizda: string;
    Iletisim: string;
  };
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ translations }) => {
  const locale = useLocale();
  console.log("HeaderNavigation locale :", locale);

  return (
    <ul className="flex max-lg:hidden justify-center w-full items-center">
      <li>
        <Link
          href={getLocalizedUrl('/', locale)}
          title={translations.Anasayfa}
          className="transition-all duration-300 px-2 hover:text-sitePrimary"
        >
          {translations.Anasayfa}
        </Link>
      </li>
      <li>
        <Link
          href={getLocalizedUrl('/aboutus', locale)}
          title={translations.Hakkimizda}
          className="transition-all duration-300 px-2 hover:text-sitePrimary"
        >
          {translations.Hakkimizda}
        </Link>
      </li>
      <li>
        <Link
          href={getLocalizedUrl('/contact', locale)}
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