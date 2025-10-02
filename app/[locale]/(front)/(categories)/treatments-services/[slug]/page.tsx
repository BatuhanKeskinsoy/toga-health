import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getTreatmentsLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";
import { getTreatmentProviders } from "@/lib/services/categories/treatments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { providersTitle, countries } = await getTreatmentsLayoutData(
      locale,
      slug
    );

    return {
      title: `${providersTitle} | ${"Tedaviler ve Hizmetler"} | Toga Health`,
      description: `${providersTitle} ${"tedavileri ve hizmetleri için uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, tedaviler, hizmetler, doktor, hastane`,
      openGraph: {
        title: `${providersTitle}`,
        description: `${providersTitle} ${"tedavileri ve hizmetleri için uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
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
  const currentPath = `/${locale}${getLocalizedUrl(
    "/treatments-services/[slug]",
    locale,
    { slug }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { treatments, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getTreatmentsLayoutData(locale, slug);

  // Tedaviler ve Hizmetler bulunamazsa 404 döndür
  if (!treatments.find((d) => d.slug === slug)) {
    notFound();
  }

  // Tüm ülkeler için verileri çek (ülke seçimi olmadan)
  const initialProvidersData = await getTreatmentProviders({
    providers_slug: slug,
    country: "", // Boş string ile tüm ülkeler
    page: 1,
    per_page: 20,
    sort_by: sortBy,
    sort_order: sortOrder,
    provider_type: providerType || undefined,
  }).catch((error) => {
    console.error("Providers fetch error:", error);
    return null;
  });

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
      <div className="container mx-auto lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4">
        <div className="flex max-lg:flex-col gap-4 w-full">
          <div className="lg:w-[320px] w-full">
            <ProvidersSidebar
              providersSlug={slug}
              country=""
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
              country=""
              countryName=""
              cityName={undefined}
              districtName={undefined}
              providers={initialProvidersData?.data?.providers?.data || []}
              pagination={initialProvidersData?.data?.providers?.pagination}
              totalProviders={
                initialProvidersData?.data?.providers?.summary
                  ?.total_providers ||
                initialProvidersData?.data?.providers?.pagination?.total ||
                0
              }
              sortBy={sortBy}
              sortOrder={sortOrder}
              providerType={providerType}
              categoryType="treatments-services"
            />
          </div>
        </div>
      </div>
    </>
  );
}