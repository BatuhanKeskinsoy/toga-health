import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getContracts } from "@/lib/services/contracts";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { notFound } from "next/navigation";

export default async function ContractsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let contractsData;
  try {
    contractsData = await getContracts();
  } catch (error) {
    console.error("Contracts fetch error:", error);
    notFound();
  }

  if (!contractsData?.status || !contractsData?.data) {
    notFound();
  }

  const contracts = contractsData.data.filter(
    (contract) => contract.is_published && contract.status === "active"
  );

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Sözleşmeler"), slug: "/contracts" },
  ];

  return (
    <>
      <div className="container mx-auto lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("Sözleşmeler")}
            </h1>
            <p className="text-gray-600">
              {t("Platform kullanımına ilişkin sözleşmeler ve politikalar")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                href={getLocalizedUrl("/contracts/[slug]", locale, {
                  slug: contract.slug,
                })}
                className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:border-sitePrimary hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contract.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {contract.type_label}
                  </span>
                </div>
                {contract.summary && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {contract.summary}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {t("Detayları Görüntüle")}
                  </span>
                  <span className="text-sitePrimary">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

