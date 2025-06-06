import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { GlobalContextProvider } from "@/app/[locale]/Context/store";
import LocaleSetter from "@/components/others/LocaleSetter";
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
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  const messages = (await import(`@/public/locales/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      dir={locale === "ar" || locale === "he" ? "rtl" : "ltr"}
    >
      <GlobalContextProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <LocaleSetter locale={locale} />
      </GlobalContextProvider>
    </html>
  );
}
