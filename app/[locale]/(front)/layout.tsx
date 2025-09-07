import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { getUserProfile } from "@/lib/services/user/user";
import ClientLayout from "@/components/ClientLayout";

export default async function FrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const generals: GeneralSettings = await getGeneralSettings(locale);
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  const user = await getUserProfile(); // Server-side user data
  
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
