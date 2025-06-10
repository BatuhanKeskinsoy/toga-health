import { getShortName } from "@/lib/functions/getShortName";
import CustomButton from "@/components/others/CustomButton";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import {
  navLinksAuthCorporateProvider,
  navLinksAuthExpertProvider,
  navLinksAuthIndividual,
} from "@/constants";
import { UserTypes } from "@/types/user/UserTypes";
import { useGlobalContext } from "@/app/Context/store";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface IProfileProps {
  user: UserTypes | null;
}

function Profile({ user }: IProfileProps) {
  const { logout } = useAuthHandler();
  const { setSidebarStatus } = useGlobalContext();

  if (!user) return null;

  const renderLinks = (links: { title: string; url: string }[]) =>
    links.map((link, key) => (
      <Link
        key={key}
        title={link.title}
        href={link.url}
        onClick={() => setSidebarStatus("")}
        className="flex items-center gap-4 justify-between bg-gray-100 py-3 px-4 text-base hover:pl-6 hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all duration-300 text-left"
      >
        {link.title}
        <IoChevronForwardOutline className="text-xl opacity-70" />
      </Link>
    ));

  const renderGroupedLinks = (
    groups: { name: string; links: { title: string; url: string }[] }[]
  ) =>
    groups.map((group, groupKey) => (
      <div key={groupKey} className="flex flex-col gap-1">
        <span className="text-sm text-gray-500 pt-3 font-medium tracking-wide uppercase">
          {group.name}
        </span>
        {renderLinks(group.links)}
      </div>
    ));

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col w-full h-full gap-6">
        <div className="flex gap-4 items-center select-none">
          <div className="relative rounded-full overflow-hidden shadow-lg shadow-gray-300">
            <ProfilePhoto user={user} size={80} fontSize={26} />
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
            renderLinks(navLinksAuthIndividual)}

          {user.user_type === "expert" &&
            renderGroupedLinks(navLinksAuthExpertProvider)}

          {user.user_type === "corporate" &&
            renderGroupedLinks(navLinksAuthCorporateProvider)}

          <hr className="border-gray-200 my-2" />

          <CustomButton
            title="Çıkış Yap"
            btnType="button"
            handleClick={logout}
            containerStyles="flex items-center gap-4 justify-between bg-gray-100 py-3 px-4 text-base hover:pl-6 transition-all duration-300 text-left hover:bg-sitePrimary/10 hover:text-sitePrimary"
            rightIcon={<IoLogOutOutline className="text-xl opacity-70" />}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
