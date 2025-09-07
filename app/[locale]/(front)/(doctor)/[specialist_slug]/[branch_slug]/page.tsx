import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getSpecialist } from "@/lib/hooks/provider/useSpecialist";
import { notFound } from "next/navigation";
import "react-medium-image-zoom/dist/styles.css";

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
  const { locale, specialist_slug, branch_slug } = await params;
  const t = await getTranslations({ locale });

  const { specialist, error } = await getSpecialist(specialist_slug);

  if (!specialist || error) {
    notFound();
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    {
      title: specialist?.name || specialist_slug,
      slug: `/${specialist_slug}/${branch_slug}`,
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ProviderView specialistData={specialist} specialistError={error} />
    </>
  );
}

export default Page;
