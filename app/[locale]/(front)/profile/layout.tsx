"use client";
import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import ProfileAuthWrapper from "@/components/(front)/UserProfile/ProfileAuthWrapper";
import Breadcrumb from "@/components/others/Breadcrumb";
import { navLinksAuthIndividual } from "@/constants";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const breadcrumbs = useMemo(() => {
    // /en/profile/appointments gibi path'leri parse et
    const pathParts = pathname.split("/").filter(part => part !== "en" && part !== "");
    
    const breadcrumbItems = [
      { title: t("Anasayfa"), slug: "/" },
    ];

    if (pathParts.length > 0 && pathParts[0] === "profile") {
      breadcrumbItems.push({ title: t("Profilim"), slug: "/profile" });
      
      if (pathParts.length > 1) {
        const subPage = pathParts[1];
        const navItem = navLinksAuthIndividual.find(item => 
          item.url.includes(subPage)
        );
        
        if (navItem) {
          breadcrumbItems.push({ 
            title: t(navItem.title), 
            slug: `/profile/${subPage}` 
          });
        }
      }
    }

    return breadcrumbItems;
  }, [pathname, t]);

  return (
    <ProfileAuthWrapper>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>

      <div className="container mx-auto px-4 w-full flex items-start max-lg:flex-col lg:gap-8 gap-4 lg:min-h-[calc(100vh-710px)] max-lg:pt-6">
        <aside className="w-full lg:max-w-[260px] lg:sticky lg:top-24">
          <ProfileSidebar />
        </aside>
        <hr className="lg:hidden w-full border-gray-200" />
        <main className="w-full">{children}</main>
      </div>
    </ProfileAuthWrapper>
  );
}
