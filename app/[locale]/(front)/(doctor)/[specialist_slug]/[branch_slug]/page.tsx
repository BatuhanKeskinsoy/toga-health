import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getDoctorDetail } from "@/lib/services/provider/doctor";
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

  try {
    const response = await getDoctorDetail(specialist_slug);
    
    if (!response.status || !response.data) {
      notFound();
    }

    const doctor = response.data;

    const breadcrumbs = [
      { title: t("Anasayfa"), slug: "/" },
      {
        title: doctor?.name || specialist_slug,
        slug: `/${specialist_slug}/${branch_slug}`,
      },
    ];

    return (
      <>
        <div className="container mx-auto px-4 lg:flex hidden">
          <Breadcrumb crumbs={breadcrumbs} locale={locale} />
        </div>
        <ProviderView 
          isHospital={false}
          providerData={doctor} 
          providerError={null} 
        />
      </>
    );
  } catch (error) {
    notFound();
  }
}

export default Page;
