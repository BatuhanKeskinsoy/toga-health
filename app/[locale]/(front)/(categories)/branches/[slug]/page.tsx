import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getBranchesLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";
import { getBranchProviders } from "@/lib/services/categories/branches";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const { providersTitle, countries } = await getBranchesLayoutData(
      locale,
      slug
    );

    return {
      title: `${providersTitle} | ${"Branşlar"} | Toga Health`,
      description: `${providersTitle} ${"branşları için uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, branşlar, doktor, hastane`,
      openGraph: {
        title: `${providersTitle}`,
        description: `${providersTitle} ${"branşları için uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
      },
    };
  } catch (error) {
    return {
      title: `${"Branşlar"} | Toga Health`,
      description:
        "Branşlar için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function BranchesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentPath = `/${locale}${getLocalizedUrl(
    "/branches/[slug]",
    locale,
    { slug }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { branches, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getBranchesLayoutData(locale, slug);

  // Branşlar bulunamazsa 404 döndür
  if (!branches.find((d) => d.slug === slug)) {
    notFound();
  }

  // Tüm ülkeler için verileri çek (ülke seçimi olmadan)
  const initialProvidersData = await getBranchProviders({
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
      title: t("Branşlar"),
      slug: getLocalizedUrl("/branches", locale),
      slugPattern: "/branches",
    },
    {
      title: providersTitle,
      slug: getLocalizedUrl("/branches/[slug]", locale, { slug }),
      slugPattern: "/branches/[slug]",
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
              categoryType="branches"
              diseases={[]}
              branches={
                branches?.map((item) => ({ ...item, title: item.name })) || []
              }
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
              categoryType="branches"
            />
          </div>
        </div>
      </div>
    </>
  );
}