import { getContracts } from "@/lib/services/contracts";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function ContractLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  // Contracts'ları çek ve mevcut locale'e göre filtrele
  let contracts = [];
  let currentContract = null;
  try {
    const contractsResponse = await getContracts();
    if (contractsResponse?.status && contractsResponse?.data) {
      // Mevcut slug ile contract'ı bul
      currentContract = contractsResponse.data.find(
        (contract) => contract.slug === slug
      );

      // Mevcut locale'e göre aktif ve yayında olan contracts'ları filtrele
      contracts = contractsResponse.data.filter(
        (contract) =>
          contract.lang_code === locale &&
          contract.is_published &&
          contract.status === "active"
      );
    }
  } catch (error) {
    console.error("Contracts fetch error in layout:", error);
  }

  return (
    <div className="container mx-auto px-4 w-full flex items-start max-lg:flex-col lg:gap-8 gap-4 max-lg:pt-6 pb-8">
      {/* Sticky Sidebar - Sadece lg ve üzeri ekranlarda görünür */}
      <aside className="hidden lg:block w-full lg:max-w-[280px] lg:sticky lg:top-4 mt-10">
        <div className="bg-white rounded-md shadow-md shadow-gray-200">
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-gray-900 p-4">
              {t("Sözleşmeler")}
            </h3>
            <hr className="border-gray-200" />
            <nav className="flex flex-col gap-1">
              {contracts.map((contract) => {
                // Mevcut contract'ın contract_id'si ile karşılaştır
                const isActive =
                  currentContract &&
                  contract.contract_id === currentContract.contract_id;
                return (
                  <Link
                    key={contract.id}
                    href={getLocalizedUrl("/contracts/[slug]", locale, {
                      slug: contract.slug,
                    })}
                    className={`px-4 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-sitePrimary text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100 hover:text-sitePrimary"
                    }`}
                  >
                    {contract.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full min-h-[calc(100vh-192px)]">
        {children}
      </div>
    </div>
  );
}

