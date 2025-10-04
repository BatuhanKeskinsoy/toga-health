import CustomButton from "@/components/others/CustomButton";
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
  };

  if (!user) return null;

  const renderGroupedLinks = (
    groups: { name: string; links: { icon: React.ReactNode; title: string; url: string }[] }[]
  ) =>
    groups.map((group, groupKey) => (
      <div key={groupKey} className="flex flex-col gap-1">
        <span className="text-sm text-gray-500 pt-3 font-medium tracking-wide uppercase">
          {group.name}
        </span>
        {group.links.map((link, linkKey) => (
          <Link
            key={linkKey}
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
        ))}
      </div>
    ));

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col w-full h-full gap-6">
        <div className="flex gap-4 items-center select-none">
          <div className="relative rounded-full overflow-hidden shadow-lg shadow-gray-300">
            <ProfilePhoto
              user={user}
              size={80}
              fontSize={26}
              responsiveSizes={{ desktop: 80, mobile: 64 }}
              responsiveFontSizes={{ desktop: 26, mobile: 16 }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sitePrimary font-semibold text-lg">
              {user.name}
            </span>
            <small>{user.email}</small>
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
