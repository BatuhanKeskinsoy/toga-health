import { getSettings } from "@/lib/services/settings";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getServerUser } from "@/lib/utils/getServerUser";
import Header from "@/components/(front)/Appointment/Inc/Header";
import ClientProviders from "@/components/ClientProviders";
import ClientPusherWrapper from "@/components/ClientPusherWrapper";

export default async function AppointmentLayout({
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
    <ClientProviders locale={locale} messages={messages}>
      <ClientPusherWrapper user={user}>
        <Header generals={generals} user={user} />
        {children}
      </ClientPusherWrapper>
    </ClientProviders>
  );
}
