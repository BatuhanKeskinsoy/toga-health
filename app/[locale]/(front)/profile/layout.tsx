import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { getServerUser } from "@/lib/utils/getServerUser";

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
      <div className="container mx-auto px-4 xl:flex hidden">
        <Breadcrumb crumbs={[
          { title: t("Anasayfa"), slug: "/" },
          { title: t("Profilim"), slug: "/profile" }
        ]} locale={locale} />
      </div>

      <div className="container mx-auto px-4 w-full flex items-start max-xl:flex-col xl:gap-8 gap-4 xl:min-h-[calc(100vh-710px)] max-xl:pt-6">
        <aside className="w-full xl:max-w-[260px] xl:sticky xl:top-4">
          <ProfileSidebar user={user} />
        </aside>
        <hr className="xl:hidden w-full border-gray-200" />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}