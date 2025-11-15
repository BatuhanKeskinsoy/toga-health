import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getContractDetail, getContracts } from "@/lib/services/contracts";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { convertDate } from "@/lib/functions/getConvertDate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  let contractDetail;

  try {
    contractDetail = await getContractDetail(slug);
  } catch (error) {
    return {
      title: "Sözleşme",
    };
  }

  if (!contractDetail?.status || !contractDetail?.data) {
    return {
      title: "Sözleşme",
    };
  }

  const contract = contractDetail.data;
  const title = `${contract.title} | TOGA Health`;
  const description = contract.summary || contract.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale,
    },
  };
}

export async function generateStaticParams() {
  try {
    const contractsData = await getContracts();
    if (!contractsData?.status || !contractsData?.data) {
      return [];
    }

    return contractsData.data
      .filter(
        (contract) => contract.is_published && contract.status === "active"
      )
      .map((contract) => ({
        slug: contract.slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  let contractDetail;
  try {
    contractDetail = await getContractDetail(slug);
  } catch (error) {
    console.error("Contract detail fetch error:", error);
    notFound();
  }

  if (!contractDetail?.status || !contractDetail?.data) {
    notFound();
  }

  const contract = contractDetail.data;

  if (!contract.is_published || contract.status !== "active") {
    notFound();
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Sözleşmeler"), slug: "/contracts" },
    { title: contract.title, slug: `/contracts/${slug}` },
  ];

  return (
    <>
      <div className="container mx-auto lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {contract.type_label}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {contract.title}
            </h1>
            {contract.summary && (
              <p className="text-gray-600 text-lg">{contract.summary}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            {contract.content ? (
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: contract.content }}
              />
            ) : (
              <p className="text-gray-600">{t("İçerik bulunamadı")}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-200 pt-6">
            <span>{t("Tarih")} :</span> {convertDate(contract.updated_at, locale)}
          </div>
        </div>
      </div>
    </>
  );
}
