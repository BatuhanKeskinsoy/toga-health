import React from "react";
import SpecialistView from "@/components/(front)/Specialist/SpecialistView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    branch_slug: string;
    specialist_slug: string;
  }>;
}) {
  const { locale, branch_slug, specialist_slug } = await params;
  const t = await getTranslations({ locale });
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: branch_slug, slug: `/${branch_slug}` },
    { title: specialist_slug, slug: `/${specialist_slug}` },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <SpecialistView />
    </>
  );
}

export default Page;
