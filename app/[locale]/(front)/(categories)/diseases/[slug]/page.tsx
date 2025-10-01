import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getDiseasesLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { providersTitle, countries } = await getDiseasesLayoutData(
      locale,
      slug
    );

    return {
      title: `${providersTitle} | ${"Hastalıklar"} | Toga Health`,
      description: `${providersTitle} ${"hastalığı için uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, hastalık, doktor, hastane`,
      openGraph: {
        title: `${providersTitle}`,
        description: `${providersTitle} ${"hastalığı için uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
      },
    };
  } catch (error) {
    return {
      title: `${"Hastalıklar"} | Toga Health`,
      description:
        "Hastalıklar için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function DiseasesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentPath = `/${locale}${getLocalizedUrl(
    "/diseases/[slug]",
    locale,
    { slug }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getDiseasesLayoutData(locale, slug);

  // Hastalık bulunamazsa 404 döndür
  if (!diseases.find((d) => d.slug === slug)) {
    notFound();
  }

  // Tüm ülkeler için verileri çek (ülke seçimi olmadan)
  const initialProvidersData = await getDiseaseProviders({
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
      title: t("Hastalıklar"),
      slug: getLocalizedUrl("/diseases", locale),
      slugPattern: "/diseases",
    },
    {
      title: providersTitle,
      slug: getLocalizedUrl("/diseases/[slug]", locale, { slug }),
      slugPattern: "/diseases/[slug]",
      params: { slug } as Record<string, string>,
    },
  ];

  return (
    <>
      <div className="container mx-auto xl:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4">
        <div className="flex max-xl:flex-col gap-4 w-full">
          <div className="xl:w-[320px] w-full">
            <ProvidersSidebar
              providersSlug={slug}
              country=""
              categoryType="diseases"
              diseases={
                diseases?.map((item) => ({ ...item, title: item.name })) || []
              }
              branches={[]}
              treatmentsServices={[]}
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
              categoryType="diseases"
            />
          </div>
        </div>
      </div>
    </>
  );
}