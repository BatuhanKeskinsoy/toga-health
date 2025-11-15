import { getSettings } from "@/lib/services/settings";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getServerUser } from "@/lib/utils/getServerUser";
import ClientLayout from "@/components/ClientLayout";
import { getContracts } from "@/lib/services/contracts";

export default async function FrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const generals: SettingsResponse = await getSettings();
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  const user = await getServerUser();
  
  // Contracts'ları çek
  let contracts = [];
  try {
    const contractsResponse = await getContracts();
    if (contractsResponse?.status && contractsResponse?.data) {
      contracts = contractsResponse.data;
    }
  } catch (error) {
    console.error("Footer contracts fetch error:", error);
  }
  
  return (
    <ClientLayout
      locale={locale}
      messages={messages}
      generals={generals}
      user={user}
      contracts={contracts}
    >
      {children}
    </ClientLayout>
  );
}
