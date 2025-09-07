import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { GlobalContextProvider } from "@/app/Context/GlobalContext";
import LocaleSetter from "@/components/others/LocaleSetter";
import { getServerLocationData } from "@/lib/utils/getServerLocation";
import "@/public/styles/globals.css";

export const metadata: Metadata = {
  title: "TOGA Health",
  description: "TOGA Health",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/public/locales/${locale}.json`)).default;
  
  // Server-side'da location bilgilerini al
  const initialLocation = await getServerLocationData();

  return (
    <html
      lang={locale}
      dir={locale === "ar" || locale === "he" ? "rtl" : "ltr"}
    >
      <body>
        <GlobalContextProvider initialLocation={initialLocation}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <LocaleSetter locale={locale} />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
