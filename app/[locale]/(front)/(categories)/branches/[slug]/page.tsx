import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getBranchesLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

    const { branches } = await getBranchesLayoutData(locale, slug);
  if (!branches.find((d) => d.slug === slug)) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
        const { providersTitle } = await getBranchesLayoutData(locale, slug);

    return {
      title: `${providersTitle} - ${"Branşlar"} | Toga Health`,
      description: `${providersTitle} ${"branşları için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
      keywords: `${providersTitle}`,
      openGraph: {
        title: `${providersTitle} - ${"Branşlar"} | Toga Health`,
        description: `${providersTitle} ${"branşları için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
        type: "website",
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title: `${providersTitle} - ${"Branşlar"} | Toga Health`,
        description: `${providersTitle} ${"branşları için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
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
  const currentPath = `/${locale}${getLocalizedUrl("/branches/[slug]", locale, {
    slug,
  })}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { branches, countries, providersTitle } = await getBranchesLayoutData(
    locale,
    slug
  );

  // Branşlar bulunamazsa 404 döndür
    if (!branches.find((d) => d.slug === slug)) {
    notFound();
  }

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
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4 ">
        <div className="flex max-lg:flex-col gap-4 w-full">
          <div className="lg:w-[320px] w-full">
            <ProvidersSidebar
              providersSlug={slug}
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
              countryName={undefined}
              cityName={undefined}
              districtName={undefined}
              categoryType="branches"
            />
          </div>
        </div>
      </div>
    </>
  );
}
