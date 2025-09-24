import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations();

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={[
          { title: t("Anasayfa"), slug: "/" },
          { title: t("Profilim"), slug: "/profile" }
        ]} locale="en" />
      </div>

      <div className="container mx-auto px-4 w-full flex items-start max-lg:flex-col lg:gap-8 gap-4 lg:min-h-[calc(100vh-710px)] max-lg:pt-6">
        <aside className="w-full lg:max-w-[260px] lg:sticky lg:top-24">
          <ProfileSidebar />
        </aside>
        <hr className="lg:hidden w-full border-gray-200" />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}