import { getSettings } from "@/lib/services/settings";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";
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
  const generals: GeneralSettingsData = await getSettings();
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  const user = await getServerUser(); // Server-side user data
  
  const translations = {
    Anasayfa: messages["Anasayfa"],
    Hakkimizda: messages["Hakkımızda"],
    Iletisim: messages["İletişim"],
    GirisYap: messages["Giriş Yap"],
  };
  
  return (
    <ClientLayout
      locale={locale}
      messages={messages}
      generals={generals}
      translations={translations}
      user={user}
    >
      {children}
    </ClientLayout>
  );
}
