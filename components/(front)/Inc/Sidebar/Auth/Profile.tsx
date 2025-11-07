import CustomButton from "@/components/Customs/CustomButton";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
import { useAuthHandler } from "@/lib/hooks/auth/useAuthHandler";
import {
  navLinksAuthCorporate,
  navLinksAuthDoctor,
  navLinksAuthIndividual,
} from "@/constants";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { usePusherContext } from "@/lib/context/PusherContext";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface IProfileProps {
  user: UserTypes | null;
}

function Profile({ user }: IProfileProps) {
  const { logout } = useAuthHandler();
  const { updateServerUser } = usePusherContext();
  const { setSidebarStatus } = useGlobalContext();
  const t = useTranslations();
  const locale = useLocale();

  const handleLogout = async () => {
    await logout();
    updateServerUser(null);
    setSidebarStatus(""); // Sidebar'ı kapat

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (
        currentPath.includes("/profile") ||
        currentPath.includes("/profil")
      ) {
        const targetUrl = getLocalizedUrl("/", locale);
        window.location.replace(targetUrl);
        return;
      }
    }
  };

  if (!user) return null;

  const renderGroupedLinks = (
    links: {
      icon: React.ReactNode;
      title: string;
      url: string;
      sublinks?: { title: string; url: string }[];
    }[]
  ) =>
    links.map((link, linkKey) => (
      <div key={linkKey} className="flex flex-col gap-1">
        <Link
          title={t(link.title)}
          href={getLocalizedUrl(link.url, locale)}
          onClick={() => setSidebarStatus("")}
          className="flex items-center gap-4 justify-between bg-gray-100 py-3 px-4 text-base hover:pl-6 hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-2">
            {link.icon && <span className="text-lg min-w-4">{link.icon}</span>}
            {t(link.title)}
          </div>
          <IoChevronForwardOutline className="text-xl opacity-70 ltr:rotate-0 rtl:rotate-180" />
        </Link>
        {/* Sublinks */}
        {link.sublinks &&
          link.sublinks.map((sublink, sublinkKey) => (
            <Link
              key={sublinkKey}
              title={t(sublink.title)}
              href={getLocalizedUrl(sublink.url, locale)}
              onClick={() => setSidebarStatus("")}
              className="flex items-center gap-4 justify-between bg-gray-50 py-2 px-4 text-sm hover:pl-8 hover:bg-sitePrimary/5 hover:text-sitePrimary transition-all duration-300 text-left ml-6 border-l-2 border-gray-200"
            >
              <div className="flex items-center gap-2">{t(sublink.title)}</div>
              <IoChevronForwardOutline className="text-lg opacity-50 ltr:rotate-0 rtl:rotate-180" />
            </Link>
          ))}
      </div>
    ));

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col w-full h-full gap-6">
        <div className="flex gap-4 items-center select-none">
          <div className="relative rounded-md overflow-hidden shadow-md shadow-gray-300">
            <ProfilePhoto
              user={user}
              size={64}
              fontSize={22}
              responsiveSizes={{ desktop: 64, mobile: 64 }}
              responsiveFontSizes={{ desktop: 22, mobile: 16 }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-lg">{user.name}</span>
              <span className="text-xs lg:text-sm text-gray-500">
                {user.user_type === "individual"
                  ? t("Üye")
                  : user.user_type === "doctor"
                  ? t("Doktor")
                  : t("Kurum")}
              </span>
            </div>
            <span className="text-xs lg:text-sm text-gray-500">
              {user.email}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex flex-col w-full gap-2">
          {user.user_type === "individual" &&
            renderGroupedLinks(navLinksAuthIndividual)}

          {user.user_type === "doctor" &&
            renderGroupedLinks(navLinksAuthDoctor)}

          {user.user_type === "corporate" &&
            renderGroupedLinks(navLinksAuthCorporate)}

          <hr className="border-gray-200 my-2" />

          <CustomButton
            title={t("Çıkış Yap")}
            btnType="button"
            handleClick={handleLogout}
            containerStyles="flex items-center gap-4 justify-between bg-gray-100 py-3 px-4 text-base hover:pl-6 transition-all duration-300 text-left hover:bg-sitePrimary/10 hover:text-sitePrimary"
            rightIcon={<IoLogOutOutline className="text-xl opacity-70" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
