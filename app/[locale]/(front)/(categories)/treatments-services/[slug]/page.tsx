import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTreatmentsLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

    const { treatments } = await getTreatmentsLayoutData(locale, slug);
  if (!treatments.find((d) => d.slug === slug)) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const { providersTitle } = await getTreatmentsLayoutData(locale, slug);

    return {
      title: `${providersTitle} - ${"Tedaviler ve Hizmetler"} | Toga Health`,
      description: `${providersTitle} ${"tedavileri ve hizmetleri için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
      keywords: `${providersTitle}`,
      openGraph: {
        title: `${providersTitle} - ${"Tedaviler ve Hizmetler"} | Toga Health`,
        description: `${providersTitle} ${"tedavileri ve hizmetleri için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
        type: "website",
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title: `${providersTitle} - ${"Tedaviler ve Hizmetler"} | Toga Health`,
        description: `${providersTitle} ${"tedavileri ve hizmetleri için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
      },
    };
  } catch (error) {
    return {
      title: `${"Tedaviler ve Hizmetler"} | Toga Health`,
      description:
        "Tedaviler ve Hizmetler için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function TreatmentsServicesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentPath = `/${locale}${getLocalizedUrl("/treatments-services/[slug]", locale, {
    slug,
  })}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { treatments, countries, providersTitle } = await getTreatmentsLayoutData(
    locale,
    slug
  );

  // Tedaviler ve Hizmetler bulunamazsa 404 döndür
    if (!treatments.find((d) => d.slug === slug)) {
    notFound();
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    {
      title: t("Tedaviler ve Hizmetler"),
      slug: getLocalizedUrl("/treatments-services", locale),
      slugPattern: "/treatments-services",
    },
    {
      title: providersTitle,
      slug: getLocalizedUrl("/treatments-services/[slug]", locale, { slug }),
      slugPattern: "/treatments-services/[slug]",
      params: { slug } as Record<string, string>,
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4 ">
        <div className="flex max-lg:flex-col gap-4 w-full">
          <div className="lg:w-[320px] w-full">
            <ProvidersSidebar
              providersSlug={slug}
              categoryType="treatments-services"
              diseases={[]}
              branches={[]}
              treatmentsServices={
                treatments?.map((item) => ({ ...item, title: item.name })) || []
              }
              countries={countries}
              cities={[]}
              districts={[]}
              locale={locale}
              currentPath={currentPath}
            />
          </div>
          <div className="flex-1">
            <ProvidersView
              providersSlug={slug}
              providersName={providersTitle}
              countryName={undefined}
              cityName={undefined}
              districtName={undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
