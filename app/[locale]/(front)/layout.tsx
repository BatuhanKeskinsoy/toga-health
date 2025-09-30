import { getSettings } from "@/lib/services/settings";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getServerUser } from "@/lib/utils/getServerUser";
import ClientLayout from "@/components/ClientLayout";

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
  
  return (
    <ClientLayout
      locale={locale}
      messages={messages}
      generals={generals}
      user={user}
    >
      {children}
    </ClientLayout>
  );
}
