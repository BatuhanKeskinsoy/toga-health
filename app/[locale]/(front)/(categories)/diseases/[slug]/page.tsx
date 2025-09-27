import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDiseasesLayoutData } from "@/lib/utils/getDiseasesLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  const { diseases } = await getDiseasesLayoutData(locale, slug);
  if (!diseases.find((d) => d.slug === slug)) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const { diseaseTitle } = await getDiseasesLayoutData(locale, slug);

    return {
      title: `${diseaseTitle} - ${"Hastalıklar"} | Toga Health`,
      description: `${diseaseTitle} ${"hastalığı için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
      keywords: `${diseaseTitle}`,
      openGraph: {
        title: `${diseaseTitle} - ${"Hastalıklar"} | Toga Health`,
        description: `${diseaseTitle} ${"hastalığı için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
        type: "website",
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title: `${diseaseTitle} - ${"Hastalıklar"} | Toga Health`,
        description: `${diseaseTitle} ${"hastalığı için uzman doktorlar ve hastanelerden randevu alın. En iyi sağlık hizmetleri için hemen başvurun."}`,
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
  const currentPath = `/${locale}${getLocalizedUrl("/diseases/[slug]", locale, {
    slug,
  })}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, diseaseTitle } = await getDiseasesLayoutData(
    locale,
    slug
  );

  // Hastalık bulunamazsa 404 döndür
  if (!diseases.find((d) => d.slug === slug)) {
    notFound();
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    {
      title: t("Hastalıklar"),
      slug: getLocalizedUrl("/diseases", locale),
      slugPattern: "/diseases",
    },
    {
      title: diseaseTitle,
      slug: getLocalizedUrl("/diseases/[slug]", locale, { slug }),
      slugPattern: "/diseases/[slug]",
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
              providersName={diseaseTitle}
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
