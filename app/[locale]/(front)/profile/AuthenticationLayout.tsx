"use client";
import { ReactNode, useEffect, useMemo, useCallback } from "react";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import Breadcrumb from "@/components/others/Breadcrumb";
import { navLinksAuthIndividual } from "@/constants";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePathname, useRouter } from "@/i18n/navigation";
import Loading from "@/components/others/Loading";
import { useTranslations } from "next-intl";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  generals: GeneralSettings;
}

export default function AuthenticatedLayout({
  children,
  generals,
}: AuthenticatedLayoutProps) {
  const { user, isLoading } = useUser();
  const { setSidebarStatus } = useGlobalContext();
  const router = useRouter();
  const path = usePathname();
  const t = useTranslations();

  const pathParts = useMemo(() => path.split("/").filter(Boolean), [path]);

  const redirectToHome = useCallback(() => {
    setSidebarStatus("Auth");
    router.push("/");
  }, [setSidebarStatus, router]);

  useEffect(() => {
    if (user === null && !isLoading) {
      redirectToHome();
    }
  }, [user, isLoading, redirectToHome]);

  const breadcrumbs = useMemo(() => {
    const titles = pathParts.map((part) => {
      const navItem = navLinksAuthIndividual.find((item) =>
        item.url.includes(part)
      );
      return navItem ? t(navItem.title) : part;
    });
    const crumbs = titles.map((title, i) => ({
      title,
      slug: "/" + pathParts.slice(0, i + 1).join("/"),
    }));
    return [
      { title: t("Anasayfa"), slug: "/" },
      ...crumbs,
    ];
  }, [pathParts, t]);

  if (isLoading) return <Loading generals={generals} />;

  if (!user) return null;

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      {children}
    </>
  );
}
