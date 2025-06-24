import Header from "@/components/(front)/Inc/Header/Header";
import Footer from "@/components/(front)/Inc/Footer/Footer";
import { getGeneralSettings } from "@/lib/utils/getGeneralSettings";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import ClientProviders from "@/components/ClientProviders";

export default async function FrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const generals: GeneralSettings = await getGeneralSettings(locale);
  
  // Translation dosyasını yükle
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  
  const translations = {
    Anasayfa: messages.Anasayfa || "Anasayfa",
    Hakkimizda: messages.Hakkimizda || "Hakkımızda", 
    Iletisim: messages.Iletisim || "İletişim",
    GirisYap: messages.GirisYap || "Giriş Yap",
  };
  
  return (
    <>
      <ClientProviders locale={locale} messages={messages}>
        <Header generals={generals} translations={translations} />
      </ClientProviders>
      <main className="flex-1 mt-5">{children}</main>
      <Footer />
    </>
  );
}
