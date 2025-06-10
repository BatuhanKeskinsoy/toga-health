"use client";
import { ReactNode, useEffect } from "react";
import { useGlobalContext } from "@/app/Context/store";
import Breadcrumb from "@/components/others/Breadcrumb";
import { navLinksAuthIndividual } from "@/constants";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePathname, useRouter } from "@/i18n/navigation";
import Loading from "@/components/others/Loading";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  generals: any;
}

export default function AuthenticatedLayout({ children, generals }: AuthenticatedLayoutProps) {
  const { user, isLoading } = useUser();
  const { setSidebarStatus } = useGlobalContext();
  const router = useRouter();
  const path = usePathname();
  const pathParts = path.split("/").filter(Boolean);

  useEffect(() => {
    if (!user && !isLoading) {
      setSidebarStatus("Auth");
      router.push("/");
    }
  }, [user, isLoading, router, setSidebarStatus]);

  if (isLoading) return <Loading generals={generals} />;

  // Dinamik breadcrumb'ları oluştur
  const titles = pathParts.map(part =>
    navLinksAuthIndividual.find(item => item.url.includes(part))?.title ?? part
  );
  const breadcrumbs = titles.map((title, i) => ({
    title,
    slug: "/" + pathParts.slice(0, i + 1).join("/"),
  }));


  return user ? (
    <>
      <div className="container mx-auto px-4 lg:flex hidden mt-6">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      {children}
    </>
  ) : null;
}