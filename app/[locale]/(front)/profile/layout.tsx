import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { getServerUser } from "@/lib/utils/getServerUser";
import ProfileMenuButton from "@/components/(front)/UserProfile/Inc/ProfileMenuButton";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations({ locale });
  const user = await getServerUser();

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb
          crumbs={[
            { title: t("Anasayfa"), slug: "/" },
            { title: t("Profil"), slug: "/profile" },
          ]}
          locale={locale}
        />
      </div>

      <div className="container mx-auto px-4 w-full flex items-start max-lg:flex-col lg:gap-8 gap-4 lg:min-h-[calc(100vh-710px)] max-lg:pt-6">
        {/* Mobil Menü Butonu - Her zaman görünür */}
        <ProfileMenuButton />
        {/* Desktop Sidebar - Sadece lg ve üzeri ekranlarda görünür */}
        <aside className="hidden lg:block w-full lg:max-w-[260px] lg:sticky lg:top-4">
          <ProfileSidebar user={user} />
        </aside>
        <div className="w-full min-h-[calc(100vh-192px)]">{children}</div>
      </div>

      {/* Sidebar - User prop'u ile */}
      <Sidebar user={user} />
    </>
  );
}
